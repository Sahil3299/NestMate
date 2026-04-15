// backend/src/middleware/errorHandler.js
const AppError = require("../utils/AppError");
const logger   = require("../utils/logger");

const handleCastError       = (e) => new AppError(`Invalid ${e.path}: ${e.value}`, 400);
const handleDuplicateKey    = (e) => new AppError(`"${Object.keys(e.keyValue)[0]}" already exists.`, 400);
const handleValidationError = (e) => new AppError(Object.values(e.errors).map((v) => v.message).join(". "), 400);
const handleJWTError        = ()  => new AppError("Invalid token. Please log in again.", 401);
const handleJWTExpired      = ()  => new AppError("Token expired. Please log in again.", 401);

const errorHandler = (err, req, res, _next) => {
  let error = Object.assign(new AppError(err.message || "Server Error", err.statusCode || 500), err);

  if (err.name === "CastError")         error = handleCastError(err);
  if (err.code  === 11000)              error = handleDuplicateKey(err);
  if (err.name === "ValidationError")   error = handleValidationError(err);
  if (err.name === "JsonWebTokenError") error = handleJWTError();
  if (err.name === "TokenExpiredError") error = handleJWTExpired();

  if (error.statusCode >= 500) {
    logger.error(`${error.statusCode} | ${req.method} ${req.originalUrl} | ${error.message}`);
  }

  res.status(error.statusCode).json({
    success: false,
    message: error.isOperational ? error.message : "Something went wrong. Please try again.",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;
