// backend/src/utils/logger.js
const { createLogger, format, transports } = require("winston");
const path = require("path");

const { combine, timestamp, colorize, printf, errors } = format;

const fmt = printf(({ timestamp: ts, level, message, stack }) =>
  stack ? `${ts} [${level}]: ${message}\n${stack}` : `${ts} [${level}]: ${message}`
);

const logger = createLogger({
  level: process.env.NODE_ENV === "production" ? "warn" : "debug",
  format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), errors({ stack: true }), colorize(), fmt),
  transports: [
    new transports.Console(),
    new transports.File({ filename: path.join(__dirname, "../../logs/error.log"),    level: "error" }),
    new transports.File({ filename: path.join(__dirname, "../../logs/combined.log") }),
  ],
  silent: process.env.NODE_ENV === "test",
});

// add http level alias
logger.http = (msg) => logger.debug(msg);

module.exports = logger;
