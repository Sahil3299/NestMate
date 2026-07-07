const passport = require('passport');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.authenticate = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return next(new AppError('Please log in to access this resource', 401));
    }
    req.user = user;
    next();
  })(req, res, next);
};

exports.optionalAuth = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) return next(err);
    req.user = user || null;
    next();
  })(req, res, next);
};
