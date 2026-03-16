const prisma = require('../prisma');
const AppError = require('../utils/AppError');

/**
 * Create a new comment (both users and shop owners can comment)
 */
const createComment = async (data, userId) => {
  // Verify shop exists
  const shop = await prisma.shop.findUnique({
    where: { id: data.shopId },
  });

  if (!shop) {
    throw new AppError('Shop not found', 404);
  }

  const comment = await prisma.comment.create({
    data: {
      ...data,
      userId,
    },
    include: {
      user: {
        select: { id: true, name: true },
      },
      shop: {
        select: { id: true, name: true },
      },
    },
  });

  return comment;
};

/**
 * Get comments by shop ID
 */
const getCommentsByShop = async (shopId, { page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;

  // Verify shop exists
  const shop = await prisma.shop.findUnique({
    where: { id: parseInt(shopId) },
  });

  if (!shop) {
    throw new AppError('Shop not found', 404);
  }

  const [comments, total] = await Promise.all([
    prisma.comment.findMany({
      where: { shopId: parseInt(shopId) },
      skip,
      take: limit,
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.comment.count({ where: { shopId: parseInt(shopId) } }),
  ]);

  return {
    comments,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

module.exports = {
  createComment,
  getCommentsByShop,
};
