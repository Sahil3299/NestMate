const router = require("express").Router();
const ctrl = require("../controllers/admin.controller");
const { authenticate, authorize } = require("../middleware/auth");

// All admin routes require authentication and admin role
router.use(authenticate, authorize("admin"));

// ═══════════════════════════════════════════════════════════════════════════
// DASHBOARD STATS
// ═══════════════════════════════════════════════════════════════════════════
router.get("/stats", ctrl.getDashboardStats);

// ═══════════════════════════════════════════════════════════════════════════
// USER MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════
router.get("/users", ctrl.getAllUsers);
router.get("/users/:userId", ctrl.getUserDetails);
router.post("/users/:userId/ban", ctrl.banUser);
router.post("/users/:userId/unban", ctrl.unbanUser);
router.delete("/users/:userId", ctrl.deleteUser);

// ═══════════════════════════════════════════════════════════════════════════
// LISTING MODERATION
// ═══════════════════════════════════════════════════════════════════════════
router.get("/listings", ctrl.getAllListings);
router.post("/listings/:listingId/approve", ctrl.approveListing);
router.post("/listings/:listingId/reject", ctrl.rejectListing);
router.post("/listings/:listingId/flag", ctrl.flagListing);
router.delete("/listings/:listingId", ctrl.deleteListing);

// ═══════════════════════════════════════════════════════════════════════════
// REVIEW MODERATION
// ═══════════════════════════════════════════════════════════════════════════
router.get("/reviews", ctrl.getAllReviews);
router.post("/reviews/:reviewId/flag", ctrl.flagReview);
router.delete("/reviews/:reviewId", ctrl.removeReview);

// ═══════════════════════════════════════════════════════════════════════════
// SYSTEM ACTIVITY
// ═══════════════════════════════════════════════════════════════════════════
router.get("/activity", ctrl.getSystemActivity);

module.exports = router;
