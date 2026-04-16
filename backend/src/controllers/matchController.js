const Match = require("../models/Match");
const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");
const { NotFoundError, AuthorizationError, ConflictError } = require("../utils/errors");

/**
 * Get all seekers (for matching)
 * GET /api/v1/matches/seekers
 */
const getSeekers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;

  // Find all seekers excluding the current user
  const seekers = await User.find({ role: "seeker", _id: { $ne: req.user.id } })
    .select("-password -emailVerificationToken -passwordResetToken")
    .skip(skip)
    .limit(parseInt(limit));

  const total = await User.countDocuments({ role: "seeker", _id: { $ne: req.user.id } });

  res.json({
    success: true,
    data: seekers,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

/**
 * Get current user's match team
 * GET /api/v1/matches/my-team
 */
const getMyTeam = asyncHandler(async (req, res) => {
  // Find team where current user is team leader
  const team = await Match.findOne({ teamLeader: req.user.id, status: "active" })
    .populate("users", "-password -emailVerificationToken -passwordResetToken");

  if (!team) {
    return res.json({
      success: true,
      message: "No active team found",
      data: null,
    });
  }

  res.json({
    success: true,
    data: team,
  });
});

/**
 * Create a new team / Create match
 * POST /api/v1/matches
 */
const createTeam = asyncHandler(async (req, res) => {
  const { teamName } = req.body;

  // Check if user already has an active team
  const existingTeam = await Match.findOne({
    teamLeader: req.user.id,
    status: "active",
  });

  if (existingTeam) {
    throw new ConflictError("You already have an active team");
  }

  // Create new team
  const team = await Match.create({
    teamLeader: req.user.id,
    users: [req.user.id],
    status: "active",
  });

  res.status(201).json({
    success: true,
    message: "Team created successfully",
    data: team,
  });
});

/**
 * Invite user to team
 * POST /api/v1/matches/invite/:userId
 */
const inviteToTeam = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // Check if invitee exists
  const invitee = await User.findById(userId);
  if (!invitee) {
    throw new NotFoundError("User not found");
  }

  // Prevent self-invitation
  if (userId === req.user.id) {
    throw new ConflictError("You cannot invite yourself");
  }

  // Get current user's team
  const team = await Match.findOne({ teamLeader: req.user.id, status: "active" });

  if (!team) {
    throw new NotFoundError("You don't have an active team");
  }

  // Check if user already in team
  if (team.users.includes(userId)) {
    throw new ConflictError("User is already in the team");
  }

  // Add user to team
  team.users.push(userId);
  await team.save();

  res.json({
    success: true,
    message: "User invited to team successfully",
    data: team,
  });
});

/**
 * Remove user from team
 * DELETE /api/v1/matches/team/:userId
 */
const removeFromTeam = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // Get current user's team
  const team = await Match.findOne({ teamLeader: req.user.id, status: "active" });

  if (!team) {
    throw new NotFoundError("You don't have an active team");
  }

  // Check if user is in team
  if (!team.users.includes(userId)) {
    throw new NotFoundError("User is not in the team");
  }

  // Remove user from team
  team.users = team.users.filter(id => id.toString() !== userId);
  await team.save();

  res.json({
    success: true,
    message: "User removed from team successfully",
    data: team,
  });
});

/**
 * Leave team
 * DELETE /api/v1/matches/leave
 */
const leaveTeam = asyncHandler(async (req, res) => {
  // Find team where user is a member
  const team = await Match.findOne({
    users: req.user.id,
    status: "active",
  });

  if (!team) {
    throw new NotFoundError("You are not part of any team");
  }

  // If user is team leader, dissolve team
  if (team.teamLeader.toString() === req.user.id) {
    team.status = "dissolved";
    team.users = [];
    await team.save();

    return res.json({
      success: true,
      message: "Team dissolved successfully",
      data: team,
    });
  }

  // Otherwise just remove user from team
  team.users = team.users.filter(id => id.toString() !== req.user.id);
  await team.save();

  res.json({
    success: true,
    message: "You have left the team",
    data: team,
  });
});

/**
 * Dissolve team
 * DELETE /api/v1/matches/team
 */
const dissolveTeam = asyncHandler(async (req, res) => {
  // Find team where user is leader
  const team = await Match.findOne({ teamLeader: req.user.id, status: "active" });

  if (!team) {
    throw new NotFoundError("You don't have an active team");
  }

  // Dissolve team
  team.status = "dissolved";
  team.users = [];
  await team.save();

  res.json({
    success: true,
    message: "Team dissolved successfully",
    data: team,
  });
});

module.exports = {
  getSeekers,
  getMyTeam,
  createTeam,
  inviteToTeam,
  removeFromTeam,
  leaveTeam,
  dissolveTeam,
};
