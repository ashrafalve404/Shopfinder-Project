const { PrismaClient } = require('@prisma/client');
const AppError = require('../utils/AppError');

const prisma = new PrismaClient();

/**
 * Create a new post for a shop
 */
const createPost = async (data, shopId, ownerId) => {
  // Verify the shop exists and belongs to the owner
  const shop = await prisma.shop.findFirst({
    where: {
      id: shopId,
      ownerId,
    },
  });

  if (!shop) {
    throw new AppError('Shop not found or you do not have permission to post', 404);
  }

  const post = await prisma.post.create({
    data: {
      title: data.title,
      content: data.content,
      image: data.image,
      shopId,
    },
    include: {
      shop: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });

  return post;
};

/**
 * Get all posts for a specific shop
 */
const getPostsByShop = async (shopId) => {
  const posts = await prisma.post.findMany({
    where: { shopId },
    include: {
      shop: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return posts;
};

/**
 * Get all posts (feed for users)
 */
const getAllPosts = async ({ page = 1, limit = 20 }, userId = null) => {
  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      include: {
        shop: {
          select: {
            id: true,
            name: true,
            image: true,
            district: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    }),
    prisma.post.count(),
  ]);

  // If userId is provided, check which posts they liked
  let userLikedPosts = new Set();
  if (userId) {
    const likes = await prisma.like.findMany({
      where: {
        userId,
        postId: { in: posts.map(p => p.id) },
      },
    });
    likes.forEach(like => userLikedPosts.add(like.postId));
  }

  // Add like count and hasLiked to posts
  const postsWithLikes = posts.map(post => ({
    ...post,
    likeCount: post._count.likes,
    hasLiked: userLikedPosts.has(post.id),
  }));

  return {
    posts: postsWithLikes,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get a single post by ID
 */
const getPostById = async (id) => {
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      shop: {
        select: {
          id: true,
          name: true,
          image: true,
          district: true,
          shoppingComplex: true,
        },
      },
    },
  });

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  return post;
};

/**
 * Delete a post
 */
const deletePost = async (id, ownerId) => {
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      shop: true,
    },
  });

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  // Check if the user owns the shop that posted
  if (post.shop.ownerId !== ownerId) {
    throw new AppError('You do not have permission to delete this post', 403);
  }

  await prisma.post.delete({
    where: { id },
  });

  return { message: 'Post deleted successfully' };
};

/**
 * Like a post
 */
const likePost = async (postId, userId) => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  // Check if user already liked the post
  const existingLike = await prisma.like.findUnique({
    where: {
      userId_postId: {
        userId,
        postId,
      },
    },
  });

  if (existingLike) {
    throw new AppError('You have already liked this post', 400);
  }

  await prisma.like.create({
    data: {
      userId,
      postId,
    },
  });

  return { message: 'Post liked successfully' };
};

/**
 * Unlike a post
 */
const unlikePost = async (postId, userId) => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  const existingLike = await prisma.like.findUnique({
    where: {
      userId_postId: {
        userId,
        postId,
      },
    },
  });

  if (!existingLike) {
    throw new AppError('You have not liked this post', 400);
  }

  await prisma.like.delete({
    where: { id: existingLike.id },
  });

  return { message: 'Post unliked successfully' };
};

/**
 * Get like count for a post
 */
const getLikeCount = async (postId) => {
  const count = await prisma.like.count({
    where: { postId },
  });
  return count;
};

/**
 * Check if user has liked a post
 */
const hasUserLiked = async (postId, userId) => {
  const like = await prisma.like.findUnique({
    where: {
      userId_postId: {
        userId,
        postId,
      },
    },
  });
  return !!like;
};

module.exports = {
  createPost,
  getPostsByShop,
  getAllPosts,
  getPostById,
  deletePost,
  likePost,
  unlikePost,
  getLikeCount,
  hasUserLiked,
};
