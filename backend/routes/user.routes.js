const { Router } = require('express');
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middleware/auth');
const { uploadAvatar } = require('../config/cloudinary');
const validate = require('../middleware/validate');
const { updateProfileValidator, profileEditValidator } = require('../validators/user.validator');

const router = Router();

router.get('/profile', authenticate, userController.getProfile);
router.patch('/profile', authenticate, uploadAvatar, validate(updateProfileValidator), userController.updateProfile);
router.get('/me', authenticate, userController.getProfile);
router.patch('/me', authenticate, uploadAvatar, validate(updateProfileValidator), userController.updateProfile);
router.patch('/edit', authenticate, validate(profileEditValidator), userController.updateProfile);
router.delete('/me', authenticate, userController.deleteAccount);
router.get('/saved', authenticate, userController.getSavedListings);
router.post('/saved/:listingId', authenticate, userController.toggleSave);
router.get('/:id', userController.getUserById);

module.exports = router;
