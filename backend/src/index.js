const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");

const env = require("./config/env");
const createApp = require("./app");

async function start() {
  await mongoose.connect(env.MONGODB_URI);
  console.log("MongoDB connected");

  const app = createApp();
  app.listen(env.PORT, () => {
    console.log(`API listening on http://localhost:${env.PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

