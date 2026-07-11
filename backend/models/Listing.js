const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner is required'],
      index: true,
    },
    type: {
      type: String,
      enum: ['room', 'flat', 'requirement'],
      default: 'room',
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      lowercase: true,
      index: true,
    },
    locality: {
      type: String,
      trim: true,
      default: '',
    },
    address: {
      type: String,
      trim: true,
      default: '',
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    rent: {
      type: Number,
      required: [true, 'Rent is required'],
      min: [0, 'Rent cannot be negative'],
    },
    deposit: {
      type: Number,
      default: 0,
      min: 0,
    },
    availableFrom: {
      type: Date,
    },
    roomType: {
      type: String,
      required: [true, 'Room type is required'],
      enum: ['Private', 'Shared', '1BHK', '2BHK', '3BHK', 'Studio', 'PG', 'Single Room'],
    },
    genderPreference: {
      type: String,
      enum: ['Male', 'Female', 'Any'],
      default: 'Any',
    },
    furnished: {
      type: String,
      enum: ['Fully Furnished', 'Semi Furnished', 'Not Furnished'],
      default: 'Not Furnished',
    },
    amenities: {
      type: [String],
      default: [],
    },
    photos: {
      type: [String],
      default: [],
    },
    isBrokerageFree: {
      type: Boolean,
      default: true,
    },
    preferredFlatmate: {
      gender: { type: String, enum: ['Male', 'Female', 'Any', ''], default: '' },
      ageMin: { type: Number, min: 18, default: 18 },
      ageMax: { type: Number, max: 100, default: 60 },
      foodPreference: { type: String, enum: ['veg', 'non-veg', 'vegan', 'eggetarian', ''], default: '' },
      smoking: { type: Boolean },
      drinking: { type: Boolean },
    },
    availability: {
      type: Boolean,
      default: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['active', 'rented', 'inactive'],
      default: 'active',
    },
    expiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

listingSchema.index({ city: 1, status: 1, rent: 1 });
listingSchema.index({ location: '2dsphere' });
listingSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Listing', listingSchema);
