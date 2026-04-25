const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    const counts = {
      users: await prisma.user.count(),
      shops: await prisma.shop.count(),
      categories: await prisma.category.count(),
      products: await prisma.product.count(),
      posts: await prisma.post.count(),
    };
    console.log(JSON.stringify(counts, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

check();
