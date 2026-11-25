const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const Counter = require('../models/Counter');

const BRAND_NAME = 'CROSSROADS 2027';
const FRONTEND_URL = 'https://crossroads-hiet.netlify.app';
const IDENTITY = {
  club: 'Team Tech Fusion',
  institute: 'Hi-Tech Institute of Engineering & Technology (HIET), Ghaziabad',
  email: 'techfusion@hietgroup.org',
  whatsappDisplay: '+91 8802323375',
  whatsappUrl: 'https://wa.me/918802323375',
  instagramHandle: '@hiet.techfusion',
  instagramUrl: 'https://www.instagram.com/hiet.techfusion',
  linkedinLabel: 'linkedin.com/company/hiet-techfusion',
  linkedinUrl: 'https://linkedin.com/company/hiet-techfusion',
  websiteUrl: FRONTEND_URL,
  festDates: '05 Feb & 06 Feb 2027',
  registrationWindow: 'January 10 – January 31, 2027'
};

// Discover all configured SMTP credentials (SMTP_1..SMTP_N + defaults + EMAIL_USER/PASS)
const buildSmtpConfigs = () => {
  const configs = [];
  const seenUsers = new Set();

  const addConfig = (name, user, pass) => {
    const cleanUser = user?.trim();
    const cleanPass = pass?.trim();
    if (!cleanUser || !cleanPass) return;
    const key = cleanUser.toLowerCase();
    if (seenUsers.has(key)) return;
    seenUsers.add(key);
    configs.push({ name, user: cleanUser, pass: cleanPass });
  };

  // Primary pool entries (ENV overrides defaults)
  addConfig(
    'SMTP 1 (hackathonhiet)',
    process.env.SMTP_1_USER || 'hackathonhiet@gmail.com',
    process.env.SMTP_1_PASS || 'kuwahyfqzwlfqtmw'
  );
  addConfig(
    'SMTP 2 (techfusion9560)',
    process.env.SMTP_2_USER || 'techfusion9560@gmail.com',
    process.env.SMTP_2_PASS || 'frkyojklfplrxrjz'
  );
  addConfig(
    'SMTP 3 (crossroads20255)',
    process.env.SMTP_3_USER || 'crossroads20255@gmail.com',
    process.env.SMTP_3_PASS || 'lmrldubacijhcuqa'
  );

  // Dynamically pick up SMTP_4_USER .. SMTP_20_USER if configured in Vercel env vars
  for (let i = 4; i <= 20; i++) {
    const envUser = process.env[`SMTP_${i}_USER`];
    const envPass = process.env[`SMTP_${i}_PASS`];
    if (envUser && envPass) {
      addConfig(`SMTP ${i} (${envUser.split('@')[0]})`, envUser, envPass);
    }
  }

  // Fallback single EMAIL_USER / EMAIL_PASS
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    addConfig('SMTP Primary (EMAIL_USER)', process.env.EMAIL_USER, process.env.EMAIL_PASS);
  }

  return configs;
};

const smtpConfigs = buildSmtpConfigs();

// Build transporter instances tuned for Vercel serverless timeouts
const transporters = smtpConfigs.map((cfg) => ({
  name: cfg.name,
  user: cfg.user,
  transporter: nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: cfg.user,
      pass: cfg.pass
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000
  })
}));

// In-memory fallback index when DB counter is unavailable
let currentSmtpIndex = 0;

/**
 * Get the starting transporter index using atomic MongoDB Counter so Round Robin
 * stays balanced across stateless Vercel serverless invocations.
 */
const getRoundRobinStartIndex = async () => {
  if (transporters.length === 0) {
    throw new Error('No SMTP transporters configured');
  }

  if (mongoose.connection.readyState === 1) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        'smtp_round_robin',
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      return Math.abs((counter.seq - 1) % transporters.length);
    } catch (err) {
      console.warn('[Round Robin Counter Fallback]', err.message);
    }
  }

  const idx = currentSmtpIndex % transporters.length;
  currentSmtpIndex = (currentSmtpIndex + 1) % transporters.length;
  return idx;
};

/**
 * Send email using Round Robin across all configured Nodemailer transporters
 * with automatic failover. Optional preferredSmtpUser lets admin pick a specific pool account.
 */
