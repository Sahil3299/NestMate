const catchAsync = require('../utils/catchAsync');
const sendResponse = require('../utils/sendResponse');
const AppError = require('../utils/AppError');

exports.uploadImage = catchAsync(async (req, res, next) => {
  if (!req.file) {
    throw new AppError('No file uploaded', 400);
  }

  sendResponse(res, 200, {
    url: req.file.path,
    filename: req.file.filename,
    size: req.file.size,
    mimetype: req.file.mimetype,
  }, 'Image uploaded successfully');
});
