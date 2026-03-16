const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { idParamValidator } = require('../utils/validators');
const { asyncHandler } = require('../utils/errorHandler');

// Public routes
router.get('/', asyncHandler(categoryController.getAllCategories));
router.get('/:id', idParamValidator, asyncHandler(categoryController.getCategoryById));

module.exports = router;
