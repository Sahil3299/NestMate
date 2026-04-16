const express = require("express");
const router = express.Router();
const { authenticate, optionalAuth } = require("../middleware/auth");
const {
  createListing,
  getListings,
  getListing,
  getMyListings,
  updateListing,
  deleteListing,
  searchListings,
} = require("../controllers/listingController");

/**
 * Public routes
 */
router.get("/", optionalAuth, getListings);
router.get("/search", searchListings);
router.get("/:id", optionalAuth, getListing);

/**
 * Protected routes (require authentication)
 */
router.post("/", authenticate, createListing);
router.get("/user/my-listings", authenticate, getMyListings);
router.patch("/:id", authenticate, updateListing);
router.delete("/:id", authenticate, deleteListing);

module.exports = router;
