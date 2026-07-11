const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema(
  {
    userA: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userB: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    breakdown: {
      food: { type: Number, default: 0 },
      smoking: { type: Number, default: 0 },
      drinking: { type: Number, default: 0 },
      sleep: { type: Number, default: 0 },
      cleanliness: { type: Number, default: 0 },
      pets: { type: Number, default: 0 },
      workFromHome: { type: Number, default: 0 },
      occupation: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

matchSchema.index({ userA: 1, userB: 1 }, { unique: true });
matchSchema.index({ userA: 1, score: -1 });

module.exports = mongoose.model('Match', matchSchema);
