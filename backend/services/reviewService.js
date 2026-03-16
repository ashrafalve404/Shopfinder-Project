const prisma = require('../prisma');
const AppError = require('../utils/AppError');

/**
 * Create a new review or update existing review (users can only have one review per shop)
 */
const createReview = async (data, userId) => {
  // Verify shop exists
  const shop = await prisma.shop.findUnique({
    where: { id: data.shopId },
  });

  if (!shop) {
    throw new AppError('Shop not found', 404);
  }

  // Check if user has already reviewed this shop
  const existingReview = await prisma.review.findUnique({
    where: {
      userId_shopId: {
        userId,
        shopId: data.shopId,
      },
    },
  });

  // If user has already reviewed, update the existing review
  if (existingReview) {
    const review = await prisma.review.update({
      where: { id: existingReview.id },
      data: {
        rating: data.rating,
        comment: data.comment,
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
    return { review, updated: true };
  }

  const review = await prisma.review.create({
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

  return { review, updated: false };
};

/**
 * Get reviews by shop ID
 */
const getReviewsByShop = async (shopId, { page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;

  // Verify shop exists
  const shop = await prisma.shop.findUnique({
    where: { id: parseInt(shopId) },
  });

  if (!shop) {
    throw new AppError('Shop not found', 404);
  }

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
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
    prisma.review.count({ where: { shopId: parseInt(shopId) } }),
  ]);

  // Calculate average rating
  const avgRating = total > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / total : 0;

  return {
    reviews,
    averageRating: parseFloat(avgRating.toFixed(1)),
    totalReviews: total,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

module.exports = {
  createReview,
  getReviewsByShop,
};
