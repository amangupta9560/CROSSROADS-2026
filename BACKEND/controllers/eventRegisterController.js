const EventTeam = require('../models/EventTeam');
const Counter = require('../models/Counter');
const SiteSetting = require('../models/SiteSetting');
const { getEventDisplay, sendTeamConfirmationWithMembersCc } = require('../utils/mailer');

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

    // Basic leader details validation
    if (!teamName || !leaderName || !leaderEmail || !leaderMobile || !leaderWhatsapp) {
      return res.status(400).json({ message: 'Leader details are required' });
    }

    const teamSizeNum = parseInt(teamSize, 10);

    // Event-specific team size rules
    let minSize = 1;
    let maxSize = 4;
    const eventDisplay = getEventDisplay(event);

    if (event === 'code-puzzle') {
      minSize = 1;
      maxSize = 1;
    } else if (event === 'treasure-hunt') {
      minSize = 5;
      maxSize = 8;
    }

    if (teamSizeNum < minSize || teamSizeNum > maxSize) {
      return res.status(400).json({
        message: `For "${eventDisplay}", team size must be between ${minSize} and ${maxSize} (including leader)`
      });
    }

    // Check number of additional members matches team size
    if (teamSizeNum > 1 && (!members || members.length !== teamSizeNum - 1)) {
      return res.status(400).json({
        message: `Exactly ${teamSizeNum - 1} additional team member(s) required`
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
    const newTeam = await EventTeam.create({
      teamId,
      teamName,
      leader: {
        name: leaderName,
        email: leaderEmail,
        mobile: leaderMobile,
        whatsapp: leaderWhatsapp
      },
      college,
      branch,
      year,
      event,
      teamSize: teamSizeNum,
      members,
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