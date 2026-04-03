const express = require("express");
const { requireAuth } = require("../middleware/auth");
const Profile = require("../models/Profile");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

function parseRequiredString(value) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

const avatarsDir = path.join(__dirname, "../uploads/avatars");
try {
  if (!fs.existsSync(avatarsDir)) fs.mkdirSync(avatarsDir, { recursive: true });
} catch (e) {
  // ignore, multer will error on write if directory is missing
}

const storage = multer.diskStorage({
  destination: avatarsDir,
  filename: (req, file, cb) => {
    const uid = req.user?.uid || "unknown";
    const ext = path.extname(file.originalname || "").toLowerCase() || ".png";
    const safeExt = ext.replace(/[^a-z0-9.]/gi, "");
    cb(null, `${uid}-${Date.now()}-${Math.random().toString(16).slice(2)}${safeExt}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ok = file.mimetype && file.mimetype.startsWith("image/");
    cb(ok ? null : new Error("Invalid file type"), ok);
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

router.post("/", requireAuth, upload.single("avatarImage"), async (req, res) => {
  try {
    const body = req.body || {};

    const name = parseRequiredString(body.name);
    const age = Number(body.age);
    const gender = parseRequiredString(body.gender);
    const budgetMin = Number(body.budgetMin);
    const budgetMax = Number(body.budgetMax);
    const city = parseRequiredString(body.city);

    const bioRaw = typeof body.bio === "string" ? body.bio.trim() : "";
    const bio = bioRaw.length ? bioRaw : "";

    // Habits fields are sent from the form as flat keys like "habits.sleep".
    const sleep = parseRequiredString(body["habits.sleep"]);
    const smoking = body["habits.smoking"] === "true";
    const drinking = body["habits.drinking"] === "true";
    const pets = body["habits.pets"] === "true";

    const avatarPreset = parseRequiredString(body.avatarPreset) || "";
    const avatarMode = parseRequiredString(body.avatarMode) || "preset"; // "upload" | "preset"

    if (
      !name ||
      !Number.isFinite(age) ||
      !gender ||
      !Number.isFinite(budgetMin) ||
      !Number.isFinite(budgetMax) ||
      !city ||
      !sleep
    ) {
      return res.status(400).json({ error: "Invalid profile payload" });
    }

    if (budgetMin > budgetMax) {
      return res.status(400).json({ error: "budgetMin must be <= budgetMax" });
    }

    const allowedSleep = ["early", "medium", "late"];
    if (!allowedSleep.includes(sleep)) {
      return res.status(400).json({ error: "sleep must be early | medium | late" });
    }

    const avatarUpdates = {};
    if (req.file) {
      avatarUpdates.avatarPath = `/uploads/avatars/${req.file.filename}`;
      avatarUpdates.avatarPreset = avatarPreset;
    } else if (avatarMode === "preset") {
      // Switch to a preset avatar: clear uploaded image path.
      avatarUpdates.avatarPath = "";
      avatarUpdates.avatarPreset = avatarPreset;
    } else {
      // Keep existing avatarPath; still update preset for future consistency.
      avatarUpdates.avatarPreset = avatarPreset;
    }

    const updated = await Profile.findOneAndUpdate(
      { uid: req.user.uid },
      {
        $set: {
          name,
          age,
          gender,
          budgetMin,
          budgetMax,
          city,
          habits: { smoking, drinking, pets, sleep },
          bio,
          ...avatarUpdates,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();

    return res.status(200).json({ profile: updated });
  } catch (err) {
    // Handle Multer upload errors
    if (err?.message) return res.status(400).json({ error: err.message });
    return res.status(500).json({ error: "Failed to save profile" });
  }
});

router.get("/me", requireAuth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ uid: req.user.uid }).lean();
    if (!profile) return res.status(404).json({ error: "Profile not found" });
    return res.status(200).json({ profile });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch profile" });
  }
});

router.get("/:uid", requireAuth, async (req, res) => {
  try {
    const { uid } = req.params || {};
    if (!uid) return res.status(400).json({ error: "uid is required" });
    const profile = await Profile.findOne({ uid: uid }).lean();
    if (!profile) return res.status(404).json({ error: "Profile not found" });
    return res.status(200).json({ profile });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch profile" });
  }
});

module.exports = router;

