# ShopFinder Bangladesh - Backend API

A scalable backend API for ShopFinder Bangladesh built with Node.js, Express.js, and Prisma ORM.

## Features

- **Authentication**: JWT-based authentication with role-based authorization
- **User Roles**: User and Shop Owner
- **Database**: SQLite with Prisma ORM (ready for PostgreSQL migration)
- **Image Upload**: Multer for product image uploads
- **Validation**: Express Validator for input validation
- **CORS**: Enabled for cross-origin requests

## Tech Stack

- Node.js
- Express.js
- Prisma ORM
- SQLite (easily migratable to PostgreSQL)
- JWT Authentication
- Multer (file uploads)
- Express Validator
- bcryptjs (password hashing)

## Project Structure

```
backend/
├── controllers/       # Route controllers
├── routes/            # API routes
├── middlewares/       # Express middlewares (auth, upload)
├── services/         # Business logic layer
├── prisma/           # Database schema and migrations
├── utils/            # Utilities (error handling, validators)
├── uploads/          # Uploaded files
├── server.js         # Application entry point
└── package.json
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Generate Prisma Client:
```bash
npx prisma generate
```

3. Create database and tables:
```bash
npx prisma db push
```

4. Seed the database with sample data:
```bash
node prisma/seed.js
```

5. Start the server:
```bash
npm start
# or for development
npm run dev
```

The server will run at `http://localhost:3000`

## Demo Accounts

After seeding the database, you can use these demo accounts:

- **User**: `user@demo.com` / `password123`
- **Shop Owner**: `owner@demo.com` / `password123`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Shops
- `GET /api/shops` - Get all shops (with pagination)
- `GET /api/shops/:id` - Get shop by ID
- `GET /api/shops/search?q=` - Search shops
- `GET /api/shops/filter?category=&district=&complex=` - Filter shops
- `GET /api/shops/nearby?lat=&lng=&radius=` - Get nearby shops
- `POST /api/shops` - Create shop (shop_owner only)
- `PUT /api/shops/:id` - Update shop (owner only)
- `DELETE /api/shops/:id` - Delete shop (owner only)

### Products
- `GET /api/products/shop/:shopId` - Get products by shop
- `POST /api/products` - Create product (shop_owner only)
- `PUT /api/products/:id` - Update product (owner only)
- `DELETE /api/products/:id` - Delete product (owner only)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID

### Reviews
- `GET /api/reviews/shop/:shopId` - Get reviews by shop
- `POST /api/reviews` - Create review (user only)

### Comments
- `GET /api/comments/shop/:shopId` - Get comments by shop
- `POST /api/comments` - Create comment (user or shop_owner)

## Database Schema

The database includes the following models:

- **User**: id, name, email, password, role, createdAt
- **Shop**: id, name, description, categoryId, district, shoppingComplex, mapLink, latitude, longitude, ownerId, createdAt
- **Category**: id, name, icon
- **Product**: id, name, price, description, image, shopId, createdAt
- **Review**: id, rating, comment, userId, shopId, createdAt
- **Comment**: id, content, userId, shopId, createdAt

## Rules

- Only shop owners can create shops
- Only users can leave reviews
- Both users and shop owners can comment
- A user can review a shop only once
- Shop owners can only update/delete their own shops and products

## Migration to PostgreSQL

To migrate from SQLite to PostgreSQL:

1. Update `.env` file:
```
DATABASE_URL="postgresql://user:password@localhost:5432/shopfinder"
```

2. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

3. Run migration:
```bash
npx prisma migrate dev
```

## Environment Variables

Create a `.env` file in the backend directory:

```
# Database
DATABASE_URL="file:./dev.db"

# JWT
JWT_SECRET="your_secret_key"
JWT_EXPIRES_IN="7d"

# Server
PORT=3000
NODE_ENV=development
```

## License

ISC
