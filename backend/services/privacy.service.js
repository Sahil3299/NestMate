const User = require('../models/User');
const PhoneRevealLog = require('../models/PhoneRevealLog');
const AppError = require('../utils/AppError');

exports.revealContact = async (requesterId, targetId) => {
  if (requesterId.toString() === targetId.toString()) {
    throw new AppError('Cannot reveal your own contact', 400);
  }

  const target = await User.findById(targetId).select('+phone');
  if (!target) throw new AppError('User not found', 404);

  let log = await PhoneRevealLog.findOne({
    requester: requesterId,
    target: targetId,
  });

  if (log && log.revealed) {
    return { phone: target.phone, alreadyRevealed: true };
  }

  if (!log) {
    log = await PhoneRevealLog.create({
      requester: requesterId,
      target: targetId,
      revealed: true,
      revealedAt: new Date(),
    });
  } else {
    log.revealed = true;
    log.revealedAt = new Date();
    await log.save();
  }

  return { phone: target.phone, alreadyRevealed: false };
};

exports.getRevealHistory = async (userId) => {
  const logs = await PhoneRevealLog.find({ requester: userId })
    .populate('target', 'name email profileImage')
    .sort({ createdAt: -1 });

  return logs;
};
