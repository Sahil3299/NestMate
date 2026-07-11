const { Router } = require('express');
const { body } = require('express-validator');
const reportController = require('../controllers/report.controller');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = Router();

router.post(
  '/',
  authenticate,
  validate([
    body('reason').trim().notEmpty().withMessage('Reason is required'),
    body('category').optional().isIn(['fake-profile', 'fake-listing', 'spam', 'inappropriate', 'other']),
  ]),
  reportController.createReport
);

router.get('/', authenticate, reportController.getReports);
router.patch('/:id/resolve', authenticate, reportController.resolveReport);

module.exports = router;
