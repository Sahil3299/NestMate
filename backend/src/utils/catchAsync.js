// backend/src/utils/catchAsync.js
// Eliminates try/catch boilerplate in controllers
const catchAsync = (fn) => (req, res, next) => fn(req, res, next).catch(next);
module.exports = catchAsync;
