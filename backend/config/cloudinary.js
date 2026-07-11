const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const env = require('./env');
const AppError = require('../utils/AppError');

const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

let roomImagesStorage;
let avatarStorage;

if (env.CLOUDINARY.CLOUD_NAME && env.CLOUDINARY.API_KEY && env.CLOUDINARY.API_SECRET) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY.CLOUD_NAME,
    api_key: env.CLOUDINARY.API_KEY,
    api_secret: env.CLOUDINARY.API_SECRET,
  });

  roomImagesStorage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'nestmate/rooms',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ width: 1200, height: 900, crop: 'limit', quality: 'auto' }],
    },
  });

  avatarStorage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'nestmate/avatars',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ width: 400, height: 400, crop: 'limit', quality: 'auto' }],
    },
  });
} else {
  const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      const subDir = file.fieldname === 'avatar' ? 'avatars' : 'rooms';
      const dir = path.join(uploadsDir, subDir);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${path.extname(file.originalname)}`);
    },
  });
  roomImagesStorage = diskStorage;
  avatarStorage = diskStorage;
}

exports.uploadRoomImages = multer({
  storage: roomImagesStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new AppError('Only image files are allowed', 400), false);
    }
  },
}).array('images', 10);

exports.uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new AppError('Only image files are allowed', 400), false);
    }
  },
}).single('avatar');

exports.deleteImage = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    // silently fail - image may not exist
  }
};

exports.extractPublicId = (url) => {
  if (!url) return null;
  const parts = url.split('/');
  const file = parts[parts.length - 1];
  const folder = parts[parts.length - 2];
  const publicId = `${folder}/${file.split('.')[0]}`;
  return publicId;
};
