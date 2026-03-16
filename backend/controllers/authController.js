const authService = require('../services/authService');
const { successResponse } = require('../utils/apiResponse');

/**
 * Register a new user
 */
const register = async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const result = await authService.register({ name, email, password, role });

  successResponse(res, result, 'Registration successful', 201);
};

/**
 * Login user
 */
const login = async (req, res, next) => {
  const { email, password } = req.body;

  const result = await authService.login({ email, password });

  successResponse(res, result, 'Login successful');
};

/**
 * Get user profile
 */
const getProfile = async (req, res, next) => {
  const user = await authService.getProfile(req.user.id);

  successResponse(res, user, 'Profile retrieved successfully');
};

module.exports = {
  register,
  login,
  getProfile,
};
