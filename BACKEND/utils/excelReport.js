const ExcelJS = require('exceljs');
const { BRAND_NAME, IDENTITY, getEventDisplay } = require('./mailer');

const sanitizeSpreadsheetCell = (val) => {
  if (val === null || val === undefined) return '';
  const str = String(val);
  return /^[=+\-@\t\r]/.test(str) ? `'${str}` : str;
};

const THIN_BORDER = {
  top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
  left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
  bottom: { style: 'thin', color: { argb: 'FFCBD5E1' } },
  right: { style: 'thin', color: { argb: 'FFCBD5E1' } }
};

const TEAM_END_BORDER = {
  top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
  left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
  bottom: { style: 'medium', color: { argb: 'FF64748B' } },
  right: { style: 'thin', color: { argb: 'FFCBD5E1' } }
};

const formatRegStatusLabel = (status) => {
  const s = (status || 'pending').toLowerCase();
  if (s === 'verified') return 'Verified';
  if (s === 'checked-in') return 'Checked In';
  if (s === 'rejected') return 'Rejected';
  return 'Pending';
};

/**
 * Compute dynamic auto-fit column widths across all unmerged header/data rows
 * so long college names, team names, and email addresses never clip.
 */
const autoFitColumns = (sheet, { skipRowNumbers = [], minWidths = [], maxWidth = 46 } = {}) => {
  const skipSet = new Set(skipRowNumbers);
  sheet.columns.forEach((col, colIndex) => {
    const minW = minWidths[colIndex] || 10;
    let maxLen = minW;

    col.eachCell({ includeEmpty: false }, (cell, rowNumber) => {
      if (skipSet.has(rowNumber)) return;
      // Ignore horizontal colSpan cells so long merged headings don't widen col 1
      if (cell.isMerged && cell.master && cell.master.col !== cell.col) return;
      if (cell.isMerged) {
        const rawMerge = sheet._merges?.[cell.master?.address];
        const mergeRange = rawMerge?.model || rawMerge;
        if (mergeRange && mergeRange.left !== mergeRange.right) return;
      }

      const raw = cell.value === null || cell.value === undefined ? '' : String(cell.value);
      const longestLine = raw
        .split('\n')
        .reduce((acc, line) => Math.max(acc, line.length), 0);
      if (longestLine + 3 > maxLen) {
        maxLen = longestLine + 3;
      }
    });

    col.width = Math.min(Math.max(maxLen, minW), maxWidth);
  });
};

/**
 * Populate a detailed worksheet with Group Column Spans (super-headers) and Team Row Spans
 * (vertical merges across all members of a team), Navy + Gold executive styling, and Auto-Fit widths.
 */
