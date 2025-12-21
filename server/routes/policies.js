const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const policy = require('../controllers/policyController');
const review = require('../controllers/reviewController');

// 검색 및 추천
router.get('/search', policy.search);
router.get('/recommend', authenticate, policy.recommend);
router.get('/popular', authenticate, policy.getPopular);
router.get('/recent', authenticate, policy.getRecent);

// 정책 상세 및 요약
router.get('/:id', authenticate, policy.getDetail);
router.get('/:id/summary', authenticate, policy.getSummary);

// 리뷰 CRUD
router.get('/:id/reviews', review.getReviews);
router.post('/:id/reviews', authenticate, review.writeReview);
router.patch('/:id/reviews', authenticate, review.writeReview); // writeReview 내부의 ON DUPLICATE KEY로 처리됨
router.delete('/:id/reviews', authenticate, review.deleteReview);

module.exports = router;