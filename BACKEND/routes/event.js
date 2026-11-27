const express = require('express');
const { registerEventTeam, getPublicSettings } = require('../controllers/eventRegisterController');
const { createRateLimiter } = require('../middleware/rateLimit');

const router = express.Router();

// Campus-friendly burst limits: up to 180 registrations/min per shared IP
const registerLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 180,
  message: 'High registration traffic from your network. Please wait a few seconds and retry.'
});

router.get('/settings', getPublicSettings);
router.post('/event-register', registerLimiter, registerEventTeam);

module.exports = router;
