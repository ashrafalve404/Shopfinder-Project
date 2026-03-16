const { body, param, query, validationResult } = require('express-validator');
const AppError = require('./AppError');

/**
 * Validation middleware
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => err.msg).join(', ');
    return next(new AppError(errorMessages, 400));
  }
  next();
};

// Auth validators
const registerValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('role')
    .optional()
    .isIn(['user', 'shop_owner'])
    .withMessage('Role must be either user or shop_owner'),
  validate,
];

const loginValidator = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
];

// Shop validators
const createShopValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Shop name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Shop name must be between 2 and 100 characters'),
  body('description').optional().trim(),
  body('categoryId').optional().isInt().withMessage('Category ID must be an integer'),
  body('district').optional().trim(),
  body('shoppingComplex').optional().trim(),
  body('mapLink').optional().trim().isURL().withMessage('Map link must be a valid URL'),
  body('latitude').optional().isFloat().withMessage('Latitude must be a number'),
  body('longitude').optional().isFloat().withMessage('Longitude must be a number'),
  validate,
];

const updateShopValidator = [
  param('id').isInt().withMessage('Shop ID must be an integer'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Shop name must be between 2 and 100 characters'),
  body('description').optional().trim(),
  body('categoryId').optional().isInt().withMessage('Category ID must be an integer'),
  body('district').optional().trim(),
  body('shoppingComplex').optional().trim(),
  body('mapLink').optional().trim().isURL().withMessage('Map link must be a valid URL'),
  body('latitude').optional().isFloat().withMessage('Latitude must be a number'),
  body('longitude').optional().isFloat().withMessage('Longitude must be a number'),
  validate,
];

// Product validators
const createProductValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Product name must be between 2 and 100 characters'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('description').optional().trim(),
  body('shopId').isInt().withMessage('Shop ID is required'),
  validate,
];

const updateProductValidator = [
  param('id').isInt().withMessage('Product ID must be an integer'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Product name must be between 2 and 100 characters'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('description').optional().trim(),
  validate,
];

// Review validators
const createReviewValidator = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment').optional().trim(),
  body('shopId').isInt().withMessage('Shop ID is required'),
  validate,
];

// Comment validators
const createCommentValidator = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Comment content is required')
    .isLength({ min: 1, max: 500 })
    .withMessage('Comment must be between 1 and 500 characters'),
  body('shopId').isInt().withMessage('Shop ID is required'),
  validate,
];

// ID parameter validators
const idParamValidator = [
  param('id').isInt().withMessage('ID must be an integer'),
  validate,
];

// Shop ID parameter validator (for routes like /products/shop/:shopId)
const shopIdParamValidator = [
  param('shopId').isInt().withMessage('Shop ID must be an integer'),
  validate,
];

// Pagination validators
const paginationValidator = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  validate,
];

// Search validators
const searchValidator = [
  query('q').optional().trim(),
  query('category').optional().isInt().withMessage('Category must be an integer'),
  query('district').optional().trim(),
  query('complex').optional().trim(),
  query('lat').optional().isFloat().withMessage('Latitude must be a number'),
  query('lng').optional().isFloat().withMessage('Longitude must be a number'),
  query('radius').optional().isFloat({ min: 0 }).withMessage('Radius must be a positive number'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  validate,
];

module.exports = {
  validate,
  registerValidator,
  loginValidator,
  createShopValidator,
  updateShopValidator,
  createProductValidator,
  updateProductValidator,
  createReviewValidator,
  createCommentValidator,
  idParamValidator,
  shopIdParamValidator,
  paginationValidator,
  searchValidator,
};
