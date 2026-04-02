const express = require("express");
const { requireAuth } = require("../middleware/auth");
const Profile = require("../models/Profile");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

const router = express.Router();

function conversationKeyFor(uidA, uidB) {
  const [a, b] = [uidA, uidB].sort();
  return `${a}:${b}`;
}

router.post("/messages", requireAuth, async (req, res) => {
  try {
    const { toUid, text } = req.body || {};
    if (!toUid || typeof toUid !== "string") {
      return res.status(400).json({ error: "toUid is required" });
    }

    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ error: "text is required" });
    }

    const trimmedText = text.trim();
    if (trimmedText.length > 2000) {
      return res.status(400).json({ error: "text too long" });
    }

    if (toUid === req.user.uid) {
      return res.status(400).json({ error: "Cannot message yourself" });
    }

    const toProfile = await Profile.findOne({ uid: toUid }).lean();
    if (!toProfile) return res.status(404).json({ error: "User not found" });

    const conversationKey = conversationKeyFor(req.user.uid, toUid);

    await Conversation.findOneAndUpdate(
      { conversationKey },
      { $setOnInsert: { conversationKey, participants: [req.user.uid, toUid].sort() } },
      { upsert: true, new: true }
    );

    const message = await Message.create({
      conversationKey,
      senderUid: req.user.uid,
      text: trimmedText,
    });

    return res.status(201).json({
      conversationKey,
      message: {
        id: message._id,
        senderUid: message.senderUid,
        text: message.text,
        createdAt: message.createdAt,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to send message" });
  }
});

router.get("/messages/:withUid", requireAuth, async (req, res) => {
  try {
    const { withUid } = req.params;
    const limitRaw = req.query.limit;
    const limit = Math.min(Math.max(Number(limitRaw || 50), 1), 200);

    const conversationKey = conversationKeyFor(req.user.uid, withUid);

    const messages = await Message.find({ conversationKey })
      .sort({ createdAt: 1 })
      .limit(limit)
      .lean();

    const safeMessages = messages.map((m) => ({
      id: m._id,
      senderUid: m.senderUid,
      text: m.text,
      createdAt: m.createdAt,
    }));

    return res.status(200).json({ conversationKey, messages: safeMessages });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch messages" });
  }
});

module.exports = router;

