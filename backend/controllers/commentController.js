const commentService = require('../services/commentService');
const { successResponse, paginatedResponse } = require('../utils/apiResponse');

/**
 * Create a new comment (both users and shop owners)
 */
const createComment = async (req, res, next) => {
  const comment = await commentService.createComment(req.body, req.user.id);

  successResponse(res, comment, 'Comment created successfully', 201);
};

/**
 * Get comments by shop ID
 */
const getCommentsByShop = async (req, res, next) => {
  const { shopId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const result = await commentService.getCommentsByShop(shopId, {
    page: parseInt(page),
    limit: parseInt(limit),
  });

  paginatedResponse(res, result.comments, result.pagination, 'Comments retrieved successfully');
};

module.exports = {
  createComment,
  getCommentsByShop,
};
