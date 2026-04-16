/**
 * Higher-order function to wrap async route handlers
 * Catches errors and passes them to the global error handler
 * Eliminates the need for try-catch in every async controller
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
