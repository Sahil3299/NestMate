// backend/src/config/multer.js
const multer = require("multer");
const path   = require("path");
const AppError = require("../utils/AppError");

const MAX_MB = parseInt(process.env.MAX_FILE_SIZE_MB || "5");

const storage = (subfolder) =>
  multer.diskStorage({
    destination: (_req, _file, cb) =>
      cb(null, path.join(__dirname, "../../uploads", subfolder)),
    filename: (_req, file, cb) => {
      const ext  = path.extname(file.originalname).toLowerCase();
      const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      cb(null, name);
    },
  });

const imageFilter = (_req, file, cb) => {
  const allowed = [".jpg", ".jpeg", ".png", ".webp"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowed.includes(ext)) {
    return cb(new AppError("Only JPEG, PNG, and WebP images are allowed.", 400), false);
  }
  cb(null, true);
};

exports.avatarUpload = multer({
  storage:  storage("avatars"),
  fileFilter: imageFilter,
  limits:   { fileSize: MAX_MB * 1024 * 1024 },
}).single("avatar");

exports.listingUpload = multer({
  storage:  storage("listings"),
  fileFilter: imageFilter,
  limits:   { fileSize: MAX_MB * 1024 * 1024 },
}).array("images", 8);
