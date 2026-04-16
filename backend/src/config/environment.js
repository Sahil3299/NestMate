const dotenv = require("dotenv");
dotenv.config();

/**
 * Validates and exports all environment variables
 * Failing early and fast is better than silent errors in production
 */
const env = {
  // Server
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT) || 5000,

  // Database
  MONGODB_URI: process.env.MONGODB_URI,

  // JWT
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",

  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:5173",

  // Email
  EMAIL_PROVIDER: process.env.EMAIL_PROVIDER || "gmail",
  EMAIL_FROM: process.env.EMAIL_FROM,
  GMAIL_SMTP_HOST: process.env.GMAIL_SMTP_HOST || "smtp.gmail.com",
  GMAIL_SMTP_PORT: Number(process.env.GMAIL_SMTP_PORT) || 587,
  GMAIL_SMTP_USER: process.env.GMAIL_SMTP_USER,
  GMAIL_SMTP_PASSWORD: process.env.GMAIL_SMTP_PASSWORD,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: Number(process.env.SMTP_PORT) || 2525,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,

  // Security
  BCRYPT_ROUNDS: Number(process.env.BCRYPT_ROUNDS) || 10,
  RATE_LIMIT_WINDOW_MS: Number(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
  RATE_LIMIT_MAX_REQUESTS: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  RATE_LIMIT_AUTH_MAX_REQUESTS: Number(process.env.RATE_LIMIT_AUTH_MAX_REQUESTS) || 5,
  PASSWORD_RESET_EXPIRY: process.env.PASSWORD_RESET_EXPIRY || "1h",
  EMAIL_VERIFICATION_EXPIRY: process.env.EMAIL_VERIFICATION_EXPIRY || "24h",

  // File uploads
  MAX_UPLOAD_SIZE: Number(process.env.MAX_UPLOAD_SIZE) || 5242880, // 5MB
  MAX_IMAGES_PER_LISTING: Number(process.env.MAX_IMAGES_PER_LISTING) || 10,
  UPLOAD_DIR: process.env.UPLOAD_DIR || "./src/uploads",

  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || "debug",
  LOG_DIR: process.env.LOG_DIR || "./logs",

  // Pagination
  DEFAULT_PAGE: Number(process.env.DEFAULT_PAGE) || 1,
  DEFAULT_LIMIT: Number(process.env.DEFAULT_LIMIT) || 20,
  MAX_LIMIT: Number(process.env.MAX_LIMIT) || 100,

  // API
  API_VERSION: process.env.API_VERSION || "v1",
  API_PREFIX: process.env.API_PREFIX || "/api/v1",

  // Helpers
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
};

// Validate required environment variables
const requiredVars = [
  "MONGODB_URI",
  "JWT_SECRET",
];

const missing = requiredVars.filter(key => !env[key]);
if (missing.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missing.join(", ")}\n` +
    `See .env.example for configuration template.`
  );
}

module.exports = env;
