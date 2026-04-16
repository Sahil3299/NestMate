const mongoose = require("mongoose");
const Review = require("../models/Review");
const asyncHandler = require("../middleware/asyncHandler");
const { NotFoundError, ValidationError, ConflictError, AuthorizationError } = require("../utils/errors");

/**
 * Create or update review
 * POST /api/v1/reviews
 */
const createReview = asyncHandler(async (req, res) => {
  const { targetType, targetId, rating, comment } = req.body;

  // Validation
  if (!targetType || !targetId || !rating) {
    throw new ValidationError(
      "Missing required fields: targetType, targetId, rating"
    );
  }

  if (rating < 1 || rating > 5) {
    throw new ValidationError("Rating must be between 1 and 5");
  }

  if (!["room", "user"].includes(targetType)) {
    throw new ValidationError("Invalid targetType. Must be 'room' or 'user'");
  }

  // Check if already reviewed
  const existing = await Review.findOne({
    reviewerId: req.user.id,
    targetId,
    targetType,
  });

  if (existing) {
    // Update existing review
    existing.rating = rating;
    existing.comment = comment || "";
    await existing.save();

    return res.json({
      success: true,
      message: "Review updated successfully",
      data: existing,
    });
  }

  // Create new review
  const review = await Review.create({
    reviewerId: req.user.id,
    targetType,
    targetId,
    rating,
    comment: comment || "",
  });

  await review.populate("reviewerId", "name email avatar");

  res.status(201).json({
    success: true,
    message: "Review created successfully",
    data: review,
  });
});

/**
 * Get reviews for a target (room or user)
 * GET /api/v1/reviews?targetType=user&targetId=123
 */
const getReviewsForTarget = asyncHandler(async (req, res) => {
  const { targetType, targetId, page = 1, limit = 20 } = req.query;

  // Validation
  if (!targetType || !targetId) {
    throw new ValidationError("targetType and targetId are required");
  }

  if (!["room", "user"].includes(targetType)) {
    throw new ValidationError("Invalid targetType. Must be 'room' or 'user'");
  }

  const skip = (page - 1) * limit;

  // Get reviews
  const reviews = await Review.find({ targetType, targetId })
    .populate("reviewerId", "name email avatar")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Review.countDocuments({ targetType, targetId });

  // Calculate statistics
  const stats = await Review.aggregate([
    { $match: { targetType, targetId: mongoose.Types.ObjectId(targetId) } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
        ratingDistribution: {
          $push: "$rating",
        },
      },
    },
  ]);

  const stats_result = stats[0] || {
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: [],
  };

  res.json({
    success: true,
    data: reviews,
    statistics: {
      averageRating: Math.round(stats_result.averageRating * 10) / 10,
      totalReviews: stats_result.totalReviews,
      ratingDistribution: {
        5: stats_result.ratingDistribution.filter(r => r === 5).length,
        4: stats_result.ratingDistribution.filter(r => r === 4).length,
        3: stats_result.ratingDistribution.filter(r => r === 3).length,
        2: stats_result.ratingDistribution.filter(r => r === 2).length,
        1: stats_result.ratingDistribution.filter(r => r === 1).length,
      },
    },
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

/**
 * Get reviews written by current user
 * GET /api/v1/reviews/my-reviews
 */
const getMyReviews = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;

  const reviews = await Review.find({ reviewerId: req.user.id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Review.countDocuments({ reviewerId: req.user.id });

  res.json({
    success: true,
    data: reviews,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

/**
 * Delete review
 * DELETE /api/v1/reviews/:reviewId
 */
const deleteReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;

  const review = await Review.findById(reviewId);
  if (!review) {
    throw new NotFoundError("Review not found");
  }

  // Only reviewer can delete
  if (review.reviewerId.toString() !== req.user.id) {
    throw new AuthorizationError("You can only delete your own reviews");
  }

  await Review.findByIdAndDelete(reviewId);

  res.json({
    success: true,
    message: "Review deleted successfully",
  });
});

module.exports = {
  createReview,
  getReviewsForTarget,
  getMyReviews,
  deleteReview,
};
