const User = require('../models/User');
const Listing = require('../models/Listing');
const Favorite = require('../models/Favorite');
const AppError = require('../utils/AppError');
const { deleteImage, extractPublicId } = require('../config/cloudinary');

exports.getProfile = async (userId) => {
  const user = await User.findById(userId).select('+phone');
  if (!user) throw new AppError('User not found', 404);
  return user;
};

exports.updateProfile = async (userId, updates, file) => {
  const allowed = [
    'name', 'firstName', 'lastName', 'phone', 'gender', 'bio', 'occupation', 'occupationType',
    'age', 'city', 'avatarPreset', 'avatarMode', 'profileImage', 'avatarPublicId',
    'preferences.budgetMin', 'preferences.budgetMax',
    'lifestyle.food', 'lifestyle.smoking', 'lifestyle.drinking',
    'lifestyle.pets', 'lifestyle.sleep', 'lifestyle.cleanliness',
    'lifestyle.workFromHome',
  ];
  const data = {};
  for (const key of allowed) {
    if (updates[key] !== undefined) data[key] = updates[key];
  }

  const current = await User.findById(userId);

  if (file) {
    if (current.avatarPublicId) {
      await deleteImage(current.avatarPublicId);
    }
    data.profileImage = file.path;
    data.avatarPublicId = '';
    data.avatarMode = 'upload';
  }

  if (updates.avatarPublicId && updates.avatarPublicId !== current.avatarPublicId) {
    if (current.avatarPublicId) {
      await deleteImage(current.avatarPublicId);
    }
    data.avatarMode = 'upload';
    data.avatarPreset = '';
  }

  if (updates.avatarPreset && updates.avatarMode === 'preset') {
    if (current.avatarPublicId) {
      await deleteImage(current.avatarPublicId);
    }
    data.avatarPublicId = '';
    data.profileImage = '';
  }

  const user = await User.findByIdAndUpdate(userId, data, { new: true, runValidators: true }).select('+phone');
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

  if (user.avatarPublicId) {
    await deleteImage(user.avatarPublicId);
  } else if (user.profileImage) {
    const publicId = extractPublicId(user.profileImage);
    if (publicId) await deleteImage(publicId);
  }

  await Listing.deleteMany({ owner: userId });
  await Favorite.deleteMany({ user: userId });
  await User.findByIdAndDelete(userId);
};

exports.toggleSave = async (userId, listingId) => {
  const listing = await Listing.findById(listingId);
  if (!listing) throw new AppError('Listing not found', 404);

  const existing = await Favorite.findOne({ user: userId, room: listingId });
  if (existing) {
    await Favorite.findByIdAndDelete(existing._id);
    return { saved: false };
  }

  await Favorite.create({ user: userId, room: listingId });
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
