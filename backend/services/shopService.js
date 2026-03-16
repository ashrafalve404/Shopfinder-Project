const prisma = require('../prisma');
const AppError = require('../utils/AppError');

/**
 * Get all shops with pagination
 */
const getAllShops = async ({ page = 1, limit = 10 }) => {
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
        _count: {
          select: { products: true, reviews: true },
        },
        reviews: {
          select: { rating: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.shop.count(),
  ]);

  // Calculate average rating for each shop
  const shopsWithRating = shops.map(shop => {
    const ratings = shop.reviews.map(r => r.rating);
    const avgRating = ratings.length > 0
      ? ratings.reduce((a, b) => a + b, 0) / ratings.length
      : 0;
    
    const { reviews, ...shopWithoutReviews } = shop;
    return {
      ...shopWithoutReviews,
      averageRating: parseFloat(avgRating.toFixed(1)),
    };
  });

  return {
    shops: shopsWithRating,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get shop by ID
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
      reviews: {
        include: {
          user: {
            select: { id: true, name: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
      comments: {
        include: {
          user: {
            select: { id: true, name: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
      _count: {
        select: { products: true, reviews: true, comments: true },
      },
    },
  });

  if (!shop) {
    throw new AppError('Shop not found', 404);
  }

  // Calculate average rating
  const avgRating =
    shop.reviews.length > 0
      ? shop.reviews.reduce((sum, review) => sum + review.rating, 0) / shop.reviews.length
      : 0;

  return { ...shop, averageRating: parseFloat(avgRating.toFixed(1)) };
};

/**
 * Create a new shop (only shop owners)
 */
const createShop = async (data, ownerId) => {
  // Check if owner already has 3 shops
  const shopCount = await prisma.shop.count({
    where: { ownerId },
  });

  if (shopCount >= 3) {
    throw new AppError('You can only create up to 3 shops', 400);
  }

  // Extract fields from form data if needed
  const shopData = {
    name: data.name,
    description: data.description,
    image: data.image,
    categoryId: data.categoryId ? parseInt(data.categoryId) : null,
    district: data.district,
    shoppingComplex: data.shoppingComplex,
    mapLink: data.mapLink,
    latitude: data.latitude ? parseFloat(data.latitude) : null,
    longitude: data.longitude ? parseFloat(data.longitude) : null,
    ownerId,
  };

  const shop = await prisma.shop.create({
    data: shopData,
    include: {
      owner: {
        select: { id: true, name: true, email: true },
      },
      category: true,
    },
  });

  return shop;
};

/**
 * Update a shop
 */
const updateShop = async (id, ownerId, data) => {
  // Check if shop exists
  const shop = await prisma.shop.findUnique({
    where: { id },
  });

  if (!shop) {
    throw new AppError('Shop not found', 404);
  }

  // Check ownership
  if (shop.ownerId !== ownerId) {
    throw new AppError('You are not authorized to update this shop', 403);
  }

  // Build update data
  const updateData = {};
  if (data.name) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.image !== undefined) updateData.image = data.image;
  if (data.categoryId) updateData.categoryId = parseInt(data.categoryId);
  if (data.district !== undefined) updateData.district = data.district;
  if (data.shoppingComplex !== undefined) updateData.shoppingComplex = data.shoppingComplex;
  if (data.mapLink !== undefined) updateData.mapLink = data.mapLink;
  if (data.latitude !== undefined) updateData.latitude = data.latitude ? parseFloat(data.latitude) : null;
  if (data.longitude !== undefined) updateData.longitude = data.longitude ? parseFloat(data.longitude) : null;

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
 * Delete a shop
 */
const deleteShop = async (id, ownerId) => {
  // Check if shop exists
  const shop = await prisma.shop.findUnique({
    where: { id },
  });

  if (!shop) {
    throw new AppError('Shop not found', 404);
  }

  // Check ownership
  if (shop.ownerId !== ownerId) {
    throw new AppError('You are not authorized to delete this shop', 403);
  }

  await prisma.shop.delete({
    where: { id },
  });

  return { message: 'Shop deleted successfully' };
};

/**
 * Search shops
 */
const searchShops = async ({ q, page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;

  const where = q
    ? {
        OR: [
          { name: { contains: q } },
          { description: { contains: q } },
          { district: { contains: q } },
          { shoppingComplex: { contains: q } },
        ],
      }
    : {};

  const [shops, total] = await Promise.all([
    prisma.shop.findMany({
      where,
      skip,
      take: limit,
      include: {
        owner: {
          select: { id: true, name: true, email: true },
        },
        category: true,
        _count: {
          select: { products: true, reviews: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.shop.count({ where }),
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
 * Filter shops by category, district, complex
 */
const filterShops = async ({ category, district, complex, page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;

  const where = {};
  if (category) where.categoryId = parseInt(category);
  if (district) where.district = { contains: district };
  if (complex) where.shoppingComplex = { contains: complex };

  const [shops, total] = await Promise.all([
    prisma.shop.findMany({
      where,
      skip,
      take: limit,
      include: {
        owner: {
          select: { id: true, name: true, email: true },
        },
        category: true,
        _count: {
          select: { products: true, reviews: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.shop.count({ where }),
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
 * Get nearby shops
 */
const getNearbyShops = async ({ lat, lng, radius = 10, page = 1, limit = 10 }) => {
  // Note: SQLite doesn't support geospatial queries natively
  // This is a simplified version that filters by approximate bounding box
  // For production with PostgreSQL, use PostGIS
  const skip = (page - 1) * limit;

  // Approximate degree to km conversion (1 degree ≈ 111km)
  const latDelta = radius / 111;
  const lngDelta = radius / (111 * Math.cos((lat * Math.PI) / 180));

  const minLat = lat - latDelta;
  const maxLat = lat + latDelta;
  const minLng = lng - lngDelta;
  const maxLng = lng + lngDelta;

  const [shops, total] = await Promise.all([
    prisma.shop.findMany({
      where: {
        latitude: { gte: minLat, lte: maxLat },
        longitude: { gte: minLng, lte: maxLng },
      },
      skip,
      take: limit,
      include: {
        owner: {
          select: { id: true, name: true, email: true },
        },
        category: true,
        _count: {
          select: { products: true, reviews: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.shop.count({
      where: {
        latitude: { gte: minLat, lte: maxLat },
        longitude: { gte: minLng, lte: maxLng },
      },
    }),
  ]);

  // Calculate distance for each shop
  const shopsWithDistance = shops.map((shop) => {
    if (!shop.latitude || !shop.longitude) return { ...shop, distance: null };

    const distance = calculateDistance(lat, lng, shop.latitude, shop.longitude);
    return { ...shop, distance: parseFloat(distance.toFixed(2)) };
  });

  // Sort by distance
  shopsWithDistance.sort((a, b) => a.distance - b.distance);

  return {
    shops: shopsWithDistance,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Calculate distance between two points using Haversine formula
 */
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRad = (deg) => deg * (Math.PI / 180);

/**
 * Get shops for a specific owner (for dashboard)
 */
const getMyShops = async (ownerId) => {
  const shops = await prisma.shop.findMany({
    where: { ownerId },
    include: {
      category: true,
      _count: {
        select: {
          products: true,
          reviews: true,
        },
      },
      reviews: {
        select: {
          rating: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Calculate average rating for each shop
  return shops.map(shop => {
    const ratings = shop.reviews.map(r => r.rating);
    const avgRating = ratings.length > 0
      ? ratings.reduce((a, b) => a + b, 0) / ratings.length
      : 0;
    
    const { reviews, ...shopWithoutReviews } = shop;
    return {
      ...shopWithoutReviews,
      averageRating: parseFloat(avgRating.toFixed(1)),
    };
  });
};

module.exports = {
  getAllShops,
  getShopById,
  createShop,
  updateShop,
  deleteShop,
  searchShops,
  filterShops,
  getNearbyShops,
  getMyShops,
};
