const postService = require('../services/postService');
const { successResponse, paginatedResponse } = require('../utils/apiResponse');

/**
 * Create a new post (shop owners only)
 */
const createPost = async (req, res, next) => {
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  const postData = {
    ...req.body,
  };

  if (imagePath) {
    postData.image = imagePath;
  }

  const post = await postService.createPost(postData, parseInt(req.body.shopId), req.user.id);

  successResponse(res, post, 'Post created successfully', 201);
};

/**
 * Get all posts (feed)
 */
const getAllPosts = async (req, res, next) => {
  const { page = 1, limit = 20 } = req.query;
  const userId = req.user?.id || null;

  const result = await postService.getAllPosts({
    page: parseInt(page),
    limit: parseInt(limit),
  }, userId);

  paginatedResponse(res, result.posts, result.pagination, 'Posts retrieved successfully');
};

/**
 * Like a post
 */
const likePost = async (req, res, next) => {
  const { id } = req.params;
  
  const result = await postService.likePost(parseInt(id), req.user.id);
  
  successResponse(res, result, 'Post liked successfully');
};

/**
 * Unlike a post
 */
const unlikePost = async (req, res, next) => {
  const { id } = req.params;
  
  const result = await postService.unlikePost(parseInt(id), req.user.id);
  
  successResponse(res, result, 'Post unliked successfully');
};

/**
 * Get posts by shop
 */
const getPostsByShop = async (req, res, next) => {
  const { shopId } = req.params;

  const posts = await postService.getPostsByShop(parseInt(shopId));

  successResponse(res, posts, 'Posts retrieved successfully');
};

/**
 * Get single post
 */
const getPostById = async (req, res, next) => {
  const { id } = req.params;

  const post = await postService.getPostById(parseInt(id));

  successResponse(res, post, 'Post retrieved successfully');
};

/**
 * Delete a post
 */
const deletePost = async (req, res, next) => {
  const { id } = req.params;

  const result = await postService.deletePost(parseInt(id), req.user.id);

  successResponse(res, result, 'Post deleted successfully');
};

module.exports = {
  createPost,
  getAllPosts,
  getPostsByShop,
  getPostById,
  deletePost,
  likePost,
  unlikePost,
};
