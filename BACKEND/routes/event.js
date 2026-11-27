const express = require('express');
const {
  registerEventTeam,
  checkRegistrationAvailability,
  reportClientRegistrationIssue,
  getPublicSettings
} = require('../controllers/eventRegisterController');
const { createRateLimiter } = require('../middleware/rateLimit');

const router = express.Router();

const registerLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 180,
  message: 'High registration traffic from your network. Please wait a few seconds and retry.'
});

router.get('/settings', getPublicSettings);
router.post('/check-availability', registerLimiter, checkRegistrationAvailability);
router.post('/event-register', registerLimiter, registerEventTeam);
router.post('/log-registration-issue', registerLimiter, reportClientRegistrationIssue);

module.exports = router;
