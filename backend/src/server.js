// backend/src/server.js
"use strict";
require("dotenv").config();
const app        = require("./app");
const connectDB  = require("./config/db");
const logger     = require("./utils/logger");

const PORT = process.env.PORT || 5000;

// ── Unhandled promise rejections ───────────────────────────────────────────
process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection:", reason);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception:", err);
  process.exit(1);
});

(async () => {
  await connectDB();
  const server = app.listen(PORT, () => {
    logger.info(`🚀  Nestmate API running on port ${PORT} [${process.env.NODE_ENV}]`);
  });

  // Graceful shutdown
  const shutdown = () => {
    logger.info("Graceful shutdown initiated...");
    server.close(() => {
      logger.info("HTTP server closed.");
      process.exit(0);
    });
  };
  process.on("SIGTERM", shutdown);
  process.on("SIGINT",  shutdown);
})();
