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
    default: 'Online registrations for CROSSROADS 2027 run from January 10, 2027 to January 31, 2027. The main fest takes place on February 5–6, 2027. Please contact the event helpdesk at techfusion@hietgroup.org for queries.'
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
    text: { type: String, default: 'Welcome to CROSSROADS 2027! Check out the schedule and register for events.' },
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

const SETTINGS_TTL_MS = 10000;
let cachedSettingsDoc = null;
let cachedSettingsExpiresAt = 0;
let pendingSettingsFetch = null;

siteSettingSchema.statics.invalidateCache = function() {
  cachedSettingsDoc = null;
  cachedSettingsExpiresAt = 0;
};

// Coalesced & TTL-cached singleton getter eliminates 50x redundant DB hits under bursts
siteSettingSchema.statics.getSettings = async function({ bypassCache = false } = {}) {
  const now = Date.now();
  if (!bypassCache && cachedSettingsDoc && now < cachedSettingsExpiresAt) {
    return cachedSettingsDoc;
  }

  if (!bypassCache && pendingSettingsFetch) {
    return pendingSettingsFetch;
  }

  const loadPromise = (async () => {
    let settings = await this.findOne({ key: 'global_settings' });
    if (!settings) {
      settings = await this.create({ key: 'global_settings' });
    } else {
      let dirty = false;
      if (!settings.authorityContacts?.directorEmail || settings.authorityContacts.directorEmail === 'director@hiet.org') {
        settings.authorityContacts.directorEmail = 'ag0567688@gmail.com';
        dirty = true;
      }
      if (!settings.authorityContacts?.hodCseEmail || settings.authorityContacts.hodCseEmail === 'hodcse@hiet.org') {
        settings.authorityContacts.hodCseEmail = 'ag902065@gmail.com';
        dirty = true;
      }
      if (!settings.authorityContacts?.hodMcaEmail || settings.authorityContacts.hodMcaEmail === 'hodmca@hiet.org') {
        settings.authorityContacts.hodMcaEmail = 'ag902065@gmail.com';
        dirty = true;
      }
      if (!settings.authorityContacts?.hodEeEmail || settings.authorityContacts.hodEeEmail === 'hodee@hiet.org') {
        settings.authorityContacts.hodEeEmail = 'ag902065@gmail.com';
        dirty = true;
      }
      if (!settings.authorityContacts?.culturalHeadEmail || settings.authorityContacts.culturalHeadEmail === 'cultural@hiet.org') {
        settings.authorityContacts.culturalHeadEmail = 'ag902065@gmail.com';
        dirty = true;
      }
      if (settings.closedMessage && (settings.closedMessage.includes('November 20, 2026') || settings.closedMessage.includes('CROSSROADS 2026'))) {
        settings.closedMessage = 'Online registrations for CROSSROADS 2027 run from January 10, 2027 to January 31, 2027. The main fest takes place on February 5–6, 2027. Please contact the event helpdesk at techfusion@hietgroup.org for queries.';
        dirty = true;
      }
      if (settings.broadcastBanner?.text === 'Welcome to CROSSROADS 2026! Check out the schedule and register for events.') {
        settings.broadcastBanner.text = 'Welcome to CROSSROADS 2027! Check out the schedule and register for events.';
        dirty = true;
      }
      if (dirty) {
        await settings.save();
      }
    }

    cachedSettingsDoc = settings;
    cachedSettingsExpiresAt = Date.now() + SETTINGS_TTL_MS;
    return settings;
  })().finally(() => {
    pendingSettingsFetch = null;
  });

  if (!bypassCache) {
    pendingSettingsFetch = loadPromise;
  }
  return loadPromise;
};

module.exports = mongoose.model('SiteSetting', siteSettingSchema);
