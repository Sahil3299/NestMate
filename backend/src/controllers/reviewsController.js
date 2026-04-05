const Review = require("../models/Review");
const RoomListing = require("../models/RoomListing");
const User = require("../models/User");

// Create or update a review
async function createReview(req, res) {
  try {
    const { targetType, targetId, rating, comment } = req.body;

    if (!targetType || !["room", "user"].includes(targetType)) {
      return res.status(400).json({ error: "Invalid targetType" });
    }

    if (!targetId || typeof targetId !== "string") {
      return res.status(400).json({ error: "targetId is required" });
    }

    const ratingNum = Number(rating);
    if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    const commentStr = typeof comment === "string" ? comment.trim() : "";

    // Verify target exists
    if (targetType === "room") {
      const room = await RoomListing.findById(targetId).lean();
      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }

      // Can't review your own room
      if (room.postedBy === req.user.uid) {
        return res.status(403).json({ error: "Cannot review your own room" });
      }
    } else if (targetType === "user") {
      const user = await User.findById(targetId).lean();
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Can't review yourself
      if (targetId === req.user.uid) {
        return res.status(403).json({ error: "Cannot review yourself" });
      }
    }

    // Check if review already exists (upsert)
    const existingReview = await Review.findOne({
      reviewerId: req.user.uid,
      targetId,
      targetType,
    });

    let review;
    if (existingReview) {
      // Update existing review
      review = await Review.findByIdAndUpdate(
        existingReview._id,
        { rating: ratingNum, comment: commentStr },
        { new: true }
      );
    } else {
      // Create new review
      review = await Review.create({
        reviewerId: req.user.uid,
        targetType,
        targetId,
        rating: ratingNum,
        comment: commentStr,
      });
    }

    return res.status(201).json({ review });
  } catch (err) {
    console.error("Error creating review:", err);
    if (err.code === 11000) {
      return res.status(409).json({ error: "Review already exists for this target" });
    }
    return res.status(500).json({ error: "Failed to create review" });
  }
}

// Get reviews for a target (room or user)
async function getReviewsForTarget(req, res) {
  try {
    const { targetType, targetId } = req.query;
    const limitRaw = req.query.limit || 20;
    const skipRaw = req.query.skip || 0;

    if (!targetType || !["room", "user"].includes(targetType)) {
      return res.status(400).json({ error: "Invalid targetType" });
    }

    if (!targetId) {
      return res.status(400).json({ error: "targetId is required" });
    }

    const limit = Math.min(Math.max(Number(limitRaw), 1), 100);
    const skip = Math.max(Number(skipRaw), 0);

    const reviews = await Review.find({
      targetType,
      targetId,
    })
      .populate("reviewerId", "email")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await Review.countDocuments({ targetType, targetId });

    // Calculate average rating
    const avgRatingData = await Review.aggregate([
      { $match: { targetType, targetId: new require("mongoose").Types.ObjectId(targetId) } },
      { $group: { _id: null, avgRating: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]);

    const avgRating = avgRatingData[0]?.avgRating || 0;
    const reviewCount = avgRatingData[0]?.count || 0;

    return res.status(200).json({
      reviews,
      total,
      limit,
      skip,
      avgRating: Math.round(avgRating * 10) / 10,
      reviewCount,
    });
  } catch (err) {
    console.error("Error fetching reviews:", err);
    return res.status(500).json({ error: "Failed to fetch reviews" });
  }
}

// Get my reviews (reviews I've given)
async function getMyReviews(req, res) {
  try {
    const limitRaw = req.query.limit || 20;
    const skipRaw = req.query.skip || 0;

    const limit = Math.min(Math.max(Number(limitRaw), 1), 100);
    const skip = Math.max(Number(skipRaw), 0);

    const reviews = await Review.find({ reviewerId: req.user.uid })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await Review.countDocuments({ reviewerId: req.user.uid });

    return res.status(200).json({ reviews, total, limit, skip });
  } catch (err) {
    console.error("Error fetching my reviews:", err);
    return res.status(500).json({ error: "Failed to fetch reviews" });
  }
}

// Delete a review (only by reviewer)
async function deleteReview(req, res) {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId).lean();
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    if (review.reviewerId !== req.user.uid) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await Review.findByIdAndDelete(reviewId);

    return res.status(200).json({ message: "Review deleted" });
  } catch (err) {
    console.error("Error deleting review:", err);
    return res.status(500).json({ error: "Failed to delete review" });
  }
}

module.exports = {
  createReview,
  getReviewsForTarget,
  getMyReviews,
  deleteReview,
};
