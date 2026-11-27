const express = require('express');
const path = require('path');
const router = express.Router();
const multer = require('multer');
const protect = require('../middleware/auth');
const { createRateLimiter } = require('../middleware/rateLimit');
const {
  login,
  getSmtpStatus,
  getAnalytics,
  getDashboardStats,
  getAdvancedInsights,
  getTeams,
  getAllRegistrations,
  getTeamById,
  updateTeam,
  updateRegistrationStatus,
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
  sendAuthorityReport,
  sendRegistrationReport,
  sendStakeholderReport,
  getEmailLogs,
  resendEmailLog,
  processEmailQueueNow,
  getFailedRegistrations,
  updateFailedRegistration,
  deleteFailedRegistration
} = require('../controllers/adminController');

const loginLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 8,
  message: 'Too many login attempts from this network. Please wait 15 minutes and try again.'
});

const ALLOWED_EXCEL_EXTS = new Set(['.xlsx', '.xls']);
const ALLOWED_EXCEL_MIMES = new Set([
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel'
]);

// Multer in-memory storage for Excel uploads with strict extension, MIME, and 5MB cap
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(String(file?.originalname || '')).toLowerCase();
    const mime = String(file?.mimetype || '').toLowerCase();
    if (!ALLOWED_EXCEL_EXTS.has(ext) || !ALLOWED_EXCEL_MIMES.has(mime)) {
      const err = new Error('Only valid Excel (.xlsx or .xls) files are permitted');
      err.status = 400;
      return cb(err);
    }
    return cb(null, true);
  }
});

const handleExcelUpload = (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      return res.status(err.status || 400).json({ msg: err.message || 'Invalid Excel file upload' });
    }
    return next();
  });
};

// Authentication (brute-force rate limited) & SMTP Pool Status
router.post('/login', loginLimiter, login);
router.get('/smtp-status', protect, getSmtpStatus);

// Analytics ($facet single-query pipeline), Advanced Insights & Registrations Management ($text full-text)
router.get('/analytics', protect, getAnalytics);
router.get('/stats', protect, getDashboardStats);
router.get('/insights', protect, getAdvancedInsights);
router.get('/teams', protect, getTeams);
router.get('/registrations', protect, getAllRegistrations);
router.get('/teams/:id', protect, getTeamById);
router.put('/teams/:id', protect, updateTeam);
router.patch('/teams/:id/status', protect, updateRegistrationStatus);
router.patch('/registrations/:id/status', protect, updateRegistrationStatus);
router.delete('/teams/:id', protect, deleteTeam);

// Candidate Registration Confirmation Emails (TO: Leader, CC: Members) via EmailLog + Round Robin
router.post('/teams/:id/resend-confirmation', protect, resendConfirmationEmail);
router.post('/teams/bulk-confirmations', protect, sendBulkConfirmations);

// Email Queue & Resilient Delivery Logs
router.get('/email-logs', protect, getEmailLogs);
router.post('/email-logs/process-queue', protect, processEmailQueueNow);
router.post('/email-logs/:id/resend', protect, resendEmailLog);

// Failed / Interrupted Registration Recovery Logs
router.get('/failed-registrations', protect, getFailedRegistrations);
router.patch('/failed-registrations/:id', protect, updateFailedRegistration);
router.delete('/failed-registrations/:id', protect, deleteFailedRegistration);

// Excel Operations (Filter-wise Upload & In-Memory Formatted RowSpan/ColSpan Export)
router.get('/export', protect, exportExcel);
router.post('/upload-excel', protect, handleExcelUpload, uploadExcel);

// Conditional Email & Broadcast Messaging (Queued + Round Robin Logged)
router.post('/send-conditional-email', protect, sendConditionalEmail);
router.post('/broadcast', protect, sendBroadcast);
router.post('/send-broadcast', protect, sendBroadcast);
router.get('/broadcasts', protect, getBroadcasts);
router.delete('/broadcasts/:id', protect, deleteBroadcast);

// Site Controls & Settings
router.get('/settings', protect, getSettings);
router.put('/settings', protect, updateSettings);

// Share Registration Reports & Official Stakeholder Dossiers (HOD / Director + any custom recipients)
router.post('/send-registration-report', protect, sendRegistrationReport);
router.post('/send-authority-report', protect, sendAuthorityReport);
router.post('/send-stakeholder-report', protect, sendStakeholderReport);

module.exports = router;
