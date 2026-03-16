const productService = require('../services/productService');
const { successResponse, paginatedResponse } = require('../utils/apiResponse');

/**
 * Create a new product
 */
const createProduct = async (req, res, next) => {
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
  
  const productData = {
    name: req.body.name,
    price: parseFloat(req.body.price),
    description: req.body.description || '',
    shopId: parseInt(req.body.shopId),
    ownerId: req.user.id,
  };

  const product = await productService.createProduct(productData, imagePath);

  successResponse(res, product, 'Product created successfully', 201);
};

/**
 * Get products by shop ID
 */
const getProductsByShop = async (req, res, next) => {
  const { shopId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const result = await productService.getProductsByShop(shopId, {
    page: parseInt(page),
    limit: parseInt(limit),
  });

  paginatedResponse(res, result.products, result.pagination, 'Products retrieved successfully');
};

/**
 * Update a product
 */
const updateProduct = async (req, res, next) => {
  const { id } = req.params;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  const updateData = {
    ...req.body,
    price: req.body.price ? parseFloat(req.body.price) : undefined,
  };

  const product = await productService.updateProduct(
    parseInt(id),
    req.user.id,
    updateData,
    imagePath
  );

  successResponse(res, product, 'Product updated successfully');
};

/**
 * Delete a product
 */
const deleteProduct = async (req, res, next) => {
  const { id } = req.params;

  const result = await productService.deleteProduct(parseInt(id), req.user.id);

  successResponse(res, result, 'Product deleted successfully');
};

module.exports = {
  createProduct,
  getProductsByShop,
  updateProduct,
  deleteProduct,
};
