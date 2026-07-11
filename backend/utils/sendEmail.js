const nodemailer = require('nodemailer');
const env = require('../config/env');
const logger = require('./logger');

const transporter = nodemailer.createTransport({
  host: env.SMTP.HOST,
  port: env.SMTP.PORT,
  secure: env.SMTP.PORT === 465,
  auth: {
    user: env.SMTP.USER,
    pass: env.SMTP.PASS,
  },
});

exports.sendEmail = async ({ to, subject, html }) => {
  if (!env.SMTP.USER || !env.SMTP.PASS) {
    logger.warn('SMTP not configured, skipping email send', { to, subject });
    return;
  }
  await transporter.sendMail({
    from: `"NestMate" <${env.SMTP.USER}>`,
    to,
    subject,
    html,
  });
};

exports.sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${env.FRONTEND_URL}/reset-password/${resetToken}`;
  await exports.sendEmail({
    to: email,
    subject: 'NestMate - Password Reset Request',
    html: `
      <h1>Password Reset</h1>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#14B8A6;color:#fff;text-decoration:none;border-radius:8px;">Reset Password</a>
      <p>This link expires in 1 hour.</p>
      <p>If you didn't request this, ignore this email.</p>
    `,
  });
};
