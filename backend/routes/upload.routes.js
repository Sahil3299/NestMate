const { Router } = require('express');
const uploadController = require('../controllers/upload.controller');
const { authenticate } = require('../middleware/auth');
const { uploadRoomImages } = require('../config/cloudinary');

const router = Router();

router.post('/image', authenticate, uploadRoomImages, uploadController.uploadImage);

module.exports = router;
