const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const policy = require('../controllers/policyController');
const review = require('../controllers/reviewController');

/**
 * @swagger
 * /api/policies/search:
 *   get:
 *     summary: 정책 검색
 *     tags: [Policies]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: 검색 키워드
 *       - in: query
 *         name: sido
 *         schema:
 *           type: string
 *         description: "시도 (지역)"
 *       - in: query
 *         name: employmentStatus
 *         schema:
 *           type: string
 *         description: 고용 상태
 *       - in: query
 *         name: maritalStatus
 *         schema:
 *           type: string
 *         description: 결혼 상태
 *       - in: query
 *         name: education
 *         schema:
 *           type: string
 *         description: 학력
 *       - in: query
 *         name: major
 *         schema:
 *           type: string
 *         description: 전공
 *       - in: query
 *         name: specialGroup
 *         schema:
 *           type: string
 *         description: "특수 그룹 쉼표로 구분"
 *       - in: query
 *         name: interests
 *         schema:
 *           type: string
 *         description: "관심사 쉼표로 구분"
 *     responses:
 *       200:
 *         description: 검색 결과
 *       500:
 *         description: 검색 실패
 */
router.get('/search', policy.search);

/**
 * @swagger
 * /api/policies/recommend:
 *   get:
 *     summary: AI 정책 추천
 *     tags: [Policies]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: prompt
 *         schema:
 *           type: string
 *         description: 추천 프롬프트
 *     responses:
 *       200:
 *         description: 추천 정책 목록
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 recommendations:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: 추천 횟수 소진
 *       404:
 *         description: 사용자 정보 없음
 *       500:
 *         description: 추천 실패
 */
router.get('/recommend', authenticate, policy.recommend);

/**
 * @swagger
 * /api/policies/popular:
 *   get:
 *     summary: "인기 정책 조회수 기준 Top 3"
 *     tags: [Policies]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 인기 정책 목록
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   plcyNm:
 *                     type: string
 */
router.get('/popular', authenticate, policy.getPopular);

/**
 * @swagger
 * /api/policies/recent:
 *   get:
 *     summary: "최신 정책 시작일 기준 Top 3"
 *     tags: [Policies]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 최신 정책 목록
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   plcyNm:
 *                     type: string
 */
router.get('/recent', authenticate, policy.getRecent);

/**
 * @swagger
 * /api/policies/{id}:
 *   get:
 *     summary: 정책 상세 정보
 *     tags: [Policies]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: 정책 ID
 *     responses:
 *       200:
 *         description: 정책 상세 정보
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Policy'
 *       404:
 *         description: 정책 없음
 */
router.get('/:id', authenticate, policy.getDetail);

/**
 * @swagger
 * /api/policies/{id}/summary:
 *   get:
 *     summary: 정책 AI 요약
 *     tags: [Policies]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: 정책 ID
 *     responses:
 *       200:
 *         description: 정책 요약
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 summary:
 *                   type: string
 *       404:
 *         description: 정책 없음
 *       500:
 *         description: 요약 실패
 */
router.get('/:id/summary', authenticate, policy.getSummary);

/**
 * @swagger
 * /api/policies/{id}/reviews:
 *   get:
 *     summary: 정책 리뷰 조회
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: 정책 ID
 *     responses:
 *       200:
 *         description: 리뷰 목록
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 */
router.get('/:id/reviews', review.getReviews);

/**
 * @swagger
 * /api/policies/{id}/reviews:
 *   post:
 *     summary: 정책 리뷰 작성
 *     tags: [Reviews]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: 정책 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               content:
 *                 type: string
 *             required: [rating, content]
 *     responses:
 *       201:
 *         description: 리뷰 작성 성공
 *       401:
 *         description: 인증 필요
 *       500:
 *         description: 리뷰 작성 실패
 */
router.post('/:id/reviews', authenticate, review.writeReview);

/**
 * @swagger
 * /api/policies/{id}/reviews:
 *   patch:
 *     summary: "정책 리뷰 수정 ON DUPLICATE KEY 처리"
 *     tags: [Reviews]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: 정책 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               content:
 *                 type: string
 *             required: [rating, content]
 *     responses:
 *       200:
 *         description: 리뷰 수정 성공
 *       401:
 *         description: 인증 필요
 *       500:
 *         description: 리뷰 수정 실패
 */
router.patch('/:id/reviews', authenticate, review.writeReview);

/**
 * @swagger
 * /api/policies/{id}/reviews:
 *   delete:
 *     summary: 정책 리뷰 삭제
 *     tags: [Reviews]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: 정책 ID
 *     responses:
 *       200:
 *         description: 리뷰 삭제 성공
 *       401:
 *         description: 인증 필요
 *       500:
 *         description: 리뷰 삭제 실패
 */
router.delete('/:id/reviews', authenticate, review.deleteReview);

module.exports = router;