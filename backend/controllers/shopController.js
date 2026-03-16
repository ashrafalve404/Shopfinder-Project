const shopService = require('../services/shopService');
const { successResponse, paginatedResponse } = require('../utils/apiResponse');

/**
 * Get all shops with pagination
 */
const getAllShops = async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;

  const result = await shopService.getAllShops({
    page: parseInt(page),
    limit: parseInt(limit),
  });

  paginatedResponse(res, result.shops, result.pagination, 'Shops retrieved successfully');
};

/**
 * Get shop by ID
 */
const getShopById = async (req, res, next) => {
  const { id } = req.params;

  const shop = await shopService.getShopById(parseInt(id));

  successResponse(res, shop, 'Shop retrieved successfully');
};

/**
 * Create a new shop (only shop owners)
 */
const createShop = async (req, res, next) => {
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
  
  const shopData = {
    ...req.body,
  };
  
  if (imagePath) {
    shopData.image = imagePath;
  }

  const shop = await shopService.createShop(shopData, req.user.id);

  successResponse(res, shop, 'Shop created successfully', 201);
};

/**
 * Update a shop
 */
const updateShop = async (req, res, next) => {
  const { id } = req.params;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
  
  const shopData = {
    ...req.body,
  };
  
  if (imagePath) {
    shopData.image = imagePath;
  }

  const shop = await shopService.updateShop(parseInt(id), req.user.id, shopData);

  successResponse(res, shop, 'Shop updated successfully');
};

/**
 * Delete a shop
 */
const deleteShop = async (req, res, next) => {
  const { id } = req.params;

  const result = await shopService.deleteShop(parseInt(id), req.user.id);

  successResponse(res, result, 'Shop deleted successfully');
};

/**
 * Search shops
 */
const searchShops = async (req, res, next) => {
  const { q, page = 1, limit = 10 } = req.query;

  const result = await shopService.searchShops({
    q,
    page: parseInt(page),
    limit: parseInt(limit),
  });

  paginatedResponse(res, result.shops, result.pagination, 'Search results retrieved successfully');
};

/**
 * Filter shops by category, district, complex
 */
const filterShops = async (req, res, next) => {
  const { category, district, complex, page = 1, limit = 10 } = req.query;

  const result = await shopService.filterShops({
    category,
    district,
    complex,
    page: parseInt(page),
    limit: parseInt(limit),
  });

  paginatedResponse(res, result.shops, result.pagination, 'Filter results retrieved successfully');
};

/**
 * Get nearby shops
 */
const getNearbyShops = async (req, res, next) => {
  const { lat, lng, radius = 10, page = 1, limit = 10 } = req.query;

  const result = await shopService.getNearbyShops({
    lat: parseFloat(lat),
    lng: parseFloat(lng),
    radius: parseFloat(radius),
    page: parseInt(page),
    limit: parseInt(limit),
  });

  paginatedResponse(res, result.shops, result.pagination, 'Nearby shops retrieved successfully');
};

/**
 * Get current user's shops (for dashboard)
 */
const getMyShops = async (req, res, next) => {
  const shops = await shopService.getMyShops(req.user.id);
  
  successResponse(res, shops, 'User shops retrieved successfully');
};

module.exports = {
  getAllShops,
  getShopById,
  createShop,
  updateShop,
  deleteShop,
  searchShops,
  filterShops,
  getNearbyShops,
  getMyShops,
};
