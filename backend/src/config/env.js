const env = {
  PORT: process.env.PORT ? Number(process.env.PORT) : 5000,
  MONGODB_URI: process.env.MONGODB_URI,
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:5173",

  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
};

const missing = [];
if (!env.MONGODB_URI) missing.push("MONGODB_URI");
if (!env.JWT_SECRET) {
  missing.push("JWT_SECRET");
}

if (missing.length) {
  // Keep startup errors loud; failing auth verification without config is worse.
  throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
}

module.exports = env;

