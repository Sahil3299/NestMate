const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");

const env = require("./config/environment");
const { AppError } = require("./utils/errors");

// Routes
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const listingRoutes = require("./routes/listing.routes");
const messageRoutes = require("./routes/message.routes");
const reviewRoutes = require("./routes/review.routes");
const matchRoutes = require("./routes/match.routes");
const notificationRoutes = require("./routes/notification.routes");
const visitRoutes = require("./routes/visit.routes");
const adminRoutes = require("./routes/admin.routes");

function createApp() {
  const app = express();

  // ═════════════════════════════════════════════════════════════════════════
  // MIDDLEWARE - Security & Logging
  // ═════════════════════════════════════════════════════════════════════════
  app.use(helmet()); // Security headers
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
    })
  );
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ limit: "10mb", extended: true }));
  app.use(morgan("dev")); // HTTP request logging

  // ═════════════════════════════════════════════════════════════════════════
  // ROUTES - Health & Static
  // ═════════════════════════════════════════════════════════════════════════
  app.get("/health", (req, res) => {
    res.status(200).json({ success: true, message: "Server is running" });
  });

  // Serve uploaded files
  const uploadDir = path.join(__dirname, "uploads");
  try {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
  } catch (e) {
    console.warn("Could not create uploads directory:", e.message);
  }
  app.use("/uploads", express.static(uploadDir));

  // ═════════════════════════════════════════════════════════════════════════
  // API ROUTES
  // ═════════════════════════════════════════════════════════════════════════
  app.use(`${env.API_PREFIX}/auth`, authRoutes);
  app.use(`${env.API_PREFIX}/users`, userRoutes);
  app.use(`${env.API_PREFIX}/listings`, listingRoutes);
  app.use(`${env.API_PREFIX}/messages`, messageRoutes);
  app.use(`${env.API_PREFIX}/reviews`, reviewRoutes);
  app.use(`${env.API_PREFIX}/matches`, matchRoutes);
  app.use(`${env.API_PREFIX}/notifications`, notificationRoutes);
  app.use(`${env.API_PREFIX}/visit-requests`, visitRoutes);
  app.use(`${env.API_PREFIX}/admin`, adminRoutes);

  // ═════════════════════════════════════════════════════════════════════════
  // ERROR HANDLING
  // ═════════════════════════════════════════════════════════════════════════

  // 404 handler - Route not found
  app.use((req, res, next) => {
    next(new AppError(`Route not found: ${req.method} ${req.path}`, 404, "NOT_FOUND"));
  });

  // Global error handler - Must be last
  app.use((err, req, res, next) => {
    // Set default values
    let error = err instanceof AppError ? err : new AppError(err.message || "Internal Server Error", 500, "INTERNAL_ERROR");

    // Handle specific Mongoose errors
    if (err.name === "MongooseValidationError") {
      const messages = Object.values(err.errors).map(e => e.message);
      error = new AppError(messages.join(", "), 422, "VALIDATION_ERROR");
    }

    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      error = new AppError(`${field} already exists`, 409, "DUPLICATE_ENTRY");
    }

    if (err.name === "CastError") {
      error = new AppError(`Invalid ${err.path}: ${err.value}`, 400, "INVALID_INPUT");
    }

    // Log errors
    if (error.statusCode >= 500) {
      console.error(`[ERROR] ${error.statusCode} - ${error.message} - ${req.method} ${req.path}`);
    }

    // Send response
    res.status(error.statusCode || 500).json(error.toJSON());
  });

  return app;
}

module.exports = createApp;

