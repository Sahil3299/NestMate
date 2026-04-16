const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema(
  {
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    teamLeader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "active", "dissolved"],
      default: "active",
      index: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Indexes for efficient queries
matchSchema.index({ teamLeader: 1, status: 1 });
matchSchema.index({ users: 1, status: 1 });
matchSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Match", matchSchema);
