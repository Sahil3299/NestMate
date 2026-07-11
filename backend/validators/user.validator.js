const { body } = require('express-validator');

exports.updateProfileValidator = [
  body('firstName')
    .trim()
    .notEmpty().withMessage('First name is required')
    .isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters')
    .matches(/^[A-Za-z\s]+$/).withMessage('First name must contain only letters'),
  
  body('lastName')
    .trim()
    .notEmpty().withMessage('Last name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[A-Za-z\s]+$/).withMessage('Last name must contain only letters'),
  
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .matches(/^[6-9]\d{9}$/).withMessage('Phone number must be a valid 10-digit Indian mobile number'),
  
  body('gender')
    .trim()
    .notEmpty().withMessage('Gender is required')
    .isIn(['Male', 'Female', 'Other']).withMessage('Gender must be Male, Female, or Other'),
];

exports.profileEditValidator = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('city')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('City must be at most 100 characters'),
  body('profileImage')
    .optional({ values: 'falsy' })
    .trim()
    .isURL().withMessage('Profile image must be a valid URL'),
  body('avatarPublicId')
    .optional()
    .trim(),
  body('avatarPreset')
    .optional({ values: 'falsy' })
    .trim()
    .isIn(['preset-1', 'preset-2', 'preset-3', 'preset-4', 'preset-5', 'preset-6', 'preset-7', 'preset-8'])
    .withMessage('Invalid avatar preset'),
  body('avatarMode')
    .optional()
    .trim()
    .isIn(['preset', 'upload']).withMessage('Avatar mode must be preset or upload'),
  body('preferences.budgetMin')
    .optional()
    .isFloat({ min: 0 }).withMessage('Budget min must be a positive number'),
  body('preferences.budgetMax')
    .optional()
    .isFloat({ min: 0 }).withMessage('Budget max must be a positive number'),
  body('lifestyle.food')
    .optional()
    .trim()
    .isIn(['veg', 'non-veg', 'vegan', 'eggetarian', '']).withMessage('Invalid food preference'),
  body('lifestyle.smoking')
    .optional()
    .trim()
    .isIn(['smoker', 'non-smoker', 'occasional', '']).withMessage('Invalid smoking preference'),
  body('lifestyle.drinking')
    .optional()
    .trim()
    .isIn(['drinker', 'non-drinker', 'occasional', '']).withMessage('Invalid drinking preference'),
  body('lifestyle.pets')
    .optional()
    .trim()
    .isIn(['has-pets', 'no-pets', 'pet-friendly', '']).withMessage('Invalid pet preference'),
  body('lifestyle.sleep')
    .optional()
    .trim()
    .isIn(['early-bird', 'night-owl', 'flexible', '']).withMessage('Invalid sleep preference'),
  body('lifestyle.cleanliness')
    .optional()
    .trim()
    .isIn(['very-tidy', 'moderate', 'messy', '']).withMessage('Invalid cleanliness preference'),
  body('lifestyle.workFromHome')
    .optional()
    .isBoolean().withMessage('Work from home must be a boolean'),
];
