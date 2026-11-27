// controllers/adminController.js
const EventTeam = require('../models/EventTeam');
const EmailLog = require('../models/EmailLog');
const Admin = require('../models/Admin');
const Counter = require('../models/Counter');
const SiteSetting = require('../models/SiteSetting');
const Broadcast = require('../models/Broadcast');
const jwt = require('jsonwebtoken');
const ExcelJS = require('exceljs');
const { ensureInitialAdminExists } = require('../utils/seedAdmin');
const {
  BRAND_NAME,
  THEME_TAGLINE,
  FRONTEND_URL,
  IDENTITY,
  transporters,
  EVENT_DISPLAY_NAMES,
  getEventDisplay,
  getUniqueMemberEmails,
  escapeHtml,
  buildResponsiveEmailDocument,
  buildTeamConfirmationEmailPayload,
  buildUnifiedAdminDispatchHtml
} = require('../utils/mailer');
const { buildFormattedRegistrationWorkbook } = require('../utils/excelReport');
const {
  TECHNICAL_EVENTS,
  REGISTRATION_STATUSES,
  getIstTodayRange,
  buildRegistrationFilterQuery,
  queryTeamsSmart
} = require('../utils/queryBuilder');
const {
  enqueueEmail,
  enqueueBatchEmails,
  processPendingEmailQueue,
  resendEmailLogById
} = require('../utils/emailWorker');

/**
 * Compute single-round-trip MongoDB $facet analytics pipeline
 * returning KPI overview, event-wise metrics, college-wise counts, and 7-day IST trend.
 */
const runAnalyticsFacetPipeline = async (matchStage = {}) => {
  const { start: todayStart, end: todayEnd } = getIstTodayRange();
  const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
  const sevenDaysStart = new Date(todayStart.getTime() - 6 * 24 * 60 * 60 * 1000);

  const pipeline = [];
  if (matchStage && Object.keys(matchStage).length > 0) {
    pipeline.push({ $match: matchStage });
  }

  pipeline.push({
    $addFields: {
      normalizedCollege: {
        $let: {
          vars: { trimmed: { $trim: { input: { $ifNull: ['$college', 'Unspecified'] } } } },
          in: { $cond: [{ $eq: ['$$trimmed', ''] }, 'Unspecified', '$$trimmed'] }
        }
      },
      effectiveSize: { $ifNull: ['$teamSize', 1] },
      effectiveStatus: { $ifNull: ['$status', 'pending'] },
      isTechnical: { $in: ['$event', TECHNICAL_EVENTS] },
      appliedDateIst: {
        $dateToString: {
          format: '%Y-%m-%d',
          date: { $add: [{ $ifNull: ['$appliedAt', '$$NOW'] }, IST_OFFSET_MS] }
        }
      }
    }
  });

  pipeline.push({
    $facet: {
      overview: [
        {
          $group: {
            _id: null,
            totalTeams: { $sum: 1 },
            totalParticipants: { $sum: '$effectiveSize' },
            todayTeams: {
              $sum: {
                $cond: [
                  { $and: [{ $gte: ['$appliedAt', todayStart] }, { $lt: ['$appliedAt', todayEnd] }] },
                  1,
                  0
                ]
              }
            },
            todayParticipants: {
              $sum: {
                $cond: [
                  { $and: [{ $gte: ['$appliedAt', todayStart] }, { $lt: ['$appliedAt', todayEnd] }] },
                  '$effectiveSize',
                  0
                ]
              }
            },
            technicalCount: { $sum: { $cond: ['$isTechnical', 1, 0] } },
            culturalCount: { $sum: { $cond: ['$isTechnical', 0, 1] } },
            pendingCount: { $sum: { $cond: [{ $eq: ['$effectiveStatus', 'pending'] }, 1, 0] } },
            verifiedCount: { $sum: { $cond: [{ $eq: ['$effectiveStatus', 'verified'] }, 1, 0] } },
            checkedInCount: { $sum: { $cond: [{ $eq: ['$effectiveStatus', 'checked-in'] }, 1, 0] } },
            rejectedCount: { $sum: { $cond: [{ $eq: ['$effectiveStatus', 'rejected'] }, 1, 0] } },
            exportedCount: { $sum: { $cond: [{ $eq: ['$exported', true] }, 1, 0] } },
            collegesSet: { $addToSet: '$normalizedCollege' }
          }
        },
        {
          $project: {
            _id: 0,
            totalTeams: 1,
            totalParticipants: 1,
            todayTeams: 1,
            todayParticipants: 1,
            technicalCount: 1,
            culturalCount: 1,
            pendingCount: 1,
            verifiedCount: 1,
            checkedInCount: 1,
            rejectedCount: 1,
            exportedCount: 1,
            totalColleges: { $size: '$collegesSet' }
          }
        }
      ],
      eventWise: [
        {
          $group: {
            _id: { $ifNull: ['$event', 'unknown'] },
            count: { $sum: 1 },
            teamsCount: { $sum: 1 },
            participants: { $sum: '$effectiveSize' },
            studentsCount: { $sum: '$effectiveSize' },
            collegesSet: { $addToSet: '$normalizedCollege' },
            soloCount: { $sum: { $cond: [{ $eq: ['$effectiveSize', 1] }, 1, 0] } },
            groupCount: { $sum: { $cond: [{ $gt: ['$effectiveSize', 1] }, 1, 0] } }
          }
        },
        {
          $project: {
            _id: 1,
            event: '$_id',
            count: 1,
            teamsCount: 1,
            participants: 1,
            studentsCount: 1,
            collegesCount: { $size: '$collegesSet' },
            soloCount: 1,
            groupCount: 1
          }
        },
        { $sort: { count: -1, studentsCount: -1 } }
      ],
      allColleges: [
        {
          $group: {
            _id: '$normalizedCollege',
            college: { $first: '$normalizedCollege' },
            count: { $sum: 1 },
            teamsCount: { $sum: 1 },
            studentsCount: { $sum: '$effectiveSize' },
            eventsSet: { $addToSet: '$event' },
            verifiedCount: {
              $sum: { $cond: [{ $in: ['$effectiveStatus', ['verified', 'checked-in']] }, 1, 0] }
            }
          }
        },
        {
          $project: {
            _id: 1,
            college: 1,
            count: 1,
            teamsCount: 1,
            studentsCount: 1,
            eventsSet: 1,
            eventsCount: { $size: '$eventsSet' },
            verifiedCount: 1
          }
        },
        { $sort: { studentsCount: -1, teamsCount: -1 } }
      ],
      trendRaw: [
        { $match: { appliedAt: { $gte: sevenDaysStart } } },
        {
          $group: {
            _id: '$appliedDateIst',
            teams: { $sum: 1 },
            students: { $sum: '$effectiveSize' }
          }
        },
        { $sort: { _id: 1 } }
      ]
    }
  });

  const [facetRes] = await EventTeam.aggregate(pipeline);
  const ov = facetRes?.overview?.[0] || {
    totalTeams: 0,
    totalParticipants: 0,
    todayTeams: 0,
    todayParticipants: 0,
    technicalCount: 0,
    culturalCount: 0,
    pendingCount: 0,
    verifiedCount: 0,
    checkedInCount: 0,
    rejectedCount: 0,
    exportedCount: 0,
    totalColleges: 0
  };

  const eventWise = (facetRes?.eventWise || []).map((ev) => ({
    ...ev,
    eventName: getEventDisplay(ev._id),
    track: TECHNICAL_EVENTS.includes(ev._id) ? 'Technical' : 'Cultural'
  }));

  const allColleges = (facetRes?.allColleges || []).map((c) => ({
    _id: c._id,
    college: c.college,
    count: c.count,
    teamsCount: c.teamsCount,
    studentsCount: c.studentsCount,
    eventsCount: c.eventsCount,
    verifiedCount: c.verifiedCount,
    events: (c.eventsSet || []).map((ev) => getEventDisplay(ev))
  }));

  // Zero-fill trailing 7 IST calendar days cleanly for smooth sparklines/bar charts
  const trendMap = new Map((facetRes?.trendRaw || []).map((d) => [d._id, d]));
  const dailyTrend = [];
  for (let i = 6; i >= 0; i--) {
    const dayDate = new Date(todayStart.getTime() - i * 24 * 60 * 60 * 1000 + IST_OFFSET_MS);
    const isoDate = dayDate.toISOString().slice(0, 10);
    const label = dayDate.toLocaleDateString('en-IN', {
      timeZone: 'UTC',
      day: '2-digit',
      month: 'short'
    });
    const entry = trendMap.get(isoDate);
    dailyTrend.push({
      date: isoDate,
      label,
      teams: entry ? entry.teams : 0,
      students: entry ? entry.students : 0
    });
  }

  return {
    total: ov.totalTeams,
    totalTeams: ov.totalTeams,
    totalParticipants: ov.totalParticipants,
    totalStudents: ov.totalParticipants,
    totalColleges: ov.totalColleges,
    today: ov.todayTeams,
    todayParticipants: ov.todayParticipants,
    technicalCount: ov.technicalCount,
    culturalCount: ov.culturalCount,
    statusBreakdown: {
      pending: ov.pendingCount,
      verified: ov.verifiedCount,
      checkedIn: ov.checkedInCount,
      rejected: ov.rejectedCount,
      exported: ov.exportedCount
    },
    eventWise,
    collegeWise: allColleges.slice(0, 8),
    allColleges,
    dailyTrend
  };
};

