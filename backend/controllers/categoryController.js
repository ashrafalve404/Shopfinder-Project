const categoryService = require('../services/categoryService');
const { successResponse } = require('../utils/apiResponse');

/**
 * Get all categories
 */
const getAllCategories = async (req, res, next) => {
  const categories = await categoryService.getAllCategories();

  successResponse(res, categories, 'Categories retrieved successfully');
};

/**
 * Get category by ID
 */
const getCategoryById = async (req, res, next) => {
  const { id } = req.params;

  const category = await categoryService.getCategoryById(parseInt(id));

  successResponse(res, category, 'Category retrieved successfully');
};

module.exports = {
  getAllCategories,
  getCategoryById,
};
