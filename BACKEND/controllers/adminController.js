// controllers/adminController.js
const EventTeam = require('../models/EventTeam');
const Counter = require('../models/Counter');
const SiteSetting = require('../models/SiteSetting');
const Broadcast = require('../models/Broadcast');
const jwt = require('jsonwebtoken');
const ExcelJS = require('exceljs');
const {
  sendMailRoundRobin,
  sendTeamConfirmationWithMembersCc,
  EVENT_DISPLAY_NAMES,
  getEventDisplay,
  transporters
} = require('../utils/mailer');

// Admin Login
const login = (req, res) => {
  const { username, password } = req.body;
  
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ role: 'admin', username }, process.env.JWT_SECRET, { expiresIn: '12h' });
    return res.json({ token, username });
  }
  res.status(401).json({ msg: 'Invalid credentials' });
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

// Analytics Dashboard Data
const getAnalytics = async (req, res) => {
  try {
    const totalTeams = await EventTeam.countDocuments();

    // Today's registrations
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    const todayCount = await EventTeam.countDocuments({
      appliedAt: { $gte: todayStart, $lt: todayEnd }
    });

    // Total participants (sum of teamSize)
    const participantsAgg = await EventTeam.aggregate([
      { $group: { _id: null, totalParticipants: { $sum: '$teamSize' } } }
    ]);
    const totalParticipants = participantsAgg[0]?.totalParticipants || totalTeams;

    // Event-wise aggregation
    const eventWise = await EventTeam.aggregate([
      { 
        $group: { 
          _id: '$event', 
          count: { $sum: 1 }, 
          participants: { $sum: '$teamSize' },
          details: { $push: '$$ROOT' } 
        } 
      },
      { $sort: { count: -1 } }
    ]);

    // Track Breakdown (Technical vs Cultural)
    const technicalEvents = ['code-puzzle', 'project-exhibition', 'robo-race', 'technical-poster'];
    let technicalCount = 0;
    let culturalCount = 0;

    eventWise.forEach(e => {
      if (technicalEvents.includes(e._id)) {
        technicalCount += e.count;
      } else {
        culturalCount += e.count;
      }
    });

    // College distribution (Top colleges)
    const collegeWise = await EventTeam.aggregate([
      { $group: { _id: '$college', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 }
    ]);

    res.json({
      total: totalTeams,
      today: todayCount,
      totalParticipants,
      technicalCount,
      culturalCount,
      eventWise,
      collegeWise
    });
  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({ msg: 'Server error fetching analytics', error: err.message });
  }
};

// Fetch filtered teams list
const getTeams = async (req, res) => {
  try {
    const { event, search, college, dateFrom, dateTo, status } = req.query;
    let query = {};

    if (event && event !== 'all') {
      query.event = event;
    }

    if (status === 'exported') {
      query.exported = true;
    } else if (status === 'unexported') {
      query.exported = false;
    }

    if (college && college !== 'all') {
      if (college === 'hiet') {
        query.college = { $regex: /hi-?tech|hiet/i };
      } else if (college === 'outside') {
        query.college = { $not: { $regex: /hi-?tech|hiet/i } };
      } else {
        query.college = college;
      }
    }

    if (dateFrom || dateTo) {
      query.appliedAt = {};
      if (dateFrom) query.appliedAt.$gte = new Date(dateFrom);
      if (dateTo) {
        const toD = new Date(dateTo);
        toD.setHours(23, 59, 59, 999);
        query.appliedAt.$lte = toD;
      }
    }

    if (search && search.trim()) {
      const term = search.trim();
      const regex = new RegExp(term, 'i');
      query.$or = [
        { teamId: regex },
        { teamName: regex },
        { 'leader.name': regex },
        { 'leader.email': regex },
        { 'leader.mobile': regex },
        { college: regex },
        { event: regex }
      ];
    }

    const teams = await EventTeam.find(query).sort({ appliedAt: -1 });
    res.json({ teams, total: teams.length });
  } catch (err) {
    console.error('Error fetching teams:', err);
    res.status(500).json({ msg: 'Error fetching teams', error: err.message });
  }
};

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

// Update team details
const updateTeam = async (req, res) => {
  try {
    const updated = await EventTeam.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ msg: 'Team not found' });
    res.json({ msg: 'Team updated successfully', team: updated });
  } catch (err) {
    res.status(500).json({ msg: err.message });
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

// Resend confirmation email to team (TO: leader, CC: all members) via Round Robin
const resendConfirmationEmail = async (req, res) => {
  try {
    const team = await EventTeam.findById(req.params.id);
    if (!team) return res.status(404).json({ msg: 'Team not found' });

    const result = await sendTeamConfirmationWithMembersCc(team, true);

    res.json({
      success: true,
      msg: `Confirmation email dispatched to Leader (${result.leaderEmail})${result.ccCount > 0 ? ` with ${result.ccCount} member(s) in CC` : ''} via Round Robin (${result.sentVia})`,
      leaderEmail: result.leaderEmail,
      ccCount: result.ccCount,
      ccList: result.ccList,
      sentVia: result.sentVia
    });
  } catch (err) {
    console.error('Resend email error:', err);
    res.status(500).json({ msg: 'Failed to send confirmation email', error: err.message });
  }
};

// Send bulk confirmation emails at any time (TO: leader, CC: members) via Round Robin
const sendBulkConfirmations = async (req, res) => {
  try {
    const { teamIds = [], filter = {} } = req.body;

    let query = {};
    if (Array.isArray(teamIds) && teamIds.length > 0) {
      query._id = { $in: teamIds };
    } else {
      if (filter.event && filter.event !== 'all') query.event = filter.event;
      if (filter.track && filter.track !== 'all') {
        const technicalEvents = ['code-puzzle', 'project-exhibition', 'robo-race', 'technical-poster'];
        if (filter.track === 'technical') query.event = { $in: technicalEvents };
        else if (filter.track === 'cultural') query.event = { $nin: technicalEvents };
      }
      if (filter.college && filter.college !== 'all') {
        if (filter.college === 'hiet') query.college = { $regex: /hi-?tech|hiet/i };
        else if (filter.college === 'outside') query.college = { $not: { $regex: /hi-?tech|hiet/i } };
      }
    }

    const targetTeams = await EventTeam.find(query);
    if (targetTeams.length === 0) {
      return res.status(404).json({ msg: 'No teams match the criteria for sending confirmations' });
    }

    let sentCount = 0;
    let failedCount = 0;

    for (const team of targetTeams) {
      try {
        await sendTeamConfirmationWithMembersCc(team, true);
        sentCount++;
      } catch (err) {
        console.warn(`Bulk confirmation failed for team ${team.teamId}:`, err.message);
        failedCount++;
      }
    }

    res.json({
      success: true,
      msg: `Bulk confirmations complete! Sent to ${sentCount} teams (Leader in TO, Members in CC) using Round Robin SMTP. Failed: ${failedCount}`,
      sentCount,
      failedCount,
      totalTeams: targetTeams.length
    });
  } catch (err) {
    console.error('Bulk confirmation error:', err);
    res.status(500).json({ msg: 'Failed to dispatch bulk confirmation emails', error: err.message });
  }
};

// Filter-wise Excel Export
const exportExcel = async (req, res) => {
  try {
    const { event, track, college, status, dateFrom, dateTo, search, markExported } = req.query;

    let query = {};
    if (event && event !== 'all') {
      query.event = event;
    } else if (track && track !== 'all') {
      const technicalEvents = ['code-puzzle', 'project-exhibition', 'robo-race', 'technical-poster'];
      if (track === 'technical') {
        query.event = { $in: technicalEvents };
      } else if (track === 'cultural') {
        query.event = { $nin: technicalEvents };
      }
    }

    if (status === 'unexported') {
      query.exported = false;
    } else if (status === 'exported') {
      query.exported = true;
    }

    if (college && college !== 'all') {
      if (college === 'hiet') {
        query.college = { $regex: /hi-?tech|hiet/i };
      } else if (college === 'outside') {
        query.college = { $not: { $regex: /hi-?tech|hiet/i } };
      } else {
        query.college = college;
      }
    }

    if (dateFrom || dateTo) {
      query.appliedAt = {};
      if (dateFrom) query.appliedAt.$gte = new Date(dateFrom);
      if (dateTo) {
        const toD = new Date(dateTo);
        toD.setHours(23, 59, 59, 999);
        query.appliedAt.$lte = toD;
      }
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { teamId: regex },
        { teamName: regex },
        { 'leader.name': regex },
        { 'leader.email': regex },
        { college: regex }
      ];
    }

    const teams = await EventTeam.find(query).sort({ appliedAt: -1 });

    if (teams.length === 0) {
      return res.status(404).json({ msg: 'No teams match the export filters' });
    }

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'CROSSROADS 2026 Admin';
    workbook.created = new Date();

    const headers = [
      'TEAM ID',
      'TEAM NAME',
      'EVENT NAME',
      'TEAM SIZE',
      'LEADER NAME',
      'LEADER EMAIL',
      'LEADER MOBILE',
      'LEADER WHATSAPP',
      'COLLEGE NAME',
      'BRANCH',
      'YEAR',
      'MEMBERS LIST',
      'REGISTERED DATE'
    ];

    const populateSheet = (sheet, teamList, sheetTitle) => {
      sheet.addRow([`CROSSROADS 2026 - ${sheetTitle}`]);
      sheet.mergeCells('A1:M1');
      const titleCell = sheet.getCell('A1');
      titleCell.font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
      titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E1B4B' } };
      titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
      sheet.getRow(1).height = 30;

      sheet.addRow([`Generated on: ${new Date().toLocaleString('en-IN')} | Total Teams: ${teamList.length}`]);
      sheet.mergeCells('A2:M2');
      const subCell = sheet.getCell('A2');
      subCell.font = { italic: true, size: 10, color: { argb: 'FF334155' } };
      subCell.alignment = { horizontal: 'center' };
      sheet.getRow(2).height = 20;

      sheet.addRow([]);

      sheet.addRow(headers);
      const headerRowIndex = 4;
      const headerRow = sheet.getRow(headerRowIndex);
      headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4338CA' } };
      headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
      headerRow.height = 25;

      teamList.forEach((team, idx) => {
        const membersStr = (team.members || []).map(m => `${m.name} (${m.email})`).join('; ') || 'Solo';
        const row = sheet.addRow([
          team.teamId,
          team.teamName,
          getEventDisplay(team.event),
          team.teamSize,
          team.leader?.name || '',
          team.leader?.email || '',
          team.leader?.mobile || '',
          team.leader?.whatsapp || '',
          team.college,
          team.branch,
          team.year,
          membersStr,
          team.appliedAt ? new Date(team.appliedAt).toLocaleDateString('en-IN') : ''
        ]);

        if (idx % 2 === 1) {
          row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
        }
      });

      sheet.columns = [
        { width: 22 },
        { width: 26 },
        { width: 28 },
        { width: 12 },
        { width: 22 },
        { width: 30 },
        { width: 16 },
        { width: 16 },
        { width: 32 },
        { width: 14 },
        { width: 14 },
        { width: 40 },
        { width: 18 }
      ];
    };

    const overallSheet = workbook.addWorksheet('Filtered Teams');
    populateSheet(overallSheet, teams, 'Filtered Teams Summary');

    const uniqueEvents = [...new Set(teams.map(t => t.event))];
    if (uniqueEvents.length > 1) {
      uniqueEvents.forEach(ev => {
        const evTeams = teams.filter(t => t.event === ev);
        const tabTitle = getEventDisplay(ev).substring(0, 28).replace(/[\/\\?*:[\]]/g, '');
        const evSheet = workbook.addWorksheet(tabTitle);
        populateSheet(evSheet, evTeams, getEventDisplay(ev));
      });
    }

    if (markExported === 'true' || markExported === true) {
      const ids = teams.map(t => t._id);
      await EventTeam.updateMany({ _id: { $in: ids } }, { $set: { exported: true } });
    }

    const filename = `CROSSROADS_2026_${event || track || 'Registrations'}_${new Date().toISOString().split('T')[0]}.xlsx`;
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

      const rowStr = values.map(v => String(v || '').toLowerCase().trim());
      const hasLeader = rowStr.some(v => v.includes('leader') || v.includes('name') || v.includes('student'));
      const hasEmailOrContact = rowStr.some(v => v.includes('email') || v.includes('mobile') || v.includes('phone'));

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
        if (keywords.some(k => header.includes(k))) {
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
      for (let m = 1; m <= 6; m++) {
        const mName = getColVal(row, [`member${m}name`, `member${m}`, `participant${m}`]);
        const mEmail = getColVal(row, [`member${m}email`]) || `${leaderEmail || 'member'}.${m}@crossroads.internal`;
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
          const matched = Object.keys(EVENT_DISPLAY_NAMES).find(k => cleanEv.includes(k) || k.includes(cleanEv));
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

// Conditional Email Sender via Round Robin
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

    let query = {};

    if (filter.event && filter.event !== 'all') {
      if (Array.isArray(filter.event)) {
        query.event = { $in: filter.event };
      } else {
        query.event = filter.event;
      }
    }

    if (filter.track && filter.track !== 'all') {
      const technicalEvents = ['code-puzzle', 'project-exhibition', 'robo-race', 'technical-poster'];
      if (filter.track === 'technical') {
        query.event = { $in: technicalEvents };
      } else if (filter.track === 'cultural') {
        query.event = { $nin: technicalEvents };
      }
    }

    if (filter.collegeType && filter.collegeType !== 'all') {
      if (filter.collegeType === 'hiet') {
        query.college = { $regex: /hi-?tech|hiet/i };
      } else if (filter.collegeType === 'outside') {
        query.college = { $not: { $regex: /hi-?tech|hiet/i } };
      } else if (filter.specificCollege) {
        query.college = filter.specificCollege;
      }
    }

    if (filter.branch && filter.branch !== 'all') {
      query.branch = filter.branch;
    }
    if (filter.year && filter.year !== 'all') {
      query.year = filter.year;
    }

    if (filter.teamType === 'solo') {
      query.teamSize = 1;
    } else if (filter.teamType === 'group') {
      query.teamSize = { $gt: 1 };
    }

    if (filter.status === 'unexported') {
      query.exported = false;
    } else if (filter.status === 'exported') {
      query.exported = true;
    }

    const matchedTeams = await EventTeam.find(query);

    const emailMap = new Map();
    matchedTeams.forEach(t => {
      if (t.leader?.email && !emailMap.has(t.leader.email.toLowerCase())) {
        emailMap.set(t.leader.email.toLowerCase(), {
          name: t.leader.name,
          email: t.leader.email,
          teamName: t.teamName,
          teamId: t.teamId,
          event: getEventDisplay(t.event)
        });
      }
    });

    const recipients = Array.from(emailMap.values());

    if (previewOnly) {
      return res.json({
        totalMatchedTeams: matchedTeams.length,
        totalRecipients: recipients.length,
        sampleRecipients: recipients.slice(0, 6)
      });
    }

    if (recipients.length === 0) {
      return res.status(400).json({ msg: 'No recipients match the specified conditions' });
    }

    if (!subject || !message) {
      return res.status(400).json({ msg: 'Subject and message are required' });
    }

    let headerGradient = 'linear-gradient(135deg,#0ea5e9,#6366f1)';
    let badgeText = 'COMMUNICATION';
    if (urgency === 'urgent') {
      headerGradient = 'linear-gradient(135deg,#dc2626,#ea580c)';
      badgeText = 'URGENT NOTIFICATION';
    } else if (urgency === 'important') {
      headerGradient = 'linear-gradient(135deg,#f59e0b,#d97706)';
      badgeText = 'IMPORTANT UPDATE';
    }

    const formattedHtml = `
      <div style="font-family:'Segoe UI',system-ui,sans-serif; max-width:680px; margin:auto; background:#0b1120; color:#e2e8f0; border-radius:18px; overflow:hidden; border:1px solid rgba(255,255,255,0.08);">
        <div style="background:${headerGradient}; padding:40px 30px; text-align:center; color:white;">
          <span style="background:rgba(255,255,255,0.2); padding:5px 16px; border-radius:999px; font-size:12px; font-weight:700; letter-spacing:1px; text-transform:uppercase;">${badgeText}</span>
          <h1 style="margin:16px 0 0; font-size:32px; font-weight:800; letter-spacing:0.5px;">${headline || 'CROSSROADS 2026'}</h1>
        </div>

        <div style="padding:35px 30px; background:#111827;">
          <div style="font-size:16px; line-height:1.8; color:#cbd5e1; white-space:pre-wrap;">
${message}
          </div>

          ${ctaText && ctaLink ? `
            <div style="text-align:center; margin:35px 0 20px;">
              <a href="${ctaLink}" style="display:inline-block; padding:15px 38px; background:linear-gradient(135deg,#0ea5e9,#6366f1); color:white; font-weight:700; font-size:16px; text-decoration:none; border-radius:999px; box-shadow:0 10px 25px rgba(14,165,233,0.35);">
                ${ctaText} →
              </a>
            </div>
          ` : ''}

          <hr style="border:none; border-top:1px solid #1f2937; margin:35px 0 25px;">
          <div style="font-size:13px; color:#94a3b8; text-align:center;">
            <p style="margin:0;">CROSSROADS 2026 Organizing Committee</p>
            <p style="margin:4px 0 0;">Hi-Tech Institute of Engineering & Technology, Ghaziabad</p>
          </div>
        </div>
      </div>
    `;

    const recipientEmails = recipients.map(r => r.email);
    let sentCount = 0;
    const batchSize = 25;

    for (let i = 0; i < recipientEmails.length; i += batchSize) {
      const batch = recipientEmails.slice(i, i + batchSize);
      await sendMailRoundRobin({
        bcc: batch,
        subject: subject,
        html: formattedHtml
      });
      sentCount += batch.length;
    }

    res.json({
      success: true,
      msg: `Conditional email successfully dispatched to ${sentCount} recipient(s) across Round Robin SMTP pool.`,
      sentCount,
      totalMatchedTeams: matchedTeams.length
    });

  } catch (err) {
    console.error('Conditional email error:', err);
    res.status(500).json({ msg: 'Failed to send conditional emails', error: err.message });
  }
};

// Centralized Broadcast System via Round Robin
const sendBroadcast = async (req, res) => {
  try {
    const { title, message, target = 'all', channel = 'email', urgency = 'normal', showOnWebsite = false } = req.body;

    if (!title || !message) {
      return res.status(400).json({ msg: 'Broadcast title and message are required' });
    }

    let recipientsCount = 0;

    if (channel === 'email' || channel === 'both') {
      let query = {};
      if (target && target !== 'all') {
        query.event = target;
      }

      const teams = await EventTeam.find(query);
      const emailSet = new Set(teams.map(t => t.leader?.email).filter(Boolean));
      const emailList = Array.from(emailSet);

      if (emailList.length > 0) {
        const batchSize = 30;
        for (let i = 0; i < emailList.length; i += batchSize) {
          const batch = emailList.slice(i, i + batchSize);
          await sendMailRoundRobin({
            bcc: batch,
            subject: `📢 [BROADCAST] ${title}`,
            html: `
              <div style="font-family:'Segoe UI',sans-serif; max-width:640px; margin:auto; background:#0b1120; color:#e2e8f0; border-radius:16px; overflow:hidden; border:1px solid rgba(255,255,255,0.1);">
                <div style="background:linear-gradient(135deg,#ec4899,#8b5cf6); padding:32px; text-align:center; color:white;">
                  <span style="font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:1px; background:rgba(0,0,0,0.2); padding:4px 14px; border-radius:999px;">OFFICIAL FEST BROADCAST</span>
                  <h2 style="margin:14px 0 0; font-size:26px;">${title}</h2>
                </div>
                <div style="padding:32px; background:#111827; font-size:16px; line-height:1.8; color:#cbd5e1; white-space:pre-wrap;">
${message}
                </div>
                <div style="padding:18px; background:#0f172a; text-align:center; font-size:12px; color:#64748b;">
                  CROSSROADS 2026 • HIET Ghaziabad • <a href="https://hiet-crossroads.online" style="color:#38bdf8; text-decoration:none;">hiet-crossroads.online</a>
                </div>
              </div>
            `
          });
        }
        recipientsCount = emailList.length;
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
    }

    const broadcastRecord = await Broadcast.create({
      title,
      message,
      target,
      channel,
      urgency,
      showOnWebsite: showOnWebsite || channel === 'website_banner' || channel === 'both',
      recipientsCount,
      createdBy: req.user?.username || 'Admin'
    });

    res.json({
      success: true,
      msg: `Broadcast published successfully! Dispatched to ${recipientsCount} recipient(s) via Round Robin SMTP.`,
      broadcast: broadcastRecord
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
    res.json({ msg: 'Website settings updated successfully', settings });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to update settings', error: err.message });
  }
};

// Send Authority Report (Director in 'to', HODs in 'cc' based on tracks and domains)
const sendAuthorityReport = async (req, res) => {
  try {
    const {
      track = 'all',
      directorEmail,
      ccEmails = [],
      remarks = '',
      attachExcel = true
    } = req.body;

    const settings = await SiteSetting.getSettings();
    // Default Director email: ag0567688@gmail.com
    const finalDirector = directorEmail || settings.authorityContacts?.directorEmail || 'ag0567688@gmail.com';

    let query = {};
    let trackLabel = 'All Tracks & Events';
    const technicalEvents = ['code-puzzle', 'project-exhibition', 'robo-race', 'technical-poster'];
    const culturalEvents = ['cultural-events', 'dance-competition', 'rangoli-competition', 'food-without-fire', 'rock-band', 'short-film-maker', 'treasure-hunt'];

    if (track === 'technical') {
      query.event = { $in: technicalEvents };
      trackLabel = 'Technical Track (CSE / MCA / Projects)';
    } else if (track === 'cultural') {
      query.event = { $in: culturalEvents };
      trackLabel = 'Cultural & Creative Track';
    } else if (track === 'robotics') {
      query.event = 'robo-race';
      trackLabel = 'Robotics Track (Robo Race)';
    } else if (track !== 'all') {
      query.event = track;
      trackLabel = getEventDisplay(track);
    }

    const teams = await EventTeam.find(query).sort({ appliedAt: -1 });
    const totalCount = teams.length;
    const totalParticipants = teams.reduce((sum, t) => sum + (t.teamSize || 1), 0);

    const eventCounts = {};
    teams.forEach(t => {
      eventCounts[t.event] = (eventCounts[t.event] || 0) + 1;
    });

    const collegeCounts = {};
    teams.forEach(t => {
      collegeCounts[t.college] = (collegeCounts[t.college] || 0) + 1;
    });

    const topColleges = Object.entries(collegeCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const eventRowsHtml = Object.entries(eventCounts)
      .map(([ev, count]) => `
        <tr>
          <td style="padding:10px 14px; border-bottom:1px solid #e2e8f0; font-weight:600; color:#1e293b;">${getEventDisplay(ev)}</td>
          <td style="padding:10px 14px; border-bottom:1px solid #e2e8f0; text-align:center; font-weight:700; color:#2563eb;">${count}</td>
        </tr>
      `).join('');

    const collegeRowsHtml = topColleges
      .map(([col, count]) => `
        <tr>
          <td style="padding:8px 14px; border-bottom:1px solid #e2e8f0; color:#334155;">${col}</td>
          <td style="padding:8px 14px; border-bottom:1px solid #e2e8f0; text-align:center; font-weight:600; color:#059669;">${count}</td>
        </tr>
      `).join('');

    const reportHtml = `
      <div style="font-family:'Segoe UI',system-ui,sans-serif; max-width:760px; margin:auto; background:#ffffff; color:#1e293b; border-radius:16px; overflow:hidden; border:1px solid #cbd5e1; box-shadow:0 15px 40px rgba(0,0,0,0.08);">
        
        <div style="background:linear-gradient(135deg,#1e3a8a,#2563eb,#3b82f6); padding:36px 30px; text-align:center; color:#ffffff;">
          <h3 style="margin:0; font-size:13px; letter-spacing:2px; text-transform:uppercase; opacity:0.9;">HI-TECH INSTITUTE OF ENGINEERING & TECHNOLOGY</h3>
          <h1 style="margin:8px 0 0; font-size:30px; font-weight:800; letter-spacing:0.5px;">CROSSROADS 2026</h1>
          <p style="margin:8px 0 0; font-size:16px; opacity:0.95;">Official Registration Status Digest • ${trackLabel}</p>
          <div style="margin-top:16px; display:inline-block; background:rgba(255,255,255,0.2); padding:6px 18px; border-radius:999px; font-size:13px;">
            Date: <strong>${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
          </div>
        </div>

        <div style="padding:32px 30px;">
          <p style="font-size:16px; margin-top:0; color:#0f172a;">
            Respected <strong>Director Sir</strong>,<br>
            Cc: Respected <strong>Head of Departments & Committee Conveners</strong>,
          </p>
          <p style="font-size:15px; line-height:1.7; color:#475569;">
            Please find below the current real-time registration status for <strong>CROSSROADS 2026</strong> under <strong>${trackLabel}</strong>.
          </p>

          ${remarks ? `
            <div style="margin:24px 0; padding:18px 22px; background:#f8fafc; border-left:4px solid #3b82f6; border-radius:8px;">
              <strong style="color:#1e3a8a; font-size:14px; text-transform:uppercase;">Admin / Coordinator Note:</strong>
              <p style="margin:6px 0 0; font-size:14.5px; color:#334155; line-height:1.6;">${remarks}</p>
            </div>
          ` : ''}

          <div style="margin:28px 0; display:flex; gap:16px; flex-wrap:wrap;">
            <div style="flex:1; min-width:180px; background:#eff6ff; border:1px solid #bfdbfe; border-radius:12px; padding:18px; text-align:center;">
              <div style="font-size:13px; color:#1e40af; font-weight:600; text-transform:uppercase;">Total Teams</div>
              <div style="font-size:32px; font-weight:800; color:#1d4ed8; margin-top:4px;">${totalCount}</div>
            </div>
            <div style="flex:1; min-width:180px; background:#ecfdf5; border:1px solid #a7f3d0; border-radius:12px; padding:18px; text-align:center;">
              <div style="font-size:13px; color:#065f46; font-weight:600; text-transform:uppercase;">Total Participants</div>
              <div style="font-size:32px; font-weight:800; color:#047857; margin-top:4px;">${totalParticipants}</div>
            </div>
            <div style="flex:1; min-width:180px; background:#faf5ff; border:1px solid #e9d5ff; border-radius:12px; padding:18px; text-align:center;">
              <div style="font-size:13px; color:#6b21a8; font-weight:600; text-transform:uppercase;">Participating Colleges</div>
              <div style="font-size:32px; font-weight:800; color:#7e22ce; margin-top:4px;">${Object.keys(collegeCounts).length}</div>
            </div>
          </div>

          <div style="margin:30px 0;">
            <h3 style="font-size:18px; color:#1e293b; margin-bottom:12px; border-bottom:2px solid #e2e8f0; padding-bottom:8px;">
              📊 Event-Wise Registration Breakdown
            </h3>
            <table style="width:100%; border-collapse:collapse; font-size:14px; background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; overflow:hidden;">
              <thead>
                <tr style="background:#f1f5f9; text-align:left;">
                  <th style="padding:10px 14px; color:#475569;">Event Name</th>
                  <th style="padding:10px 14px; text-align:center; color:#475569;">Registered Teams</th>
                </tr>
              </thead>
              <tbody>
                ${eventRowsHtml || '<tr><td colspan="2" style="padding:12px; text-align:center;">No registrations in this track</td></tr>'}
              </tbody>
            </table>
          </div>

          <div style="margin:30px 0;">
            <h3 style="font-size:18px; color:#1e293b; margin-bottom:12px; border-bottom:2px solid #e2e8f0; padding-bottom:8px;">
              🏫 Top Participating Colleges
            </h3>
            <table style="width:100%; border-collapse:collapse; font-size:14px; background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; overflow:hidden;">
              <thead>
                <tr style="background:#f1f5f9; text-align:left;">
                  <th style="padding:10px 14px; color:#475569;">College Name</th>
                  <th style="padding:10px 14px; text-align:center; color:#475569;">Teams</th>
                </tr>
              </thead>
              <tbody>
                ${collegeRowsHtml || '<tr><td colspan="2" style="padding:12px; text-align:center;">No college data</td></tr>'}
              </tbody>
            </table>
          </div>

          ${attachExcel ? `
            <div style="margin:24px 0; padding:14px 18px; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; font-size:14px; color:#166534; display:flex; align-items:center; gap:10px;">
              <span>📎</span>
              <span><strong>Attached Excel Sheet:</strong> Complete participant roster attached in Excel (.xlsx) format.</span>
            </div>
          ` : ''}

          <hr style="border:none; border-top:1px solid #e2e8f0; margin:32px 0 20px;">
          
          <div style="font-size:13px; color:#64748b; text-align:center;">
            <p style="margin:0;">CROSSROADS 2026 Admin Portal Automated Reporting System</p>
            <p style="margin:4px 0 0;">Hi-Tech Institute of Engineering & Technology, Ghaziabad</p>
          </div>
        </div>
      </div>
    `;

    const attachments = [];

    if (attachExcel && teams.length > 0) {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet(trackLabel.substring(0, 25));

      sheet.addRow(['STUDENT/TEAM ID', 'TEAM NAME', 'EVENT', 'SIZE', 'LEADER NAME', 'LEADER EMAIL', 'MOBILE', 'COLLEGE', 'BRANCH', 'YEAR', 'MEMBERS', 'DATE']);
      sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
      sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3A8A' } };

      teams.forEach(t => {
        sheet.addRow([
          t.teamId,
          t.teamName,
          getEventDisplay(t.event),
          t.teamSize,
          t.leader?.name || '',
          t.leader?.email || '',
          t.leader?.mobile || '',
          t.college,
          t.branch,
          t.year,
          (t.members || []).map(m => m.name).join(', ') || 'Solo',
          t.appliedAt ? new Date(t.appliedAt).toLocaleDateString('en-IN') : ''
        ]);
      });

      sheet.columns.forEach(col => { col.width = 20; });

      const buffer = await workbook.xlsx.writeBuffer();
      attachments.push({
        filename: `CROSSROADS_2026_${track}_Report_${new Date().toISOString().split('T')[0]}.xlsx`,
        content: buffer,
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
    }

    // Default HOD CC: ag902065@gmail.com
    const defaultHods = ['ag902065@gmail.com'];
    const validCc = Array.isArray(ccEmails) && ccEmails.length > 0
      ? ccEmails.filter(e => e && e.includes('@'))
      : defaultHods;

    const result = await sendMailRoundRobin({
      to: finalDirector,
      cc: validCc,
      subject: `CROSSROADS 2026 - Registration Status Report [${trackLabel.toUpperCase()}]`,
      html: reportHtml,
      attachments
    });

    res.json({
      success: true,
      msg: `Official report successfully dispatched to Director (${finalDirector}) with HOD(s) in CC (${validCc.join(', ')}) via Round Robin (${result.sentVia}).`,
      director: finalDirector,
      ccList: validCc,
      sentVia: result.sentVia,
      teamsCount: totalCount
    });

  } catch (err) {
    console.error('Authority report error:', err);
    res.status(500).json({ msg: 'Failed to send authority report', error: err.message });
  }
};

module.exports = {
  login,
  getSmtpStatus,
  getAnalytics,
  getTeams,
  getTeamById,
  updateTeam,
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
  sendAuthorityReport
};