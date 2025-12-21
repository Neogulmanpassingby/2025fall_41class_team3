const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// 1. 액세스 토큰 생성
exports.generateAccessToken = (email) => {
  return jwt.sign({ userId: email }, JWT_SECRET, { expiresIn: '1h' });
};

// 2. 리프레시 토큰 생성
exports.generateRefreshToken = () => {
  return crypto.randomBytes(64).toString('hex');
};

// 3. 토큰 검증 로직
exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};

// 4. 배열 정규화 
exports.normalizeArray = (field) => 
  Array.isArray(field) ? field : (field ? [field] : []);

// 5. 부적절한 닉네임 체크
exports.isForbiddenNickname = (nickname) => {
  const blacklist = ['fuck', 'shit', 'bitch', '씨발', '병신', '지랄', '개새', '좆', '씹'];
  const lowered = nickname.toLowerCase();
  return blacklist.some(word => lowered.includes(word));
};