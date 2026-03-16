const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shopController');
const { protect, authorize } = require('../middlewares/auth');
const upload = require('../middlewares/upload');
const {
  createShopValidator,
  updateShopValidator,
  idParamValidator,
  paginationValidator,
  searchValidator,
} = require('../utils/validators');
const { asyncHandler } = require('../utils/errorHandler');

// Public routes
router.get('/', paginationValidator, asyncHandler(shopController.getAllShops));
router.get('/search', searchValidator, asyncHandler(shopController.searchShops));
router.get('/filter', searchValidator, asyncHandler(shopController.filterShops));
router.get('/nearby', searchValidator, asyncHandler(shopController.getNearbyShops));

// Protected routes - get current user's shops (must be before /:id route)
router.get('/my/shops', protect, asyncHandler(shopController.getMyShops));

// Public route with id param (must be after /my/shops)
router.get('/:id', idParamValidator, asyncHandler(shopController.getShopById));

// Protected routes (only shop owners can create, update, delete)
router.post('/', protect, authorize('shop_owner'), upload.single('image'), createShopValidator, asyncHandler(shopController.createShop));
router.put('/:id', protect, authorize('shop_owner'), upload.single('image'), updateShopValidator, asyncHandler(shopController.updateShop));
router.delete('/:id', protect, authorize('shop_owner'), idParamValidator, asyncHandler(shopController.deleteShop));

module.exports = router;
