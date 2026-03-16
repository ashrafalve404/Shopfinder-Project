const reviewService = require('../services/reviewService');
const { successResponse, paginatedResponse } = require('../utils/apiResponse');

/**
 * Create a new review or update existing review (only users)
 */
const createReview = async (req, res, next) => {
  const result = await reviewService.createReview(req.body, req.user.id);
  
  if (result.updated) {
    successResponse(res, result.review, 'Review updated successfully');
  } else {
    successResponse(res, result.review, 'Review created successfully', 201);
  }
};

/**
 * Get reviews by shop ID
 */
const getReviewsByShop = async (req, res, next) => {
  const { shopId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const result = await reviewService.getReviewsByShop(shopId, {
    page: parseInt(page),
    limit: parseInt(limit),
  });

  paginatedResponse(res, result.reviews, result.pagination, 'Reviews retrieved successfully');
};

module.exports = {
  createReview,
  getReviewsByShop,
};
