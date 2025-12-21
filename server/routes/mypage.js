const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const controller = require('../controllers/mypageController');

/**
 * @swagger
 * /api/mypage/basic:
 *   get:
 *     summary: 기본 정보 조회
 *     tags: [MyPage]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 사용자 기본 정보
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nickname:
 *                   type: string
 *                 email:
 *                   type: string
 *                 birthDate:
 *                   type: string
 *       401:
 *         description: 인증 필요
 */
router.get('/basic', authenticate, controller.getBasic);

/**
 * @swagger
 * /api/mypage/detail:
 *   get:
 *     summary: 상세 정보 조회
 *     tags: [MyPage]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 사용자 상세 정보
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 location:
 *                   type: string
 *                 income:
 *                   type: string
 *                 education:
 *                   type: string
 *                 maritalStatus:
 *                   type: string
 *                 major:
 *                   type: string
 *                 employmentStatus:
 *                   type: array
 *                 specialGroup:
 *                   type: array
 *                 interests:
 *                   type: array
 *       401:
 *         description: 인증 필요
 */
router.get('/detail', authenticate, controller.getDetail);

/**
 * @swagger
 * /api/mypage/edit:
 *   put:
 *     summary: 사용자 정보 수정
 *     tags: [MyPage]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               location:
 *                 type: string
 *               income:
 *                 type: string
 *               education:
 *                 type: string
 *               maritalStatus:
 *                 type: string
 *               major:
 *                 type: string
 *               employmentStatus:
 *                 type: array
 *               specialGroup:
 *                 type: array
 *               interests:
 *                 type: array
 *     responses:
 *       200:
 *         description: 정보 수정 성공
 *       401:
 *         description: 인증 필요
 *       500:
 *         description: 수정 실패
 */
router.put('/edit', authenticate, controller.edit);

/**
 * @swagger
 * /api/mypage/likes/{policyId}:
 *   delete:
 *     summary: 좋아요한 정책 삭제
 *     tags: [MyPage]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: policyId
 *         schema:
 *           type: integer
 *         required: true
 *         description: 정책 ID
 *     responses:
 *       200:
 *         description: 삭제 성공
 *       401:
 *         description: 인증 필요
 *       500:
 *         description: 삭제 실패
 */
router.delete('/likes/:policyId', authenticate, controller.deleteLike);

/**
 * @swagger
 * /api/mypage/recommend:
 *   get:
 *     summary: 남은 추천 횟수 조회
 *     tags: [MyPage]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 추천 횟수 정보
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 recommendCount:
 *                   type: integer
 *       401:
 *         description: 인증 필요
 */
router.get('/recommend', authenticate, controller.getRecommendCount);

module.exports = router;

