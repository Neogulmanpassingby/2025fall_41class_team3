// server/routes/auth.js

const express = require('express');
const router = express.Router();
const controller = require('../controllers/authController');

router.post('/signup', controller.signup);
router.post('/login', controller.login);
router.post('/refresh', controller.refresh);
router.get('/check-email', controller.checkEmail);
router.get('/check-nickname', controller.checkNickname);

module.exports = router; // <--- 이 줄이 파일의 마지막이어야 합니다.