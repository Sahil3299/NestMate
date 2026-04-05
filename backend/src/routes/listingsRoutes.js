const express = require("express");
const { requireAuth } = require("../middleware/auth");
const {
  createListing,
  getListing,
  updateListing,
  deleteListing,
  getUserListings,
  searchListings,
} = require("../controllers/listingsController");

const router = express.Router();

// Create a new listing (authenticated)
router.post("/", requireAuth, createListing);

// Get all my listings
router.get("/my-listings", requireAuth, getUserListings);

// Search/browse listings (public, but with auth context)
router.get("/search", searchListings);

// Get a single listing by ID
router.get("/:id", getListing);

// Update a listing (authenticated, owner only)
router.put("/:id", requireAuth, updateListing);

// Delete a listing (authenticated, owner only)
router.delete("/:id", requireAuth, deleteListing);

module.exports = router;
