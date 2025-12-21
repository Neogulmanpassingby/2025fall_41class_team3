const { verifyToken } = require('../utils/authHelper');

module.exports = function authenticate(req, res, next) {
  const auth = req.headers.authorization;
  
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: '인증 실패: 토큰 없음' });
  }

  const token = auth.split(' ')[1];
  const decoded = verifyToken(token); // 유틸리티 함수 사용

  if (!decoded) {
    return res.status(401).json({ message: '유효하지 않은 토큰' });
  }

  req.user = decoded;
  next();
};