const mongoose = require("mongoose");

const amenitiesEnum = [
  "wifi",
  "ac",
  "heating",
  "kitchen",
  "parking",
  "laundry",
  "balcony",
  "gym",
  "pool",
  "garden",
  "tv",
  "fridge",
  "washer",
  "dryer",
];

const roomListingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 150,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 3000,
    },
    rent: {
      type: Number,
      required: true,
      min: [0, "Rent cannot be negative"],
      max: 999999,
    },
    securityDeposit: {
      type: Number,
      required: true,
      min: 0,
      max: 999999,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
        validate: {
          validator: function (v) {
            return v.length === 2 && Math.abs(v[0]) <= 180 && Math.abs(v[1]) <= 90;
          },
          message: "Invalid coordinates. Must be [longitude, latitude] with valid ranges.",
        },
      },
      address: {
        type: String,
        required: true,
        trim: true,
      },
      city: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },
    },
    amenities: {
      type: [String],
      enum: amenitiesEnum,
      default: [],
    },
    images: {
      type: [String], // Array of image URLs
      default: [],
      maxlength: 10,
    },
    availableFrom: {
      type: Date,
      required: true,
    },
    occupancy: {
      type: Number,
      required: true,
      min: 1,
      max: 20,
    },
    roomType: {
      type: String,
      enum: ["single", "shared", "entire"],
      required: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    posterProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Create geospatial index for location-based queries
roomListingSchema.index({ "location.coordinates": "2dsphere" });
roomListingSchema.index({ "location.city": 1 });
roomListingSchema.index({ rent: 1 });
roomListingSchema.index({ postedBy: 1 });
roomListingSchema.index({ isActive: 1, createdAt: -1 });

module.exports = mongoose.model("RoomListing", roomListingSchema);