const populateDetailedTeamSheet = (sheet, teamList, sheetTitle) => {
  const totalStudents = teamList.reduce((acc, t) => acc + (t.teamSize || 1), 0);
  const uniqueColleges = new Set(
    teamList.map((t) => (t.college || '').trim().toLowerCase()).filter(Boolean)
  ).size;

  // Row 1: Top Navy Banner (colSpan A1:Q1)
  sheet.addRow([`${BRAND_NAME} — ${sheetTitle}`]);
  sheet.mergeCells('A1:Q1');
  const titleCell = sheet.getCell('A1');
  titleCell.font = { bold: true, size: 15, color: { argb: 'FFFACC15' } };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F172A' } };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  sheet.getRow(1).height = 34;

  // Row 2: Subtitle Metadata (colSpan A2:Q2)
  sheet.addRow([
    `${IDENTITY.institute}  |  Fest: ${IDENTITY.festDates}  |  Generated: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST`
  ]);
  sheet.mergeCells('A2:Q2');
  const subCell = sheet.getCell('A2');
  subCell.font = { italic: true, size: 10, color: { argb: 'FF334155' } };
  subCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } };
  subCell.alignment = { horizontal: 'center', vertical: 'middle' };
  sheet.getRow(2).height = 22;

  // Row 3: KPI Summary Cards Strip using Column Spans
  const kpiRow = sheet.addRow(new Array(17).fill(''));
  kpiRow.height = 24;
  const kpiBlocks = [
    { range: 'A3:D3', text: `TOTAL TEAMS: ${teamList.length}`, bg: 'FFE0F2FE', fg: 'FF0369A1' },
    { range: 'E3:H3', text: `TOTAL STUDENTS: ${totalStudents}`, bg: 'FFDCFCE7', fg: 'FF15803D' },
    { range: 'I3:M3', text: `PARTICIPATING COLLEGES: ${uniqueColleges}`, bg: 'FFEDE9FE', fg: 'FF6D28D9' },
    { range: 'N3:Q3', text: `PORTAL: ${IDENTITY.websiteUrl}`, bg: 'FFFEF3C7', fg: 'FFB45309' }
  ];
  kpiBlocks.forEach((b) => {
    sheet.mergeCells(b.range);
    const startCol = b.range.split(':')[0];
    const cell = sheet.getCell(startCol);
    cell.value = b.text;
    cell.font = { bold: true, size: 10, color: { argb: b.fg } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: b.bg } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = THIN_BORDER;
  });

  // Row 4: Super-Header Group Labels (colSpan across logical sections)
  const groupRow = sheet.addRow(new Array(17).fill(''));
  groupRow.height = 24;
  const superGroups = [
    { range: 'A4:E4', label: 'TEAM & ARENA DETAILS', bg: 'FF1E3A8A' },
    { range: 'F4:I4', label: 'INSTITUTION & ACADEMICS', bg: 'FF0F766E' },
    { range: 'J4:N4', label: 'PARTICIPANT ROSTER (LEADER + TEAMMATES)', bg: 'FF4338CA' },
    { range: 'O4:Q4', label: 'VERIFICATION & TRACKING', bg: 'FF0F172A' }
  ];
  superGroups.forEach((g) => {
    sheet.mergeCells(g.range);
    const cell = sheet.getCell(g.range.split(':')[0]);
    cell.value = g.label;
    cell.font = { bold: true, size: 10, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: g.bg } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = THIN_BORDER;
  });

  // Row 5: Navy Background + Bold Gold Sub-Headers
  const headers = [
    'S.NO',
    'TEAM ID',
    'TEAM NAME',
    'EVENT NAME',
    'SIZE',
    'COLLEGE / INSTITUTION',
    'BRANCH',
    'YEAR',
    'REGISTERED DATE',
    'ROLE',
    'PARTICIPANT NAME',
    'PARTICIPANT EMAIL',
    'CALLING MOBILE',
    'WHATSAPP NO.',
    'EXTRA MEMBERS',
    'STATUS',
    'EXPORTED'
  ];
  const headerRow = sheet.addRow(headers);
  headerRow.height = 26;
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, size: 10, color: { argb: 'FFFACC15' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F172A' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.border = THIN_BORDER;
  });

  // Data rows: Each team occupies N rows (1 Leader + M Members), with Team-level cols vertically row-spanned!
  teamList.forEach((team, teamIdx) => {
    const members = Array.isArray(team.members) ? team.members : [];
    const participants = [
      {
        role: 'Leader (TO)',
        name: team.leader?.name || '',
        email: team.leader?.email || '',
        mobile: team.leader?.mobile || '',
        whatsapp: team.leader?.whatsapp || team.leader?.mobile || ''
      },
      ...members.map((m, mIdx) => ({
        role: `Member ${mIdx + 2} (CC)`,
        name: m.name || '',
        email: m.email || '',
        mobile: '—',
        whatsapp: '—'
      }))
    ];

    const startRowIdx = sheet.rowCount + 1;
    const endRowIdx = startRowIdx + participants.length - 1;
    const isAltBand = teamIdx % 2 === 1;
    const bandFill = isAltBand
      ? { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } }
      : { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } };

    const regDateStr = team.appliedAt
      ? new Date(team.appliedAt).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })
      : '';

    const statusLabel = formatRegStatusLabel(team.status);

    participants.forEach((p, pIdx) => {
      const isFirst = pIdx === 0;
      const isLast = pIdx === participants.length - 1;

      const row = sheet.addRow([
        isFirst ? teamIdx + 1 : '',
        isFirst ? sanitizeSpreadsheetCell(team.teamId) : '',
        isFirst ? sanitizeSpreadsheetCell(team.teamName) : '',
        isFirst ? sanitizeSpreadsheetCell(getEventDisplay(team.event)) : '',
        isFirst ? (team.teamSize || participants.length) : '',
        isFirst ? sanitizeSpreadsheetCell(team.college) : '',
        isFirst ? sanitizeSpreadsheetCell(team.branch) : '',
        isFirst ? sanitizeSpreadsheetCell(team.year) : '',
        isFirst ? regDateStr : '',
        p.role,
        sanitizeSpreadsheetCell(p.name),
        sanitizeSpreadsheetCell(p.email),
        sanitizeSpreadsheetCell(p.mobile),
        sanitizeSpreadsheetCell(p.whatsapp),
        isFirst ? members.length : '',
        isFirst ? statusLabel : '',
        isFirst ? (team.exported ? 'Yes' : 'No') : ''
      ]);

      row.height = 20;
      row.eachCell((cell, colNumber) => {
        cell.fill = bandFill;
        cell.border = isLast ? TEAM_END_BORDER : THIN_BORDER;
        cell.alignment = {
          vertical: 'middle',
          horizontal: [1, 5, 8, 9, 10, 15, 16, 17].includes(colNumber) ? 'center' : 'left',
          wrapText: true
        };
        if (colNumber === 10) {
          cell.font = {
            bold: isFirst,
            size: 10,
            color: { argb: isFirst ? 'FF0369A1' : 'FF475569' }
          };
        } else if (colNumber === 2 && isFirst) {
          cell.font = { bold: true, size: 10, color: { argb: 'FF1E3A8A' } };
        } else if (colNumber === 16 && isFirst) {
          const statusColor =
            statusLabel === 'Checked In'
              ? 'FF047857'
              : statusLabel === 'Verified'
                ? 'FF1D4ED8'
                : statusLabel === 'Rejected'
                  ? 'FFB91C1C'
                  : 'FFB45309';
          cell.font = { bold: true, size: 10, color: { argb: statusColor } };
        } else {
          cell.font = { size: 10, color: { argb: 'FF0F172A' } };
        }
      });
    });

    // Apply vertical Row Span across Team-level columns when team has > 1 participant
    if (participants.length > 1) {
      const teamColsToSpan = [1, 2, 3, 4, 5, 6, 7, 8, 9, 15, 16, 17];
      teamColsToSpan.forEach((colIdx) => {
        sheet.mergeCells(startRowIdx, colIdx, endRowIdx, colIdx);
      });
    }
  });

  // Freeze top 5 rows & auto-fit every column dynamically
  sheet.views = [{ state: 'frozen', ySplit: 5 }];
  autoFitColumns(sheet, {
    skipRowNumbers: [1, 2, 3, 4],
    minWidths: [7, 19, 20, 24, 7, 28, 16, 11, 15, 15, 22, 26, 15, 15, 13, 13, 10],
    maxWidth: 46
  });
};

