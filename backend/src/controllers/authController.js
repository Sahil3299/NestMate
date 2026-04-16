const jwt = require("jsonwebtoken");
const User = require("../models/User");
const env = require("../config/environment");
const { ValidationError, AuthenticationError, ConflictError, NotFoundError } = require("../utils/errors");
const asyncHandler = require("../middleware/asyncHandler");

/**
 * Generate JWT tokens
 */
const generateTokens = (userId, email, role) => {
  const accessToken = jwt.sign(
    { userId, email, role },
    env.JWT_SECRET,
    { expiresIn: env.JWT_ACCESS_EXPIRES_IN }
  );

  const refreshToken = jwt.sign(
    { userId },
    env.JWT_SECRET,
    { expiresIn: env.JWT_REFRESH_EXPIRES_IN }
  );

  return { accessToken, refreshToken };
};

/**
 * Register new user
 * POST /api/auth/register
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, city } = req.body;

  // Validation
  if (!name || !email || !password || !role || !city) {
    throw new ValidationError("Missing required fields: name, email, password, role, city");
  }

  if (password.length < 8) {
    throw new ValidationError("Password must be at least 8 characters");
  }

  // Check if user exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new ConflictError("Email already registered");
  }

  // Create user
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    role,
    city,
  });

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user._id, user.email, user.role);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        city: user.city,
      },
      accessToken,
      refreshToken,
    },
  });
});

/**
 * Login user
 * POST /api/auth/login
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ValidationError("Email and password are required");
  }

  // Find user and select password field
  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw new AuthenticationError("Invalid email or password");
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user._id, user.email, user.role);

  res.json({
    success: true,
    message: "Logged in successfully",
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        city: user.city,
      },
      accessToken,
      refreshToken,
    },
  });
});

/**
 * Refresh access token
 * POST /api/auth/refresh-token
 */
const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken: token } = req.body;

  if (!token) {
    throw new ValidationError("Refresh token is required");
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      user._id,
      user.email,
      user.role
    );

    res.json({
      success: true,
      message: "Token refreshed successfully",
      data: {
        accessToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error) {
    throw new AuthenticationError("Invalid or expired refresh token");
  }
});

/**
 * Logout user
 * POST /api/auth/logout
 */
const logout = asyncHandler(async (req, res) => {
  // In a real app, you might invalidate refresh tokens here
  // For now, logout is handled by clearing tokens on the client

  res.json({
    success: true,
    message: "Logged out successfully",
  });
});

/**
 * Get current user profile
 * GET /api/auth/me (requires auth)
 */
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  res.json({
    success: true,
    data: user.getPublicProfile(),
  });
});

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  getCurrentUser,
};