const sendMailRoundRobin = async (mailOptions, optionsMeta = {}) => {
  if (transporters.length === 0) {
    throw new Error('No SMTP transporters configured');
  }

  const { preferredSmtpUser = null, fromLabel = BRAND_NAME } = optionsMeta;

  // Build ordered transporter queue starting at the chosen/round-robin index
  let orderedQueue = [];
  if (preferredSmtpUser) {
    const preferred = transporters.find(
      (t) => t.user.toLowerCase() === preferredSmtpUser.trim().toLowerCase()
    );
    if (preferred) {
      orderedQueue = [preferred, ...transporters.filter((t) => t.user !== preferred.user)];
    }
  }

  if (orderedQueue.length === 0) {
    const startIdx = await getRoundRobinStartIndex();
    for (let i = 0; i < transporters.length; i++) {
      orderedQueue.push(transporters[(startIdx + i) % transporters.length]);
    }
  }

  let lastError = null;
  for (let i = 0; i < orderedQueue.length; i++) {
    const smtp = orderedQueue[i];
    try {
      const options = {
        ...mailOptions,
        from: `"${fromLabel}" <${smtp.user}>`,
        replyTo: mailOptions.replyTo || IDENTITY.email
      };

      const info = await smtp.transporter.sendMail(options);
      console.log(
        `[Round Robin ${smtp.name}] Sent to: ${mailOptions.to || mailOptions.bcc} (attempt ${i + 1}/${orderedQueue.length})`
      );
      return {
        success: true,
        info,
        sentVia: smtp.user,
        smtpName: smtp.name,
        attempt: i + 1
      };
    } catch (err) {
      console.warn(`[Round Robin ${smtp.name}] Error: ${err.message}. Failing over...`);
      lastError = err;
    }
  }

  throw lastError || new Error('All SMTP servers in Round Robin pool failed');
};

// Event display mapping
const EVENT_DISPLAY_NAMES = {
  'code-puzzle': 'Code Puzzle',
  'project-exhibition': 'Project Exhibition / Project Evolution',
  'robo-race': 'Robo Race',
  'technical-poster': 'Technical Poster Presentation',
  'cultural-events': 'Cultural Events (Group Dance)',
  'rangoli-competition': 'Rangoli Competition',
  'food-without-fire': 'Food Without Fire',
  'dance-competition': 'Dance Competition (Solo Dance)',
  'rock-band': 'Rock Band',
  'short-film-maker': 'Short Film Maker / Reel Making',
  'treasure-hunt': 'Treasure Hunt'
};

const getEventDisplay = (eventKey) => {
  if (!eventKey) return `${BRAND_NAME} Event`;
  return EVENT_DISPLAY_NAMES[eventKey] || eventKey.toUpperCase().replace(/-/g, ' ');
};

