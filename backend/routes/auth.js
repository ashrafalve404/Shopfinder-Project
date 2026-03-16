const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/auth');
const { registerValidator, loginValidator } = require('../utils/validators');

// Public routes
router.post('/register', registerValidator, authController.register);
router.post('/login', loginValidator, authController.login);

// Protected routes
router.get('/profile', protect, authController.getProfile);

module.exports = router;
