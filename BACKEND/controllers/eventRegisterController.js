const EventTeam = require('../models/EventTeam');
const Counter = require('../models/Counter');
const SiteSetting = require('../models/SiteSetting');
const FailedRegistration = require('../models/FailedRegistration');
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

const FEST_EDITION_YEAR = '2027';
const MAX_EVENTS_PER_PERSON = 2;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[6-9]\d{9}$/;

const EVENT_SIZE_LIMITS = {
  'code-puzzle': [1, 1],
  'dance-competition': [1, 1],
  'short-film-maker': [1, 2],
  'rangoli-competition': [1, 3],
  'treasure-hunt': [5, 8],
};

// Atomic lock keys prevent duplicate races across teamName, emails, and mobile numbers during bursts
const inFlightLocks = new Set();

const escapeRegex = (str) => String(str || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Persist any failed, conflicted, or crashed registration attempt with all filled details
 * so festival coordinators can inspect the exact error and contact participants directly.
 */
const recordFailedRegistration = async (req, meta = {}) => {
  try {
    const body = req?.body || {};
    const leaderMobile = String(body.leaderMobile || body.leader?.mobile || '').trim();
    const leaderWhatsapp = String(body.leaderWhatsapp || body.leader?.whatsapp || leaderMobile || '').trim();
    const leaderEmail = String(body.leaderEmail || body.leader?.email || '').trim().toLowerCase();
    const leaderName = String(body.leaderName || body.leader?.name || '').trim();

    const parsedMembers = Array.isArray(body.members)
      ? body.members.slice(0, 8).map((m) => ({
          name: String(m?.name || '').trim(),
          email: String(m?.email || '').trim().toLowerCase(),
          mobile: String(m?.mobile || '').trim()
        }))
      : [];

    const ip =
      req?.ip ||
      req?.headers?.['x-forwarded-for']?.split(',')[0]?.trim() ||
      req?.socket?.remoteAddress ||
      '';

    await FailedRegistration.create({
      errorType: meta.errorType || 'server_error',
      httpStatus: meta.httpStatus || 500,
      errorMessage: String(meta.errorMessage || 'Unknown registration issue').slice(0, 1000),
      errorField: String(meta.errorField || ''),
      errorStep: Number.isFinite(meta.errorStep) ? meta.errorStep : 0,
      source: meta.source || 'backend_register',
      teamName: String(body.teamName || '').trim(),
      leader: {
        name: leaderName,
        email: leaderEmail,
        mobile: leaderMobile,
        whatsapp: leaderWhatsapp
      },
      college: String(body.college || '').trim(),
      customCollege: String(body.customCollege || '').trim(),
      course: String(body.course || '').trim(),
      branch: String(body.branch || '').trim(),
      year: String(body.year || '').trim(),
      event: String(body.event || '').trim(),
      teamSize: Number(body.teamSize) || Math.max(1, parsedMembers.length + 1),
      members: parsedMembers,
      rawPayload: body,
      userAgent: String(req?.headers?.['user-agent'] || '').slice(0, 300),
      clientIp: String(ip).slice(0, 120),
      followUpStatus: 'pending',
      occurredAt: new Date()
    });
  } catch (logErr) {
    console.warn('[FailedRegistration Log Error]', logErr.message);
  }
};

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
 * Shared validation against:
 * 1. Intra-squad duplicate emails & mobile numbers
 * 2. Globally unique teamName (case-insensitive)
 * 3. Per-event duplicate leader or teammate email/mobile
 * 4. Strict maximum limit of 2 events per participant (by email OR mobile across Leader + Members)
 */
const validateSquadUniquenessAndCaps = async ({
  teamName,
  leaderEmail,
  leaderMobile,
  leaderWhatsapp,
  event,
  members = []
}) => {
  const cleanTeamName = String(teamName || '').trim();
  const normLeaderEmail = String(leaderEmail || '').trim().toLowerCase();
  const normLeaderMobile = String(leaderMobile || '').trim();
  const normLeaderWhatsapp = String(leaderWhatsapp || normLeaderMobile || '').trim();

  // 1. Intra-squad uniqueness check (emails & mobiles within submitted form)
  const squadEmails = new Set(normLeaderEmail ? [normLeaderEmail] : []);
  const squadMobiles = new Set(normLeaderMobile ? [normLeaderMobile] : []);

  for (let i = 0; i < members.length; i += 1) {
    const m = members[i] || {};
    const mEmail = String(m.email || '').trim().toLowerCase();
    const mMobile = String(m.mobile || '').trim();

    if (mEmail) {
      if (squadEmails.has(mEmail)) {
        return {
          ok: false,
          field: `members.${i}.email`,
          step: 1,
          message: `Duplicate email "${mEmail}" within the same team. Every member must have a unique email.`
        };
      }
      squadEmails.add(mEmail);
    }

    if (mMobile) {
      if (squadMobiles.has(mMobile)) {
        return {
          ok: false,
          field: `members.${i}.mobile`,
          step: 1,
          message: `Duplicate mobile number "${mMobile}" within the same team. Every member must use their own mobile number.`
        };
      }
      squadMobiles.add(mMobile);
    }
  }

  // 2. Globally unique teamName (case-insensitive)
  if (cleanTeamName) {
    const existingTeamName = await EventTeam.findOne({
      teamName: new RegExp(`^${escapeRegex(cleanTeamName)}$`, 'i')
    })
      .select('teamId teamName')
      .lean();

    if (existingTeamName) {
      return {
        ok: false,
        field: 'teamName',
        step: 0,
        message: `Team name "${existingTeamName.teamName}" is already registered (${existingTeamName.teamId}). Please edit and pick another team name.`
      };
    }
  }

  // 3. Database-wide lookup for any email / mobile participation across events
  const allEmails = Array.from(squadEmails);
  const mobileSet = new Set(squadMobiles);
  if (normLeaderWhatsapp) mobileSet.add(normLeaderWhatsapp);
  const allMobiles = Array.from(mobileSet).filter(Boolean);

  if (allEmails.length === 0 && allMobiles.length === 0) {
    return { ok: true };
  }

  const orConditions = [];
  if (allEmails.length > 0) {
    orConditions.push({ 'leader.email': { $in: allEmails } });
    orConditions.push({ 'members.email': { $in: allEmails } });
  }
  if (allMobiles.length > 0) {
    orConditions.push({ 'leader.mobile': { $in: allMobiles } });
    orConditions.push({ 'leader.whatsapp': { $in: allMobiles } });
    orConditions.push({ 'members.mobile': { $in: allMobiles } });
  }

  const relatedDocs = await EventTeam.find({ $or: orConditions })
    .select('teamId teamName event leader members')
    .lean();

  const eventsByEmail = new Map();
  const eventsByMobile = new Map();

  const recordParticipation = (map, key, evSlug) => {
    if (!key) return;
    if (!map.has(key)) map.set(key, new Set());
    map.get(key).add(evSlug);
  };

  for (const doc of relatedDocs) {
    const evSlug = doc.event;
    if (doc.leader?.email) {
      recordParticipation(eventsByEmail, doc.leader.email.trim().toLowerCase(), evSlug);
    }
    if (doc.leader?.mobile) {
      recordParticipation(eventsByMobile, String(doc.leader.mobile).trim(), evSlug);
    }
    if (doc.leader?.whatsapp) {
      recordParticipation(eventsByMobile, String(doc.leader.whatsapp).trim(), evSlug);
    }
    for (const mem of doc.members || []) {
      if (mem?.email) {
        recordParticipation(eventsByEmail, mem.email.trim().toLowerCase(), evSlug);
      }
      if (mem?.mobile) {
        recordParticipation(eventsByMobile, String(mem.mobile).trim(), evSlug);
      }
    }
  }

  const targetEventLabel = event ? getEventDisplay(event) : 'this event';

  const checkPerson = (personLabel, email, mobile, emailField, mobileField, stepIndex) => {
    if (email) {
      const evs = eventsByEmail.get(email);
      if (evs) {
        if (event && evs.has(event)) {
          return {
            ok: false,
            field: emailField,
            step: stepIndex,
            message: `${personLabel} email "${email}" is already registered in ${targetEventLabel}. Please edit this email or pick a different event.`
          };
        }
        if (evs.size >= MAX_EVENTS_PER_PERSON) {
          const joinedList = Array.from(evs).map(getEventDisplay).join(' & ');
          return {
            ok: false,
            field: emailField,
            step: stepIndex,
            message: `${personLabel} ("${email}") has already joined ${MAX_EVENTS_PER_PERSON} events (${joinedList}). Maximum ${MAX_EVENTS_PER_PERSON} events allowed per participant.`
          };
        }
      }
    }

    if (mobile) {
      const evs = eventsByMobile.get(mobile);
      if (evs) {
        if (event && evs.has(event)) {
          return {
            ok: false,
            field: mobileField,
            step: stepIndex,
            message: `${personLabel} mobile "${mobile}" is already registered in ${targetEventLabel}. Please edit this mobile number.`
          };
        }
        if (evs.size >= MAX_EVENTS_PER_PERSON) {
          const joinedList = Array.from(evs).map(getEventDisplay).join(' & ');
          return {
            ok: false,
            field: mobileField,
            step: stepIndex,
            message: `${personLabel} mobile "${mobile}" has already reached the maximum limit of ${MAX_EVENTS_PER_PERSON} events (${joinedList}).`
          };
        }
      }
    }

    return null;
  };

  const leaderConflict = checkPerson(
    'Team Leader',
    normLeaderEmail,
    normLeaderMobile,
    'leaderEmail',
    'leaderMobile',
    0
  );
  if (leaderConflict) return leaderConflict;

  if (normLeaderWhatsapp && normLeaderWhatsapp !== normLeaderMobile) {
    const waConflict = checkPerson(
      'Team Leader WhatsApp',
      '',
      normLeaderWhatsapp,
      'leaderWhatsapp',
      'leaderWhatsapp',
      0
    );
    if (waConflict) return waConflict;
  }

  for (let i = 0; i < members.length; i += 1) {
    const m = members[i] || {};
    const mEmail = String(m.email || '').trim().toLowerCase();
    const mMobile = String(m.mobile || '').trim();
    const memberConflict = checkPerson(
      `Teammate #${i + 2}`,
      mEmail,
      mMobile,
      `members.${i}.email`,
      `members.${i}.mobile`,
      1
    );
    if (memberConflict) return memberConflict;
  }

  return { ok: true };
};

/**
 * Fast live step-level validation endpoint + capture of user-facing conflicts.
 */
const checkRegistrationAvailability = async (req, res) => {
  try {
    const {
      teamName,
      leaderEmail,
      leaderMobile,
      leaderWhatsapp,
      event,
      members = []
    } = req.body || {};

    const result = await validateSquadUniquenessAndCaps({
      teamName,
      leaderEmail,
      leaderMobile,
      leaderWhatsapp,
      event,
      members
    });

    if (!result.ok) {
      // Save user-encountered conflict details so admins can contact & help if needed
      await recordFailedRegistration(req, {
        errorType: 'validation_conflict',
        httpStatus: 409,
        errorMessage: result.message,
        errorField: result.field,
        errorStep: result.step,
        source: 'backend_check'
      });

      return res.status(200).json({
        available: false,
        field: result.field,
        step: result.step,
        message: result.message
      });
    }

    return res.status(200).json({ available: true });
  } catch (err) {
    console.error('[Availability Check Error]', err);
    await recordFailedRegistration(req, {
      errorType: 'server_error',
      httpStatus: 500,
      errorMessage: err.message || 'Availability check server failure',
      source: 'backend_check'
    });
    return res.status(500).json({ message: 'Unable to validate availability right now.' });
  }
};

/**
 * Backup client-side error reporter for network/timeout/unexpected browser issues
 * when submitting registration.
 */
const reportClientRegistrationIssue = async (req, res) => {
  try {
    const {
      errorMessage,
      errorType = 'client_submit_error',
      httpStatus = 0,
      errorField = '',
      errorStep = 0
    } = req.body || {};

    if (!errorMessage) {
      return res.status(400).json({ message: 'errorMessage is required' });
    }

    await recordFailedRegistration(req, {
      errorType,
      httpStatus,
      errorMessage,
      errorField,
      errorStep,
      source: 'frontend_fallback'
    });

    return res.status(201).json({ logged: true });
  } catch (err) {
    console.warn('[Client Issue Log Error]', err.message);
    return res.status(500).json({ logged: false });
  }
};

/**
 * Scaled MERN registration handler enforcing strict uniqueness, max 2 events per participant,
 * HIET/CR/2027/XXX team IDs, automatic issue logging on any failure, and single email delivery.
 */
const registerEventTeam = async (req, res) => {
  const acquiredLocks = [];

  try {
    const settings = await SiteSetting.getSettings();
    if (!settings.registrationOpen) {
      const msg =
        settings.closedMessage ||
        'Online registrations for CROSSROADS 2027 are currently closed.';
      await recordFailedRegistration(req, {
        errorType: 'closed_gate',
        httpStatus: 403,
        errorMessage: msg,
        source: 'backend_register'
      });
      return res.status(403).json({ message: msg });
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

    const failAndLog = async (status, payloadObj, errorType = 'validation_conflict') => {
      await recordFailedRegistration(req, {
        errorType,
        httpStatus: status,
        errorMessage: payloadObj.message,
        errorField: payloadObj.field || '',
        errorStep: typeof payloadObj.step === 'number' ? payloadObj.step : 0,
        source: 'backend_register'
      });
      return res.status(status).json(payloadObj);
    };

    if (settings.eventStatus) {
      const isEventOpen =
        typeof settings.eventStatus.get === 'function'
          ? settings.eventStatus.get(event)
          : settings.eventStatus[event];

      if (isEventOpen === false) {
        return failAndLog(
          403,
          {
            field: 'event',
            step: 0,
            message: `Registrations for "${getEventDisplay(event)}" are currently closed.`
          },
          'closed_gate'
        );
      }
    }

    if (
      !teamName?.trim() ||
      !leaderName?.trim() ||
      !leaderEmail ||
      !leaderMobile ||
      !leaderWhatsapp
    ) {
      return failAndLog(400, { step: 0, message: 'Leader details are required' });
    }

    if (!college?.trim() || !branch?.trim() || !year?.trim()) {
      return failAndLog(400, {
        step: 0,
        message: 'College, branch, and academic year are required'
      });
    }

    const normalizedLeaderEmail = leaderEmail.trim().toLowerCase();
    if (!EMAIL_REGEX.test(normalizedLeaderEmail)) {
      return failAndLog(400, {
        field: 'leaderEmail',
        step: 0,
        message: 'Valid leader email address is required'
      });
    }

    const cleanLeaderMobile = String(leaderMobile).trim();
    const cleanLeaderWhatsapp = String(leaderWhatsapp).trim();
    if (!PHONE_REGEX.test(cleanLeaderMobile)) {
      return failAndLog(400, {
        field: 'leaderMobile',
        step: 0,
        message: 'Valid 10-digit Indian calling number is required'
      });
    }
    if (!PHONE_REGEX.test(cleanLeaderWhatsapp)) {
      return failAndLog(400, {
        field: 'leaderWhatsapp',
        step: 0,
        message: 'Valid 10-digit Indian WhatsApp number is required'
      });
    }

    if (!event || !Object.prototype.hasOwnProperty.call(EVENT_DISPLAY_NAMES, event)) {
      return failAndLog(400, {
        field: 'event',
        step: 0,
        message: 'Invalid or unknown event selected'
      });
    }

    const teamSizeNum = parseInt(teamSize, 10);
    const [minSize, maxSize] = EVENT_SIZE_LIMITS[event] || [1, 4];
    const eventDisplay = getEventDisplay(event);

    if (Number.isNaN(teamSizeNum) || teamSizeNum < minSize || teamSizeNum > maxSize) {
      return failAndLog(400, {
        field: 'teamSize',
        step: 0,
        message: `For "${eventDisplay}", team size must be between ${minSize} and ${maxSize} (including leader)`
      });
    }

    const sanitizedMembers = [];
    if (teamSizeNum > 1) {
      if (!Array.isArray(members) || members.length !== teamSizeNum - 1) {
        return failAndLog(400, {
          step: 1,
          message: `Exactly ${teamSizeNum - 1} additional team member(s) required`
        });
      }
      for (let i = 0; i < members.length; i += 1) {
        const m = members[i];
        const mName = m?.name?.trim();
        const mEmail = m?.email?.trim().toLowerCase();
        const mMobile = String(m?.mobile || '').trim();
        if (!mName) {
          return failAndLog(400, {
            field: `members.${i}.name`,
            step: 1,
            message: `Full name is required for Teammate #${i + 2}`
          });
        }
        if (!mEmail || !EMAIL_REGEX.test(mEmail)) {
          return failAndLog(400, {
            field: `members.${i}.email`,
            step: 1,
            message: `Valid email address is required for Teammate #${i + 2}`
          });
        }
        if (!mMobile || !PHONE_REGEX.test(mMobile)) {
          return failAndLog(400, {
            field: `members.${i}.mobile`,
            step: 1,
            message: `Valid 10-digit mobile number is required for Teammate #${i + 2}`
          });
        }
        sanitizedMembers.push({ name: mName, email: mEmail, mobile: mMobile });
      }
    }

    const candidateKeys = [
      `team:${teamName.trim().toLowerCase()}`,
      `email:${normalizedLeaderEmail}`,
      `mob:${cleanLeaderMobile}`,
      ...sanitizedMembers.flatMap((m) => [`email:${m.email}`, `mob:${m.mobile}`])
    ];

    for (const key of candidateKeys) {
      if (inFlightLocks.has(key)) {
        return failAndLog(409, {
          message:
            'A concurrent registration with overlapping credentials is already in progress. Please wait and retry.'
        });
      }
    }
    candidateKeys.forEach((k) => {
      inFlightLocks.add(k);
      acquiredLocks.push(k);
    });

    const check = await validateSquadUniquenessAndCaps({
      teamName: teamName.trim(),
      leaderEmail: normalizedLeaderEmail,
      leaderMobile: cleanLeaderMobile,
      leaderWhatsapp: cleanLeaderWhatsapp,
      event,
      members: sanitizedMembers
    });

    if (!check.ok) {
      return failAndLog(409, {
        field: check.field,
        step: check.step,
        message: check.message
      });
    }

    const counterId = `event_${FEST_EDITION_YEAR}`;
    let newTeam = null;
    let finalTeamId = '';

    for (let attempt = 0; attempt < 3; attempt += 1) {
      const counter = await Counter.findByIdAndUpdate(
        counterId,
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      const serial = String(counter.seq).padStart(3, '0');
      finalTeamId = `HIET/CR/${FEST_EDITION_YEAR}/${serial}`;

      try {
        newTeam = await EventTeam.create({
          teamId: finalTeamId,
          teamName: teamName.trim(),
          leader: {
            name: leaderName.trim(),
            email: normalizedLeaderEmail,
            mobile: cleanLeaderMobile,
            whatsapp: cleanLeaderWhatsapp
          },
          college: college.trim(),
          branch: branch.trim(),
          year: year.trim(),
          event,
          teamSize: teamSizeNum,
          members: sanitizedMembers,
          status: 'pending',
          confirmationEmailQueued: true,
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

    // Mark any prior pending failed attempt by this leader/event as auto-resolved so coordinators know!
    FailedRegistration.updateMany(
      {
        'leader.email': normalizedLeaderEmail,
        event,
        followUpStatus: 'pending'
      },
      {
        $set: {
          followUpStatus: 'resolved',
          adminNote: `Auto-resolved: Completed registration (${finalTeamId})`
        }
      }
    ).catch(() => {});

    // Strictly single idempotent email enqueue & dispatch
    try {
      const payload = buildTeamConfirmationEmailPayload(newTeam, false);
      const queuedResult = await enqueueEmail(payload, {
        sendImmediately: false,
        isManual: false
      });

      if (process.env.VERCEL && queuedResult?.log) {
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
    await recordFailedRegistration(req, {
      errorType: 'server_error',
      httpStatus: 500,
      errorMessage: err.message || 'Server error during registration',
      source: 'backend_register'
    });
    return res.status(500).json({ message: 'Server error during registration' });
  } finally {
    for (const k of acquiredLocks) {
      inFlightLocks.delete(k);
    }
  }
};

module.exports = {
  registerEventTeam,
  checkRegistrationAvailability,
  reportClientRegistrationIssue,
  getPublicSettings,
  validateSquadUniquenessAndCaps,
  recordFailedRegistration
};
