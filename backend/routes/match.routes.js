const { Router } = require('express');
const matchController = require('../controllers/match.controller');
const { authenticate } = require('../middleware/auth');

const router = Router();

router.get('/suggestions', authenticate, matchController.getSuggestions);
router.get('/:userId', authenticate, matchController.getMatchWithUser);

module.exports = router;
