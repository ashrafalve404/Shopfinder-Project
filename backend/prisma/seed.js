const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create categories only (no demo users/shops)
  const categories = [
    { name: 'Clothing & Fashion', icon: 'tshirt' },
    { name: 'Electronics', icon: 'laptop' },
    { name: 'Food & Restaurant', icon: 'utensils' },
    { name: 'Books & Stationery', icon: 'book' },
    { name: 'Beauty & Cosmetics', icon: 'sparkles' },
    { name: 'Home & Furniture', icon: 'couch' },
    { name: 'Sports & Fitness', icon: 'dumbbell' },
    { name: 'Jewelry', icon: 'gem' },
    { name: 'Pharmacy', icon: 'pills' },
    { name: 'Other', icon: 'store' },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  console.log('Categories seeded successfully');
  console.log('Database is now ready for new users!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
