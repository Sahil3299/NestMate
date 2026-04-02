const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { requireAuth } = require("../middleware/auth");
const env = require("../config/env");
const User = require("../models/User");

const router = express.Router();

function requireString(field, name) {
  if (typeof field !== "string") return null;
  const trimmed = field.trim();
  if (!trimmed) return null;
  return trimmed;
}

router.post("/register", async (req, res) => {
  try {
    const email = requireString(req.body?.email, "email");
    const password = requireString(req.body?.password, "password");

    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "password must be at least 6 characters" });
    }

    const existing = await User.findOne({ email }).lean();
    if (existing) return res.status(409).json({ error: "Email already in use" });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ email, passwordHash });

    const token = jwt.sign({ uid: user._id.toString(), email: user.email }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
    });

    return res.status(201).json({ token, user: { uid: user._id.toString(), email: user.email } });
  } catch (err) {
    return res.status(500).json({ error: "Failed to register" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const email = requireString(req.body?.email, "email");
    const password = requireString(req.body?.password, "password");

    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ uid: user._id.toString(), email: user.email }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
    });

    return res.status(200).json({ token, user: { uid: user._id.toString(), email: user.email } });
  } catch (err) {
    return res.status(500).json({ error: "Failed to login" });
  }
});

router.get("/me", requireAuth, async (req, res) => {
  try {
    return res.status(200).json({ user: req.user });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch user" });
  }
});

module.exports = router;

