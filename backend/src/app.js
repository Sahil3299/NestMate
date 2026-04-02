const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const env = require("./config/env");

const profileRoutes = require("./routes/profileRoutes");
const matchesRoutes = require("./routes/matchesRoutes");
const chatRoutes = require("./routes/chatRoutes");
const authRoutes = require("./routes/authRoutes");

function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
    })
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan("dev"));

  app.get("/health", (req, res) => res.status(200).json({ ok: true }));

  app.use("/api/auth", authRoutes);
  app.use("/api/profile", profileRoutes);
  app.use("/api/matches", matchesRoutes);
  app.use("/api", chatRoutes);

  app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  app.use((err, req, res, next) => {
    // eslint-disable-next-line no-unused-vars
    console.error(err);
    res.status(500).json({ error: "Server error" });
  });

  return app;
}

module.exports = createApp;

