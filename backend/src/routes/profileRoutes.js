const express = require("express");
const { requireAuth } = require("../middleware/auth");
const Profile = require("../models/Profile");

const router = express.Router();

function parseRequiredString(value) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

router.post("/", requireAuth, async (req, res) => {
  try {
    const body = req.body || {};

    const name = parseRequiredString(body.name);
    const age = Number(body.age);
    const gender = parseRequiredString(body.gender);
    const budgetMin = Number(body.budgetMin);
    const budgetMax = Number(body.budgetMax);
    const city = parseRequiredString(body.city);

    const habits = body.habits || {};
    const smoking = Boolean(habits.smoking);
    const drinking = Boolean(habits.drinking);
    const pets = Boolean(habits.pets);
    const sleep = parseRequiredString(habits.sleep);

    if (!name || !Number.isFinite(age) || !gender || !Number.isFinite(budgetMin) || !Number.isFinite(budgetMax) || !city || !sleep) {
      return res.status(400).json({ error: "Invalid profile payload" });
    }

    if (budgetMin > budgetMax) {
      return res.status(400).json({ error: "budgetMin must be <= budgetMax" });
    }

    const allowedSleep = ["early", "medium", "late"];
    if (!allowedSleep.includes(sleep)) {
      return res.status(400).json({ error: "sleep must be early | medium | late" });
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
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();

    return res.status(200).json({ profile: updated });
  } catch (err) {
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

module.exports = router;

