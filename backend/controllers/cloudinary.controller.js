const cloudinary = require('cloudinary').v2;
const catchAsync = require('../utils/catchAsync');
const sendResponse = require('../utils/sendResponse');
const env = require('../config/env');

exports.signUpload = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const folder = `nestmate/avatars/${userId}`;
  const timestamp = Math.round(Date.now() / 1000);

  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    env.CLOUDINARY.API_SECRET
  );

  sendResponse(res, 200, {
    timestamp,
    signature,
    apiKey: env.CLOUDINARY.API_KEY,
    cloudName: env.CLOUDINARY.CLOUD_NAME,
    folder,
  });
});
