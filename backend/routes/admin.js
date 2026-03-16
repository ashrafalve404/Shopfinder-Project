const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/auth');
const { asyncHandler } = require('../utils/errorHandler');

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// Dashboard
router.get('/stats', asyncHandler(adminController.getStats));

// Users
router.get('/users', asyncHandler(adminController.getAllUsers));
router.get('/users/:id', asyncHandler(adminController.getUserById));
router.put('/users/:id/role', asyncHandler(adminController.updateUserRole));
router.delete('/users/:id', asyncHandler(adminController.deleteUser));

// Shops
router.get('/shops', asyncHandler(adminController.getAllShops));
router.get('/shops/:id', asyncHandler(adminController.getShopById));
router.put('/shops/:id', asyncHandler(adminController.updateShop));
router.delete('/shops/:id', asyncHandler(adminController.deleteShop));

// Products
router.get('/products', asyncHandler(adminController.getAllProducts));
router.get('/products/:id', asyncHandler(adminController.getProductById));
router.put('/products/:id', asyncHandler(adminController.updateProduct));
router.delete('/products/:id', asyncHandler(adminController.deleteProduct));

// Reviews
router.get('/reviews', asyncHandler(adminController.getAllReviews));
router.delete('/reviews/:id', asyncHandler(adminController.deleteReview));

// Comments
router.get('/comments', asyncHandler(adminController.getAllComments));
router.delete('/comments/:id', asyncHandler(adminController.deleteComment));

module.exports = router;
