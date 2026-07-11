const { validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

module.exports = (validations) => {
  return async (req, res, next) => {
    for (const validation of validations) {
      await validation.run(req);
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors.array().map((e) => e.msg);
      return next(new AppError(messages.join('. '), 400));
    }
    next();
  };
};
