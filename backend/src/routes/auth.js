const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const asyncHandler = require("../middleware/asyncHandler");
const {
  register,
  login,
  refreshToken,
  logout,
  getCurrentUser,
} = require("../controllers/authController");

/**
 * Public routes
 */
router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);

/**
 * Protected routes
 */
router.get("/me", authenticate, getCurrentUser);

module.exports = router;
