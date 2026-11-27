const EventTeam = require('../models/EventTeam');
const Counter = require('../models/Counter');
const SiteSetting = require('../models/SiteSetting');
const {
  EVENT_DISPLAY_NAMES,
  getEventDisplay,
  buildTeamConfirmationEmailPayload
} = require('../utils/mailer');
const {
  enqueueEmail,
  processSingleEmailLog,
  triggerBackgroundQueueDrain
} = require('../utils/emailWorker');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[6-9]\d{9}$/;

const EVENT_SIZE_LIMITS = {
  'code-puzzle': [1, 1],
  'dance-competition': [1, 1],
  'short-film-maker': [1, 2],
  'rangoli-competition': [1, 3],
  'treasure-hunt': [5, 8],
};

// Prevents double-click / simultaneous identical submission race conditions
const inFlightRegistrations = new Set();

const getPublicSettings = async (req, res) => {
  try {
    const settings = await SiteSetting.getSettings();
    res.setHeader('Cache-Control', 'public, max-age=10');
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

/**
 * High-concurrency MERN registration handler engineered to handle 50+ simultaneous
 * submissions cleanly without SMTP blocking, race collisions, or server stalls.
 */
const registerEventTeam = async (req, res) => {
  let lockKey = null;

  try {
    const settings = await SiteSetting.getSettings();
    if (!settings.registrationOpen) {
      return res.status(403).json({
        message:
          settings.closedMessage ||
          'Online registrations for CROSSROADS 2027 are currently closed.'
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
    } = req.body || {};

    if (settings.eventStatus) {
      const isEventOpen =
        typeof settings.eventStatus.get === 'function'
          ? settings.eventStatus.get(event)
          : settings.eventStatus[event];

      if (isEventOpen === false) {
        return res.status(403).json({
          message: `Registrations for "${getEventDisplay(event)}" are currently closed.`
        });
      }
    }

    if (
      !teamName?.trim() ||
      !leaderName?.trim() ||
      !leaderEmail ||
      !leaderMobile ||
      !leaderWhatsapp
    ) {
      return res.status(400).json({ message: 'Leader details are required' });
    }

    if (!college?.trim() || !branch?.trim() || !year?.trim()) {
      return res
        .status(400)
        .json({ message: 'College, branch, and academic year are required' });
    }

    const normalizedLeaderEmail = leaderEmail.trim().toLowerCase();
    if (!EMAIL_REGEX.test(normalizedLeaderEmail)) {
      return res
        .status(400)
        .json({ message: 'Valid leader email address is required' });
    }

    if (
      !PHONE_REGEX.test(String(leaderMobile).trim()) ||
      !PHONE_REGEX.test(String(leaderWhatsapp).trim())
    ) {
      return res.status(400).json({
        message: 'Valid 10-digit Indian mobile and WhatsApp numbers are required'
      });
    }

    if (!event || !Object.prototype.hasOwnProperty.call(EVENT_DISPLAY_NAMES, event)) {
      return res.status(400).json({ message: 'Invalid or unknown event selected' });
    }

    const teamSizeNum = parseInt(teamSize, 10);
    const [minSize, maxSize] = EVENT_SIZE_LIMITS[event] || [1, 4];
    const eventDisplay = getEventDisplay(event);

    if (Number.isNaN(teamSizeNum) || teamSizeNum < minSize || teamSizeNum > maxSize) {
      return res.status(400).json({
        message: `For "${eventDisplay}", team size must be between ${minSize} and ${maxSize} (including leader)`
      });
    }

    const sanitizedMembers = [];
    if (teamSizeNum > 1) {
      if (!Array.isArray(members) || members.length !== teamSizeNum - 1) {
        return res.status(400).json({
          message: `Exactly ${teamSizeNum - 1} additional team member(s) required`
        });
      }
      const teamEmailSet = new Set([normalizedLeaderEmail]);
      for (let i = 0; i < members.length; i += 1) {
        const m = members[i];
        const mName = m?.name?.trim();
        const mEmail = m?.email?.trim().toLowerCase();
        if (!mName || !mEmail || !EMAIL_REGEX.test(mEmail)) {
          return res.status(400).json({
            message: `Valid name and email are required for team member ${i + 2}`
          });
        }
        if (teamEmailSet.has(mEmail)) {
          return res.status(400).json({
            message: 'All team emails must be unique within the same squad.'
          });
        }
        teamEmailSet.add(mEmail);
        sanitizedMembers.push({ name: mName, email: mEmail });
      }
    }

    // Acquire atomic in-process duplicate guard before DB check & write
    lockKey = `${normalizedLeaderEmail}::${event}`;
    if (inFlightRegistrations.has(lockKey)) {
      return res.status(409).json({
        message: 'Your registration request is already being processed. Please wait a moment.'
      });
    }
    inFlightRegistrations.add(lockKey);

    const duplicate = await EventTeam.findOne({
      'leader.email': normalizedLeaderEmail,
      event
    })
      .select('teamId teamName')
      .lean();

    if (duplicate) {
      return res.status(409).json({
        message: `You have already registered team "${duplicate.teamName}" (${duplicate.teamId}) for ${eventDisplay}.`
      });
    }

    // Generate unique Team ID atomically & retry cleanly on rare counter collision under bursts
    const currentYear = new Date().getFullYear();
    const counterId = `event_${currentYear}`;
    let newTeam = null;
    let finalTeamId = '';

    for (let attempt = 0; attempt < 3; attempt += 1) {
      const counter = await Counter.findByIdAndUpdate(
        counterId,
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      const serial = String(counter.seq).padStart(3, '0');
      finalTeamId = `HIET/CR/${currentYear}/${serial}`;

      try {
        newTeam = await EventTeam.create({
          teamId: finalTeamId,
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
          status: 'pending',
          appliedAt: new Date()
        });
        break;
      } catch (createErr) {
        if (createErr?.code === 11000 && attempt < 2) {
          continue;
        }
        throw createErr;
      }
    }

    // Durable non-blocking email queue dispatch (leader TO, teammates CC)
    try {
      const payload = buildTeamConfirmationEmailPayload(newTeam, false);
      const queuedResult = await enqueueEmail(payload, { sendImmediately: false });

      if (process.env.VERCEL && queuedResult?.log) {
        // Under Vercel serverless, race fast pooled SMTP with 1400ms soft cap so bursts still respond immediately
        await Promise.race([
          processSingleEmailLog(queuedResult.log),
          new Promise((resolve) => setTimeout(resolve, 1400))
        ]);
      } else {
        triggerBackgroundQueueDrain();
      }
    } catch (mailErr) {
      console.warn('Confirmation email queue error (team registered safely):', mailErr.message);
    }

    return res.status(201).json({
      message: 'Team registered successfully',
      teamId: finalTeamId
    });
  } catch (err) {
    console.error('[Event Registration Error]', err);
    return res.status(500).json({ message: 'Server error during registration' });
  } finally {
    if (lockKey) {
      inFlightRegistrations.delete(lockKey);
    }
  }
};

module.exports = { registerEventTeam, getPublicSettings };
