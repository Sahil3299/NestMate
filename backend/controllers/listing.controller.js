const catchAsync = require('../utils/catchAsync');
const sendResponse = require('../utils/sendResponse');
const listingService = require('../services/listing.service');

exports.createListing = catchAsync(async (req, res, next) => {
  const listing = await listingService.createListing(req.user._id, req.body, req.files);
  sendResponse(res, 201, listing, 'Listing created successfully');
});

exports.getListings = catchAsync(async (req, res, next) => {
  const result = await listingService.getListings(req.query, req.user);
  sendResponse(res, 200, result.listings, undefined, { pagination: result.pagination });
});

exports.getListingById = catchAsync(async (req, res, next) => {
  const listing = await listingService.getListingById(req.params.id, req.user);
  sendResponse(res, 200, listing);
});

exports.getMyListings = catchAsync(async (req, res, next) => {
  const listings = await listingService.getMyListings(req.user._id);
  sendResponse(res, 200, listings);
});

exports.updateListing = catchAsync(async (req, res, next) => {
  const listing = await listingService.updateListing(req.params.id, req.user._id, req.body, req.files);
  sendResponse(res, 200, listing, 'Listing updated successfully');
});

exports.deleteListing = catchAsync(async (req, res, next) => {
  await listingService.deleteListing(req.params.id, req.user._id);
  sendResponse(res, 200, null, 'Listing deleted successfully');
});
