// backend/src/routes/listing.routes.js
const router   = require("express").Router();
const ctrl     = require("../controllers/listing.controller");
const { protect, optionalAuth } = require("../middleware/auth");
const { listingUpload }  = require("../config/multer");
const validate = require("../middleware/validate");
const { createListingSchema, updateListingSchema, listingQuerySchema } = require("../validators/listing.validator");

// Public (score added if authenticated)
router.get( "/",                optionalAuth, validate(listingQuerySchema), ctrl.getListings);
router.get( "/mine",            protect,                                    ctrl.getMyListings);
router.get( "/:id",             optionalAuth,                               ctrl.getListing);

// Protected
router.post(  "/",     protect, listingUpload, ctrl.createListing);
router.patch( "/:id",  protect, listingUpload, ctrl.updateListing);
router.delete("/:id",  protect,                ctrl.deleteListing);

module.exports = router;
