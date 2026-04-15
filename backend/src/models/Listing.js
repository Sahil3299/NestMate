// backend/src/models/Listing.js
const mongoose = require("mongoose");
const slugify  = require("slugify");

const ListingSchema = new mongoose.Schema(
  {
    owner: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      "User",
      required: true,
    },
    title: {
      type:      String,
      required:  [true, "Title is required"],
      trim:      true,
      maxlength: [120, "Title cannot exceed 120 characters"],
    },
    slug:        { type: String, unique: true, index: true },
    description: {
      type:      String,
      required:  [true, "Description is required"],
      maxlength: [3000, "Description cannot exceed 3000 characters"],
    },
    images:      [{ type: String }],

    // Listing type: room in a flat | flatmate profile | PG
    listingType: {
      type:    String,
      enum:    ["room", "flatmate", "pg"],
      default: "room",
    },
    roomType: {
      type: String,
      enum: ["Private Room", "Shared Room", "Full Apartment", "PG"],
    },
    furnishing: {
      type:    String,
      enum:    ["Furnished", "Semi-furnished", "Unfurnished"],
      default: "Furnished",
    },

    // Location
    location: {
      address:    { type: String, required: true },
      area:       { type: String },
      city:       { type: String, required: true, index: true },
      state:      { type: String, default: "Maharashtra" },
      pincode:    { type: String },
      // GeoJSON point for $nearSphere queries
      coordinates: {
        type:        { type: String, enum: ["Point"], default: "Point" },
        coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
      },
    },

    rent:    { type: Number, required: true, min: 0, index: true },
    deposit: { type: Number, default: 0 },

    // Preferences for matching
    preferences: {
      gender:     { type: String, enum: ["any", "male", "female"], default: "any" },
      smoking:    { type: Boolean, default: false },
      pets:       { type: Boolean, default: false },
      vegetarian: { type: Boolean, default: false },
      drinking:   { type: Boolean, default: false },
      students:   { type: Boolean, default: true },
      working:    { type: Boolean, default: true },
    },

    amenities:    [{ type: String }],
    tags:         [{ type: String }],
    availableFrom:{ type: Date, required: true },
    isActive:     { type: Boolean, default: true, index: true },
    isFeatured:   { type: Boolean, default: false },
    isVerified:   { type: Boolean, default: false },
    views:        { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON:   { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── Virtual ────────────────────────────────────────────────────────────────
ListingSchema.virtual("availabilityLabel").get(function () {
  return this.availableFrom <= new Date() ? "Available Now" : `From ${this.availableFrom.toLocaleDateString("en-IN")}`;
});

// ── Indexes ────────────────────────────────────────────────────────────────
ListingSchema.index({ "location.coordinates": "2dsphere" }); // geo queries
ListingSchema.index({ rent: 1, isActive: 1 });
ListingSchema.index({ "location.city": 1, isActive: 1 });
ListingSchema.index({ listingType: 1, isActive: 1 });
ListingSchema.index({ title: "text", "location.area": "text", tags: "text" }); // full-text

// ── Auto slug ──────────────────────────────────────────────────────────────
ListingSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true }) + "-" + Date.now();
  }
  next();
});

module.exports = mongoose.model("Listing", ListingSchema);
