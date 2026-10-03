const mongoose = require('mongoose');

const siteSettingSchema = new mongoose.Schema({
  key: {
    type: String,
    default: 'global_settings',
    unique: true
  },
  registrationOpen: {
    type: Boolean,
    default: true
  },
  closedMessage: {
    type: String,
    default: 'Online registrations for CROSSROADS 2026 are currently closed. Please check back later or contact the event helpdesk.'
  },
  eventStatus: {
    type: Map,
    of: Boolean,
    default: {
      'code-puzzle': true,
      'project-exhibition': true,
      'robo-race': true,
      'technical-poster': true,
      'cultural-events': true,
      'rangoli-competition': true,
      'food-without-fire': true,
      'dance-competition': true,
      'rock-band': true,
      'short-film-maker': true,
      'treasure-hunt': true
    }
  },
  broadcastBanner: {
    enabled: { type: Boolean, default: false },
    text: { type: String, default: 'Welcome to CROSSROADS 2026! Check out the schedule and register for events.' },
    link: { type: String, default: '/events' },
    level: { type: String, enum: ['info', 'warning', 'urgent', 'success'], default: 'info' }
  },
  authorityContacts: {
    directorEmail: { type: String, default: 'ag0567688@gmail.com' },
    directorName: { type: String, default: 'Dr. Pankaj Kumar Mishra' },
    chairmanEmail: { type: String, default: 'chairman@hiet.org' },
    chairmanName: { type: String, default: 'Mr. Anand Prakash' },
    secretaryEmail: { type: String, default: 'secretary@hiet.org' },
    secretaryName: { type: String, default: 'Ms. Renu Goel' },
    hodCseEmail: { type: String, default: 'ag902065@gmail.com' },
    hodCseName: { type: String, default: 'Dr. Tripti Choudhary' },
    hodMcaEmail: { type: String, default: 'ag902065@gmail.com' },
    hodMcaName: { type: String, default: 'Mr. Bhaskar Sharma' },
    hodEeEmail: { type: String, default: 'ag902065@gmail.com' },
    hodEeName: { type: String, default: 'Mr. Aman Srivastava' },
    culturalHeadEmail: { type: String, default: 'ag902065@gmail.com' },
    culturalHeadName: { type: String, default: 'Cultural Committee Head' }
  }
}, { timestamps: true });

// Helper to get or create default singleton
siteSettingSchema.statics.getSettings = async function() {
  let settings = await this.findOne({ key: 'global_settings' });
  if (!settings) {
    settings = await this.create({ key: 'global_settings' });
  } else {
    // Ensure newly requested defaults are updated if still having placeholder
    if (!settings.authorityContacts?.directorEmail || settings.authorityContacts.directorEmail === 'director@hiet.org') {
      settings.authorityContacts.directorEmail = 'ag0567688@gmail.com';
    }
    if (!settings.authorityContacts?.hodCseEmail || settings.authorityContacts.hodCseEmail === 'hodcse@hiet.org') {
      settings.authorityContacts.hodCseEmail = 'ag902065@gmail.com';
    }
    if (!settings.authorityContacts?.hodMcaEmail || settings.authorityContacts.hodMcaEmail === 'hodmca@hiet.org') {
      settings.authorityContacts.hodMcaEmail = 'ag902065@gmail.com';
    }
    if (!settings.authorityContacts?.hodEeEmail || settings.authorityContacts.hodEeEmail === 'hodee@hiet.org') {
      settings.authorityContacts.hodEeEmail = 'ag902065@gmail.com';
    }
    if (!settings.authorityContacts?.culturalHeadEmail || settings.authorityContacts.culturalHeadEmail === 'cultural@hiet.org') {
      settings.authorityContacts.culturalHeadEmail = 'ag902065@gmail.com';
    }
    await settings.save();
  }
  return settings;
};

module.exports = mongoose.model('SiteSetting', siteSettingSchema);
