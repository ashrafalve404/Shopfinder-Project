require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Import routes
const authRoutes = require('./routes/auth');
const shopRoutes = require('./routes/shops');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const reviewRoutes = require('./routes/reviews');
const commentRoutes = require('./routes/comments');
const adminRoutes = require('./routes/admin');
const postRoutes = require('./routes/posts');

// Import middleware
const { errorHandler, notFoundHandler } = require('./utils/errorHandler');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/posts', postRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'ShopFinder Bangladesh API is running' });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to ShopFinder Bangladesh API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      shops: '/api/shops',
      products: '/api/products',
      categories: '/api/categories',
      reviews: '/api/reviews',
      comments: '/api/comments',
    },
  });
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`\n🏪 ShopFinder Bangladesh API Server`);
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api`);
  console.log(`❤️  Health Check: http://localhost:${PORT}/api/health\n`);
});

module.exports = app;
