const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { protect, authorize } = require('../middlewares/auth');
const { createReviewValidator, idParamValidator, shopIdParamValidator, paginationValidator } = require('../utils/validators');
const { asyncHandler } = require('../utils/errorHandler');

// Public routes
router.get('/shop/:shopId', shopIdParamValidator, paginationValidator, asyncHandler(reviewController.getReviewsByShop));

// Protected routes (only users can create reviews)
router.post('/', protect, authorize('user'), createReviewValidator, asyncHandler(reviewController.createReview));

module.exports = router;
