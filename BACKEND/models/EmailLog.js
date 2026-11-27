const mongoose = require('mongoose');

const emailLogSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: [
      'registration_confirmation',
      'broadcast',
      'conditional_email',
      'stakeholder_report',
      'registration_report',
      'manual_resend'
    ],
    default: 'registration_confirmation',
    index: true
  },
  status: {
    type: String,
    enum: ['queued', 'sending', 'sent', 'failed'],
    default: 'queued',
    index: true
  },
  to: [{ type: String, trim: true }],
  cc: [{ type: String, trim: true }],
  bcc: [{ type: String, trim: true }],
  replyTo: { type: String, trim: true },
  subject: { type: String, required: true },
  html: { type: String, required: true },
  preferredSmtpUser: { type: String, default: '' },
  sentVia: { type: String, default: '' },
  messageId: { type: String, default: '' },
  teamId: { type: String, default: '' },
  teamRef: { type: mongoose.Schema.Types.ObjectId, ref: 'EventTeam' },
  event: { type: String, default: '' },
  hasAttachment: { type: Boolean, default: false },
  attachmentFilename: { type: String, default: '' },
  // Stores filter parameters so report emails with live Excel workbooks can be resent on demand
  reportParams: { type: mongoose.Schema.Types.Mixed, default: null },
  attempts: { type: Number, default: 0 },
  maxAttempts: { type: Number, default: 4 },
  nextRetryAt: { type: Date, default: null },
  lastError: { type: String, default: '' },
  queuedAt: { type: Date, default: Date.now },
  sentAt: { type: Date }
}, { timestamps: true });

emailLogSchema.index({ status: 1, nextRetryAt: 1, queuedAt: 1 });
emailLogSchema.index({ status: 1, queuedAt: 1 });
emailLogSchema.index({ createdAt: -1 });
emailLogSchema.index({ to: 1 });

module.exports = mongoose.model('EmailLog', emailLogSchema);
