const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const {
  getProfile,
  updateProfile,
  getPublicProfile,
  getSavedListings,
  toggleSaveListing,
  checkSaved,
} = require("../controllers/userController");

/**
 * Protected routes (require authentication)
 */
router.get("/me", authenticate, getProfile);
router.patch("/me", authenticate, updateProfile);
router.get("/me/saved", authenticate, getSavedListings);
router.post("/me/saved/:listingId", authenticate, toggleSaveListing);
router.get("/me/saved/:listingId", authenticate, checkSaved);

/**
 * Public routes
 */
router.get("/:userId", getPublicProfile);

module.exports = router;
