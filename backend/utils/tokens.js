const jwt = require('jsonwebtoken');
const env = require('../config/env');

exports.generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

exports.generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId, type: 'refresh' }, env.JWT_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  });
};

exports.verifyToken = (token) => {
  return jwt.verify(token, env.JWT_SECRET);
};

exports.generateResetToken = () => {
  const crypto = require('crypto');
  return crypto.randomBytes(32).toString('hex');
};
