// backend/src/routes/auth.routes.js
const router   = require("express").Router();
const ctrl     = require("../controllers/auth.controller");
const validate = require("../middleware/validate");
const { authenticate } = require("../middleware/auth");
const {
  registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema,
} = require("../validators/auth.validator");

router.post("/register",              validate(registerSchema),        ctrl.register);
router.post("/login",                 validate(loginSchema),           ctrl.login);
router.post("/refresh-token",                                          ctrl.refreshToken);
router.post("/logout",                authenticate,                    ctrl.logout);
router.get( "/verify-email/:token",                                    ctrl.verifyEmail);
router.post("/forgot-password",       validate(forgotPasswordSchema),  ctrl.forgotPassword);
router.patch("/reset-password/:token",validate(resetPasswordSchema),   ctrl.resetPassword);

module.exports = router;