/**
 * Lightweight JS aggregation over pre-fetched team slice (used in report generation).
 */
const computeAggregations = (teams) => {
  const { start: todayStart, end: todayEnd } = getIstTodayRange();
  let totalParticipants = 0;
  let todayCount = 0;
  let todayParticipants = 0;
  let technicalCount = 0;
  let culturalCount = 0;

  const eventMap = new Map();
  const collegeMap = new Map();

  teams.forEach((t) => {
    const size = t.teamSize || 1;
    totalParticipants += size;

    const applied = t.appliedAt ? new Date(t.appliedAt) : null;
    if (applied && applied >= todayStart && applied < todayEnd) {
      todayCount += 1;
      todayParticipants += size;
    }

    if (TECHNICAL_EVENTS.includes(t.event)) technicalCount += 1;
    else culturalCount += 1;

    const evKey = t.event || 'unknown';
    if (!eventMap.has(evKey)) {
      eventMap.set(evKey, {
        _id: evKey,
        event: evKey,
        eventName: getEventDisplay(evKey),
        track: TECHNICAL_EVENTS.includes(evKey) ? 'Technical' : 'Cultural',
        count: 0,
        teamsCount: 0,
        participants: 0,
        studentsCount: 0,
        collegesSet: new Set(),
        soloCount: 0,
        groupCount: 0
      });
    }
    const ev = eventMap.get(evKey);
    ev.count += 1;
    ev.teamsCount += 1;
    ev.participants += size;
    ev.studentsCount += size;
    if (t.college) ev.collegesSet.add(t.college.trim());
    if (size === 1) ev.soloCount += 1;
    else ev.groupCount += 1;

    const colName = (t.college || 'Unspecified').trim();
    if (!collegeMap.has(colName)) {
      collegeMap.set(colName, {
        _id: colName,
        college: colName,
        count: 0,
        teamsCount: 0,
        studentsCount: 0,
        eventsSet: new Set(),
        eventBreakdown: {}
      });
    }
    const col = collegeMap.get(colName);
    col.count += 1;
    col.teamsCount += 1;
    col.studentsCount += size;
    col.eventsSet.add(getEventDisplay(evKey));
    col.eventBreakdown[evKey] = (col.eventBreakdown[evKey] || 0) + size;
  });

  const eventWise = Array.from(eventMap.values())
    .map((ev) => ({
      _id: ev._id,
      event: ev.event,
      eventName: ev.eventName,
      track: ev.track,
      count: ev.count,
      teamsCount: ev.teamsCount,
      participants: ev.participants,
      studentsCount: ev.studentsCount,
      collegesCount: ev.collegesSet.size,
      soloCount: ev.soloCount,
      groupCount: ev.groupCount
    }))
    .sort((a, b) => b.count - a.count);

  const allColleges = Array.from(collegeMap.values())
    .map((c) => ({
      _id: c._id,
      college: c.college,
      count: c.count,
      teamsCount: c.teamsCount,
      studentsCount: c.studentsCount,
      eventsCount: c.eventsSet.size,
      events: Array.from(c.eventsSet),
      eventBreakdown: c.eventBreakdown
    }))
    .sort((a, b) => b.studentsCount - a.studentsCount || b.teamsCount - a.teamsCount);

  return {
    total: teams.length,
    totalTeams: teams.length,
    totalParticipants,
    totalStudents: totalParticipants,
    totalColleges: allColleges.length,
    today: todayCount,
    todayParticipants,
    technicalCount,
    culturalCount,
    eventWise,
    collegeWise: allColleges.slice(0, 8),
    allColleges
  };
};

const parseEmailList = (input) => {
  if (!input) return [];
  const rawList = Array.isArray(input) ? input : String(input).split(/[,;\n]+/);
  const seen = new Set();
  const valid = [];
  for (const item of rawList) {
    const email = String(item || '').trim();
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !seen.has(email.toLowerCase())) {
      seen.add(email.toLowerCase());
      valid.push(email);
    }
  }
  return valid;
};

// Admin Login (authenticates against seeded Admin credentials in MongoDB)
const login = async (req, res) => {
  try {
    const { email, username, password } = req.body || {};
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      return res.status(500).json({ msg: 'JWT_SECRET is not configured on the server' });
    }

    const inputEmail = String(email || username || '').trim().toLowerCase();
    if (!inputEmail || !password) {
      return res.status(400).json({ msg: 'Email and password are required' });
    }

    let admin = await Admin.findOne({ email: inputEmail, isActive: true }).select('+passwordHash');

    // Auto-seed initial admin from env vars only if Admin collection is completely empty
    if (!admin) {
      await ensureInitialAdminExists();
      admin = await Admin.findOne({ email: inputEmail, isActive: true }).select('+passwordHash');
    }

    if (!admin || !admin.verifyPassword(String(password))) {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    admin.lastLoginAt = new Date();
    await admin.save();

    const token = jwt.sign(
      { id: admin._id, role: 'admin', email: admin.email, username: admin.email },
      jwtSecret,
      { expiresIn: '12h' }
    );

    return res.json({
      token,
      username: admin.email,
      email: admin.email,
      name: admin.name,
      role: admin.role
    });
  } catch (err) {
    console.error('Admin login error:', err);
    return res.status(500).json({ msg: 'Authentication failed', error: err.message });
  }
};

// Return SMTP Pool Status (Round Robin Accounts)
const getSmtpStatus = (req, res) => {
  const pool = transporters.map((t, idx) => ({
    id: idx + 1,
    name: t.name,
    user: t.user,
    configured: !!t.user
  }));
  res.json({ pool, totalActive: pool.length });
};

// Real-Time Dashboard Stats via single MongoDB $facet pipeline (serves /stats & /analytics)
const getAnalytics = async (req, res) => {
  try {
    const summary = await runAnalyticsFacetPipeline({});
    res.json(summary);
  } catch (err) {
    console.error('Analytics $facet error:', err);
    res.status(500).json({ msg: 'Server error fetching analytics', error: err.message });
  }
};
const getDashboardStats = getAnalytics;

// Advanced Filter Insights via single MongoDB $facet + filtered teams
const getAdvancedInsights = async (req, res) => {
  try {
    const matchQuery = buildRegistrationFilterQuery(req.query);
    const [summary, { teams, usedTextIndex }] = await Promise.all([
      runAnalyticsFacetPipeline(matchQuery),
      queryTeamsSmart(EventTeam, req.query, { lean: true })
    ]);
    res.json({
      ...summary,
      teams,
      usedTextIndex
    });
  } catch (err) {
    console.error('Advanced insights error:', err);
    res.status(500).json({ msg: 'Error computing advanced insights', error: err.message });
  }
};

