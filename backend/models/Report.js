const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    targetListing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
    },
    reason: {
      type: String,
      required: [true, 'Reason is required'],
      trim: true,
      maxlength: [500, 'Reason cannot exceed 500 characters'],
    },
    category: {
      type: String,
      enum: ['fake-profile', 'fake-listing', 'spam', 'inappropriate', 'other'],
      default: 'other',
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
      default: 'pending',
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: Date,
    notes: String,
  },
  {
    timestamps: true,
  }
);

reportSchema.index({ status: 1 });
reportSchema.index({ reporter: 1 });
reportSchema.index({ targetUser: 1 });

module.exports = mongoose.model('Report', reportSchema);
