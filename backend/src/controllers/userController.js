const User = require("../models/User");
const SavedListing = require("../models/SavedListing");
const asyncHandler = require("../middleware/asyncHandler");
const { NotFoundError, AuthorizationError } = require("../utils/errors");

/**
 * Get current user profile
 * GET /api/v1/users/me
 */
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  res.json({
    success: true,
    data: user.getPublicProfile(),
  });
});

/**
 * Update current user profile
 * PATCH /api/v1/users/me
 */
const updateProfile = asyncHandler(async (req, res) => {
  const { name, age, gender, occupation, bio, city, phone, preferences } = req.body;

  const user = await User.findById(req.user.id);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  // Update allowed fields
  if (name) user.name = name;
  if (age) user.age = age;
  if (gender) user.gender = gender;
  if (occupation) user.occupation = occupation;
  if (bio) user.bio = bio;
  if (city) user.city = city;
  if (phone) user.phone = phone;
  if (preferences) user.preferences = { ...user.preferences, ...preferences };

  await user.save();

  res.json({
    success: true,
    message: "Profile updated successfully",
    data: user.getPublicProfile(),
  });
});

/**
 * Get public user profile
 * GET /api/v1/users/:userId
 */
const getPublicProfile = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  res.json({
    success: true,
    data: user.getPublicProfile(),
  });
});

/**
 * Get user's saved listings
 * GET /api/v1/users/me/saved
 */
const getSavedListings = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;

  const savedListings = await SavedListing.find({ user: req.user.id })
    .populate("listing")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await SavedListing.countDocuments({ user: req.user.id });

  res.json({
    success: true,
    data: savedListings.map(sl => sl.listing),
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

/**
 * Toggle save listing (add or remove from saved)
 * POST /api/v1/users/me/saved/:listingId
 */
const toggleSaveListing = asyncHandler(async (req, res) => {
  const { listingId } = req.params;

  // Check if already saved
  const existing = await SavedListing.findOne({
    user: req.user.id,
    listing: listingId,
  });

  if (existing) {
    // Remove from saved
    await SavedListing.deleteOne({ _id: existing._id });
    return res.json({
      success: true,
      message: "Listing removed from saved",
      data: { saved: false },
    });
  } else {
    // Add to saved
    const saved = await SavedListing.create({
      user: req.user.id,
      listing: listingId,
    });
    return res.status(201).json({
      success: true,
      message: "Listing saved successfully",
      data: { saved: true },
    });
  }
});

/**
 * Check if listing is saved
 * GET /api/v1/users/me/saved/:listingId
 */
const checkSaved = asyncHandler(async (req, res) => {
  const { listingId } = req.params;

  const saved = await SavedListing.findOne({
    user: req.user.id,
    listing: listingId,
  });

  res.json({
    success: true,
    data: { saved: !!saved },
  });
});

module.exports = {
  getProfile,
  updateProfile,
  getPublicProfile,
  getSavedListings,
  toggleSaveListing,
  checkSaved,
};
