const mongoose = require('mongoose');

const eventTeamSchema = new mongoose.Schema({
  teamId: {
    type: String,
    required: true,
    unique: true
  },
  teamName: {
    type: String,
    required: true,
    trim: true
  },
  leader: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    whatsapp: { type: String, required: true }
  },
  college: { type: String, required: true },
  branch: { type: String, required: true },
  year: { type: String, required: true },
  event: { type: String, required: true },
  teamSize: { type: Number, required: true, min: 1, max: 8 },
  members: [{
    name: { type: String, required: true },
    email: { type: String, required: true }
  }],
  appliedAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['pending', 'verified', 'checked-in', 'rejected'],
    default: 'pending'
  },
  adminNotes: {
    type: String,
    default: '',
    trim: true
  },
  statusUpdatedAt: {
    type: Date
  },
  exported: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Full-text search index for sub-millisecond queries across thousands of registrations
eventTeamSchema.index(
  {
    teamId: 'text',
    teamName: 'text',
    'leader.name': 'text',
    'leader.email': 'text',
    'leader.mobile': 'text',
    college: 'text',
    branch: 'text',
    event: 'text'
  },
  { name: 'event_team_fulltext_idx' }
);
eventTeamSchema.index({ appliedAt: -1 });
eventTeamSchema.index({ event: 1, appliedAt: -1 });
eventTeamSchema.index({ status: 1, appliedAt: -1 });

module.exports = mongoose.model('EventTeam', eventTeamSchema);