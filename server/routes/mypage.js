const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const controller = require('../controllers/mypageController');

router.get('/basic', authenticate, controller.getBasic);
router.get('/detail', authenticate, controller.getDetail);
router.put('/edit', authenticate, controller.edit);
router.delete('/likes/:policyId', authenticate, controller.deleteLike);
router.get('/recommend', authenticate, controller.getRecommendCount);

module.exports = router;