// Fetch filtered registrations using full-text $text index + regex fallback (/teams & /registrations)
const getTeams = async (req, res) => {
  try {
    const { teams, usedTextIndex } = await queryTeamsSmart(EventTeam, req.query, { lean: false });
    res.json({ teams, total: teams.length, usedTextIndex });
  } catch (err) {
    console.error('Error fetching teams:', err);
    res.status(500).json({ msg: 'Error fetching teams', error: err.message });
  }
};
const getAllRegistrations = getTeams;

// Get single team details
const getTeamById = async (req, res) => {
  try {
    const team = await EventTeam.findById(req.params.id);
    if (!team) return res.status(404).json({ msg: 'Team not found' });
    res.json(team);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Update team details (whitelisted fields only)
const updateTeam = async (req, res) => {
  try {
    const allowedFields = [
      'teamName',
      'leader',
      'college',
      'branch',
      'year',
      'event',
      'teamSize',
      'members',
      'exported',
      'status',
      'adminNotes'
    ];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }
    if (updates.status) {
      updates.statusUpdatedAt = new Date();
    }
    const updated = await EventTeam.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ msg: 'Team not found' });
    res.json({ msg: 'Team updated successfully', team: updated });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Dedicated Registration Status Update (Pending / Verified / Checked-In / Rejected)
const updateRegistrationStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body || {};
    if (!REGISTRATION_STATUSES.includes(status)) {
      return res.status(400).json({
        msg: `Invalid status. Allowed values: ${REGISTRATION_STATUSES.join(', ')}`
      });
    }

    const updateFields = { status, statusUpdatedAt: new Date() };
    if (adminNotes !== undefined) updateFields.adminNotes = String(adminNotes).trim();

    const updated = await EventTeam.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ msg: 'Registration not found' });

    res.json({
      success: true,
      msg: `Team ${updated.teamId} status updated to "${status}"`,
      team: updated
    });
  } catch (err) {
    console.error('Status update error:', err);
    res.status(500).json({ msg: 'Failed to update registration status', error: err.message });
  }
};

