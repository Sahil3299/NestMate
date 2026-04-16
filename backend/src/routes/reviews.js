const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const {
  createReview,
  getReviewsForTarget,
  getMyReviews,
  deleteReview,
} = require("../controllers/reviewController");

/**
 * Public routes
 */
router.get("/", getReviewsForTarget);

/**
 * Protected routes (require authentication)
 */
router.post("/", authenticate, createReview);
router.get("/my-reviews", authenticate, getMyReviews);
router.delete("/:reviewId", authenticate, deleteReview);

module.exports = router;
