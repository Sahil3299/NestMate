const { Router } = require('express');
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middleware/auth');
const { uploadAvatar } = require('../config/cloudinary');

const router = Router();

router.get('/profile', authenticate, userController.getProfile);
router.patch('/profile', authenticate, uploadAvatar, userController.updateProfile);
router.get('/me', authenticate, userController.getProfile);
router.patch('/me', authenticate, uploadAvatar, userController.updateProfile);
router.delete('/me', authenticate, userController.deleteAccount);
router.get('/saved', authenticate, userController.getSavedListings);
router.post('/saved/:listingId', authenticate, userController.toggleSave);
router.get('/:id', userController.getUserById);

module.exports = router;
