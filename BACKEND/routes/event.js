const express = require('express');
const { registerEventTeam, getPublicSettings } = require('../controllers/eventRegisterController');

const router = express.Router();

router.get('/settings', getPublicSettings);
router.post('/event-register', registerEventTeam);

module.exports = router;