const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 0, max: 120 },
    gender: { type: String, required: true, trim: true },

    budgetMin: { type: Number, required: true, min: 0 },
    budgetMax: { type: Number, required: true, min: 0 },

    city: { type: String, required: true, trim: true },

    habits: {
      smoking: { type: Boolean, required: true },
      drinking: { type: Boolean, required: true },
      pets: { type: Boolean, required: true },
      // "early" | "medium" | "late"
      sleep: { type: String, required: true, enum: ["early", "medium", "late"] },
    },

    bio: { type: String, default: "" },

    // Either:
    // - avatarPath: relative URL path like "/uploads/avatars/..."
    // - avatarPreset: preset id (e.g. "preset-1") when no upload is used
    avatarPath: { type: String, default: "" },
    avatarPreset: { type: String, default: "" },
  },
  { timestamps: true }
);

profileSchema.index({ uid: 1 }, { unique: true });

module.exports = mongoose.model("Profile", profileSchema);

