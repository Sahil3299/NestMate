// backend/src/controllers/match.controller.js
"use strict";
const User         = require("../models/User");
const catchAsync   = require("../utils/catchAsync");
const AppError     = require("../utils/AppError");
const sendResponse = require("../utils/sendResponse");
const { scoreSeekers } = require("../services/matchingEngine");

// ── Find compatible seekers (Team Creator) ─────────────────────────────────
exports.findSeekers = catchAsync(async (req, res) => {
  const { city, minBudget, maxBudget, gender, page = 1, limit = 12 } = req.query;

  const filter = {
    isActive:   true,
    isVerified: true,
    _id:        { $ne: req.user._id },      // exclude self
    role:       "seeker",
    teamPartner:null,                         // not already in a team
  };

  if (city)   filter.preferredCity = new RegExp(city, "i");
  if (gender) filter.gender        = gender;

  if (minBudget || maxBudget) {
    // Overlap check: seeker's budget range overlaps with requested range
    if (minBudget) filter["budget.max"] = { $gte: Number(minBudget) };
    if (maxBudget) filter["budget.min"] = { $lte: Number(maxBudget) };
  }

  const total   = await User.countDocuments(filter);
  const seekers = await User.find(filter)
    .select("name avatar age gender occupation bio preferredCity budget lifestyle genderPreference isVerified createdAt")
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  const scored = scoreSeekers(req.user.toObject(), seekers);

  sendResponse(res, 200, "Seekers found.", scored, {
    total,
    page:  Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / Number(limit)),
  });
});

// ── Send team invite ───────────────────────────────────────────────────────
exports.sendTeamInvite = catchAsync(async (req, res, next) => {
  const { targetId } = req.params;
  if (String(targetId) === String(req.user._id)) {
    return next(new AppError("You cannot invite yourself.", 400));
  }

  const target = await User.findById(targetId);
  if (!target || !target.isActive) {
    return next(new AppError("User not found.", 404));
  }
  if (target.teamPartner) {
    return next(new AppError("This user already has a team partner.", 409));
  }
  if (req.user.teamPartner) {
    return next(new AppError("You already have a team partner.", 409));
  }

  // For MVP: auto-match. In production, implement an accept/decline flow.
  await User.findByIdAndUpdate(req.user._id,  { teamPartner: targetId });
  await User.findByIdAndUpdate(targetId,       { teamPartner: req.user._id });

  sendResponse(res, 200, "Team formed successfully! You can now search for apartments together.", {
    partner: {
      _id:        target._id,
      name:       target.name,
      avatar:     target.avatar,
      occupation: target.occupation,
    },
  });
});

// ── Leave team ─────────────────────────────────────────────────────────────
exports.leaveTeam = catchAsync(async (req, res, next) => {
  if (!req.user.teamPartner) {
    return next(new AppError("You are not in a team.", 400));
  }
  await User.findByIdAndUpdate(req.user.teamPartner, { teamPartner: null });
  await User.findByIdAndUpdate(req.user._id,          { teamPartner: null });

  sendResponse(res, 200, "You have left the team.");
});
