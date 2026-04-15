// backend/src/controllers/listing.controller.js
"use strict";
const path           = require("path");
const Listing        = require("../models/Listing");
const catchAsync     = require("../utils/catchAsync");
const AppError       = require("../utils/AppError");
const sendResponse   = require("../utils/sendResponse");
const { scoreListings } = require("../services/matchingEngine");

// ── Create listing ─────────────────────────────────────────────────────────
exports.createListing = catchAsync(async (req, res) => {
  // Attach uploaded image paths
  const images = req.files?.map((f) => `/uploads/listings/${f.filename}`) || [];

  // Parse nested JSON strings (from multipart/form-data)
  const body = { ...req.body };
  if (typeof body.location    === "string") body.location    = JSON.parse(body.location);
  if (typeof body.preferences === "string") body.preferences = JSON.parse(body.preferences);
  if (typeof body.amenities   === "string") body.amenities   = JSON.parse(body.amenities);
  if (typeof body.tags        === "string") body.tags        = JSON.parse(body.tags);

  // Map coordinates to GeoJSON
  if (body.location?.coordinates) {
    const { lat, lng } = body.location.coordinates;
    body.location.coordinates = { type: "Point", coordinates: [lng, lat] };
  }

  const listing = await Listing.create({ ...body, owner: req.user._id, images });
  sendResponse(res, 201, "Listing created successfully.", listing);
});

// ── Get all listings (with filters, pagination, matching) ──────────────────
exports.getListings = catchAsync(async (req, res) => {
  const {
    city, minRent, maxRent, listingType, roomType, gender,
    smoking, pets, vegetarian, lat, lng, radius = 10,
    search, page = 1, limit = 12, sort = "newest",
  } = req.query;

  const filter = { isActive: true };

  if (city)        filter["location.city"]           = new RegExp(city, "i");
  if (listingType) filter.listingType                = listingType;
  if (roomType)    filter.roomType                   = roomType;
  if (gender)      filter["preferences.gender"]      = { $in: [gender, "any"] };
  if (smoking !== undefined)    filter["preferences.smoking"]    = smoking    === "true";
  if (pets    !== undefined)    filter["preferences.pets"]       = pets       === "true";
  if (vegetarian !== undefined) filter["preferences.vegetarian"] = vegetarian === "true";

  if (minRent || maxRent) {
    filter.rent = {};
    if (minRent) filter.rent.$gte = Number(minRent);
    if (maxRent) filter.rent.$lte = Number(maxRent);
  }

  // Full-text search
  if (search) filter.$text = { $search: search };

  // Geo filter
  if (lat && lng) {
    filter["location.coordinates"] = {
      $nearSphere: {
        $geometry:    { type: "Point", coordinates: [Number(lng), Number(lat)] },
        $maxDistance: Number(radius) * 1000, // metres
      },
    };
  }

  // Sort
  const sortMap = {
    newest:    { createdAt: -1 },
    rent_asc:  { rent: 1 },
    rent_desc: { rent: -1 },
    match:     { createdAt: -1 }, // overridden below
  };
  const sortObj = sortMap[sort] || sortMap.newest;

  const skip  = (Number(page) - 1) * Number(limit);
  const total = await Listing.countDocuments(filter);

  let listings = await Listing.find(filter)
    .populate("owner", "name avatar isVerified")
    .sort(sortObj)
    .skip(skip)
    .limit(Number(limit))
    .lean();

  // Apply matching score if user is authenticated and sort=match
  if (sort === "match" && req.user) {
    listings = scoreListings(req.user, listings);
  } else if (req.user) {
    // Still annotate score even if not sorting by it
    listings = scoreListings(req.user, listings);
  }

  sendResponse(res, 200, "Listings fetched.", listings, {
    total,
    page:       Number(page),
    limit:      Number(limit),
    totalPages: Math.ceil(total / Number(limit)),
  });
});

// ── Get single listing ─────────────────────────────────────────────────────
exports.getListing = catchAsync(async (req, res, next) => {
  const listing = await Listing.findOne({
    $or: [{ _id: req.params.id.match(/^[a-f\d]{24}$/i) ? req.params.id : null }, { slug: req.params.id }],
    isActive: true,
  }).populate("owner", "name avatar isVerified bio occupation");

  if (!listing) return next(new AppError("Listing not found.", 404));

  // Increment views
  await Listing.findByIdAndUpdate(listing._id, { $inc: { views: 1 } });

  let data = listing.toObject();
  if (req.user) {
    const { score, breakdown } = require("../services/matchingEngine").calculateMatch(req.user, data);
    data.matchScore    = score;
    data.matchBreakdown = breakdown;
  }

  sendResponse(res, 200, "Listing fetched.", data);
});

// ── Update listing ─────────────────────────────────────────────────────────
exports.updateListing = catchAsync(async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return next(new AppError("Listing not found.", 404));

  if (listing.owner.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    return next(new AppError("You can only update your own listings.", 403));
  }

  const newImages = req.files?.map((f) => `/uploads/listings/${f.filename}`) || [];
  const body      = { ...req.body };
  if (newImages.length) body.images = [...(listing.images || []), ...newImages];

  if (typeof body.location    === "string") body.location    = JSON.parse(body.location);
  if (typeof body.preferences === "string") body.preferences = JSON.parse(body.preferences);

  if (body.location?.coordinates?.lat) {
    const { lat, lng } = body.location.coordinates;
    body.location.coordinates = { type: "Point", coordinates: [lng, lat] };
  }

  const updated = await Listing.findByIdAndUpdate(req.params.id, body, {
    new: true, runValidators: true,
  });

  sendResponse(res, 200, "Listing updated.", updated);
});

// ── Delete listing ─────────────────────────────────────────────────────────
exports.deleteListing = catchAsync(async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return next(new AppError("Listing not found.", 404));

  if (listing.owner.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    return next(new AppError("You can only delete your own listings.", 403));
  }

  await listing.deleteOne();
  sendResponse(res, 200, "Listing deleted.");
});

// ── My listings ────────────────────────────────────────────────────────────
exports.getMyListings = catchAsync(async (req, res) => {
  const listings = await Listing.find({ owner: req.user._id }).sort({ createdAt: -1 });
  sendResponse(res, 200, "Your listings.", listings);
});
