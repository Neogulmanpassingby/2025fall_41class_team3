const db = require('../config/db');
const bcrypt = require('bcrypt');
const authHelper = require('../utils/authHelper');

async function signup(req, res) {
  const { email, nickname, password, birthDate, location, income, education, ...rest } = req.body;

  // 1. 필수값 검증 (Joi나 Zod 같은 라이브러리를 쓰면 더 깔끔합니다)
  if (!email || !nickname || !password || !birthDate || !location || !income || !education) {
    return res.status(400).json({ message: '필수 값 누락' });
  }

  try {
    // 2. 중복 체크
    const [existing] = await db.query('SELECT email FROM users WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(409).json({ message: '이메일 중복' });

    // 3. 비밀번호 해싱 및 데이터 준비
    const hashedPassword = await bcrypt.hash(password, 10);
    const accessToken = authHelper.generateAccessToken(email);
    const refreshToken = authHelper.generateRefreshToken();

    // 4. DB 저장
    await db.query(`
      INSERT INTO users (email, nickname, password, birthDate, location, income, maritalStatus, education, major, employmentStatus, specialGroup, interests, refreshToken)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      email, nickname, hashedPassword, birthDate, location, income,
      rest.maritalStatus || '', rest.education || '', rest.major || '',
      JSON.stringify(authHelper.normalizeArray(rest.employmentStatus)),
      JSON.stringify(authHelper.normalizeArray(rest.specialGroup)),
      JSON.stringify(authHelper.normalizeArray(rest.interests)),
      refreshToken
    ]);

    res.status(201).json({ status: 'success', nickname, token: accessToken, refreshToken, expires_in: 3600 });
  } catch (err) {
    console.error('회원가입 실패:', err);
    res.status(500).json({ message: '서버 오류' });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  try {
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = users[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: '로그인 실패' });
    }

    const accessToken = authHelper.generateAccessToken(user.email);
    const refreshToken = authHelper.generateRefreshToken();

    await db.query('UPDATE users SET refreshToken = ? WHERE email = ?', [refreshToken, email]);

    res.json({ token: accessToken, refreshToken, expires_in: 3600, nickname: user.nickname });
  } catch (err) {
    res.status(500).json({ message: '로그인 실패' });
  }
}

async function refresh(req, res) {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ message: '리프레시 토큰 필요' });

  try {
    const [users] = await db.query('SELECT * FROM users WHERE refreshToken = ?', [refreshToken]);
    const user = users[0];

    if (!user) return res.status(401).json({ message: '유효하지 않은 토큰' });

    const newAccessToken = authHelper.generateAccessToken(user.email);
    const newRefreshToken = authHelper.generateRefreshToken();

    await db.query('UPDATE users SET refreshToken = ? WHERE email = ?', [newRefreshToken, user.email]);

    res.json({ token: newAccessToken, refreshToken: newRefreshToken, expires_in: 3600 });
  } catch (err) {
    res.status(500).json({ message: '토큰 재발급 실패' });
  }
}

async function checkEmail(req, res) {
  const { email } = req.query;
  try {
    const [rows] = await db.query('SELECT 1 FROM users WHERE email = ?', [email]);
    res.json({ data: { exists: rows.length > 0 } });
  } catch (err) {
    res.status(500).json({ message: '서버 오류' });
  }
}

async function checkNickname(req, res) {
  const { nickname } = req.query;
  if (!nickname) return res.status(400).json({ message: '닉네임 필요' });

  if (authHelper.isForbiddenNickname(nickname)) {
    return res.status(400).json({ message: '부적절한 닉네임', data: { exists: true } });
  }

  try {
    const [rows] = await db.query('SELECT 1 FROM users WHERE nickname = ? LIMIT 1', [nickname]);
    res.json({ data: { exists: rows.length > 0 } });
  } catch (err) {
    res.status(500).json({ message: '서버 오류' });
  }
}

module.exports = { signup, login, refresh, checkEmail, checkNickname };