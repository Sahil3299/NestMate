const express = require("express");
const { requireAuth } = require("../middleware/auth");
const Profile = require("../models/Profile");
const { computeScore, normalizeCity } = require("../services/matching");

const router = express.Router();

router.get("/best", requireAuth, async (req, res) => {
  try {
    const limitRaw = req.query.limit;
    const limit = Math.min(Math.max(Number(limitRaw || 20), 1), 50);

    const cityFilter = typeof req.query.city === "string" ? req.query.city.trim() : "";
    const normalizedCityFilter = cityFilter ? normalizeCity(cityFilter) : "";

    const minBudget =
      req.query.minBudget !== undefined ? Number(req.query.minBudget) : null;
    const maxBudget =
      req.query.maxBudget !== undefined ? Number(req.query.maxBudget) : null;

    const budgetFilterEnabled =
      (minBudget !== null && Number.isFinite(minBudget)) ||
      (maxBudget !== null && Number.isFinite(maxBudget));

    // Lifestyle filters are optional; if provided they must match exactly.
    function parseOptionalBoolean(v) {
      if (v === undefined || v === null) return null;
      if (typeof v === "boolean") return v;
      if (typeof v !== "string") return null;
      if (v === "true") return true;
      if (v === "false") return false;
      if (v === "1") return true;
      if (v === "0") return false;
      return null;
    }

    const smoking = parseOptionalBoolean(req.query.smoking);
    const drinking = parseOptionalBoolean(req.query.drinking);
    const pets = parseOptionalBoolean(req.query.pets);

    const sleep =
      typeof req.query.sleep === "string" ? req.query.sleep.trim().toLowerCase() : "";
    const sleepFilterEnabled = ["early", "medium", "late"].includes(sleep);

    const me = await Profile.findOne({ uid: req.user.uid }).lean();
    if (!me) return res.status(400).json({ error: "Profile not found. Create your profile first." });

    const others = await Profile.find({ uid: { $ne: req.user.uid } }).lean();

    const filtered = others.filter((other) => {
      if (normalizedCityFilter) {
        if (normalizeCity(other.city) !== normalizedCityFilter) return false;
      }

      if (budgetFilterEnabled) {
        const a = { budgetMin: Number.isFinite(minBudget) ? minBudget : -Infinity, budgetMax: Number.isFinite(maxBudget) ? maxBudget : Infinity };
        const b = { budgetMin: other.budgetMin, budgetMax: other.budgetMax };
        // Use the same overlap rule you specified:
        // aMin <= bMax && bMin <= aMax
        const overlap = a.budgetMin <= b.budgetMax && b.budgetMin <= a.budgetMax;
        if (!overlap) return false;
      }

      if (smoking !== null) {
        if (other.habits?.smoking !== smoking) return false;
      }
      if (drinking !== null) {
        if (other.habits?.drinking !== drinking) return false;
      }
      if (pets !== null) {
        if (other.habits?.pets !== pets) return false;
      }
      if (sleepFilterEnabled) {
        if (other.habits?.sleep !== sleep) return false;
      }

      return true;
    });

    const scored = filtered
      .map((other) => {
        const score = computeScore(me, other);
        return {
          uid: other.uid,
          name: other.name,
          age: other.age,
          gender: other.gender,
          city: other.city,
          budgetMin: other.budgetMin,
          budgetMax: other.budgetMax,
          habits: other.habits,
          ...score,
        };
      })
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return b.matchPercent - a.matchPercent;
      })
      .slice(0, limit);

    return res.status(200).json({ bestMatches: scored });
  } catch (err) {
    return res.status(500).json({ error: "Failed to compute matches" });
  }
});

module.exports = router;

