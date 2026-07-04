// backend/src/routes/listing.routes.js
const router   = require("express").Router();
const ctrl     = require("../controllers/listing.controller");
const { authenticate, optionalAuth } = require("../middleware/auth");
const { listingUpload }  = require("../config/multer");
const validate = require("../middleware/validate");
const { createListingSchema, updateListingSchema, listingQuerySchema } = require("../validators/listing.validator");

// Public (score added if authenticated)
router.get( "/",                optionalAuth, validate(listingQuerySchema), ctrl.getListings);
router.get( "/mine",            authenticate,                               ctrl.getMyListings);
router.get( "/:id/analytics",   authenticate,                               ctrl.getListingAnalytics);
router.post("/:id/view",        optionalAuth,                               ctrl.incrementViews);
router.get( "/:id",             optionalAuth,                               ctrl.getListing);

// Protected
router.post(  "/",     authenticate, listingUpload, ctrl.createListing);
router.patch( "/:id",  authenticate, listingUpload, ctrl.updateListing);
router.delete("/:id",  authenticate,                ctrl.deleteListing);

module.exports = router;
