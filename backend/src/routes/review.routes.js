const router = require("express").Router();
const ctrl = require("../controllers/reviewController");
const { authenticate } = require("../middleware/auth");

// All review routes require authentication
router.use(authenticate);

// Create/update review for a listing or user
router.post("/", ctrl.createReview);

// Get reviews for a target (listing or user)
router.get("/target/:targetType/:targetId", ctrl.getReviews);

// Get reviews written by the current user
router.get("/my-reviews", ctrl.getMyReviews);

// Get single review
router.get("/:id", ctrl.getReviewById);

// Delete review
router.delete("/:reviewId", ctrl.deleteReview);

module.exports = router;
