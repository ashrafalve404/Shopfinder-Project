const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting comprehensive Bangladesh-themed seed...');

  // 1. Clean the database (Optional but recommended for a fresh demo)
  // Ordered to handle foreign key constraints
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.review.deleteMany();
  await prisma.product.deleteMany();
  await prisma.post.deleteMany();
  await prisma.shop.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log('Database cleaned.');

  // 2. Create Users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Ashraf Admin',
      email: 'admin@shopfinder.com',
      password: hashedPassword,
      role: 'admin',
    },
  });

  const shopOwner1 = await prisma.user.create({
    data: {
      name: 'Tanvir Rahman',
      email: 'tanvir@fashionhub.com',
      password: hashedPassword,
      role: 'shop_owner',
    },
  });

  const shopOwner2 = await prisma.user.create({
    data: {
      name: 'Anika Tabassum',
      email: 'anika@techworld.com',
      password: hashedPassword,
      role: 'shop_owner',
    },
  });

  const regularUser = await prisma.user.create({
    data: {
      name: 'Sajid Islam',
      email: 'sajid@example.com',
      password: hashedPassword,
      role: 'user',
    },
  });

  console.log('Users created.');

  // 3. Create Categories
  const categoriesData = [
    { name: 'Clothing & Fashion', icon: '👕' },
    { name: 'Electronics & Gadgets', icon: '📱' },
    { name: 'Food & Restaurant', icon: '🍕' },
    { name: 'Beauty & Cosmetics', icon: '💄' },
    { name: 'Home & Furniture', icon: '🏠' },
    { name: 'Books & Stationery', icon: '📚' },
    { name: 'Jewelry & Accessories', icon: '💎' },
  ];

  const categories = [];
  for (const cat of categoriesData) {
    const category = await prisma.category.create({ data: cat });
    categories.push(category);
  }

  console.log('Categories created.');

  // 4. Create Shops
  const shop1 = await prisma.shop.create({
    data: {
      name: 'Aarong - Bashundhara City',
      description: 'Bangladesh\'s most popular lifestyle retail chain.',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
      categoryId: categories.find(c => c.name === 'Clothing & Fashion').id,
      district: 'Dhaka',
      shoppingComplex: 'Bashundhara City',
      mapLink: 'https://goo.gl/maps/BashundharaCity',
      latitude: 23.7509,
      longitude: 90.3935,
      ownerId: shopOwner1.id,
    },
  });

  const shop2 = await prisma.shop.create({
    data: {
      name: 'Star Tech - Multiplan',
      description: 'Leading computer and laptop shop in Bangladesh.',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80',
      categoryId: categories.find(c => c.name === 'Electronics & Gadgets').id,
      district: 'Dhaka',
      shoppingComplex: 'Multiplan Center',
      mapLink: 'https://goo.gl/maps/Multiplan',
      latitude: 23.7384,
      longitude: 90.3853,
      ownerId: shopOwner2.id,
    },
  });

  const shop3 = await prisma.shop.create({
    data: {
      name: 'Takeout - Dhanmondi',
      description: 'Famous for the best burgers in town.',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
      categoryId: categories.find(c => c.name === 'Food & Restaurant').id,
      district: 'Dhaka',
      shoppingComplex: 'Dhanmondi 27',
      mapLink: 'https://goo.gl/maps/TakeoutDhanmondi',
      latitude: 23.7534,
      longitude: 90.3756,
      ownerId: shopOwner1.id,
    },
  });

  console.log('Shops created.');

  // 5. Create Products
  await prisma.product.createMany({
    data: [
      { name: 'Panjabi - Nakshi Kantha', price: 3500, description: 'Hand-stitched premium Panjabi.', shopId: shop1.id },
      { name: 'Jamdani Saree', price: 12000, description: 'Authentic Dhakai Jamdani.', shopId: shop1.id },
      { name: 'Gaming Laptop RTX 4060', price: 145000, description: 'High performance gaming laptop.', shopId: shop2.id },
      { name: 'Wireless Mouse', price: 1200, description: 'Ergonomic wireless mouse.', shopId: shop2.id },
      { name: 'Classic Beef Burger', price: 450, description: 'Juicy beef patty with special sauce.', shopId: shop3.id },
    ],
  });

  console.log('Products created.');

  // 6. Create Posts
  await prisma.post.create({
    data: {
      title: 'Pohela Boishakh Collection!',
      content: 'Celebrate the Bengali New Year with our exclusive Nakshi collection. 20% discount for early birds!',
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80',
      shopId: shop1.id,
    },
  });

  await prisma.post.create({
    data: {
      title: 'New RTX 50 Series Coming Soon!',
      content: 'Pre-order starts next week. Stay tuned for the biggest launch of the year.',
      image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80',
      shopId: shop2.id,
    },
  });

  console.log('Posts created.');

  // 7. Create Reviews
  await prisma.review.create({
    data: {
      rating: 5,
      comment: 'Excellent quality Panjabi. Worth the price!',
      userId: regularUser.id,
      shopId: shop1.id,
    },
  });

  await prisma.review.create({
    data: {
      rating: 4,
      comment: 'Great service, but the queue was long.',
      userId: regularUser.id,
      shopId: shop3.id,
    },
  });

  console.log('Reviews created.');

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
