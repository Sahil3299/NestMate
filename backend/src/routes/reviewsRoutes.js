const express = require("express");
const { requireAuth } = require("../middleware/auth");
const {
  createReview,
  getReviewsForTarget,
  getMyReviews,
  deleteReview,
} = require("../controllers/reviewsController");

const router = express.Router();

// Create or update a review
router.post("/", requireAuth, createReview);

// Get reviews for a specific target (room or user)
router.get("/", getReviewsForTarget);

// Get my reviews
router.get("/my-reviews", requireAuth, getMyReviews);

// Delete a review
router.delete("/:reviewId", requireAuth, deleteReview);

module.exports = router;
