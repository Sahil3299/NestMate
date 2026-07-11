const { Router } = require('express');
const { body } = require('express-validator');
const teamController = require('../controllers/team.controller');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = Router();

router.post(
  '/',
  authenticate,
  validate([body('name').optional().trim().isLength({ max: 100 })]),
  teamController.createTeam
);
router.get('/:id', authenticate, teamController.getTeam);
router.post('/:id/join', authenticate, teamController.joinTeam);
router.post('/:id/leave', authenticate, teamController.leaveTeam);

module.exports = router;
