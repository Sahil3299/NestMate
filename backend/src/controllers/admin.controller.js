const User = require("../models/User");
const Listing = require("../models/Listing");
const Review = require("../models/Review");
const VisitRequest = require("../models/VisitRequest");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const sendResponse = require("../utils/sendResponse");

/**
 * Get dashboard statistics
 */
exports.getDashboardStats = catchAsync(async (req, res, next) => {
  const [totalUsers, totalListings, totalReviews, totalVisitRequests] =
    await Promise.all([
      User.countDocuments(),
      Listing.countDocuments(),
      Review.countDocuments(),
      VisitRequest.countDocuments(),
    ]);

  const avgRating =
    totalReviews > 0
      ? (
          await Review.aggregate([
            {
              $group: {
                _id: null,
                avgRating: { $avg: "$rating" },
              },
            },
          ])
        )[0]?.avgRating || 0
      : 0;

  sendResponse(res, 200, "Dashboard statistics fetched.", {
    totalUsers,
    totalListings,
    totalReviews,
    totalVisitRequests,
    avgRating: avgRating.toFixed(2),
  });
});

/**
 * Get all users with filters
 */
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 20, role, isVerified, search } = req.query;
  const skip = (page - 1) * limit;

  const filter = {};
  if (role) filter.role = role;
  if (isVerified !== undefined) filter.isVerified = isVerified === "true";
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(filter)
      .select("-password -refreshToken")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    User.countDocuments(filter),
  ]);

  sendResponse(res, 200, "Users fetched.", users, {
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / Number(limit)),
  });
});

/**
 * Get user details with activity
 */
exports.getUserDetails = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.userId).select("-password -refreshToken");

  if (!user)
    throw new AppError("User not found", 404);

  const [listings, reviews, visits] = await Promise.all([
    Listing.countDocuments({ owner: user._id }),
    Review.countDocuments({ author: user._id }),
    VisitRequest.countDocuments({
      $or: [{ fromUser: user._id }, { toUser: user._id }],
    }),
  ]);

  sendResponse(res, 200, "User details fetched.", {
    user,
    activity: {
      listings,
      reviews,
      visits,
    },
  });
});

/**
 * Ban user account
 */
exports.banUser = catchAsync(async (req, res, next) => {
  const { reason } = req.body;

  const user = await User.findById(req.params.userId);

  if (!user)
    throw new AppError("User not found", 404);

  if (user.isBanned)
    throw new AppError("User is already banned", 400);

  user.isBanned = true;
  user.banReason = reason;
  await user.save({ validateBeforeSave: false });

  sendResponse(res, 200, "User banned successfully.", user);
});

/**
 * Unban user account
 */
exports.unbanUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.userId);

  if (!user)
    throw new AppError("User not found", 404);

  if (!user.isBanned)
    throw new AppError("User is not banned", 400);

  user.isBanned = false;
  user.banReason = null;
  await user.save({ validateBeforeSave: false });

  sendResponse(res, 200, "User unbanned successfully.", user);
});

/**
 * Delete user account
 */
exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.userId);

  if (!user)
    throw new AppError("User not found", 404);

  // Delete related data
  await Promise.all([
    Listing.deleteMany({ owner: user._id }),
    Review.deleteMany({ author: user._id }),
    VisitRequest.deleteMany({
      $or: [{ fromUser: user._id }, { toUser: user._id }],
    }),
  ]);

  await User.findByIdAndDelete(user._id);

  sendResponse(res, 200, "User and related data deleted successfully.");
});

/**
 * Get all listings with filters
 */
exports.getAllListings = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 20, status, verified } = req.query;
  const skip = (page - 1) * limit;

  const filter = {};
  if (verified !== undefined) filter.isVerified = verified === "true";

  const [listings, total] = await Promise.all([
    Listing.find(filter)
      .populate("owner", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Listing.countDocuments(filter),
  ]);

  sendResponse(res, 200, "Listings fetched.", listings, {
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / Number(limit)),
  });
});

/**
 * Approve listing
 */
exports.approveListing = catchAsync(async (req, res, next) => {
  const listing = await Listing.findById(req.params.listingId);

  if (!listing)
    throw new AppError("Listing not found", 404);

  if (listing.isVerified)
    throw new AppError("Listing is already verified", 400);

  listing.isVerified = true;
  await listing.save();

  sendResponse(res, 200, "Listing approved.", listing);
});

/**
 * Reject listing
 */
exports.rejectListing = catchAsync(async (req, res, next) => {
  const { reason } = req.body;

  const listing = await Listing.findById(req.params.listingId);

  if (!listing)
    throw new AppError("Listing not found", 404);

  // Option 1: Mark as rejected
  listing.isVerified = false;
  listing.rejectionReason = reason;
  await listing.save();

  sendResponse(res, 200, "Listing rejected.", listing);
});

/**
 * Flag listing for review
 */
exports.flagListing = catchAsync(async (req, res, next) => {
  const { reason } = req.body;

  const listing = await Listing.findById(req.params.listingId);

  if (!listing)
    throw new AppError("Listing not found", 404);

  listing.flagged = true;
  listing.flagReason = reason;
  listing.flaggedAt = new Date();
  await listing.save();

  sendResponse(res, 200, "Listing flagged for review.", listing);
});

/**
 * Delete listing
 */
exports.deleteListing = catchAsync(async (req, res, next) => {
  const listing = await Listing.findById(req.params.listingId);

  if (!listing)
    throw new AppError("Listing not found", 404);

  await Listing.findByIdAndDelete(listing._id);
  // Also delete related visits if needed
  await VisitRequest.deleteMany({ listing: listing._id });

  sendResponse(res, 200, "Listing deleted successfully.");
});

/**
 * Get all reviews with filters
 */
exports.getAllReviews = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 20, flagged } = req.query;
  const skip = (page - 1) * limit;

  const filter = {};
  if (flagged === "true") filter.flagged = true;

  const [reviews, total] = await Promise.all([
    Review.find(filter)
      .populate("author", "name email")
      .populate("listing", "title")
      .populate("reviewer", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Review.countDocuments(filter),
  ]);

  sendResponse(res, 200, "Reviews fetched.", reviews, {
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / Number(limit)),
  });
});

/**
 * Remove review
 */
exports.removeReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.reviewId);

  if (!review)
    throw new AppError("Review not found", 404);

  await Review.findByIdAndDelete(review._id);

  sendResponse(res, 200, "Review removed successfully.");
});

/**
 * Flag review
 */
exports.flagReview = catchAsync(async (req, res, next) => {
  const { reason } = req.body;

  const review = await Review.findById(req.params.reviewId);

  if (!review)
    throw new AppError("Review not found", 404);

  review.flagged = true;
  review.flagReason = reason;
  await review.save();

  sendResponse(res, 200, "Review flagged.", review);
});

/**
 * Get system logs/activity (placeholder)
 */
exports.getSystemActivity = catchAsync(async (req, res, next) => {
  // This would typically query an activity log collection
  // For now, return placeholder
  sendResponse(res, 200, "System activity log.", {
    activities: [],
    note: "Activity logging system can be implemented with a dedicated Activity model",
  });
});
