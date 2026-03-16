const adminService = require('../services/adminService');
const { successResponse, paginatedResponse } = require('../utils/apiResponse');

// Dashboard stats
const getStats = async (req, res, next) => {
  const stats = await adminService.getStats();
  successResponse(res, stats, 'Stats retrieved successfully');
};

// Users management
const getAllUsers = async (req, res, next) => {
  const { page = 1, limit = 20 } = req.query;
  const result = await adminService.getAllUsers({
    page: parseInt(page),
    limit: parseInt(limit),
  });
  paginatedResponse(res, result.users, result.pagination, 'Users retrieved successfully');
};

const getUserById = async (req, res, next) => {
  const { id } = req.params;
  const user = await adminService.getUserById(parseInt(id));
  successResponse(res, user, 'User retrieved successfully');
};

const updateUserRole = async (req, res, next) => {
  const { id } = req.params;
  const { role } = req.body;
  const user = await adminService.updateUserRole(parseInt(id), role);
  successResponse(res, user, 'User role updated successfully');
};

const deleteUser = async (req, res, next) => {
  const { id } = req.params;
  const result = await adminService.deleteUser(parseInt(id));
  successResponse(res, result, 'User deleted successfully');
};

// Shops management
const getAllShops = async (req, res, next) => {
  const { page = 1, limit = 20 } = req.query;
  const result = await adminService.getAllShops({
    page: parseInt(page),
    limit: parseInt(limit),
  });
  paginatedResponse(res, result.shops, result.pagination, 'Shops retrieved successfully');
};

const getShopById = async (req, res, next) => {
  const { id } = req.params;
  const shop = await adminService.getShopById(parseInt(id));
  successResponse(res, shop, 'Shop retrieved successfully');
};

const updateShop = async (req, res, next) => {
  const { id } = req.params;
  const shop = await adminService.updateShop(parseInt(id), req.body);
  successResponse(res, shop, 'Shop updated successfully');
};

const deleteShop = async (req, res, next) => {
  const { id } = req.params;
  const result = await adminService.deleteShop(parseInt(id));
  successResponse(res, result, 'Shop deleted successfully');
};

// Products management
const getAllProducts = async (req, res, next) => {
  const { page = 1, limit = 20, shopId } = req.query;
  const result = await adminService.getAllProducts({
    page: parseInt(page),
    limit: parseInt(limit),
    shopId,
  });
  paginatedResponse(res, result.products, result.pagination, 'Products retrieved successfully');
};

const getProductById = async (req, res, next) => {
  const { id } = req.params;
  const product = await adminService.getProductById(parseInt(id));
  successResponse(res, product, 'Product retrieved successfully');
};

const updateProduct = async (req, res, next) => {
  const { id } = req.params;
  const product = await adminService.updateProduct(parseInt(id), req.body);
  successResponse(res, product, 'Product updated successfully');
};

const deleteProduct = async (req, res, next) => {
  const { id } = req.params;
  const result = await adminService.deleteProduct(parseInt(id));
  successResponse(res, result, 'Product deleted successfully');
};

// Reviews management
const getAllReviews = async (req, res, next) => {
  const { page = 1, limit = 20, shopId } = req.query;
  const result = await adminService.getAllReviews({
    page: parseInt(page),
    limit: parseInt(limit),
    shopId,
  });
  paginatedResponse(res, result.reviews, result.pagination, 'Reviews retrieved successfully');
};

const deleteReview = async (req, res, next) => {
  const { id } = req.params;
  const result = await adminService.deleteReview(parseInt(id));
  successResponse(res, result, 'Review deleted successfully');
};

// Comments management
const getAllComments = async (req, res, next) => {
  const { page = 1, limit = 20, shopId } = req.query;
  const result = await adminService.getAllComments({
    page: parseInt(page),
    limit: parseInt(limit),
    shopId,
  });
  paginatedResponse(res, result.comments, result.pagination, 'Comments retrieved successfully');
};

const deleteComment = async (req, res, next) => {
  const { id } = req.params;
  const result = await adminService.deleteComment(parseInt(id));
  successResponse(res, result, 'Comment deleted successfully');
};

module.exports = {
  getStats,
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  getAllShops,
  getShopById,
  updateShop,
  deleteShop,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getAllReviews,
  deleteReview,
  getAllComments,
  deleteComment,
};