// Escape user-provided strings before embedding in HTML emails
const escapeHtml = (str) => {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

/**
 * Full-bleed responsive HTML email document wrapper (0 outer margin & 0 outer padding)
 * so it adapts seamlessly on desktop, mobile Gmail, iOS Mail, and Outlook.
 */
const buildResponsiveEmailDocument = ({
  badgeText = 'OFFICIAL COMMUNICATION',
  title = BRAND_NAME,
  subtitle = `${IDENTITY.institute}`,
  headerGradient = 'linear-gradient(135deg,#0f172a 0%,#1e3a8a 52%,#0284c7 100%)',
  accentColor = '#0284c7',
  bodyHtml = ''
}) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>${escapeHtml(title)}</title>
  <style>
    html, body {
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
      background-color: #0b1120 !important;
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    table {
      border-collapse: collapse;
    }
    @media only screen and (max-width: 600px) {
      .email-container {
        width: 100% !important;
        max-width: 100% !important;
        border-radius: 0 !important;
      }
      .mobile-pad {
        padding: 18px 14px !important;
      }
      .mobile-header-pad {
        padding: 26px 14px !important;
      }
      .kpi-col {
        display: block !important;
        width: 100% !important;
        padding: 0 0 10px 0 !important;
      }
      .hero-title {
        font-size: 26px !important;
      }
      .social-pill {
        display: block !important;
        margin: 6px 0 !important;
      }
    }
  </style>
</head>
<body style="margin:0; padding:0; width:100%; background-color:#0b1120;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%; margin:0; padding:0; background-color:#0b1120;">
    <tr>
      <td align="center" style="margin:0; padding:0;">
        <table role="presentation" class="email-container" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%; max-width:740px; margin:0 auto; background-color:#ffffff; color:#1e293b;">
          <!-- Header -->
          <tr>
            <td class="mobile-header-pad" style="background:${headerGradient}; padding:34px 24px; text-align:center; color:#ffffff;">
              <div style="display:inline-block; background:rgba(255,255,255,0.16); border:1px solid rgba(255,255,255,0.28); border-radius:999px; padding:5px 14px; font-size:11px; font-weight:700; letter-spacing:1.4px; text-transform:uppercase; color:#e0f2fe;">
                ${escapeHtml(badgeText)}
              </div>
              <h1 class="hero-title" style="margin:12px 0 4px; font-size:32px; line-height:1.15; font-weight:800; letter-spacing:0.5px; color:#ffffff;">
                ${escapeHtml(title)}
              </h1>
              <p style="margin:0; font-size:14px; line-height:1.5; color:#cbd5e1;">
                ${escapeHtml(subtitle)}
              </p>
              <div style="margin-top:14px; font-size:12px; color:#bae6fd; font-weight:600;">
                Event Dates: ${IDENTITY.festDates} &nbsp;|&nbsp; Registrations: ${IDENTITY.registrationWindow}
              </div>
            </td>
          </tr>

          <!-- Main Body -->
          <tr>
            <td class="mobile-pad" style="padding:28px 24px; background-color:#ffffff; color:#1e293b;">
              ${bodyHtml}
            </td>
          </tr>

          <!-- Official Identity & Social Footer -->
          <tr>
            <td class="mobile-pad" style="background-color:#0f172a; color:#cbd5e1; padding:26px 24px; text-align:center; border-top:3px solid ${accentColor};">
              <div style="font-size:15px; font-weight:800; color:#ffffff; letter-spacing:0.5px;">
                ${BRAND_NAME} &bull; ${IDENTITY.club}
              </div>
              <div style="font-size:12px; color:#94a3b8; margin-top:4px;">
                ${IDENTITY.institute}
              </div>

              <div style="margin:16px 0 14px;">
                <a class="social-pill" href="${IDENTITY.websiteUrl}/" style="display:inline-block; margin:4px 5px; padding:7px 14px; background:#1e293b; border:1px solid #334155; border-radius:999px; color:#38bdf8; text-decoration:none; font-size:12px; font-weight:600;">
                  Website Portal
                </a>
                <a class="social-pill" href="${IDENTITY.instagramUrl}" style="display:inline-block; margin:4px 5px; padding:7px 14px; background:#1e293b; border:1px solid #334155; border-radius:999px; color:#f472b6; text-decoration:none; font-size:12px; font-weight:600;">
                  Instagram: ${IDENTITY.instagramHandle}
                </a>
                <a class="social-pill" href="${IDENTITY.linkedinUrl}" style="display:inline-block; margin:4px 5px; padding:7px 14px; background:#1e293b; border:1px solid #334155; border-radius:999px; color:#60a5fa; text-decoration:none; font-size:12px; font-weight:600;">
                  LinkedIn: Team Tech Fusion
                </a>
              </div>

              <div style="font-size:12px; color:#94a3b8; line-height:1.7;">
                Email: <a href="mailto:${IDENTITY.email}" style="color:#38bdf8; text-decoration:none;">${IDENTITY.email}</a>
                &nbsp;|&nbsp;
                WhatsApp: <a href="${IDENTITY.whatsappUrl}" style="color:#34d399; text-decoration:none;">${IDENTITY.whatsappDisplay}</a>
              </div>
              <div style="font-size:11px; color:#64748b; margin-top:8px;">
                Portal: <a href="${IDENTITY.websiteUrl}/" style="color:#94a3b8; text-decoration:none;">${IDENTITY.websiteUrl}/</a>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

// Generates registration confirmation HTML (0 outer margin/padding, responsive)
const generateRegistrationConfirmationHtml = (team) => {
  const memberListHtml = team.members && team.members.length > 0
    ? team.members.map((m, i) => `
      <tr>
        <td style="padding:10px 12px; border-bottom:1px solid #e2e8f0; color:#475569; font-size:13px;">Member ${i + 2}</td>
        <td style="padding:10px 12px; border-bottom:1px solid #e2e8f0; color:#0f172a; font-weight:600; font-size:13px;">${escapeHtml(m.name)}</td>
        <td style="padding:10px 12px; border-bottom:1px solid #e2e8f0; color:#475569; font-size:13px;">${escapeHtml(m.email)}</td>
      </tr>
    `).join('')
    : '<tr><td colspan="3" style="padding:12px; text-align:center; color:#64748b; font-size:13px;">Solo Participant (Individual Registration)</td></tr>';

  const eventName = escapeHtml(getEventDisplay(team.event));

  const bodyHtml = `
    <p style="font-size:16px; line-height:1.6; margin:0 0 8px; color:#0f172a;">
      Hello <strong>${escapeHtml(team.leader?.name)}</strong> &amp; Team,
    </p>
    <p style="font-size:15px; line-height:1.7; color:#334155; margin:0 0 18px;">
      Your team <strong style="color:#0284c7;">${escapeHtml(team.teamName)}</strong> is officially registered for
      <strong style="color:#1e3a8a;">${eventName}</strong> at <strong>${BRAND_NAME}</strong>.
    </p>

    <div style="margin:0 0 22px; text-align:center; background:#f0f9ff; border:1px solid #bae6fd; border-radius:12px; padding:14px;">
      <div style="font-size:11px; text-transform:uppercase; letter-spacing:1.2px; color:#0369a1; font-weight:700;">Official Team Pass ID</div>
      <div style="font-size:22px; font-weight:800; color:#0f172a; font-family:monospace; margin-top:4px;">${escapeHtml(team.teamId)}</div>
    </div>

    <div style="margin:0 0 22px; padding:16px; background:#f8fafc; border-radius:12px; border:1px solid #e2e8f0;">
      <h3 style="margin:0 0 12px; font-size:16px; color:#0f172a;">Registration Overview</h3>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%; font-size:13.5px;">
        <tr><td style="padding:7px 0; color:#64748b; font-weight:600; width:40%;">Team Name</td><td style="color:#0f172a; font-weight:700;">${escapeHtml(team.teamName)}</td></tr>
        <tr><td style="padding:7px 0; color:#64748b; font-weight:600;">Event Arena</td><td style="color:#0284c7; font-weight:700;">${eventName}</td></tr>
        <tr><td style="padding:7px 0; color:#64748b; font-weight:600;">Fest Dates</td><td style="color:#0f172a; font-weight:600;">${IDENTITY.festDates}</td></tr>
        <tr><td style="padding:7px 0; color:#64748b; font-weight:600;">Registration Window</td><td style="color:#334155;">${IDENTITY.registrationWindow}</td></tr>
        <tr><td style="padding:7px 0; color:#64748b; font-weight:600;">Team Size</td><td style="color:#0f172a; font-weight:600;">${escapeHtml(team.teamSize)} member(s)</td></tr>
        <tr><td style="padding:7px 0; color:#64748b; font-weight:600;">Team Leader (TO)</td><td style="color:#0f172a;">${escapeHtml(team.leader?.name)} (${escapeHtml(team.leader?.email)})</td></tr>
        <tr><td style="padding:7px 0; color:#64748b; font-weight:600;">Mobile / WhatsApp</td><td style="color:#0f172a;">${escapeHtml(team.leader?.mobile)} / ${escapeHtml(team.leader?.whatsapp || team.leader?.mobile)}</td></tr>
        <tr><td style="padding:7px 0; color:#64748b; font-weight:600;">College</td><td style="color:#0f172a;">${escapeHtml(team.college)}</td></tr>
        <tr><td style="padding:7px 0; color:#64748b; font-weight:600;">Branch &amp; Year</td><td style="color:#0f172a;">${escapeHtml(team.branch)} &bull; ${escapeHtml(team.year)}</td></tr>
      </table>
    </div>

    <div style="margin:0 0 22px; overflow-x:auto;">
      <h3 style="margin:0 0 10px; font-size:16px; color:#0f172a;">Team Roster (CC&apos;d on this Email)</h3>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%; border:1px solid #e2e8f0; border-radius:10px; overflow:hidden;">
        <tr style="background:#0f172a; text-align:left;">
          <th style="padding:10px 12px; color:#cbd5e1; font-size:12px;">Role</th>
          <th style="padding:10px 12px; color:#cbd5e1; font-size:12px;">Name</th>
          <th style="padding:10px 12px; color:#cbd5e1; font-size:12px;">Email</th>
        </tr>
        <tr>
          <td style="padding:10px 12px; border-bottom:1px solid #e2e8f0; color:#0284c7; font-weight:700; font-size:13px;">Leader (Primary)</td>
          <td style="padding:10px 12px; border-bottom:1px solid #e2e8f0; color:#0f172a; font-weight:600; font-size:13px;">${escapeHtml(team.leader?.name)}</td>
          <td style="padding:10px 12px; border-bottom:1px solid #e2e8f0; color:#475569; font-size:13px;">${escapeHtml(team.leader?.email)}</td>
        </tr>
        ${memberListHtml}
      </table>
    </div>

    <div style="margin:0; padding:20px; background:linear-gradient(135deg,#064e3b,#047857); border-radius:12px; text-align:center; color:#ffffff;">
      <h3 style="margin:0 0 8px; font-size:17px; color:#ffffff;">Official WhatsApp Community</h3>
      <p style="margin:0 0 14px; font-size:13.5px; color:#d1fae5;">
        Join for live schedule announcements, reporting desks, and event briefings.
      </p>
      <a href="https://chat.whatsapp.com/KTyS5UeLX1q3wVX7omGqcg" style="display:inline-block; padding:11px 26px; background:#ffffff; color:#065f46; text-decoration:none; border-radius:999px; font-weight:700; font-size:14px;">
        Join WhatsApp Group &rarr;
      </a>
    </div>
  `;

  return buildResponsiveEmailDocument({
    badgeText: 'REGISTRATION CONFIRMED',
    title: BRAND_NAME,
    subtitle: `${eventName} • ${IDENTITY.institute}`,
    headerGradient: 'linear-gradient(135deg,#0f172a 0%,#1e3a8a 50%,#0284c7 100%)',
    accentColor: '#0284c7',
    bodyHtml
  });
};

// Build clean email payload for confirmation (TO: leader, CC: deduplicated valid members)
const buildTeamConfirmationEmailPayload = (team, isManual = false) => {
  if (!team.leader?.email) {
    throw new Error('Team leader email is missing');
  }

  const leaderEmail = team.leader.email.trim();
  const seen = new Set([leaderEmail.toLowerCase()]);
  const uniqueMemberEmails = [];

  for (const m of team.members || []) {
    const email = m.email?.trim();
    if (email && email.includes('@') && !seen.has(email.toLowerCase())) {
      seen.add(email.toLowerCase());
      uniqueMemberEmails.push(email);
    }
  }

  const emailHtml = generateRegistrationConfirmationHtml(team);
  const subjectPrefix = isManual ? '[Official Update] ' : '';
  const subject = `${subjectPrefix}${BRAND_NAME} Registration Confirmed – ${team.teamName} (${team.teamId})`;

  return {
    category: 'registration_confirmation',
    to: [leaderEmail],
    cc: uniqueMemberEmails,
    subject,
    html: emailHtml,
    teamId: team.teamId,
    teamRef: team._id,
    event: team.event,
    leaderEmail,
    ccCount: uniqueMemberEmails.length,
    ccList: uniqueMemberEmails
  };
};

// Dispatch confirmation email to leader (TO) and all team members (CC) via Round Robin
const sendTeamConfirmationWithMembersCc = async (team, isManual = false) => {
  const payload = buildTeamConfirmationEmailPayload(team, isManual);
  const mailOptions = {
    to: payload.to[0],
    ...(payload.cc.length > 0 && { cc: payload.cc }),
    subject: payload.subject,
    html: payload.html
  };

  const result = await sendMailRoundRobin(mailOptions);
  return {
    ...result,
    leaderEmail: payload.leaderEmail,
    ccCount: payload.ccCount,
    ccList: payload.ccList
  };
};

module.exports = {
  BRAND_NAME,
  FRONTEND_URL,
  IDENTITY,
  transporters,
  sendMailRoundRobin,
  buildTeamConfirmationEmailPayload,
  sendTeamConfirmationWithMembersCc,
  EVENT_DISPLAY_NAMES,
  getEventDisplay,
  escapeHtml,
  buildResponsiveEmailDocument,
  generateRegistrationConfirmationHtml
};
