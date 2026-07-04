// backend/src/routes/user.routes.js
const router   = require("express").Router();
const ctrl     = require("../controllers/user.controller");
const { authenticate, authorize } = require("../middleware/auth");
const { avatarUpload } = require("../config/multer");
const validate = require("../middleware/validate");
const { updateProfileSchema } = require("../validators/message.validator");

router.use(authenticate); // all user routes require auth

router.get( "/me",                      ctrl.getMe);
router.patch("/me",  avatarUpload,      ctrl.updateProfile);
router.get( "/me/saved",               ctrl.getSavedListings);
router.post("/me/saved/:listingId",    ctrl.toggleSaveListing);
router.delete("/me/saved/:listingId",  ctrl.toggleSaveListing);

// Roommate discovery (compatible users)
router.get( "/roommates",              ctrl.findRoommates);

router.get("/:id",                     ctrl.getUserProfile);

// Admin
router.get("/",    authorize("admin"), ctrl.getAllUsers);

module.exports = router;
