const mongoose = require('mongoose');

const broadcastSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  target: {
    type: String,
    default: 'all' // 'all', or specific event value like 'code-puzzle', or track
  },
  channel: {
    type: String,
    enum: ['email', 'website_banner', 'both'],
    default: 'email'
  },
  urgency: {
    type: String,
    enum: ['normal', 'important', 'urgent'],
    default: 'normal'
  },
  showOnWebsite: {
    type: Boolean,
    default: false
  },
  recipientsCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: String,
    default: 'Admin'
  }
}, { timestamps: true });

module.exports = mongoose.model('Broadcast', broadcastSchema);
