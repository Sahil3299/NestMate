const { Router } = require('express');
const listingController = require('../controllers/listing.controller');
const { authenticate, optionalAuth } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createListingValidator, updateListingValidator } = require('../validators/listing.validator');
const { uploadRoomImages } = require('../config/cloudinary');

const router = Router();

router.get('/', optionalAuth, listingController.getListings);
router.get('/mine', authenticate, listingController.getMyListings);
router.get('/my-listings', authenticate, listingController.getMyListings);
router.get('/search', optionalAuth, listingController.getListings);
router.get('/:id', optionalAuth, listingController.getListingById);
router.post('/', authenticate, uploadRoomImages, validate(createListingValidator), listingController.createListing);
router.patch('/:id', authenticate, uploadRoomImages, listingController.updateListing);
router.put('/:id', authenticate, uploadRoomImages, listingController.updateListing);
router.delete('/:id', authenticate, listingController.deleteListing);

module.exports = router;
