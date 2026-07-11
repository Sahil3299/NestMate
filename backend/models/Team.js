const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: [100, 'Team name cannot exceed 100 characters'],
    },
    members: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    targetCity: {
      type: String,
      trim: true,
      lowercase: true,
    },
    targetLocality: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'disbanded'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

teamSchema.index({ createdBy: 1 });
teamSchema.index({ 'members': 1 });

module.exports = mongoose.model('Team', teamSchema);
