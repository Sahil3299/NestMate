const catchAsync = require('../utils/catchAsync');
const sendResponse = require('../utils/sendResponse');
const userService = require('../services/user.service');

const flattenObject = (obj, prefix = '') => {
  let result = {};
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    const prefixed = prefix ? `${prefix}.${key}` : key;
    if (val !== null && typeof val === 'object' && !Array.isArray(val) && !(val instanceof Date)) {
      Object.assign(result, flattenObject(val, prefixed));
    } else {
      result[prefixed] = val;
    }
  }
  return result;
};

exports.getProfile = catchAsync(async (req, res, next) => {
  const user = await userService.getProfile(req.user._id);
  sendResponse(res, 200, user);
});

exports.updateProfile = catchAsync(async (req, res, next) => {
  const flatBody = flattenObject(req.body);
  const user = await userService.updateProfile(req.user._id, flatBody, req.file);
  sendResponse(res, 200, user, 'Profile updated successfully');
});

exports.getUserById = catchAsync(async (req, res, next) => {
  const user = await userService.getUserById(req.params.id);
  sendResponse(res, 200, user);
});

exports.deleteAccount = catchAsync(async (req, res, next) => {
  await userService.deleteAccount(req.user._id);
  res.clearCookie('refreshToken');
  sendResponse(res, 200, null, 'Account deleted successfully');
});

exports.toggleSave = catchAsync(async (req, res, next) => {
  const result = await userService.toggleSave(req.user._id, req.params.listingId);
  sendResponse(res, 200, result, result.saved ? 'Listing saved' : 'Listing unsaved');
});

exports.getSavedListings = catchAsync(async (req, res, next) => {
  const listings = await userService.getSavedListings(req.user._id);
  sendResponse(res, 200, listings);
});
