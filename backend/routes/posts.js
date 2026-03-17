const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { protect, authorize } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

// Public routes
router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);
router.get('/shop/:shopId', postController.getPostsByShop);

// Protected routes (shop owners and admin)
router.post('/', protect, authorize('shop_owner', 'admin'), upload.single('image'), postController.createPost);
router.delete('/:id', protect, authorize('shop_owner', 'admin'), postController.deletePost);

// Like/Unlike routes (authenticated users)
router.post('/:id/like', protect, postController.likePost);
router.delete('/:id/like', protect, postController.unlikePost);

module.exports = router;
