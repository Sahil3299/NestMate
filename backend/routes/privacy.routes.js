const { Router } = require('express');
const privacyController = require('../controllers/privacy.controller');
const { authenticate } = require('../middleware/auth');

const router = Router();

router.post('/reveal/:userId', authenticate, privacyController.revealContact);
router.get('/history', authenticate, privacyController.getRevealHistory);

module.exports = router;
