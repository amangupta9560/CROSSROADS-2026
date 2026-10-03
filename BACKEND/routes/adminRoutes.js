const express = require('express');
const router = express.Router();
const multer = require('multer');
const protect = require('../middleware/auth');
const {
  login,
  getSmtpStatus,
  getAnalytics,
  getTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
  resendConfirmationEmail,
  sendBulkConfirmations,
  exportExcel,
  uploadExcel,
  sendConditionalEmail,
  sendBroadcast,
  getBroadcasts,
  deleteBroadcast,
  getSettings,
  updateSettings,
  sendAuthorityReport
} = require('../controllers/adminController');

// Multer in-memory storage for Excel uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB limit
});

// Authentication & SMTP Status
router.post('/login', login);
router.get('/smtp-status', protect, getSmtpStatus);

// Analytics & Team Management
router.get('/analytics', protect, getAnalytics);
router.get('/teams', protect, getTeams);
router.get('/teams/:id', protect, getTeamById);
router.put('/teams/:id', protect, updateTeam);
router.delete('/teams/:id', protect, deleteTeam);

// Candidate Registration Confirmation Emails (TO: Leader, CC: Members) via Round Robin
router.post('/teams/:id/resend-confirmation', protect, resendConfirmationEmail);
router.post('/teams/bulk-confirmations', protect, sendBulkConfirmations);

// Excel Operations (Filter-wise Upload & Export)
router.get('/export', protect, exportExcel);
router.post('/upload-excel', protect, upload.single('file'), uploadExcel);

// Conditional Email Sending
router.post('/send-conditional-email', protect, sendConditionalEmail);

// Centralized Broadcast System
router.post('/broadcast', protect, sendBroadcast);
router.get('/broadcasts', protect, getBroadcasts);
router.delete('/broadcasts/:id', protect, deleteBroadcast);

// Site Controls & Settings (Registration ON/OFF, event toggles, banner, authority contacts)
router.get('/settings', protect, getSettings);
router.put('/settings', protect, updateSettings);

// Send Authority Report (Director + HODs in CC)
router.post('/send-authority-report', protect, sendAuthorityReport);

module.exports = router;