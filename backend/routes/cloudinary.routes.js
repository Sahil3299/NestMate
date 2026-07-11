const { Router } = require('express');
const cloudinaryController = require('../controllers/cloudinary.controller');
const { authenticate } = require('../middleware/auth');

const router = Router();

router.post('/sign', authenticate, cloudinaryController.signUpload);

module.exports = router;
