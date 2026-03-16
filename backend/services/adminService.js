const prisma = require('../prisma');
const AppError = require('../utils/AppError');

/**
 * Get all users (admin)
 */
const getAllUsers = async ({ page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            shops: true,
            reviews: true,
            comments: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count(),
  ]);

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get user by ID (admin)
 */
const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      shops: {
        select: {
          id: true,
          name: true,
        },
      },
      _count: {
        select: {
          reviews: true,
          comments: true,
        },
      },
    },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
};

/**
 * Update user role (admin)
 */
const updateUserRole = async (id, role) => {
  const validRoles = ['user', 'shop_owner', 'admin'];
  if (!validRoles.includes(role)) {
    throw new AppError('Invalid role', 400);
  }

  const user = await prisma.user.update({
    where: { id },
    data: { role },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  return user;
};

/**
 * Delete user (admin)
 */
const deleteUser = async (id) => {
  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  await prisma.user.delete({
    where: { id },
  });

  return { message: 'User deleted successfully' };
};

/**
 * Get all shops (admin)
 */
const getAllShops = async ({ page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;

  const [shops, total] = await Promise.all([
    prisma.shop.findMany({
      skip,
      take: limit,
      include: {
        owner: {
          select: { id: true, name: true, email: true },
        },
        category: true,
        products: {
          select: {
            id: true,
            name: true,
            price: true,
            description: true,
          },
        },
        reviews: {
          select: {
            id: true,
            rating: true,
            comment: true,
            user: { select: { name: true } },
            createdAt: true,
          },
        },
        comments: {
          select: {
            id: true,
            content: true,
            user: { select: { name: true } },
            createdAt: true,
          },
        },
        _count: {
          select: {
            products: true,
            reviews: true,
            comments: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.shop.count(),
  ]);

  return {
    shops,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get shop by ID (admin)
 */
const getShopById = async (id) => {
  const shop = await prisma.shop.findUnique({
    where: { id },
    include: {
      owner: {
        select: { id: true, name: true, email: true },
      },
      category: true,
      products: true,
      reviews: true,
      comments: true,
    },
  });

  if (!shop) {
    throw new AppError('Shop not found', 404);
  }

  return shop;
};

/**
 * Update shop (admin)
 */
const updateShop = async (id, data) => {
  const shop = await prisma.shop.findUnique({
    where: { id },
  });

  if (!shop) {
    throw new AppError('Shop not found', 404);
  }

  const updateData = {};
  if (data.name) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.categoryId) updateData.categoryId = parseInt(data.categoryId);
  if (data.district !== undefined) updateData.district = data.district;
  if (data.shoppingComplex !== undefined) updateData.shoppingComplex = data.shoppingComplex;
  if (data.mapLink !== undefined) updateData.mapLink = data.mapLink;
  if (data.latitude) updateData.latitude = parseFloat(data.latitude);
  if (data.longitude) updateData.longitude = parseFloat(data.longitude);

  const updatedShop = await prisma.shop.update({
    where: { id },
    data: updateData,
    include: {
      owner: {
        select: { id: true, name: true, email: true },
      },
      category: true,
    },
  });

  return updatedShop;
};

/**
 * Delete shop (admin)
 */
const deleteShop = async (id) => {
  const shop = await prisma.shop.findUnique({
    where: { id },
  });

  if (!shop) {
    throw new AppError('Shop not found', 404);
  }

  await prisma.shop.delete({
    where: { id },
  });

  return { message: 'Shop deleted successfully' };
};

/**
 * Get all products (admin)
 */
const getAllProducts = async ({ page = 1, limit = 20, shopId }) => {
  const skip = (page - 1) * limit;

  const where = {};
  if (shopId) {
    where.shopId = parseInt(shopId);
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      skip,
      take: limit,
      where,
      include: {
        shop: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get product by ID (admin)
 */
const getProductById = async (id) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      shop: {
        select: { id: true, name: true },
      },
    },
  });

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  return product;
};

/**
 * Update product (admin)
 */
const updateProduct = async (id, data) => {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  const updateData = {};
  if (data.name) updateData.name = data.name;
  if (data.price !== undefined) updateData.price = parseFloat(data.price);
  if (data.description !== undefined) updateData.description = data.description;

  const updatedProduct = await prisma.product.update({
    where: { id },
    data: updateData,
    include: {
      shop: {
        select: { id: true, name: true },
      },
    },
  });

  return updatedProduct;
};

/**
 * Delete product (admin)
 */
const deleteProduct = async (id) => {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  await prisma.product.delete({
    where: { id },
  });

  return { message: 'Product deleted successfully' };
};

/**
 * Get all reviews (admin)
 */
const getAllReviews = async ({ page = 1, limit = 20, shopId }) => {
  const skip = (page - 1) * limit;

  const where = {};
  if (shopId) {
    where.shopId = parseInt(shopId);
  }

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      skip,
      take: limit,
      where,
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        shop: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.review.count({ where }),
  ]);

  return {
    reviews,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Delete review (admin)
 */
const deleteReview = async (id) => {
  const review = await prisma.review.findUnique({
    where: { id },
  });

  if (!review) {
    throw new AppError('Review not found', 404);
  }

  await prisma.review.delete({
    where: { id },
  });

  return { message: 'Review deleted successfully' };
};

/**
 * Get all comments (admin)
 */
const getAllComments = async ({ page = 1, limit = 20, shopId }) => {
  const skip = (page - 1) * limit;

  const where = {};
  if (shopId) {
    where.shopId = parseInt(shopId);
  }

  const [comments, total] = await Promise.all([
    prisma.comment.findMany({
      skip,
      take: limit,
      where,
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        shop: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.comment.count({ where }),
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

/**
 * Delete comment (admin)
 */
const deleteComment = async (id) => {
  const comment = await prisma.comment.findUnique({
    where: { id },
  });

  if (!comment) {
    throw new AppError('Comment not found', 404);
  }

  await prisma.comment.delete({
    where: { id },
  });

  return { message: 'Comment deleted successfully' };
};

/**
 * Get dashboard stats (admin)
 */
const getStats = async () => {
  const [
    totalUsers,
    totalShops,
    totalProducts,
    totalReviews,
    totalComments,
    usersByRole,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.shop.count(),
    prisma.product.count(),
    prisma.review.count(),
    prisma.comment.count(),
    prisma.user.groupBy({
      by: ['role'],
      _count: {
        role: true,
      },
    }),
  ]);

  return {
    totalUsers,
    totalShops,
    totalProducts,
    totalReviews,
    totalComments,
    usersByRole: usersByRole.reduce((acc, item) => {
      acc[item.role] = item._count.role;
      return acc;
    }, {}),
  };
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  getAllShops,
  getShopById,
  updateShop,
  deleteShop,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getAllReviews,
  deleteReview,
  getAllComments,
  deleteComment,
  getStats,
};
