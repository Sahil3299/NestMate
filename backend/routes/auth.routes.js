const { Router } = require('express');
const authController = require('../controllers/auth.controller');
const validate = require('../middleware/validate');
const { registerValidator, loginValidator, forgotPasswordValidator, resetPasswordValidator } = require('../validators/auth.validator');

const router = Router();

router.post('/register', validate(registerValidator), authController.register);
router.post('/login', validate(loginValidator), authController.login);
router.post('/logout', authController.logout);
router.post('/refresh-token', authController.refreshToken);
router.post('/forgot-password', validate(forgotPasswordValidator), authController.forgotPassword);
router.patch('/reset-password/:token', validate(resetPasswordValidator), authController.resetPassword);

module.exports = router;
