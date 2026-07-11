const mongoose = require('mongoose');

const phoneRevealLogSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    target: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    revealed: {
      type: Boolean,
      default: false,
    },
    revealedAt: Date,
  },
  {
    timestamps: true,
  }
);

phoneRevealLogSchema.index({ requester: 1, target: 1 }, { unique: true });

module.exports = mongoose.model('PhoneRevealLog', phoneRevealLogSchema);