// Delete team
const deleteTeam = async (req, res) => {
  try {
    const deleted = await EventTeam.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: 'Team not found' });
    res.json({ msg: 'Team deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Resend confirmation email to team (TO: leader, CC: all members) via EmailLog + Round Robin
const resendConfirmationEmail = async (req, res) => {
  try {
    const team = await EventTeam.findById(req.params.id);
    if (!team) return res.status(404).json({ msg: 'Team not found' });

    const payload = buildTeamConfirmationEmailPayload(team, true);
    const result = await enqueueEmail(payload, { sendImmediately: true });

    if (!result.success) {
      return res.status(502).json({
        msg: `Email queued/failed (${result.error}). Logged in Email Queue & Logs for retry.`,
        logId: result.log?._id
      });
    }

    res.json({
      success: true,
      msg: `Confirmation email dispatched to Leader (${payload.leaderEmail})${payload.ccCount > 0 ? ` with ${payload.ccCount} member(s) in CC` : ''} via Round Robin (${result.sentVia})`,
      leaderEmail: payload.leaderEmail,
      ccCount: payload.ccCount,
      ccList: payload.ccList,
      sentVia: result.sentVia,
      logId: result.log?._id
    });
  } catch (err) {
    console.error('Resend email error:', err);
    res.status(500).json({ msg: 'Failed to send confirmation email', error: err.message });
  }
};

// Send bulk confirmation emails through EmailLog + Round Robin SMTP pool
const sendBulkConfirmations = async (req, res) => {
  try {
    const { teamIds = [], filter = {} } = req.body;

    const query = Array.isArray(teamIds) && teamIds.length > 0
      ? { _id: { $in: teamIds } }
      : buildRegistrationFilterQuery(filter);

    const targetTeams = await EventTeam.find(query);
    if (targetTeams.length === 0) {
      return res.status(404).json({ msg: 'No teams match the criteria for sending confirmations' });
    }

    const emailPayloads = [];
    for (const team of targetTeams) {
      try {
        emailPayloads.push(buildTeamConfirmationEmailPayload(team, true));
      } catch {
        // Skip invalid missing leader emails
      }
    }

    const batchResult = await enqueueBatchEmails(emailPayloads);

    res.json({
      success: true,
      msg: `Bulk confirmations logged! Sent immediately: ${batchResult.sent}, Queued for worker: ${batchResult.remainingQueued}, Failed: ${batchResult.failed} (Pool: ${batchResult.usedAccounts.join(', ') || 'Round Robin'}).`,
      sentCount: batchResult.sent,
      failedCount: batchResult.failed,
      remainingQueued: batchResult.remainingQueued,
      totalTeams: targetTeams.length,
      usedAccounts: batchResult.usedAccounts
    });
  } catch (err) {
    console.error('Bulk confirmation error:', err);
    res.status(500).json({ msg: 'Failed to dispatch bulk confirmation emails', error: err.message });
  }
};

// Filter-wise Formatted In-Memory Excel Export (RowSpan + ColSpan, Navy/Gold, Auto-Fit)
const exportExcel = async (req, res) => {
  try {
    const { teams } = await queryTeamsSmart(EventTeam, req.query, { lean: true });

    if (teams.length === 0) {
      return res.status(404).json({ msg: 'No teams match the export filters' });
    }

    const { event, track, specificCollege, markExported } = req.query;
    const scopeLabel = specificCollege && specificCollege !== 'all'
      ? specificCollege
      : event && event !== 'all'
        ? getEventDisplay(event)
        : track && track !== 'all'
          ? `${track.toUpperCase()} Track`
          : 'All Events & Colleges';

    const workbook = await buildFormattedRegistrationWorkbook(teams, scopeLabel);

    if (markExported === 'true' || markExported === true) {
      const ids = teams.map((t) => t._id);
      await EventTeam.updateMany({ _id: { $in: ids } }, { $set: { exported: true } });
    }

    const slug = (event && event !== 'all' ? event : track && track !== 'all' ? track : 'All')
      .replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `CROSSROADS_2027_${slug}_${new Date().toISOString().split('T')[0]}.xlsx`;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error('Export error:', err);
    res.status(500).json({ msg: 'Excel export failed', error: err.message });
  }
};

// Filter-wise Excel Upload (Bulk Import)
const uploadExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'Please select an Excel file (.xlsx or .xls) to upload' });
    }

    const { targetEvent, defaultCollege } = req.body;

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(req.file.buffer);

    const worksheet = workbook.worksheets[0];
    if (!worksheet) {
      return res.status(400).json({ msg: 'The uploaded Excel file contains no worksheets' });
    }

    let headerRowIndex = -1;
    let colMap = {};

    worksheet.eachRow((row, rowNumber) => {
      if (headerRowIndex !== -1) return;
      const values = row.values;
      if (!Array.isArray(values)) return;

      const rowStr = values.map((v) => String(v || '').toLowerCase().trim());
      const hasLeader = rowStr.some((v) => v.includes('leader') || v.includes('name') || v.includes('student'));
      const hasEmailOrContact = rowStr.some((v) => v.includes('email') || v.includes('mobile') || v.includes('phone'));

      if (hasLeader && hasEmailOrContact) {
        headerRowIndex = rowNumber;
        values.forEach((headerVal, colIdx) => {
          if (!headerVal) return;
          const h = String(headerVal).toLowerCase().trim().replace(/[^a-z0-9]/g, '');
          colMap[colIdx] = h;
        });
      }
    });

    if (headerRowIndex === -1) {
      headerRowIndex = 1;
      const firstRow = worksheet.getRow(1);
      firstRow.values.forEach((headerVal, colIdx) => {
        if (!headerVal) return;
        const h = String(headerVal).toLowerCase().trim().replace(/[^a-z0-9]/g, '');
        colMap[colIdx] = h;
      });
    }

    const getColVal = (row, keywords) => {
      for (const [colIdx, header] of Object.entries(colMap)) {
        if (keywords.some((k) => header.includes(k))) {
          const val = row.getCell(Number(colIdx)).value;
          if (val === null || val === undefined) return '';
          if (typeof val === 'object' && val.text) return String(val.text).trim();
          if (typeof val === 'object' && val.result) return String(val.result).trim();
          return String(val).trim();
        }
      }
      return '';
    };

    const currentYear = new Date().getFullYear();
    const rowsToProcess = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber <= headerRowIndex) return;

      const teamName = getColVal(row, ['teamname', 'team']) || getColVal(row, ['leadername', 'leader', 'name']) || `Team-${rowNumber}`;
      const leaderName = getColVal(row, ['leadername', 'leader', 'fullname', 'name']);
      const leaderEmail = getColVal(row, ['leaderemail', 'email', 'emailid', 'mail']);
      const leaderMobile = getColVal(row, ['leadermobile', 'mobile', 'phone', 'contact', 'whatsapp']) || '9999999999';
      const leaderWhatsapp = getColVal(row, ['whatsapp']) || leaderMobile;
      const college = getColVal(row, ['college', 'institution', 'collegename']) || defaultCollege || 'HIET Ghaziabad';
      const branch = getColVal(row, ['branch', 'department', 'dept', 'course']) || 'CSE';
      const year = getColVal(row, ['year', 'academicyear']) || '3rd Year';
      const rawEvent = getColVal(row, ['event', 'eventname', 'competition']);
      const teamIdRaw = getColVal(row, ['teamid', 'studentid', 'id']);
      const rawTeamSize = getColVal(row, ['teamsize', 'size', 'memberscount']);

      const members = [];
      const leaderLocalPart = (leaderEmail || 'member').split('@')[0].replace(/[^a-zA-Z0-9._-]/g, '') || 'member';
      for (let m = 1; m <= 6; m++) {
        const mName = getColVal(row, [`member${m}name`, `member${m}`, `participant${m}`]);
        const mEmail = getColVal(row, [`member${m}email`]) || `${leaderLocalPart}.${rowNumber}.${m}@crossroads.internal`;
        if (mName && mName.toLowerCase() !== leaderName?.toLowerCase()) {
          members.push({ name: mName, email: mEmail });
        }
      }

      if (leaderName || leaderEmail) {
        rowsToProcess.push({
          rowNumber,
          teamIdRaw,
          teamName,
          leaderName: leaderName || 'Leader',
          leaderEmail: leaderEmail || `student.${rowNumber}@crossroads.internal`,
          leaderMobile,
          leaderWhatsapp,
          college,
          branch,
          year,
          rawEvent,
          rawTeamSize,
          members
        });
      }
    });

    if (rowsToProcess.length === 0) {
      return res.status(400).json({ msg: 'No participant records found in the sheet. Please ensure headers and rows are filled.' });
    }

    let importedCount = 0;
    let skippedCount = 0;
    const errors = [];

    for (const r of rowsToProcess) {
      try {
        let eventKey = targetEvent;
        if (!eventKey && r.rawEvent) {
          const cleanEv = r.rawEvent.toLowerCase().trim().replace(/\s+/g, '-');
          const matched = Object.keys(EVENT_DISPLAY_NAMES).find((k) => cleanEv.includes(k) || k.includes(cleanEv));
          eventKey = matched || 'project-exhibition';
        }
        if (!eventKey) eventKey = 'project-exhibition';

        let existingTeam = null;
        if (r.teamIdRaw) {
          existingTeam = await EventTeam.findOne({ teamId: r.teamIdRaw });
        }
        if (!existingTeam && r.leaderEmail) {
          existingTeam = await EventTeam.findOne({ 'leader.email': r.leaderEmail, event: eventKey });
        }

        if (existingTeam) {
          existingTeam.teamName = r.teamName || existingTeam.teamName;
          existingTeam.college = r.college || existingTeam.college;
          existingTeam.branch = r.branch || existingTeam.branch;
          existingTeam.year = r.year || existingTeam.year;
          await existingTeam.save();
          skippedCount++;
          continue;
        }

        let teamId = r.teamIdRaw;
        if (!teamId) {
          const counter = await Counter.findByIdAndUpdate(
            `event_${currentYear}`,
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
          );
          const serial = String(counter.seq).padStart(3, '0');
          teamId = `HIET/CR/${currentYear}/${serial}`;
        }

        const teamSize = parseInt(r.rawTeamSize, 10) || (r.members.length + 1) || 1;

        await EventTeam.create({
          teamId,
          teamName: r.teamName,
          leader: {
            name: r.leaderName,
            email: r.leaderEmail,
            mobile: r.leaderMobile,
            whatsapp: r.leaderWhatsapp
          },
          college: r.college,
          branch: r.branch,
          year: r.year,
          event: eventKey,
          teamSize,
          members: r.members,
          status: 'verified',
          appliedAt: new Date(),
          exported: false
        });

        importedCount++;
      } catch (err) {
        errors.push(`Row ${r.rowNumber}: ${err.message}`);
      }
    }

    res.json({
      success: true,
      msg: `Excel Upload Successful! Imported ${importedCount} teams, updated ${skippedCount} existing records.`,
      importedCount,
      skippedCount,
      totalRows: rowsToProcess.length,
      errors: errors.slice(0, 5)
    });
  } catch (err) {
    console.error('Excel upload error:', err);
    res.status(500).json({ msg: 'Failed to process Excel upload', error: err.message });
  }
};

// Conditional Email Sender via EmailLog + Round Robin (TO: leader, CC: all team members in unified format)
const sendConditionalEmail = async (req, res) => {
  try {
    const {
      filter = {},
      subject,
      headline,
      message,
      ctaText,
      ctaLink,
      urgency = 'normal',
      previewOnly = false
    } = req.body;

    const query = buildRegistrationFilterQuery(filter);
    const matchedTeams = await EventTeam.find(query).lean();

    const uniqueRecipientSet = new Set();
    const validTeams = [];

    matchedTeams.forEach((t) => {
      const leaderEmail = t.leader?.email?.trim();
      if (!leaderEmail) return;
      validTeams.push(t);
      uniqueRecipientSet.add(leaderEmail.toLowerCase());
      getUniqueMemberEmails(t).forEach((mEmail) => {
        uniqueRecipientSet.add(mEmail.toLowerCase());
      });
    });

    if (previewOnly) {
      return res.json({
        totalMatchedTeams: validTeams.length,
        totalRecipients: uniqueRecipientSet.size,
        sampleRecipients: validTeams.slice(0, 6).map((t) => ({
          name: t.leader.name,
          email: t.leader.email.trim(),
          ccCount: getUniqueMemberEmails(t).length,
          teamName: t.teamName,
          teamId: t.teamId,
          eventDisplay: getEventDisplay(t.event)
        }))
      });
    }

    if (validTeams.length === 0) {
      return res.status(400).json({ msg: 'No recipients match the specified conditions' });
    }

    if (!subject || !message) {
      return res.status(400).json({ msg: 'Subject and message are required' });
    }

    let accentColor = '#C69B43';
    let badgeText = 'OFFICIAL COMMUNICATION';
    if (urgency === 'urgent') {
      accentColor = '#DC2626';
      badgeText = 'URGENT NOTIFICATION';
    } else if (urgency === 'important') {
      accentColor = '#D97706';
      badgeText = 'IMPORTANT UPDATE';
    }

    const payloads = validTeams.map((team) => {
      const leaderEmail = team.leader.email.trim();
      const ccMembers = getUniqueMemberEmails(team);
      const formattedHtml = buildUnifiedAdminDispatchHtml(team, {
        headline: headline || `${BRAND_NAME} — Important Update`,
        message,
        badgeText,
        accentColor,
        ctaText,
        ctaLink
      });

      return {
        category: 'conditional_email',
        to: [leaderEmail],
        cc: ccMembers,
        subject,
        html: formattedHtml,
        teamId: team.teamId,
        teamRef: team._id,
        event: team.event
      };
    });

    const batchResult = await enqueueBatchEmails(payloads);

    res.json({
      success: true,
      msg: `Conditional emails logged for ${validTeams.length} team(s) (${uniqueRecipientSet.size} total participants incl. CC)! Sent: ${batchResult.sent}, Queued: ${batchResult.remainingQueued}, Failed: ${batchResult.failed}.`,
      sentCount: batchResult.sent,
      failedCount: batchResult.failed,
      remainingQueued: batchResult.remainingQueued,
      totalMatchedTeams: validTeams.length,
      totalRecipients: uniqueRecipientSet.size
    });
  } catch (err) {
    console.error('Conditional email error:', err);
    res.status(500).json({ msg: 'Failed to send conditional emails', error: err.message });
  }
};

