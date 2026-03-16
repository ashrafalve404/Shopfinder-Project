const prisma = require('../prisma');

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

module.exports = {
  getAllCategories,
  getCategoryById,
};
