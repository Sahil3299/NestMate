const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    conversationKey: { type: String, required: true, index: true },
    senderUid: { type: String, required: true, index: true },
    text: { type: String, required: true, maxlength: 2000 },
  },
  { timestamps: true }
);

messageSchema.index({ conversationKey: 1, createdAt: 1 });

module.exports = mongoose.model("Message", messageSchema);

