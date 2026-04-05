const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    reviewerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    targetType: {
      type: String,
      enum: ["room", "user"],
      required: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: function () {
        return this.targetType === "room" ? "RoomListing" : "User";
      },
      index: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
  },
  { timestamps: true }
);

// Prevent duplicate reviews: one reviewer can only review a target once
reviewSchema.index({ reviewerId: 1, targetId: 1, targetType: 1 }, { unique: true });
reviewSchema.index({ targetId: 1, targetType: 1 });

module.exports = mongoose.model("Review", reviewSchema);
