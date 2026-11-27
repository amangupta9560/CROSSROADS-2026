const mongoose = require('mongoose');

const failedRegistrationSchema = new mongoose.Schema(
  {
    errorType: {
      type: String,
      enum: [
        'server_error',
        'validation_conflict',
        'closed_gate',
        'network_timeout',
        'client_submit_error'
      ],
      default: 'server_error',
      index: true
    },
    httpStatus: { type: Number, default: 500 },
    errorMessage: { type: String, required: true },
    errorField: { type: String, default: '' },
    errorStep: { type: Number, default: 0 },
    source: {
      type: String,
      enum: ['backend_register', 'backend_check', 'express_error_guard', 'frontend_fallback'],
      default: 'backend_register'
    },

    // Full filled registration credentials so admins can assist & contact the participant
    teamName: { type: String, default: '', trim: true },
    leader: {
      name: { type: String, default: '', trim: true },
      email: { type: String, default: '', trim: true },
      mobile: { type: String, default: '', trim: true },
      whatsapp: { type: String, default: '', trim: true }
    },
    college: { type: String, default: '' },
    customCollege: { type: String, default: '' },
    course: { type: String, default: '' },
    branch: { type: String, default: '' },
    year: { type: String, default: '' },
    event: { type: String, default: '' },
    teamSize: { type: Number, default: 1, min: 1, max: 8 },
    members: [
      {
        name: { type: String, default: '' },
        email: { type: String, default: '' },
        mobile: { type: String, default: '' }
      }
    ],

    rawPayload: { type: mongoose.Schema.Types.Mixed, default: null },
    userAgent: { type: String, default: '' },
    clientIp: { type: String, default: '' },

    followUpStatus: {
      type: String,
      enum: ['pending', 'contacted', 'resolved'],
      default: 'pending',
      index: true
    },
    adminNote: { type: String, default: '' },
    occurredAt: { type: Date, default: Date.now, index: true }
  },
  { timestamps: true }
);

failedRegistrationSchema.index({ occurredAt: -1 });
failedRegistrationSchema.index({ followUpStatus: 1, occurredAt: -1 });
failedRegistrationSchema.index({ 'leader.email': 1, occurredAt: -1 });

module.exports = mongoose.model('FailedRegistration', failedRegistrationSchema);
