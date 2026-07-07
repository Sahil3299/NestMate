const { body } = require('express-validator');

exports.createListingValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),
  body('rent')
    .notEmpty().withMessage('Rent is required')
    .isFloat({ min: 0 }).withMessage('Rent must be a positive number'),
  body('city')
    .trim()
    .notEmpty().withMessage('City is required'),
  body('roomType')
    .trim()
    .notEmpty().withMessage('Room type is required')
    .isIn(['1BHK', '2BHK', '3BHK', 'Studio', 'PG', 'Single Room']).withMessage('Invalid room type'),
  body('genderPreference')
    .optional()
    .isIn(['Male', 'Female', 'Any']).withMessage('Invalid gender preference'),
  body('furnished')
    .optional()
    .isIn(['Fully Furnished', 'Semi Furnished', 'Not Furnished']).withMessage('Invalid furnished option'),
  body('amenities')
    .optional()
    .isArray().withMessage('Amenities must be an array'),
  body('latitude')
    .optional()
    .isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
  body('longitude')
    .optional()
    .isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude'),
];

exports.updateListingValidator = [
  body('title')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),
  body('rent')
    .optional()
    .isFloat({ min: 0 }).withMessage('Rent must be a positive number'),
];
