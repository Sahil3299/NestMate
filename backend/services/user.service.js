const User = require('../models/User');
const Room = require('../models/Room');
const Favorite = require('../models/Favorite');
const AppError = require('../utils/AppError');
const { deleteImage, extractPublicId } = require('../config/cloudinary');

exports.getProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', 404);
  return user;
};

exports.updateProfile = async (userId, updates, file) => {
  const allowed = [
    'name', 'phone', 'gender', 'bio', 'occupation',
    'age', 'city', 'avatarPreset', 'avatarMode',
    'preferences.budgetMin', 'preferences.budgetMax',
    'habits.smoking', 'habits.drinking', 'habits.pets', 'habits.sleep',
  ];
  const data = {};
  for (const key of allowed) {
    if (updates[key] !== undefined) data[key] = updates[key];
  }

  if (file) {
    const current = await User.findById(userId);
    if (current.profileImage) {
      const publicId = extractPublicId(current.profileImage);
      if (publicId) await deleteImage(publicId);
    }
    data.profileImage = file.path;
    data.avatarMode = 'upload';
  }

  const user = await User.findByIdAndUpdate(userId, data, { new: true, runValidators: true });
  if (!user) throw new AppError('User not found', 404);
  return user;
};

exports.getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new AppError('User not found', 404);
  return user;
};

exports.deleteAccount = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', 404);

  if (user.profileImage) {
    const publicId = extractPublicId(user.profileImage);
    if (publicId) await deleteImage(publicId);
  }

  await Room.deleteMany({ owner: userId });
  await Favorite.deleteMany({ user: userId });
  await User.findByIdAndDelete(userId);
};

exports.toggleSave = async (userId, roomId) => {
  const room = await Room.findById(roomId);
  if (!room) throw new AppError('Room not found', 404);

  const existing = await Favorite.findOne({ user: userId, room: roomId });
  if (existing) {
    await Favorite.findByIdAndDelete(existing._id);
    return { saved: false };
  }

  await Favorite.create({ user: userId, room: roomId });
  return { saved: true };
};

exports.getSavedListings = async (userId) => {
  const favorites = await Favorite.find({ user: userId })
    .populate({
      path: 'room',
      populate: { path: 'owner', select: 'name email profileImage' },
    })
    .sort({ createdAt: -1 });

  return favorites.filter((f) => f.room != null).map((f) => f.room);
};
