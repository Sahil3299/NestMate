const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    // Sorted participants key: `${uidA}:${uidB}`
    conversationKey: { type: String, required: true, unique: true, index: true },
    participants: { type: [String], required: true, validate: (v) => v.length === 2 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", conversationSchema);

