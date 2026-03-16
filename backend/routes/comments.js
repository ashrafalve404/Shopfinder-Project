const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { protect } = require('../middlewares/auth');
const { createCommentValidator, idParamValidator, shopIdParamValidator, paginationValidator } = require('../utils/validators');
const { asyncHandler } = require('../utils/errorHandler');

// Public routes
router.get('/shop/:shopId', shopIdParamValidator, paginationValidator, asyncHandler(commentController.getCommentsByShop));

// Protected routes (both users and shop owners can comment)
router.post('/', protect, createCommentValidator, asyncHandler(commentController.createComment));

module.exports = router;
