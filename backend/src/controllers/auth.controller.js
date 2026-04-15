// backend/src/controllers/auth.controller.js
"use strict";
const crypto     = require("crypto");
const User       = require("../models/User");
const catchAsync = require("../utils/catchAsync");
const AppError   = require("../utils/AppError");
const sendResponse = require("../utils/sendResponse");
const sendEmail    = require("../utils/sendEmail");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  attachRefreshCookie,
  clearRefreshCookie,
} = require("../utils/tokens");

// ── Register ───────────────────────────────────────────────────────────────
exports.register = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return next(new AppError("Email already registered.", 400));

  const user = await User.create({ name, email, password, role });

  // Email verification
  const rawToken = user.getEmailVerifyToken();
  await user.save({ validateBeforeSave: false });

  const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${rawToken}`;
  await sendEmail({
    to:      email,
    subject: "Verify your Nestmate account",
    html:    `<p>Hi ${name},</p><p>Please verify your email: <a href="${verifyUrl}">Verify</a></p><p>Link expires in 24 hours.</p>`,
  });

  const accessToken  = signAccessToken(user._id, user.role);
  const refreshToken = signRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  attachRefreshCookie(res, refreshToken);

  sendResponse(res, 201, "Registration successful. Please verify your email.", {
    accessToken,
    user: { _id: user._id, name: user.name, email: user.email, role: user.role, isVerified: user.isVerified },
  });
});

// ── Login ──────────────────────────────────────────────────────────────────
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password +refreshToken");
  if (!user || !(await user.matchPassword(password))) {
    return next(new AppError("Invalid email or password.", 401));
  }
  if (!user.isActive) return next(new AppError("Account has been deactivated.", 401));

  const accessToken  = signAccessToken(user._id, user.role);
  const refreshToken = signRefreshToken(user._id);

  user.refreshToken = refreshToken;
  user.lastLogin    = new Date();
  await user.save({ validateBeforeSave: false });

  attachRefreshCookie(res, refreshToken);

  sendResponse(res, 200, "Login successful.", {
    accessToken,
    user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, isVerified: user.isVerified },
  });
});

// ── Refresh token ──────────────────────────────────────────────────────────
exports.refreshToken = catchAsync(async (req, res, next) => {
  const token = req.cookies?.refreshToken;
  if (!token) return next(new AppError("No refresh token.", 401));

  let decoded;
  try {
    decoded = verifyRefreshToken(token);
  } catch {
    return next(new AppError("Invalid or expired refresh token.", 401));
  }

  const user = await User.findById(decoded.id).select("+refreshToken");
  if (!user || user.refreshToken !== token) {
    return next(new AppError("Refresh token reuse detected. Please log in again.", 401));
  }

  // Rotate — invalidate old, issue new pair
  const newAccess  = signAccessToken(user._id, user.role);
  const newRefresh = signRefreshToken(user._id);
  user.refreshToken = newRefresh;
  await user.save({ validateBeforeSave: false });

  attachRefreshCookie(res, newRefresh);
  sendResponse(res, 200, "Token refreshed.", { accessToken: newAccess });
});

// ── Logout ─────────────────────────────────────────────────────────────────
exports.logout = catchAsync(async (req, res) => {
  if (req.user) {
    await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
  }
  clearRefreshCookie(res);
  sendResponse(res, 200, "Logged out successfully.");
});

// ── Verify Email ───────────────────────────────────────────────────────────
exports.verifyEmail = catchAsync(async (req, res, next) => {
  const hashed = crypto.createHash("sha256").update(req.params.token).digest("hex");
  const user   = await User.findOne({
    emailVerifyToken:  hashed,
    emailVerifyExpire: { $gt: Date.now() },
  });
  if (!user) return next(new AppError("Invalid or expired verification link.", 400));

  user.isVerified       = true;
  user.emailVerifyToken  = undefined;
  user.emailVerifyExpire = undefined;
  await user.save({ validateBeforeSave: false });

  sendResponse(res, 200, "Email verified successfully.");
});

// ── Forgot Password ────────────────────────────────────────────────────────
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new AppError("No account found with that email.", 404));

  const rawToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${rawToken}`;
  await sendEmail({
    to:      user.email,
    subject: "Nestmate password reset",
    html:    `<p>Reset your password: <a href="${resetUrl}">Reset</a></p><p>Expires in 10 minutes.</p>`,
  });

  sendResponse(res, 200, "Password reset email sent.");
});

// ── Reset Password ─────────────────────────────────────────────────────────
exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashed = crypto.createHash("sha256").update(req.params.token).digest("hex");
  const user   = await User.findOne({
    resetPasswordToken:  hashed,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) return next(new AppError("Invalid or expired reset link.", 400));

  user.password             = req.body.password;
  user.resetPasswordToken   = undefined;
  user.resetPasswordExpire  = undefined;
  user.refreshToken         = null; // invalidate all sessions
  await user.save();

  clearRefreshCookie(res);
  sendResponse(res, 200, "Password reset successful. Please log in.");
});