/**
 * Populate Executive Summary sheet with Event-wise and College-wise tables (colSpan + totals + Auto-Fit).
 */
const populateSummarySheet = (sheet, teams, scopeLabel) => {
  const totalTeams = teams.length;
  const totalStudents = teams.reduce((sum, t) => sum + (t.teamSize || 1), 0);

  const eventMap = new Map();
  const collegeMap = new Map();

  teams.forEach((t) => {
    const evKey = t.event || 'unknown';
    if (!eventMap.has(evKey)) {
      eventMap.set(evKey, { teams: 0, students: 0, colleges: new Set(), solo: 0, group: 0 });
    }
    const ev = eventMap.get(evKey);
    ev.teams += 1;
    ev.students += t.teamSize || 1;
    if (t.college) ev.colleges.add(t.college.trim());
    if ((t.teamSize || 1) === 1) ev.solo += 1;
    else ev.group += 1;

    const colName = (t.college || 'Unspecified').trim();
    if (!collegeMap.has(colName)) {
      collegeMap.set(colName, { teams: 0, students: 0, events: new Set() });
    }
    const col = collegeMap.get(colName);
    col.teams += 1;
    col.students += t.teamSize || 1;
    col.events.add(getEventDisplay(evKey));
  });

  // Banner (Navy & Gold)
  sheet.addRow([`${BRAND_NAME} — EXECUTIVE REGISTRATION SUMMARY (${scopeLabel})`]);
  sheet.mergeCells('A1:G1');
  const titleCell = sheet.getCell('A1');
  titleCell.font = { bold: true, size: 14, color: { argb: 'FFFACC15' } };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F172A' } };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  sheet.getRow(1).height = 32;

  sheet.addRow([
    `Total Teams: ${totalTeams}   |   Total Students: ${totalStudents}   |   Total Colleges: ${collegeMap.size}   |   Fest Dates: ${IDENTITY.festDates}`
  ]);
  sheet.mergeCells('A2:G2');
  const subCell = sheet.getCell('A2');
  subCell.font = { bold: true, size: 10, color: { argb: 'FF0369A1' } };
  subCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0F2FE' } };
  subCell.alignment = { horizontal: 'center', vertical: 'middle' };
  sheet.getRow(2).height = 24;

  sheet.addRow([]);

  // Section 1: Event-Wise Breakdown
  const evSectionRow = sheet.addRow(['1. EVENT-WISE REGISTRATION BREAKDOWN']);
  sheet.mergeCells(`A${evSectionRow.number}:G${evSectionRow.number}`);
  evSectionRow.getCell(1).font = { bold: true, size: 11, color: { argb: 'FFFFFFFF' } };
  evSectionRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3A8A' } };
  evSectionRow.getCell(1).alignment = { horizontal: 'left', vertical: 'middle' };
  evSectionRow.height = 24;

  const evHeader = sheet.addRow(['S.NO', 'EVENT NAME', 'TOTAL TEAMS', 'TOTAL STUDENTS', 'COLLEGES', 'SOLO / SQUAD', 'SHARE (%)']);
  evHeader.height = 24;
  evHeader.eachCell((c) => {
    c.font = { bold: true, size: 10, color: { argb: 'FFFACC15' } };
    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F172A' } };
    c.alignment = { horizontal: 'center', vertical: 'middle' };
    c.border = THIN_BORDER;
  });

  const sortedEvents = Array.from(eventMap.entries()).sort((a, b) => b[1].teams - a[1].teams);
  sortedEvents.forEach(([evKey, data], idx) => {
    const pct = totalTeams > 0 ? `${Math.round((data.teams / totalTeams) * 100)}%` : '0%';
    const row = sheet.addRow([
      idx + 1,
      sanitizeSpreadsheetCell(getEventDisplay(evKey)),
      data.teams,
      data.students,
      data.colleges.size,
      `${data.solo} Solo / ${data.group} Team`,
      pct
    ]);
    row.height = 20;
    row.eachCell((c, colNo) => {
      c.border = THIN_BORDER;
      c.alignment = { horizontal: colNo === 2 ? 'left' : 'center', vertical: 'middle' };
      if (idx % 2 === 1) c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
    });
  });

  const evTotalRow = sheet.addRow(['', 'GRAND TOTAL', totalTeams, totalStudents, collegeMap.size, '—', '100%']);
  evTotalRow.height = 22;
  evTotalRow.eachCell((c, colNo) => {
    c.font = { bold: true, size: 10, color: { argb: 'FF0F172A' } };
    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDBEAFE' } };
    c.border = TEAM_END_BORDER;
    c.alignment = { horizontal: colNo === 2 ? 'left' : 'center', vertical: 'middle' };
  });

  sheet.addRow([]);
  sheet.addRow([]);

  // Section 2: College-Wise Breakdown (colSpan across E:G for Events list)
  const colSectionRow = sheet.addRow(['2. COLLEGE-WISE PARTICIPATION & STUDENT COUNT']);
  sheet.mergeCells(`A${colSectionRow.number}:G${colSectionRow.number}`);
  colSectionRow.getCell(1).font = { bold: true, size: 11, color: { argb: 'FFFFFFFF' } };
  colSectionRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F766E' } };
  colSectionRow.getCell(1).alignment = { horizontal: 'left', vertical: 'middle' };
  colSectionRow.height = 24;

  const colHeaderRow = sheet.addRow(['S.NO', 'COLLEGE / INSTITUTION', 'TOTAL TEAMS', 'TOTAL STUDENTS', 'EVENTS PARTICIPATED', '', '']);
  sheet.mergeCells(`E${colHeaderRow.number}:G${colHeaderRow.number}`);
  colHeaderRow.height = 24;
  colHeaderRow.eachCell((c) => {
    c.font = { bold: true, size: 10, color: { argb: 'FFFACC15' } };
    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F172A' } };
    c.alignment = { horizontal: 'center', vertical: 'middle' };
    c.border = THIN_BORDER;
  });

  const sortedColleges = Array.from(collegeMap.entries()).sort((a, b) => b[1].students - a[1].students);
  sortedColleges.forEach(([colName, data], idx) => {
    const r = sheet.addRow([
      idx + 1,
      sanitizeSpreadsheetCell(colName),
      data.teams,
      data.students,
      sanitizeSpreadsheetCell(Array.from(data.events).join(', ')),
      '',
      ''
    ]);
    sheet.mergeCells(`E${r.number}:G${r.number}`);
    r.height = 21;
    r.eachCell((c, colNo) => {
      c.border = THIN_BORDER;
      c.alignment = {
        horizontal: colNo === 2 || colNo >= 5 ? 'left' : 'center',
        vertical: 'middle',
        wrapText: true
      };
      if (idx % 2 === 1) c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
    });
  });

  autoFitColumns(sheet, {
    skipRowNumbers: [1, 2, evSectionRow.number, colSectionRow.number],
    minWidths: [8, 34, 15, 16, 18, 22, 16],
    maxWidth: 50
  });
};

