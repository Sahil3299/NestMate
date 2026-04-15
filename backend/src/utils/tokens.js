// backend/src/utils/tokens.js
const jwt = require("jsonwebtoken");

/**
 * Generate short-lived access token (15m default)
 */
const signAccessToken = (userId, role) =>
  jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "15m",
  });

/**
 * Generate long-lived refresh token (7d default)
 */
const signRefreshToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || "7d",
  });

const verifyAccessToken  = (token) => jwt.verify(token, process.env.JWT_SECRET);
const verifyRefreshToken = (token) => jwt.verify(token, process.env.JWT_REFRESH_SECRET);

/**
 * Attach refresh token as httpOnly cookie
 */
const attachRefreshCookie = (res, token) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge:   7 * 24 * 60 * 60 * 1000, // 7 days ms
  });
};

const clearRefreshCookie = (res) =>
  res.clearCookie("refreshToken", { httpOnly: true, secure: process.env.NODE_ENV === "production" });

module.exports = { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken, attachRefreshCookie, clearRefreshCookie };
