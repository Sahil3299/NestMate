const mongoose = require("mongoose");

const savedListingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
      index: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Unique index to prevent duplicate saves
savedListingSchema.index({ user: 1, listing: 1 }, { unique: true });
savedListingSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("SavedListing", savedListingSchema);
