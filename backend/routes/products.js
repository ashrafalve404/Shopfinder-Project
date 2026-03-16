const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, authorize } = require('../middlewares/auth');
const upload = require('../middlewares/upload');
const {
  createProductValidator,
  updateProductValidator,
  idParamValidator,
  shopIdParamValidator,
  paginationValidator,
} = require('../utils/validators');
const { asyncHandler } = require('../utils/errorHandler');

// Public routes
router.get('/shop/:shopId', shopIdParamValidator, paginationValidator, asyncHandler(productController.getProductsByShop));

// Protected routes (only shop owners can create, update, delete products)
router.post(
  '/',
  protect,
  authorize('shop_owner'),
  upload.single('image'),
  createProductValidator,
  asyncHandler(productController.createProduct)
);
router.put(
  '/:id',
  protect,
  authorize('shop_owner'),
  upload.single('image'),
  updateProductValidator,
  asyncHandler(productController.updateProduct)
);
router.delete('/:id', protect, authorize('shop_owner'), idParamValidator, asyncHandler(productController.deleteProduct));

module.exports = router;
