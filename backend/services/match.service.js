const Match = require('../models/Match');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const { computeScore } = require('./compatibility.service');

exports.getOrComputeMatch = async (currentUserId, targetUserId) => {
  const [currentUser, targetUser] = await Promise.all([
    User.findById(currentUserId),
    User.findById(targetUserId),
  ]);

  if (!currentUser || !targetUser) {
    throw new AppError('User not found', 404);
  }

  const existing = await Match.findOne({
    $or: [
      { userA: currentUserId, userB: targetUserId },
      { userA: targetUserId, userB: currentUserId },
    ],
  });

  if (existing) return existing;

  const { score, breakdown } = computeScore(currentUser, targetUser);
  const match = await Match.create({
    userA: currentUserId,
    userB: targetUserId,
    score,
    breakdown,
  });

  return match;
};

exports.getSuggestions = async (userId, limit = 10) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', 404);

  const existingMatches = await Match.find({
    $or: [{ userA: userId }, { userB: userId }],
  }).select('userA userB');

  const matchedIds = new Set();
  matchedIds.add(userId.toString());
  for (const m of existingMatches) {
    const other = m.userA.toString() === userId.toString() ? m.userB : m.userA;
    matchedIds.add(other.toString());
  }

  const candidates = await User.find({
    _id: { $nin: [...matchedIds] },
    city: user.city || undefined,
  }).limit(50);

  const scored = candidates.map((candidate) => {
    const { score, breakdown } = computeScore(user, candidate);
    return { user: candidate, score, breakdown };
  });

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, limit);
};
