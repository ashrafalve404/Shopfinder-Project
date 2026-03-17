const prisma = require('../prisma');
const AppError = require('../utils/AppError');

/**
 * Get all categories
 */
const getAllCategories = async () => {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });

  return categories;
};

/**
 * Get category by ID
 */
const getCategoryById = async (id) => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      shops: true,
    },
  });

  return category;
};

/**
 * Create a new category
 */
const createCategory = async (data) => {
  // Check if category already exists
  const existingCategory = await prisma.category.findUnique({
    where: { name: data.name },
  });

  if (existingCategory) {
    throw new AppError('Category already exists', 400);
  }

  const category = await prisma.category.create({
    data: {
      name: data.name,
      icon: data.icon || null,
    },
  });

  return category;
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
};
