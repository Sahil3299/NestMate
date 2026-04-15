// backend/src/middleware/rateLimiter.js
const rateLimit = require("express-rate-limit");

const make = (windowMs, max, message) =>
  rateLimit({
    windowMs,
    max,
    message:         { success: false, message },
    standardHeaders: true,
    legacyHeaders:   false,
  });

exports.auth = make(
  15 * 60 * 1000,   // 15 minutes
  20,               // max 20 auth requests per window
  "Too many authentication attempts. Please try again in 15 minutes."
);

exports.chat = make(
  60 * 1000,        // 1 minute
  30,               // max 30 messages per minute
  "You are sending messages too quickly. Please slow down."
);

exports.general = make(
  10 * 60 * 1000,   // 10 minutes
  200,
  "Too many requests. Please try again later."
);
