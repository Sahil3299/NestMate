// backend/src/controllers/user.controller.js
"use strict";
const User         = require("../models/User");
const Listing      = require("../models/Listing");
const catchAsync   = require("../utils/catchAsync");
const AppError     = require("../utils/AppError");
const sendResponse = require("../utils/sendResponse");

// ── Get current user profile ───────────────────────────────────────────────
exports.getMe = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id).populate("savedListings", "title rent location images");
  sendResponse(res, 200, "Profile fetched.", user);
});

// ── Update profile ─────────────────────────────────────────────────────────
exports.updateProfile = catchAsync(async (req, res) => {
  // Block password change via this route
  const { password, email, role, ...updates } = req.body;

  if (req.file) updates.avatar = `/uploads/avatars/${req.file.filename}`;

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true, runValidators: true,
  });

  sendResponse(res, 200, "Profile updated.", user);
});

// ── Save / unsave a listing ────────────────────────────────────────────────
exports.toggleSaveListing = catchAsync(async (req, res, next) => {
  const { listingId } = req.params;
  const listing = await Listing.findById(listingId);
  if (!listing) return next(new AppError("Listing not found.", 404));

  const user    = await User.findById(req.user._id);
  const saved   = user.savedListings.map(String);
  const isSaved = saved.includes(String(listingId));

  const update = isSaved
    ? { $pull:     { savedListings: listingId } }
    : { $addToSet: { savedListings: listingId } };

  await user.updateOne(update);

  sendResponse(res, 200, isSaved ? "Listing unsaved." : "Listing saved.", {
    saved: !isSaved,
    listingId,
  });
});

// ── Get saved listings ─────────────────────────────────────────────────────
exports.getSavedListings = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate({ path: "savedListings", match: { isActive: true } });
  sendResponse(res, 200, "Saved listings.", user.savedListings);
});

// ── Get public user profile ────────────────────────────────────────────────
exports.getUserProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).select(
    "name avatar bio occupation age gender preferredCity lifestyle genderPreference isVerified createdAt"
  );
  if (!user || !user.isActive) return next(new AppError("User not found.", 404));
  sendResponse(res, 200, "User profile.", user);
});

// ── Admin: list all users ──────────────────────────────────────────────────
exports.getAllUsers = catchAsync(async (req, res) => {
  const page  = Number(req.query.page  || 1);
  const limit = Number(req.query.limit || 20);
  const total = await User.countDocuments();
  const users = await User.find()
    .select("-password -refreshToken -resetPasswordToken -emailVerifyToken")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
  sendResponse(res, 200, "All users.", users, { total, page, limit });
});
