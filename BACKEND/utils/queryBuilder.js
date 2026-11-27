const TECHNICAL_EVENTS = ['code-puzzle', 'project-exhibition', 'robo-race', 'technical-poster'];
const REGISTRATION_STATUSES = ['pending', 'verified', 'checked-in', 'rejected'];

const escapeRegex = (str) => String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const asString = (val) => (typeof val === 'string' ? val.trim() : '');

/**
 * Compute start & end of the current calendar day in IST (Asia/Kolkata, UTC+05:30),
 * ensuring "Today" metrics reflect local college time even on Vercel (UTC).
 */
const getIstTodayRange = () => {
  const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
  const nowIst = new Date(Date.now() + IST_OFFSET_MS);
  const startUtcMs =
    Date.UTC(nowIst.getUTCFullYear(), nowIst.getUTCMonth(), nowIst.getUTCDate()) - IST_OFFSET_MS;
  const start = new Date(startUtcMs);
  const end = new Date(startUtcMs + 24 * 60 * 60 * 1000);
  return { start, end };
};

/**
 * Build MongoDB filter query uniformly from query params or filter objects.
 * Strictly coerces primitive types to neutralize NoSQL operator injection ($ne, $gt, etc.).
 */
const buildRegistrationFilterQuery = (filters = {}, options = { includeSearchRegex: true }) => {
  const safe = filters && typeof filters === 'object' ? filters : {};
  const eventRaw = safe.event;
  const track = asString(safe.track);
  const college = asString(safe.college);
  const collegeType = asString(safe.collegeType);
  const specificCollege = asString(safe.specificCollege);
  const branch = asString(safe.branch);
  const year = asString(safe.year);
  const teamType = asString(safe.teamType);
  const status = asString(safe.status);
  const regStatus = asString(safe.regStatus);
  const dateFrom = asString(safe.dateFrom);
  const dateTo = asString(safe.dateTo);
  const search = asString(safe.search);

  const query = {};

  if (Array.isArray(eventRaw)) {
    const cleanEvents = eventRaw.map((e) => asString(e)).filter((e) => e && e !== 'all');
    if (cleanEvents.length > 0) query.event = { $in: cleanEvents };
  } else {
    const eventStr = asString(eventRaw);
    if (eventStr && eventStr !== 'all') {
      query.event = eventStr;
    } else if (track && track !== 'all') {
      if (track === 'technical') query.event = { $in: TECHNICAL_EVENTS };
      else if (track === 'cultural') query.event = { $nin: TECHNICAL_EVENTS };
      else if (track === 'robotics') query.event = 'robo-race';
    }
  }

  const resolvedCollegeFilter =
    specificCollege && specificCollege !== 'all'
      ? specificCollege
      : collegeType && collegeType !== 'all'
        ? collegeType
        : college;

  if (resolvedCollegeFilter && resolvedCollegeFilter !== 'all') {
    if (resolvedCollegeFilter === 'hiet') {
      query.college = { $regex: /hi-?tech|hiet/i };
    } else if (resolvedCollegeFilter === 'outside') {
      query.college = { $not: { $regex: /hi-?tech|hiet/i } };
    } else {
      query.college = { $regex: new RegExp(`^${escapeRegex(resolvedCollegeFilter)}$`, 'i') };
    }
  }

  if (branch && branch !== 'all') query.branch = branch;
  if (year && year !== 'all') query.year = year;

  if (teamType === 'solo') query.teamSize = 1;
  else if (teamType === 'group') query.teamSize = { $gt: 1 };

  const resolvedRegStatus =
    regStatus && regStatus !== 'all'
      ? regStatus
      : REGISTRATION_STATUSES.includes(status)
        ? status
        : null;

  if (resolvedRegStatus && resolvedRegStatus !== 'all') {
    if (resolvedRegStatus === 'pending') {
      query.status = { $in: ['pending', null] };
    } else if (REGISTRATION_STATUSES.includes(resolvedRegStatus)) {
      query.status = resolvedRegStatus;
    }
  }

  if (status === 'exported') query.exported = true;
  else if (status === 'unexported') query.exported = false;

  if (dateFrom || dateTo) {
    const dateRange = {};
    if (dateFrom) {
      const fromD = new Date(dateFrom);
      if (!Number.isNaN(fromD.getTime())) dateRange.$gte = fromD;
    }
    if (dateTo) {
      const toD = new Date(dateTo);
      if (!Number.isNaN(toD.getTime())) {
        toD.setHours(23, 59, 59, 999);
        dateRange.$lte = toD;
      }
    }
    if (Object.keys(dateRange).length > 0) {
      query.appliedAt = dateRange;
    }
  }

  if (options.includeSearchRegex && search) {
    const regex = new RegExp(escapeRegex(search.slice(0, 120)), 'i');
    query.$or = [
      { teamId: regex },
      { teamName: regex },
      { 'leader.name': regex },
      { 'leader.email': regex },
      { 'leader.mobile': regex },
      { college: regex },
      { branch: regex },
      { event: regex }
    ];
  }

  return query;
};

/**
 * Execute team search leveraging MongoDB $text full-text index first for sub-millisecond
 * lookups, with seamless regex fallback for partial strings/phone digits or unindexed stores.
 */
const queryTeamsSmart = async (EventTeamModel, filters = {}, { lean = false } = {}) => {
  const trimmedSearch = asString(filters?.search);

  if (!trimmedSearch) {
    const query = buildRegistrationFilterQuery(filters, { includeSearchRegex: false });
    let q = EventTeamModel.find(query).sort({ appliedAt: -1 });
    if (lean) q = q.lean();
    const teams = await q;
    return { teams, usedTextIndex: false };
  }

  const baseQuery = buildRegistrationFilterQuery(filters, { includeSearchRegex: false });

  try {
    let textQuery = EventTeamModel.find(
      { ...baseQuery, $text: { $search: trimmedSearch } },
      { score: { $meta: 'textScore' } }
    ).sort({ score: { $meta: 'textScore' }, appliedAt: -1 });
    if (lean) textQuery = textQuery.lean();
    const textMatches = await textQuery;
    if (textMatches.length > 0) {
      return { teams: textMatches, usedTextIndex: true };
    }
  } catch {
    // Index missing or not yet built; fall through cleanly to regex scan
  }

  const fullRegexQuery = buildRegistrationFilterQuery(filters, { includeSearchRegex: true });
  let fallbackQuery = EventTeamModel.find(fullRegexQuery).sort({ appliedAt: -1 });
  if (lean) fallbackQuery = fallbackQuery.lean();
  const teams = await fallbackQuery;
  return { teams, usedTextIndex: false };
};

module.exports = {
  TECHNICAL_EVENTS,
  REGISTRATION_STATUSES,
  escapeRegex,
  asString,
  getIstTodayRange,
  buildRegistrationFilterQuery,
  queryTeamsSmart
};
