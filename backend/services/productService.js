const prisma = require('../prisma');
const AppError = require('../utils/AppError');

/**
 * Create a new product
 */
const createProduct = async (data, imagePath) => {
  // Verify shop belongs to the owner
  const shop = await prisma.shop.findFirst({
    where: {
      id: data.shopId,
      ownerId: data.ownerId,
    },
  });

  if (!shop) {
    throw new AppError('Shop not found or you are not authorized', 404);
  }

  const productData = {
    name: data.name,
    price: data.price,
    description: data.description,
    shopId: data.shopId,
  };

  if (imagePath) {
    productData.image = imagePath;
  }

  const product = await prisma.product.create({
    data: productData,
    include: {
      shop: {
        select: { id: true, name: true },
      },
    },
  });

  return product;
};

/**
 * Get products by shop ID
 */
const getProductsByShop = async (shopId, { page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;

  // Verify shop exists
  const shop = await prisma.shop.findUnique({
    where: { id: parseInt(shopId) },
  });

  if (!shop) {
    throw new AppError('Shop not found', 404);
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where: { shopId: parseInt(shopId) },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count({ where: { shopId: parseInt(shopId) } }),
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
 * Update a product
 */
const updateProduct = async (id, ownerId, data, imagePath) => {
  // Find product with shop
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      shop: true,
    },
  });

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  // Check ownership
  if (product.shop.ownerId !== ownerId) {
    throw new AppError('You are not authorized to update this product', 403);
  }

  const updateData = {};
  
  if (data.name) updateData.name = data.name;
  if (data.price !== undefined) updateData.price = data.price;
  if (data.description !== undefined) updateData.description = data.description;
  if (imagePath) updateData.image = imagePath;

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
 * Delete a product
 */
const deleteProduct = async (id, ownerId) => {
  // Find product with shop
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      shop: true,
    },
  });

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  // Check ownership
  if (product.shop.ownerId !== ownerId) {
    throw new AppError('You are not authorized to delete this product', 403);
  }

  await prisma.product.delete({
    where: { id },
  });

  return { message: 'Product deleted successfully' };
};

module.exports = {
  createProduct,
  getProductsByShop,
  updateProduct,
  deleteProduct,
};