// Centralized Broadcast System via EmailLog Queue & Round Robin (TO: leader, CC: all members in unified format)
const sendBroadcast = async (req, res) => {
  try {
    const {
      title,
      message,
      target = 'all',
      targetCollege = 'all',
      channel = 'email',
      urgency = 'normal',
      showOnWebsite = false
    } = req.body;

    if (!title || !message) {
      return res.status(400).json({ msg: 'Broadcast title and message are required' });
    }

    let recipientsCount = 0;
    let queueStats = { sent: 0, remainingQueued: 0, failed: 0 };

    if (channel === 'email' || channel === 'both') {
      const filterInput = {};
      if (target && target !== 'all') {
        if (target === 'technical' || target === 'cultural') filterInput.track = target;
        else if (target !== 'college') filterInput.event = target;
      }
      if (targetCollege && targetCollege !== 'all') {
        filterInput.specificCollege = targetCollege;
      }

      const query = buildRegistrationFilterQuery(filterInput);
      const teams = await EventTeam.find(query).lean();

      const validTeams = teams.filter((t) => Boolean(t.leader?.email?.trim()));
      const uniqueEmails = new Set();
      validTeams.forEach((t) => {
        uniqueEmails.add(t.leader.email.trim().toLowerCase());
        getUniqueMemberEmails(t).forEach((em) => uniqueEmails.add(em.toLowerCase()));
      });
      recipientsCount = uniqueEmails.size;

      if (validTeams.length > 0) {
        let accentColor = '#C69B43';
        let badgeText = 'OFFICIAL FEST BROADCAST';
        if (urgency === 'urgent') {
          accentColor = '#DC2626';
          badgeText = 'URGENT FEST BROADCAST';
        } else if (urgency === 'important') {
          accentColor = '#D97706';
          badgeText = 'IMPORTANT FEST BROADCAST';
        }

        const payloads = validTeams.map((team) => {
          const leaderEmail = team.leader.email.trim();
          const ccMembers = getUniqueMemberEmails(team);
          const htmlDoc = buildUnifiedAdminDispatchHtml(team, {
            headline: title,
            message,
            badgeText,
            accentColor,
            ctaText: `Open ${BRAND_NAME} Portal`,
            ctaLink: `${FRONTEND_URL}/events`
          });

          return {
            category: 'broadcast',
            to: [leaderEmail],
            cc: ccMembers,
            subject: `[BROADCAST] ${title}`,
            html: htmlDoc,
            teamId: team.teamId,
            teamRef: team._id,
            event: team.event
          };
        });

        queueStats = await enqueueBatchEmails(payloads);
      }
    }

    if (showOnWebsite || channel === 'website_banner' || channel === 'both') {
      const settings = await SiteSetting.getSettings();
      settings.broadcastBanner = {
        enabled: true,
        text: title + ': ' + message.substring(0, 160) + (message.length > 160 ? '...' : ''),
        link: '/events',
        level: urgency === 'urgent' ? 'urgent' : urgency === 'important' ? 'warning' : 'info'
      };
      await settings.save();
      SiteSetting.invalidateCache();
    }

    const broadcastRecord = await Broadcast.create({
      title,
      message,
      target,
      targetCollege,
      channel,
      urgency,
      showOnWebsite: showOnWebsite || channel === 'website_banner' || channel === 'both',
      recipientsCount,
      createdBy: req.user?.username || 'Admin'
    });

    res.json({
      success: true,
      msg: `Broadcast logged for ${recipientsCount} participant(s) (Leader TO + Members CC)! Sent immediately: ${queueStats.sent}, Queued: ${queueStats.remainingQueued}, Failed: ${queueStats.failed}.`,
      broadcast: broadcastRecord,
      queueStats
    });
  } catch (err) {
    console.error('Broadcast error:', err);
    res.status(500).json({ msg: 'Broadcast publication failed', error: err.message });
  }
};

