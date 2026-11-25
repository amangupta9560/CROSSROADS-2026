const EventTeam = require('../models/EventTeam');
const Counter = require('../models/Counter');
const SiteSetting = require('../models/SiteSetting');
const { EVENT_DISPLAY_NAMES, getEventDisplay, sendTeamConfirmationWithMembersCc } = require('../utils/mailer');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[6-9]\d{9}$/;

const EVENT_SIZE_LIMITS = {
  'code-puzzle': [1, 1],
  'dance-competition': [1, 1],
  'short-film-maker': [1, 2],
  'rangoli-competition': [1, 3],
  'treasure-hunt': [5, 8],
};

const getPublicSettings = async (req, res) => {
  try {
    const settings = await SiteSetting.getSettings();
    res.json({
      registrationOpen: settings.registrationOpen,
      closedMessage: settings.closedMessage,
      eventStatus: settings.eventStatus,
      broadcastBanner: settings.broadcastBanner
    });
  } catch (err) {
    console.error('Error fetching public settings:', err);
    res.status(500).json({ message: 'Error retrieving site settings' });
  }
};

const registerEventTeam = async (req, res) => {
  try {
    // Check if registrations are open globally
    const settings = await SiteSetting.getSettings();
    if (!settings.registrationOpen) {
      return res.status(403).json({
        message: settings.closedMessage || 'Online registrations for CROSSROADS 2026 are currently closed.'
      });
    }

    const {
      teamName,
      leaderName,
      leaderEmail,
      leaderMobile,
      leaderWhatsapp,
      college,
      branch,
      year,
      event,
      teamSize,
      members = []
    } = req.body;

    // Check if registration is open for this specific event
    if (settings.eventStatus) {
      const isEventOpen = typeof settings.eventStatus.get === 'function'
        ? settings.eventStatus.get(event)
        : settings.eventStatus[event];
        
      if (isEventOpen === false) {
        return res.status(403).json({
          message: `Registrations for "${getEventDisplay(event)}" are currently closed.`
        });
      }
    }

    // Basic leader & institution details validation
    if (!teamName || !teamName.trim() || !leaderName || !leaderName.trim() || !leaderEmail || !leaderMobile || !leaderWhatsapp) {
      return res.status(400).json({ message: 'Leader details are required' });
    }

    if (!college || !college.trim() || !branch || !branch.trim() || !year || !year.trim()) {
      return res.status(400).json({ message: 'College, branch, and academic year are required' });
    }

    const normalizedLeaderEmail = leaderEmail.trim().toLowerCase();
    if (!EMAIL_REGEX.test(normalizedLeaderEmail)) {
      return res.status(400).json({ message: 'Valid leader email address is required' });
    }

    if (!PHONE_REGEX.test(String(leaderMobile).trim()) || !PHONE_REGEX.test(String(leaderWhatsapp).trim())) {
      return res.status(400).json({ message: 'Valid 10-digit Indian mobile and WhatsApp numbers are required' });
    }

    if (!event || !Object.prototype.hasOwnProperty.call(EVENT_DISPLAY_NAMES, event)) {
      return res.status(400).json({ message: 'Invalid or unknown event selected' });
    }

    const teamSizeNum = parseInt(teamSize, 10);

    // Event-specific team size rules aligned with frontend arenas
    const [minSize, maxSize] = EVENT_SIZE_LIMITS[event] || [1, 4];
    const eventDisplay = getEventDisplay(event);

    if (Number.isNaN(teamSizeNum) || teamSizeNum < minSize || teamSizeNum > maxSize) {
      return res.status(400).json({
        message: `For "${eventDisplay}", team size must be between ${minSize} and ${maxSize} (including leader)`
      });
    }

    // Check number of additional members matches team size and validate each member
    if (teamSizeNum > 1) {
      if (!Array.isArray(members) || members.length !== teamSizeNum - 1) {
        return res.status(400).json({
          message: `Exactly ${teamSizeNum - 1} additional team member(s) required`
        });
      }
      for (let i = 0; i < members.length; i++) {
        const m = members[i];
        if (!m?.name?.trim() || !m?.email?.trim() || !EMAIL_REGEX.test(m.email.trim())) {
          return res.status(400).json({
            message: `Valid name and email are required for team member ${i + 2}`
          });
        }
      }
    }

    // Prevent duplicate registrations for the same leader email & event
    const duplicate = await EventTeam.findOne({
      'leader.email': normalizedLeaderEmail,
      event
    });
    if (duplicate) {
      return res.status(409).json({
        message: `You have already registered team "${duplicate.teamName}" (${duplicate.teamId}) for ${eventDisplay}.`
      });
    }

    // Generate unique team ID
    const currentYear = new Date().getFullYear();
    const counterId = `event_${currentYear}`;

    const counter = await Counter.findByIdAndUpdate(
      counterId,
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const serial = String(counter.seq).padStart(3, '0');
    const teamId = `HIET/CR/${currentYear}/${serial}`;

    // Save the team
    const sanitizedMembers = teamSizeNum > 1
      ? members.map(m => ({ name: m.name.trim(), email: m.email.trim().toLowerCase() }))
      : [];

    const newTeam = await EventTeam.create({
      teamId,
      teamName: teamName.trim(),
      leader: {
        name: leaderName.trim(),
        email: normalizedLeaderEmail,
        mobile: String(leaderMobile).trim(),
        whatsapp: String(leaderWhatsapp).trim()
      },
      college: college.trim(),
      branch: branch.trim(),
      year: year.trim(),
      event,
      teamSize: teamSizeNum,
      members: sanitizedMembers,
      appliedAt: new Date()
    });

    // Send confirmation email via Round Robin (TO: leader, CC: members)
    try {
      await sendTeamConfirmationWithMembersCc(newTeam);
    } catch (mailErr) {
      console.warn('Confirmation email sending failed (team registered):', mailErr.message);
    }

    res.status(201).json({
      message: 'Team registered successfully',
      teamId
    });

  } catch (err) {
    console.error('[Event Registration Error]', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

module.exports = { registerEventTeam, getPublicSettings };