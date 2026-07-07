const catchAsync = require('../utils/catchAsync');
const sendResponse = require('../utils/sendResponse');
const authService = require('../services/auth.service');

exports.register = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  const result = await authService.register({ name, email, password, role });

  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  sendResponse(res, 201, { accessToken: result.accessToken, user: result.user }, 'Registration successful');
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);

  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  sendResponse(res, 200, { accessToken: result.accessToken, user: result.user }, 'Login successful');
});

exports.logout = catchAsync(async (req, res, next) => {
  res.clearCookie('refreshToken');
  sendResponse(res, 200, null, 'Logged out successfully');
});

exports.refreshToken = catchAsync(async (req, res, next) => {
  const token = req.cookies.refreshToken || req.body.refreshToken;
  if (!token) {
    return sendResponse(res, 401, null, 'No refresh token provided');
  }

  const result = await authService.refreshToken(token);

  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  sendResponse(res, 200, { accessToken: result.accessToken });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  await authService.forgotPassword(email);
  sendResponse(res, 200, null, 'If an account exists with that email, a password reset link has been sent');
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;
  await authService.resetPassword(token, password);
  sendResponse(res, 200, null, 'Password reset successful');
});
