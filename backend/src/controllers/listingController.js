const Listing = require("../models/Listing");
const asyncHandler = require("../middleware/asyncHandler");
const { NotFoundError, AuthorizationError, ValidationError } = require("../utils/errors");

/**
 * Create a new listing
 * POST /api/v1/listings
 */
const createListing = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    listingType,
    roomType,
    furnishing,
    rent,
    deposit,
    location,
    preferences,
    amenities,
    availableFrom,
    images,
  } = req.body;

  // Validation
  if (!title || !description || !rent || !location || !availableFrom) {
    throw new ValidationError(
      "Missing required fields: title, description, rent, location, availableFrom"
    );
  }

  if (!location.address || !location.city) {
    throw new ValidationError("Location must include address and city");
  }

  const listing = await Listing.create({
    owner: req.user.id,
    title,
    description,
    listingType: listingType || "room",
    roomType,
    furnishing,
    rent,
    deposit: deposit || 0,
    location,
    preferences,
    amenities: amenities || [],
    availableFrom: new Date(availableFrom),
    images: images || [],
  });

  res.status(201).json({
    success: true,
    message: "Listing created successfully",
    data: listing,
  });
});

/**
 * Get all listings with filters
 * GET /api/v1/listings?city=Mumbai&minRent=10000&maxRent=50000&roomType=1BHK&page=1&limit=20
 */
const getListings = asyncHandler(async (req, res) => {
  const { city, minRent, maxRent, roomType, listingType, amenities, page = 1, limit = 20 } = req.query;

  // Build filter object
  const filter = { isActive: true };

  if (city) filter["location.city"] = city;
  if (minRent || maxRent) {
    filter.rent = {};
    if (minRent) filter.rent.$gte = Number(minRent);
    if (maxRent) filter.rent.$lte = Number(maxRent);
  }
  if (roomType) filter.roomType = roomType;
  if (listingType) filter.listingType = listingType;
  if (amenities) {
    const amenityArray = Array.isArray(amenities) ? amenities : [amenities];
    filter.amenities = { $in: amenityArray };
  }

  const skip = (page - 1) * limit;

  const listings = await Listing.find(filter)
    .populate("owner", "name email avatar city")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Listing.countDocuments(filter);

  res.json({
    success: true,
    data: listings,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

/**
 * Get single listing by ID
 * GET /api/v1/listings/:id
 */
const getListing = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findByIdAndUpdate(
    id,
    { $inc: { views: 1 } },
    { new: true }
  ).populate("owner", "name email avatar city age gender occupation bio");

  if (!listing) {
    throw new NotFoundError("Listing not found");
  }

  res.json({
    success: true,
    data: listing,
  });
});

/**
 * Get user's own listings
 * GET /api/v1/listings/user/my-listings
 */
const getMyListings = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;

  const listings = await Listing.find({ owner: req.user.id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Listing.countDocuments({ owner: req.user.id });

  res.json({
    success: true,
    data: listings,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

/**
 * Update listing
 * PATCH /api/v1/listings/:id
 */
const updateListing = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check ownership
  const listing = await Listing.findById(id);
  if (!listing) {
    throw new NotFoundError("Listing not found");
  }

  if (listing.owner.toString() !== req.user.id) {
    throw new AuthorizationError("You can only edit your own listings");
  }

  // Update allowed fields
  const allowedFields = [
    "title",
    "description",
    "roomType",
    "furnishing",
    "rent",
    "deposit",
    "preferences",
    "amenities",
    "availableFrom",
    "images",
    "location",
    "isActive",
  ];

  Object.keys(req.body).forEach(key => {
    if (allowedFields.includes(key)) {
      listing[key] = req.body[key];
    }
  });

  await listing.save();

  res.json({
    success: true,
    message: "Listing updated successfully",
    data: listing,
  });
});

/**
 * Delete listing
 * DELETE /api/v1/listings/:id
 */
const deleteListing = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id);
  if (!listing) {
    throw new NotFoundError("Listing not found");
  }

  if (listing.owner.toString() !== req.user.id) {
    throw new AuthorizationError("You can only delete your own listings");
  }

  await Listing.findByIdAndDelete(id);

  res.json({
    success: true,
    message: "Listing deleted successfully",
  });
});

/**
 * Search listings with advanced filters
 * GET /api/v1/listings/search?q=kitchen&city=Mumbai&minRent=5000&maxRent=50000
 */
const searchListings = asyncHandler(async (req, res) => {
  const { q, city, minRent, maxRent, roomType, page = 1, limit = 20 } = req.query;

  const filter = { isActive: true };

  // Text search if query provided
  if (q) {
    filter.$text = { $search: q };
  }

  // Filters
  if (city) filter["location.city"] = city;
  if (minRent || maxRent) {
    filter.rent = {};
    if (minRent) filter.rent.$gte = Number(minRent);
    if (maxRent) filter.rent.$lte = Number(maxRent);
  }
  if (roomType) filter.roomType = roomType;

  const skip = (page - 1) * limit;

  const listings = await Listing.find(filter)
    .populate("owner", "name email avatar")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Listing.countDocuments(filter);

  res.json({
    success: true,
    data: listings,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

module.exports = {
  createListing,
  getListings,
  getListing,
  getMyListings,
  updateListing,
  deleteListing,
  searchListings,
};
