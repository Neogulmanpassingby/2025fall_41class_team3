// server/routes/auth.js

const express = require('express');
const router = express.Router();
const controller = require('../controllers/authController');

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: 회원가입
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: 회원가입 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 nickname:
 *                   type: string
 *                 token:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *                 expires_in:
 *                   type: integer
 *       400:
 *         description: 필수값 누락
 *       409:
 *         description: 이메일 중복
 *       500:
 *         description: 서버 오류
 */
router.post('/signup', controller.signup);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: 로그인
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *             required: [email, password]
 *     responses:
 *       200:
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: 로그인 실패 (잘못된 이메일 또는 비밀번호)
 *       500:
 *         description: 서버 오류
 */
router.post('/login', controller.login);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: 토큰 재발급
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *             required: [refreshToken]
 *     responses:
 *       200:
 *         description: 토큰 재발급 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: 리프레시 토큰 필요
 *       401:
 *         description: 유효하지 않은 토큰
 *       500:
 *         description: 서버 오류
 */
router.post('/refresh', controller.refresh);

/**
 * @swagger
 * /api/auth/check-email:
 *   get:
 *     summary: 이메일 중복 확인
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *           format: email
 *         required: true
 *         description: 확인할 이메일
 *     responses:
 *       200:
 *         description: 확인 완료
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     exists:
 *                       type: boolean
 *       500:
 *         description: 서버 오류
 */
router.get('/check-email', controller.checkEmail);

/**
 * @swagger
 * /api/auth/check-nickname:
 *   get:
 *     summary: 닉네임 중복 확인
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: nickname
 *         schema:
 *           type: string
 *         required: true
 *         description: 확인할 닉네임
 *     responses:
 *       200:
 *         description: 확인 완료
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     exists:
 *                       type: boolean
 *       400:
 *         description: "닉네임 필요 또는 부적절한 닉네임"
 *       500:
 *         description: 서버 오류
 */
router.get('/check-nickname', controller.checkNickname);

module.exports = router;