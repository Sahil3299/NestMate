const crypto = require('crypto');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const { generateAccessToken, generateRefreshToken, verifyToken, generateResetToken } = require('../utils/tokens');
const { sendPasswordResetEmail, sendEmail } = require('../utils/sendEmail');

exports.register = async ({ name, email, password, role }) => {
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new AppError('An account with this email already exists', 409);
  }

  const otp = crypto.randomInt(100000, 999999).toString();
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    role: role || 'seeker',
    otp,
    otpExpires: Date.now() + 600000,
  });

  try {
    await sendEmail({
      to: user.email,
      subject: 'NestMate - Verify your email',
      html: `<h1>Welcome to NestMate!</h1><p>Your verification code is: <strong>${otp}</strong></p><p>This code expires in 10 minutes.</p>`,
    });
  } catch (err) {
    // email send failure is non-fatal during registration
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  return { user, accessToken, refreshToken };
};

exports.verifyOtp = async (email, otp) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+otp');
  if (!user) throw new AppError('User not found', 404);
  if (user.verified) throw new AppError('Email already verified', 400);
  if (!user.otp || user.otp !== otp) throw new AppError('Invalid OTP', 400);
  if (user.otpExpires < Date.now()) throw new AppError('OTP has expired', 400);

  user.verified = true;
  user.verificationStatus = 'approved';
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save({ validateBeforeSave: false });

  return user;
};

exports.resendOtp = async (email) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) throw new AppError('User not found', 404);
  if (user.verified) throw new AppError('Email already verified', 400);

  const otp = crypto.randomInt(100000, 999999).toString();
  user.otp = otp;
  user.otpExpires = Date.now() + 600000;
  await user.save({ validateBeforeSave: false });

  await sendEmail({
    to: user.email,
    subject: 'NestMate - Resend verification code',
    html: `<h1>NestMate Verification</h1><p>Your new verification code is: <strong>${otp}</strong></p><p>This code expires in 10 minutes.</p>`,
  });
};

exports.login = async (email, password) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  return { user, accessToken, refreshToken };
};

exports.refreshToken = async (refreshTokenStr) => {
  const decoded = verifyToken(refreshTokenStr);
  if (decoded.type !== 'refresh') {
    throw new AppError('Invalid refresh token', 401);
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new AppError('User no longer exists', 401);
  }

  const accessToken = generateAccessToken(user._id);
  const newRefreshToken = generateRefreshToken(user._id);

  return { accessToken, refreshToken: newRefreshToken };
};

exports.forgotPassword = async (email) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return;
  }

  const resetToken = generateResetToken();
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 3600000;
  await user.save({ validateBeforeSave: false });

  try {
    await sendPasswordResetEmail(user.email, resetToken);
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save({ validateBeforeSave: false });
    throw new AppError('Failed to send password reset email', 500);
  }
};

exports.resetPassword = async (token, newPassword) => {
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new AppError('Invalid or expired reset token', 400);
  }

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
};