/**
 * Build full multi-sheet ExcelJS workbook cleanly in memory with Summary, Overall All Registrations,
 * and per-Event detailed worksheets using Row Span, Column Span, Navy/Gold Headers & Auto-Fit.
 */
const buildFormattedRegistrationWorkbook = async (teams, scopeLabel = 'All Registrations') => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = `${BRAND_NAME} Admin (${IDENTITY.club})`;
  workbook.created = new Date();

  const summarySheet = workbook.addWorksheet('Executive Summary');
  populateSummarySheet(summarySheet, teams, scopeLabel);

  const overallSheet = workbook.addWorksheet('Overall Registrations');
  populateDetailedTeamSheet(overallSheet, teams, `Overall Registrations (${scopeLabel})`);

  const uniqueEvents = [...new Set(teams.map((t) => t.event).filter(Boolean))];
  uniqueEvents.forEach((evKey) => {
    const evTeams = teams.filter((t) => t.event === evKey);
    const tabTitle = getEventDisplay(evKey)
      .replace(/[\/\\?*:[\]]/g, '')
      .substring(0, 31);
    const evSheet = workbook.addWorksheet(tabTitle);
    populateDetailedTeamSheet(evSheet, evTeams, getEventDisplay(evKey));
  });

  return workbook;
};

module.exports = {
  sanitizeSpreadsheetCell,
  buildFormattedRegistrationWorkbook
};