// Get broadcast history
const getBroadcasts = async (req, res) => {
  try {
    const broadcasts = await Broadcast.find().sort({ createdAt: -1 }).limit(30);
    res.json(broadcasts);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Delete broadcast
const deleteBroadcast = async (req, res) => {
  try {
    await Broadcast.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Broadcast deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Website Controls & Settings
const getSettings = async (req, res) => {
  try {
    const settings = await SiteSetting.getSettings();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to load settings', error: err.message });
  }
};

const updateSettings = async (req, res) => {
  try {
    let settings = await SiteSetting.getSettings();
    const { registrationOpen, closedMessage, eventStatus, broadcastBanner, authorityContacts } = req.body;

    if (registrationOpen !== undefined) settings.registrationOpen = registrationOpen;
    if (closedMessage !== undefined) settings.closedMessage = closedMessage;
    if (eventStatus !== undefined) settings.eventStatus = eventStatus;
    if (broadcastBanner !== undefined) settings.broadcastBanner = broadcastBanner;
    if (authorityContacts !== undefined) settings.authorityContacts = authorityContacts;

    await settings.save();
    SiteSetting.invalidateCache();
    res.json({ msg: 'Website settings updated successfully', settings });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to update settings', error: err.message });
  }
};

const REPORT_TYPE_META = {
  executive_summary: {
    badge: 'EXECUTIVE REGISTRATION REPORT',
    subtitlePrefix: 'Comprehensive Status & Breakdown',
    gradient: 'linear-gradient(135deg,#0f172a 0%,#1e3a8a 52%,#0284c7 100%)',
    accent: '#0284c7',
    defaultSalutation: 'Respected Sir / Ma’am,'
  },
  event_roster: {
    badge: 'EVENT-WISE REGISTRATION ROSTER',
    subtitlePrefix: 'Arena-Wise Teams & Participant Details',
    gradient: 'linear-gradient(135deg,#0f172a 0%,#0f766e 55%,#0284c7 100%)',
    accent: '#0d9488',
    defaultSalutation: 'Dear Coordinator / Recipient,'
  },
  college_digest: {
    badge: 'COLLEGE PARTICIPATION DIGEST',
    subtitlePrefix: 'Institution-Wise Teams & Student Count',
    gradient: 'linear-gradient(135deg,#0f172a 0%,#312e81 55%,#0284c7 100%)',
    accent: '#4f46e5',
    defaultSalutation: 'Dear Team / Recipient,'
  },
  today_snapshot: {
    badge: 'TODAY’S LIVE REGISTRATION SNAPSHOT',
    subtitlePrefix: 'Daily Registrations Digest (IST)',
    gradient: 'linear-gradient(135deg,#064e3b 0%,#047857 52%,#0284c7 100%)',
    accent: '#059669',
    defaultSalutation: 'Respected Sir / Ma’am,'
  },
  authority_digest: {
    badge: 'OFFICIAL STAKEHOLDER DOSSIER (HOD / DIRECTOR)',
    subtitlePrefix: 'Official Fest Status Briefing & Master Sheet',
    gradient: 'linear-gradient(135deg,#0f172a 0%,#1e3a8a 50%,#0369a1 100%)',
    accent: '#1d4ed8',
    defaultSalutation: 'Respected HOD Sir / Director Sir & Core Committee,'
  }
};

/**
 * Shared responsive Registration Report / Official Stakeholder Dossier builder & dispatcher.
 * Powers `/api/admin/send-registration-report`, `/api/admin/send-authority-report`,
 * and `/api/admin/send-stakeholder-report`, persisting full EmailLog audit & retry metadata.
 */
const handleRegistrationReportDispatch = async (req, res, isLegacyOrStakeholder = false) => {
  try {
    const {
      toEmails,
      directorEmail,
      ccEmails = [],
      bccEmails = [],
      dossierToHod = false,
      reportType = isLegacyOrStakeholder ? 'authority_digest' : 'executive_summary',
      track = 'all',
      event = 'all',
      collegeType = 'all',
      specificCollege = 'all',
      branch = 'all',
      year = 'all',
      teamType = 'all',
      dateFrom = '',
      dateTo = '',
      subject = '',
      salutation = '',
      remarks = '',
      attachExcel = true,
      includeRosterTable = true,
      preferredSmtpUser = '',
      replyTo = '',
      previewHtmlOnly = false
    } = req.body || {};

    const meta = REPORT_TYPE_META[reportType] || REPORT_TYPE_META.executive_summary;

    const filterInput = {
      event: event && event !== 'all' ? event : undefined,
      track: (!event || event === 'all') && track !== 'all' ? track : undefined,
      collegeType,
      specificCollege,
      branch,
      year,
      teamType,
      dateFrom,
      dateTo
    };

    const query = buildRegistrationFilterQuery(filterInput);
    let istDayRange = null;
    if (reportType === 'today_snapshot' && !dateFrom && !dateTo) {
      istDayRange = getIstTodayRange();
      query.appliedAt = { $gte: istDayRange.start, $lt: istDayRange.end };
    }

    const teams = await EventTeam.find(query).sort({ appliedAt: -1 }).lean();
    const stats = computeAggregations(teams);
    const scopeLabel = specificCollege && specificCollege !== 'all'
      ? specificCollege
      : event && event !== 'all'
        ? getEventDisplay(event)
        : track && track !== 'all'
          ? `${track.toUpperCase()} Track`
          : 'All Events & Colleges';

    const eventRowsHtml = stats.eventWise
      .map((ev) => {
        const pct = stats.total > 0 ? Math.round((ev.count / stats.total) * 100) : 0;
        return `
          <tr>
            <td style="padding:9px 10px; border-bottom:1px solid #e2e8f0; font-weight:600; color:#0f172a; font-size:13px;">${escapeHtml(ev.eventName)}</td>
            <td style="padding:9px 8px; border-bottom:1px solid #e2e8f0; text-align:center; font-size:12px; color:#475569;">${escapeHtml(ev.track)}</td>
            <td style="padding:9px 8px; border-bottom:1px solid #e2e8f0; text-align:center; font-weight:700; color:#1d4ed8; font-size:13px;">${ev.teamsCount}</td>
            <td style="padding:9px 8px; border-bottom:1px solid #e2e8f0; text-align:center; font-weight:700; color:#047857; font-size:13px;">${ev.studentsCount}</td>
            <td style="padding:9px 8px; border-bottom:1px solid #e2e8f0; text-align:center; color:#334155; font-size:13px;">${ev.collegesCount}</td>
            <td style="padding:9px 8px; border-bottom:1px solid #e2e8f0; text-align:center; color:#475569; font-size:12px;">${pct}%</td>
          </tr>
        `;
      })
      .join('');

    const collegeRowsHtml = stats.allColleges
      .slice(0, 25)
      .map((col, idx) => `
        <tr>
          <td style="padding:8px 8px; border-bottom:1px solid #e2e8f0; text-align:center; color:#64748b; font-size:12px;">${idx + 1}</td>
          <td style="padding:8px 10px; border-bottom:1px solid #e2e8f0; color:#0f172a; font-weight:600; font-size:12.5px;">${escapeHtml(col.college)}</td>
          <td style="padding:8px 8px; border-bottom:1px solid #e2e8f0; text-align:center; font-weight:700; color:#1d4ed8; font-size:13px;">${col.teamsCount}</td>
          <td style="padding:8px 8px; border-bottom:1px solid #e2e8f0; text-align:center; font-weight:700; color:#047857; font-size:13px;">${col.studentsCount}</td>
          <td style="padding:8px 10px; border-bottom:1px solid #e2e8f0; color:#475569; font-size:12px;">${escapeHtml(col.events.join(', '))}</td>
        </tr>
      `)
      .join('');

    const isSpecificEvent = event && event !== 'all';
    const shouldRenderRoster =
      teams.length > 0 &&
      (isSpecificEvent || reportType === 'event_roster' || reportType === 'today_snapshot' || includeRosterTable);
    const rosterSlice = teams.slice(0, 120);
    const rosterTruncated = teams.length - rosterSlice.length;

    const rosterRowsHtml = rosterSlice
      .map((t) => {
        const membersText = (t.members || []).map((m) => `${m.name} (${m.email})`).join(', ');
        return `
          <tr>
            <td style="padding:8px; border-bottom:1px solid #e2e8f0; font-family:monospace; font-size:11.5px; color:#1e3a8a; font-weight:700;">${escapeHtml(t.teamId)}</td>
            <td style="padding:8px; border-bottom:1px solid #e2e8f0; font-size:12.5px; font-weight:600; color:#0f172a;">
              ${escapeHtml(t.teamName)}
              <div style="font-size:11px; color:#0284c7; font-weight:600;">${escapeHtml(getEventDisplay(t.event))}</div>
            </td>
            <td style="padding:8px; border-bottom:1px solid #e2e8f0; font-size:12px; color:#334155;">
              <strong>${escapeHtml(t.leader?.name)}</strong><br />
              <span style="color:#64748b; font-size:11px;">${escapeHtml(t.leader?.email)} &bull; ${escapeHtml(t.leader?.mobile)}</span>
            </td>
            <td style="padding:8px; border-bottom:1px solid #e2e8f0; font-size:12px; color:#334155;">
              ${escapeHtml(t.college)}<br />
              <span style="color:#64748b; font-size:11px;">${escapeHtml(t.branch)} &bull; ${escapeHtml(t.year)}</span>
            </td>
            <td style="padding:8px; border-bottom:1px solid #e2e8f0; text-align:center; font-weight:700; color:#047857; font-size:12.5px;">
              ${t.teamSize || 1}
              ${membersText ? `<div style="font-size:10.5px; color:#64748b; font-weight:400; text-align:left; margin-top:2px;">${escapeHtml(membersText)}</div>` : ''}
            </td>
          </tr>
        `;
      })
      .join('');

    const showEventWiseTable = reportType !== 'college_digest' && (!isSpecificEvent || stats.eventWise.length > 0);
    const showCollegeTable = reportType === 'college_digest' || reportType === 'executive_summary' || reportType === 'authority_digest';

    const bodyHtml = `
      <p style="font-size:15px; margin:0 0 8px; color:#E8DFC8; font-weight:700;">
        ${escapeHtml(salutation || meta.defaultSalutation)}
      </p>
      <div style="margin:0 0 14px; padding:10px 12px; background-color:#0B140F; border-left:3px solid #C69B43;">
        <div style="font-size:11px; font-weight:800; letter-spacing:1.4px; color:#E8C574; text-transform:uppercase;">
          ${BRAND_NAME} &bull; THE LOST CIVILIZATION
        </div>
        <div style="font-size:12px; font-weight:700; color:#C7BFA9; margin-top:2px;">
          "${THEME_TAGLINE}"
        </div>
      </div>
      <p style="font-size:14px; line-height:1.65; color:#C7BFA9; margin:0 0 16px;">
        Here is the official registration dossier for <strong style="color:#E8C574;">${BRAND_NAME}</strong> covering
        <strong style="color:#6EE7B7;">${escapeHtml(scopeLabel)}</strong> as of
        <strong>${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })} IST</strong>.
      </p>

      ${remarks ? `
        <div style="margin:0 0 18px; padding:12px 14px; background:#0B140F; border-left:3px solid #C69B43; border-radius:4px;">
          <div style="font-size:10.5px; font-weight:800; text-transform:uppercase; letter-spacing:0.8px; color:#E8C574;">Coordinator Note</div>
          <p style="margin:5px 0 0; font-size:13.5px; color:#E8DFC8; line-height:1.6; white-space:pre-wrap;">${escapeHtml(remarks)}</p>
        </div>
      ` : ''}

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; margin:0 0 18px;">
        <tr>
          <td class="kpi-col" width="25%" style="padding:0 4px 0 0; vertical-align:top;">
            <div style="background:#0B140F; border:1px solid #3A4D3E; border-radius:6px; padding:10px 6px; text-align:center;">
              <div style="font-size:10px; color:#E8C574; font-weight:700; text-transform:uppercase;">Total Teams</div>
              <div style="font-size:22px; font-weight:800; color:#E8DFC8; margin-top:3px;">${stats.totalTeams}</div>
            </div>
          </td>
          <td class="kpi-col" width="25%" style="padding:0 4px; vertical-align:top;">
            <div style="background:#0B140F; border:1px solid #2E6F4E; border-radius:6px; padding:10px 6px; text-align:center;">
              <div style="font-size:10px; color:#6EE7B7; font-weight:700; text-transform:uppercase;">Total Students</div>
              <div style="font-size:22px; font-weight:800; color:#6EE7B7; margin-top:3px;">${stats.totalStudents}</div>
            </div>
          </td>
          <td class="kpi-col" width="25%" style="padding:0 4px; vertical-align:top;">
            <div style="background:#0B140F; border:1px solid #594622; border-radius:6px; padding:10px 6px; text-align:center;">
              <div style="font-size:10px; color:#E8C574; font-weight:700; text-transform:uppercase;">Total Colleges</div>
              <div style="font-size:22px; font-weight:800; color:#E8C574; margin-top:3px;">${stats.totalColleges}</div>
            </div>
          </td>
          <td class="kpi-col" width="25%" style="padding:0 0 0 4px; vertical-align:top;">
            <div style="background:#0B140F; border:1px solid #6E3613; border-radius:6px; padding:10px 6px; text-align:center;">
              <div style="font-size:10px; color:#F2B57E; font-weight:700; text-transform:uppercase;">Today (IST)</div>
              <div style="font-size:22px; font-weight:800; color:#F2B57E; margin-top:3px;">${stats.today}</div>
            </div>
          </td>
        </tr>
      </table>

      ${showEventWiseTable ? `
        <div style="margin:0 0 20px;">
          <h3 style="margin:0 0 8px; font-size:14px; color:#E8C574; border-bottom:1px solid #3A4D3E; padding-bottom:5px; text-transform:uppercase;">
            Event-Wise Registration Breakdown
          </h3>
          <div style="width:100%; overflow-x:auto;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; border:1px solid #2D3F32; background:#ffffff;">
              <thead>
                <tr style="background:#0B140F; color:#E8C574; text-align:left;">
                  <th style="padding:9px 10px; font-size:11.5px;">Event Arena</th>
                  <th style="padding:9px 8px; font-size:11.5px; text-align:center;">Track</th>
                  <th style="padding:9px 8px; font-size:11.5px; text-align:center;">Teams</th>
                  <th style="padding:9px 8px; font-size:11.5px; text-align:center;">Students</th>
                  <th style="padding:9px 8px; font-size:11.5px; text-align:center;">Colleges</th>
                  <th style="padding:9px 8px; font-size:11.5px; text-align:center;">Share</th>
                </tr>
              </thead>
              <tbody>
                ${eventRowsHtml || '<tr><td colspan="6" style="padding:14px; text-align:center; color:#64748b; font-size:13px;">No registrations match this scope.</td></tr>'}
                ${stats.eventWise.length > 0 ? `
                  <tr style="background:#f8fafc; font-weight:700;">
                    <td style="padding:9px 10px; color:#0f172a; font-size:12.5px;">GRAND TOTAL</td>
                    <td style="padding:9px 8px; text-align:center; color:#475569; font-size:12px;">All</td>
                    <td style="padding:9px 8px; text-align:center; color:#1d4ed8; font-size:13px;">${stats.totalTeams}</td>
                    <td style="padding:9px 8px; text-align:center; color:#047857; font-size:13px;">${stats.totalStudents}</td>
                    <td style="padding:9px 8px; text-align:center; color:#6d28d9; font-size:13px;">${stats.totalColleges}</td>
                    <td style="padding:9px 8px; text-align:center; color:#0f172a; font-size:12px;">100%</td>
                  </tr>
                ` : ''}
              </tbody>
            </table>
          </div>
        </div>
      ` : ''}

      ${showCollegeTable ? `
        <div style="margin:0 0 20px;">
          <h3 style="margin:0 0 8px; font-size:14px; color:#E8C574; border-bottom:1px solid #3A4D3E; padding-bottom:5px; text-transform:uppercase;">
            College-Wise Participation &amp; Student Count ${stats.allColleges.length > 25 ? `(Top 25 of ${stats.allColleges.length})` : ''}
          </h3>
          <div style="width:100%; overflow-x:auto;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; border:1px solid #2D3F32; background:#ffffff;">
              <thead>
                <tr style="background:#182B20; color:#E8C574; text-align:left;">
                  <th style="padding:8px; font-size:11.5px; text-align:center;">#</th>
                  <th style="padding:8px 10px; font-size:11.5px;">College / Institution</th>
                  <th style="padding:8px; font-size:11.5px; text-align:center;">Teams</th>
                  <th style="padding:8px; font-size:11.5px; text-align:center;">Students</th>
                  <th style="padding:8px 10px; font-size:11.5px;">Events Participated</th>
                </tr>
              </thead>
              <tbody>
                ${collegeRowsHtml || '<tr><td colspan="5" style="padding:14px; text-align:center; color:#64748b; font-size:13px;">No college data available.</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>
      ` : ''}

      ${shouldRenderRoster ? `
        <div style="margin:0 0 18px;">
          <h3 style="margin:0 0 8px; font-size:14px; color:#E8C574; border-bottom:1px solid #3A4D3E; padding-bottom:5px; text-transform:uppercase;">
            Registered Teams &amp; Participant Roster (${escapeHtml(scopeLabel)})
          </h3>
          <div style="width:100%; overflow-x:auto;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; border:1px solid #2D3F32; background:#ffffff;">
              <thead>
                <tr style="background:#0B140F; color:#E8C574; text-align:left;">
                  <th style="padding:8px; font-size:11.5px;">Team ID</th>
                  <th style="padding:8px; font-size:11.5px;">Team &amp; Event</th>
                  <th style="padding:8px; font-size:11.5px;">Team Leader</th>
                  <th style="padding:8px; font-size:11.5px;">Institution</th>
                  <th style="padding:8px; font-size:11.5px; text-align:center;">Size &amp; Members</th>
                </tr>
              </thead>
              <tbody>
                ${rosterRowsHtml}
              </tbody>
            </table>
          </div>
          ${rosterTruncated > 0 ? `
            <p style="margin:8px 0 0; font-size:12px; color:#C7BFA9; font-style:italic;">
              Showing ${rosterSlice.length} of ${teams.length} teams in email body. See the attached Excel workbook for all ${teams.length} teams.
            </p>
          ` : ''}
        </div>
      ` : ''}

      ${attachExcel && teams.length > 0 ? `
        <div style="margin:0; padding:12px 14px; background:#0B140F; border:1px solid #2E6F4E; border-radius:6px; font-size:12.5px; color:#A7F3D0;">
          <strong>Attached Master Excel Workbook (.xlsx):</strong> Includes Executive Summary, Overall All-Teams sheet, and Event-Wise tabs.
        </div>
      ` : ''}
    `;

    const reportHtml = buildResponsiveEmailDocument({
      badgeText: meta.badge,
      title: BRAND_NAME,
      accentColor: '#C69B43',
      bodyHtml
    });

    const slug = (event && event !== 'all' ? event : track && track !== 'all' ? track : 'All')
      .replace(/[^a-zA-Z0-9_-]/g, '_');
    const attachmentFilename = `CROSSROADS_2027_${slug}_Dossier_${new Date().toISOString().split('T')[0]}.xlsx`;
    const resolvedSubject =
      subject?.trim() ||
      `${BRAND_NAME} – ${meta.badge} [${scopeLabel}]`;

    if (previewHtmlOnly) {
      return res.json({
        success: true,
        html: reportHtml,
        subject: resolvedSubject,
        attachmentFilename,
        stats: {
          totalTeams: stats.totalTeams,
          totalStudents: stats.totalStudents,
          totalColleges: stats.totalColleges,
          today: stats.today
        }
      });
    }

    const settings = await SiteSetting.getSettings();
    let finalToList = parseEmailList(toEmails);
    let validCc = parseEmailList(ccEmails);

    if (dossierToHod) {
      if (finalToList.length === 0) {
        finalToList = parseEmailList(settings.authorityContacts?.hodCseEmail || 'ag902065@gmail.com');
      }
      const autoCc = parseEmailList([
        settings.authorityContacts?.directorEmail || 'ag0567688@gmail.com',
        IDENTITY.email
      ]);
      autoCc.forEach((em) => {
        if (!finalToList.some((t) => t.toLowerCase() === em.toLowerCase()) &&
            !validCc.some((c) => c.toLowerCase() === em.toLowerCase())) {
          validCc.push(em);
        }
      });
    } else {
      if (finalToList.length === 0 && directorEmail) {
        finalToList = parseEmailList(directorEmail);
      }
      if (finalToList.length === 0 && isLegacyOrStakeholder) {
        finalToList = parseEmailList(settings.authorityContacts?.hodCseEmail || settings.authorityContacts?.directorEmail || 'ag902065@gmail.com');
      }
      if (isLegacyOrStakeholder && validCc.length === 0) {
        validCc = parseEmailList(settings.authorityContacts?.directorEmail || 'ag0567688@gmail.com');
      }
    }

    if (finalToList.length === 0) {
      return res.status(400).json({ msg: 'Please enter at least one valid recipient (To) email address' });
    }

    const validBcc = parseEmailList(bccEmails);

    const logResult = await enqueueEmail(
      {
        category: isLegacyOrStakeholder || dossierToHod ? 'stakeholder_report' : 'registration_report',
        to: finalToList,
        cc: validCc,
        bcc: validBcc,
        replyTo: replyTo && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(replyTo.trim()) ? replyTo.trim() : '',
        subject: resolvedSubject,
        html: reportHtml,
        preferredSmtpUser: preferredSmtpUser && preferredSmtpUser !== 'auto' ? preferredSmtpUser : '',
        hasAttachment: Boolean(attachExcel && teams.length > 0),
        attachmentFilename,
        reportParams: attachExcel
          ? {
              attachExcel: true,
              filterInput,
              istDayRange,
              scopeLabel
            }
          : null
      },
      { sendImmediately: true }
    );

    if (!logResult.success) {
      return res.status(502).json({
        msg: `Dossier queued & failed (${logResult.error}). Logged in Email Queue & Logs for 1-click retry.`,
        logId: logResult.log?._id
      });
    }

    res.json({
      success: true,
      msg: `Official report dispatched to ${finalToList.join(', ')}${validCc.length > 0 ? ` (CC: ${validCc.join(', ')})` : ''} via ${logResult.sentVia}.`,
      to: finalToList,
      ccList: validCc,
      bccList: validBcc,
      sentVia: logResult.sentVia,
      logId: logResult.log?._id,
      teamsCount: stats.totalTeams,
      studentsCount: stats.totalStudents,
      collegesCount: stats.totalColleges
    });
  } catch (err) {
    console.error('Registration report dispatch error:', err);
    res.status(500).json({ msg: 'Failed to send registration report', error: err.message });
  }
};

const sendRegistrationReport = (req, res) => handleRegistrationReportDispatch(req, res, false);
const sendAuthorityReport = (req, res) => handleRegistrationReportDispatch(req, res, true);
const sendStakeholderReport = (req, res) => handleRegistrationReportDispatch(req, res, true);

// Email Queue & Audit Logs Endpoints
const getEmailLogs = async (req, res) => {
  try {
    const { status = 'all', category = 'all', search = '', limit = 100 } = req.query;
    const query = {};
    if (status && status !== 'all') query.status = status;
    if (category && category !== 'all') query.category = category;
    if (search && String(search).trim()) {
      const rx = new RegExp(String(search).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      query.$or = [
        { to: rx },
        { cc: rx },
        { subject: rx },
        { teamId: rx },
        { sentVia: rx },
        { lastError: rx }
      ];
    }

    const cappedLimit = Math.min(Math.max(parseInt(limit, 10) || 100, 1), 300);

    const [logs, statsFacet] = await Promise.all([
      EmailLog.find(query)
        .sort({ createdAt: -1 })
        .limit(cappedLimit)
        .select('-reportParams')
        .lean(),
      EmailLog.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    const counts = { total: 0, queued: 0, sending: 0, sent: 0, failed: 0 };
    statsFacet.forEach((s) => {
      counts[s._id] = s.count;
      counts.total += s.count;
    });

    res.json({ logs, stats: counts });
  } catch (err) {
    console.error('Email logs fetch error:', err);
    res.status(500).json({ msg: 'Failed to load email logs', error: err.message });
  }
};

const resendEmailLog = async (req, res) => {
  try {
    const result = await resendEmailLogById(req.params.id);
    if (!result) {
      return res.status(404).json({ msg: 'Email log record not found' });
    }
    if (!result.success) {
      return res.status(502).json({
        success: false,
        msg: `Resend failed: ${result.error}`,
        log: result.log
      });
    }
    res.json({
      success: true,
      msg: `Email resent successfully to ${(result.log?.to || []).join(', ')} via ${result.sentVia}`,
      log: result.log,
      sentVia: result.sentVia
    });
  } catch (err) {
    console.error('Resend email log error:', err);
    res.status(500).json({ msg: 'Failed to resend email', error: err.message });
  }
};

const processEmailQueueNow = async (req, res) => {
  try {
    const batchSize = Math.min(Math.max(parseInt(req.body?.batchSize || req.query?.batchSize, 10) || 15, 1), 50);
    const result = await processPendingEmailQueue(batchSize);
    res.json({
      success: true,
      msg: `Processed ${result.processed} queued email(s): ${result.sent} sent, ${result.failed} failed (${result.remainingQueued ?? 0} remaining).`,
      ...result
    });
  } catch (err) {
    console.error('Queue drain error:', err);
    res.status(500).json({ msg: 'Failed to process pending email queue', error: err.message });
  }
};

module.exports = {
  login,
  getSmtpStatus,
  getAnalytics,
  getDashboardStats,
  getAdvancedInsights,
  getTeams,
  getAllRegistrations,
  getTeamById,
  updateTeam,
  updateRegistrationStatus,
  deleteTeam,
  resendConfirmationEmail,
  sendBulkConfirmations,
  exportExcel,
  uploadExcel,
  sendConditionalEmail,
  sendBroadcast,
  getBroadcasts,
  deleteBroadcast,
  getSettings,
  updateSettings,
  sendAuthorityReport,
  sendRegistrationReport,
  sendStakeholderReport,
  getEmailLogs,
  resendEmailLog,
  processEmailQueueNow
};
