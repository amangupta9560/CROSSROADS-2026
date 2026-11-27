const nodemailer = require('nodemailer');

const BRAND_NAME = 'CROSSROADS 2027';
const THEME_TAGLINE = 'BEYOND THE KNOWN. INTO THE UNKNOWN.';
const FRONTEND_URL = (process.env.FRONTEND_PUBLIC_URL || 'https://crossroads-hiet.netlify.app').replace(/\/+$/, '');
const EMAIL_BANNER_URL = process.env.EMAIL_BANNER_URL || `${FRONTEND_URL}/email%20banner.png`;
const WHATSAPP_GROUP_URL = 'https://chat.whatsapp.com/DaK4uonBMwd4k7s8Pv7RNu';

const IDENTITY = {
  club: 'Team Tech Fusion',
  institute: 'Hi-Tech Institute of Engineering & Technology (HIET), Ghaziabad',
  email: 'techfusion@hietgroup.org',
  whatsappDisplay: '+91 8802323375',
  whatsappUrl: 'https://wa.me/918802323375',
  whatsappGroupUrl: WHATSAPP_GROUP_URL,
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

  for (let i = 4; i <= 20; i++) {
    const envUser = process.env[`SMTP_${i}_USER`];
    const envPass = process.env[`SMTP_${i}_PASS`];
    if (envUser && envPass) {
      addConfig(`SMTP ${i} (${envUser.split('@')[0]})`, envUser, envPass);
    }
  }

  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    addConfig('SMTP Primary (EMAIL_USER)', process.env.EMAIL_USER, process.env.EMAIL_PASS);
  }

  return configs;
};

const smtpConfigs = buildSmtpConfigs();

const transporters = smtpConfigs.map((cfg) => ({
  name: cfg.name,
  user: cfg.user,
  transporter: nodemailer.createTransport({
    service: 'gmail',
    pool: true,
    maxConnections: 3,
    maxMessages: 100,
    rateDelta: 1000,
    rateLimit: 4,
    auth: {
      user: cfg.user,
      pass: cfg.pass
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 25000
  })
}));

let currentSmtpIndex = 0;

// Fast lock-free Round Robin index distributes evenly across all SMTP pool accounts without DB write contention
const getRoundRobinStartIndex = async () => {
  if (transporters.length === 0) {
    throw new Error('No SMTP transporters configured');
  }
  const idx = currentSmtpIndex % transporters.length;
  currentSmtpIndex = (currentSmtpIndex + 1) % transporters.length;
  return idx;
};

const sendMailRoundRobin = async (mailOptions, optionsMeta = {}) => {
  if (transporters.length === 0) {
    throw new Error('No SMTP transporters configured');
  }

  const { preferredSmtpUser = null, fromLabel = BRAND_NAME } = optionsMeta;

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
      lastError = err;
      // Only fail over when failure happened BEFORE SMTP accepted DATA; otherwise risk sending duplicate copy!
      const alreadySentData =
        err.command === 'DATA' ||
        (err.code === 'ETIMEDOUT' && err.command !== 'CONN' && err.command !== 'AUTH');
      if (alreadySentData) {
        throw new Error(`SMTP acknowledgement uncertain after DATA (${err.message})`);
      }
      console.warn(`[Round Robin ${smtp.name}] Pre-send error: ${err.message}. Failing over...`);
    }
  }

  throw lastError || new Error('All SMTP servers in Round Robin pool failed');
};

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
 * Full-bleed edge-to-edge Lost Civilization email document (0 outer margin & 0 outer padding)
 * displaying top global `email banner.png`, salutation/tagline zone, modular body, activated WhatsApp
 * community block, social links, and support contact (`techfusion@hietgroup.org`).
 */
const buildResponsiveEmailDocument = ({
  badgeText = 'THE LOST CIVILIZATION',
  title = BRAND_NAME,
  accentColor = '#C69B43',
  bodyHtml = ''
}) => {
  return `<!DOCTYPE html>
<html lang="en" style="margin:0; padding:0;">
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
      min-width: 100% !important;
      background-color: #080D0B !important;
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    table, td {
      border-collapse: collapse;
    }
    img {
      border: 0;
      outline: none;
      text-decoration: none;
      display: block;
    }
    @media only screen and (max-width: 600px) {
      .email-container {
        width: 100% !important;
        max-width: 100% !important;
      }
      .inner-pad {
        padding: 16px 14px !important;
      }
      .kpi-col {
        display: block !important;
        width: 100% !important;
        padding: 0 0 8px 0 !important;
      }
      .social-pill {
        display: block !important;
        margin: 6px 0 !important;
      }
    }
  </style>
</head>
<body style="margin:0; padding:0; width:100%; background-color:#080D0B; color:#E8DFC8;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%; margin:0; padding:0; background-color:#080D0B;">
    <tr>
      <td align="center" style="margin:0; padding:0;">
        <table role="presentation" class="email-container" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%; max-width:680px; margin:0; padding:0; background-color:#101D16; color:#E8DFC8;">
          <!-- 1. Global Edge-to-Edge Banner -->
          <tr>
            <td style="margin:0; padding:0; background-color:#080D0B;">
              <img
                src="${EMAIL_BANNER_URL}"
                alt="${BRAND_NAME} — ${THEME_TAGLINE}"
                width="680"
                style="display:block; width:100%; max-width:100%; height:auto; margin:0; padding:0; border:0;"
              />
            </td>
          </tr>

          <!-- Subtle Gold Seal Strip -->
          <tr>
            <td style="margin:0; padding:8px 14px; background-color:#0B1510; border-top:2px solid ${accentColor}; border-bottom:1px solid #3E331A; text-align:center;">
              <span style="font-size:10px; font-weight:800; letter-spacing:1.8px; text-transform:uppercase; color:#E8C574;">
                ${escapeHtml(badgeText)} &bull; ${IDENTITY.festDates}
              </span>
            </td>
          </tr>

          <!-- Main Content Area -->
          <tr>
            <td class="inner-pad" style="margin:0; padding:20px 18px; background-color:#101D16; color:#E8DFC8;">
              ${bodyHtml}

              <!-- Activated Official WhatsApp Group CTA -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%; margin:18px 0 0; background-color:#14281E; border:1px solid #2E6F4E; border-radius:8px;">
                <tr>
                  <td style="padding:16px 14px; text-align:center;">
                    <div style="font-size:13px; font-weight:800; letter-spacing:0.8px; text-transform:uppercase; color:#A7F3D0; margin-bottom:6px;">
                      Official CROSSROADS 2027 WhatsApp Community
                    </div>
                    <p style="margin:0 0 12px; font-size:12.5px; line-height:1.5; color:#D1FAE5;">
                      Join immediately for event briefings, reporting counters, and live arena updates.
                    </p>
                    <a
                      href="${WHATSAPP_GROUP_URL}"
                      target="_blank"
                      style="display:inline-block; padding:10px 24px; background-color:#10B981; color:#052E16; text-decoration:none; border-radius:4px; font-weight:800; font-size:13px; letter-spacing:0.5px;"
                    >
                      Join WhatsApp Group &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Social Links & Support Footer -->
          <tr>
            <td class="inner-pad" style="margin:0; padding:20px 16px; background-color:#080D0B; color:#E8DFC8; text-align:center; border-top:2px solid ${accentColor};">
              <div style="font-size:14px; font-weight:800; color:#E8C574; letter-spacing:0.8px;">
                ${BRAND_NAME} &bull; ${IDENTITY.club}
              </div>
              <div style="font-size:11.5px; color:#A89F88; margin-top:4px;">
                ${IDENTITY.institute}
              </div>

              <div style="margin:14px 0 12px;">
                <a class="social-pill" href="${IDENTITY.websiteUrl}/" style="display:inline-block; margin:4px 4px; padding:6px 12px; background:#101D16; border:1px solid #594622; border-radius:4px; color:#E8C574; text-decoration:none; font-size:11.5px; font-weight:700;">
                  Website Portal
                </a>
                <a class="social-pill" href="${IDENTITY.instagramUrl}" style="display:inline-block; margin:4px 4px; padding:6px 12px; background:#101D16; border:1px solid #594622; border-radius:4px; color:#E8DFC8; text-decoration:none; font-size:11.5px; font-weight:700;">
                  Instagram: ${IDENTITY.instagramHandle}
                </a>
                <a class="social-pill" href="${IDENTITY.linkedinUrl}" style="display:inline-block; margin:4px 4px; padding:6px 12px; background:#101D16; border:1px solid #594622; border-radius:4px; color:#E8DFC8; text-decoration:none; font-size:11.5px; font-weight:700;">
                  LinkedIn
                </a>
                <a class="social-pill" href="${WHATSAPP_GROUP_URL}" style="display:inline-block; margin:4px 4px; padding:6px 12px; background:#101D16; border:1px solid #2E6F4E; border-radius:4px; color:#6EE7B7; text-decoration:none; font-size:11.5px; font-weight:700;">
                  WhatsApp Group
                </a>
              </div>

              <div style="font-size:12px; color:#C2B8A1; line-height:1.7;">
                Support Email: <a href="mailto:${IDENTITY.email}" style="color:#E8C574; font-weight:700; text-decoration:none;">${IDENTITY.email}</a>
                &nbsp;|&nbsp;
                Helpline: <a href="${IDENTITY.whatsappUrl}" style="color:#6EE7B7; text-decoration:none;">${IDENTITY.whatsappDisplay}</a>
              </div>
              <div style="font-size:10.5px; color:#777568; margin-top:6px;">
                ${BRAND_NAME} • ${THEME_TAGLINE}
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

/**
 * Extract unique valid additional teammate emails excluding team leader email.
 */
const getUniqueMemberEmails = (team) => {
  const leaderEmail = (team.leader?.email || '').trim().toLowerCase();
  const seen = new Set(leaderEmail ? [leaderEmail] : []);
  const uniqueMembers = [];

  for (const m of team.members || []) {
    const email = m?.email?.trim();
    if (email && email.includes('@') && !seen.has(email.toLowerCase())) {
      seen.add(email.toLowerCase());
      uniqueMembers.push(email);
    }
  }
  return uniqueMembers;
};

/**
 * Shared tabular team & member summary block used identically across registration confirmations
 * and all admin-dispatched conditional / broadcast emails.
 */
const buildUnifiedTeamTablesHtml = (team) => {
  const eventName = escapeHtml(getEventDisplay(team.event));

  const memberRowsHtml =
    team.members && team.members.length > 0
      ? team.members
          .map(
            (m) => `
          <tr>
            <td style="padding:9px 10px; border:1px solid #2D3F32; color:#E8DFC8; font-size:12.5px; font-weight:600;">${escapeHtml(m.name)}</td>
            <td style="padding:9px 10px; border:1px solid #2D3F32; color:#C7BFA9; font-size:12px; word-break:break-all;">${escapeHtml(m.email)}</td>
          </tr>
        `
          )
          .join('')
      : `
          <tr>
            <td colspan="2" style="padding:10px; border:1px solid #2D3F32; text-align:center; color:#A89F88; font-size:12px;">
              Solo Participant (Leader Only — No Additional Members)
            </td>
          </tr>
        `;

  return `
    <!-- Team Details Table -->
    <div style="margin:0 0 16px;">
      <div style="font-size:11px; font-weight:800; letter-spacing:1.3px; text-transform:uppercase; color:#E8C574; margin-bottom:6px;">
        Expedition Registration Details
      </div>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse:collapse; background-color:#0B140F;">
        <tr>
          <td style="padding:9px 10px; border:1px solid #2D3F32; color:#A89F88; font-size:12px; font-weight:700; width:42%;">Team ID</td>
          <td style="padding:9px 10px; border:1px solid #2D3F32; color:#E8C574; font-size:13px; font-weight:800; font-family:monospace;">${escapeHtml(team.teamId)}</td>
        </tr>
        <tr>
          <td style="padding:9px 10px; border:1px solid #2D3F32; color:#A89F88; font-size:12px; font-weight:700;">Team Name</td>
          <td style="padding:9px 10px; border:1px solid #2D3F32; color:#E8DFC8; font-size:12.5px; font-weight:700;">${escapeHtml(team.teamName)}</td>
        </tr>
        <tr>
          <td style="padding:9px 10px; border:1px solid #2D3F32; color:#A89F88; font-size:12px; font-weight:700;">Leader Name</td>
          <td style="padding:9px 10px; border:1px solid #2D3F32; color:#E8DFC8; font-size:12.5px;">${escapeHtml(team.leader?.name)}</td>
        </tr>
        <tr>
          <td style="padding:9px 10px; border:1px solid #2D3F32; color:#A89F88; font-size:12px; font-weight:700;">Leader Email</td>
          <td style="padding:9px 10px; border:1px solid #2D3F32; color:#E8C574; font-size:12px; word-break:break-all;">${escapeHtml(team.leader?.email)}</td>
        </tr>
        <tr>
          <td style="padding:9px 10px; border:1px solid #2D3F32; color:#A89F88; font-size:12px; font-weight:700;">Team Size (Including Leader)</td>
          <td style="padding:9px 10px; border:1px solid #2D3F32; color:#E8DFC8; font-size:12.5px; font-weight:700;">${escapeHtml(team.teamSize)} Member(s)</td>
        </tr>
        <tr>
          <td style="padding:9px 10px; border:1px solid #2D3F32; color:#A89F88; font-size:12px; font-weight:700;">Event Name</td>
          <td style="padding:9px 10px; border:1px solid #2D3F32; color:#6EE7B7; font-size:12.5px; font-weight:700;">${eventName}</td>
        </tr>
      </table>
    </div>

    <!-- Additional Members Roster Table -->
    <div style="margin:0;">
      <div style="font-size:11px; font-weight:800; letter-spacing:1.3px; text-transform:uppercase; color:#E8C574; margin-bottom:6px;">
        Team Members Roster (Kept in CC)
      </div>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse:collapse; background-color:#0B140F;">
        <thead>
          <tr style="background-color:#182B20;">
            <th style="padding:9px 10px; border:1px solid #3A4D3E; text-align:left; color:#E8C574; font-size:11.5px; text-transform:uppercase;">Member Name</th>
            <th style="padding:9px 10px; border:1px solid #3A4D3E; text-align:left; color:#E8C574; font-size:11.5px; text-transform:uppercase;">Email</th>
          </tr>
        </thead>
        <tbody>
          ${memberRowsHtml}
        </tbody>
      </table>
    </div>
  `;
};

/**
 * Build Lost Civilization registration confirmation HTML following exact section order:
 * Banner -> Salutation -> Tagline -> Congratulations + 2-line description -> Details Table ->
 * Members Table -> Activated WhatsApp Link -> Important Social & Support Contact Footer.
 */
const generateRegistrationConfirmationHtml = (team) => {
  const eventName = escapeHtml(getEventDisplay(team.event));

  const bodyHtml = `
    <!-- 2. Salutation -->
    <p style="margin:0 0 10px; font-size:15px; line-height:1.5; color:#E8DFC8;">
      Dear <strong style="color:#E8C574;">${escapeHtml(team.leader?.name)}</strong> &amp; Team <strong style="color:#E8C574;">${escapeHtml(team.teamName)}</strong>,
    </p>

    <!-- 3. Event Tagline -->
    <div style="margin:0 0 14px; padding:10px 12px; background-color:#0B140F; border-left:3px solid #C69B43;">
      <div style="font-size:11px; font-weight:800; letter-spacing:1.4px; color:#E8C574; text-transform:uppercase;">
        ${BRAND_NAME} &bull; THE LOST CIVILIZATION
      </div>
      <div style="font-size:12.5px; font-weight:700; letter-spacing:0.6px; color:#C7BFA9; margin-top:2px;">
        "${THEME_TAGLINE}"
      </div>
    </div>

    <!-- 4. Congratulations + Team Name + 2-Line Description -->
    <div style="margin:0 0 16px; padding:12px 14px; background-color:#15251C; border:1px solid #3A4D3E; border-radius:6px;">
      <h2 style="margin:0 0 6px; font-size:16px; color:#E8C574; font-weight:800;">
        Congratulations, Team ${escapeHtml(team.teamName)}!
      </h2>
      <p style="margin:0; font-size:13px; line-height:1.6; color:#E8DFC8;">
        Your squad is officially registered for <strong>${eventName}</strong> at ${BRAND_NAME}, HIET Ghaziabad (${IDENTITY.festDates}).<br/>
        Save your Team Registration ID below and ensure your full squad reports together with valid college ID cards.
      </p>
    </div>

    ${buildUnifiedTeamTablesHtml(team)}
  `;

  return buildResponsiveEmailDocument({
    badgeText: 'REGISTRATION CONFIRMED',
    title: `${BRAND_NAME} — ${team.teamName}`,
    accentColor: '#C69B43',
    bodyHtml
  });
};

/**
 * Build unified HTML for Admin Conditional / Broadcast emails so every email sent from
 * the Admin Panel strictly follows the exact same Lost Civilization banner, salutation, tagline,
 * team details table, members table, activated WhatsApp group, and social/support footer.
 */
const buildUnifiedAdminDispatchHtml = (team, { headline, message, badgeText = 'OFFICIAL UPDATE', accentColor = '#C69B43', ctaText = '', ctaLink = '' }) => {
  const safeCtaLink = ctaLink && /^https?:\/\//i.test(ctaLink.trim()) ? ctaLink.trim() : '';

  const bodyHtml = `
    <!-- Salutation -->
    <p style="margin:0 0 10px; font-size:15px; line-height:1.5; color:#E8DFC8;">
      Dear <strong style="color:#E8C574;">${escapeHtml(team.leader?.name)}</strong> &amp; Team <strong style="color:#E8C574;">${escapeHtml(team.teamName)}</strong>,
    </p>

    <!-- Event Tagline -->
    <div style="margin:0 0 14px; padding:10px 12px; background-color:#0B140F; border-left:3px solid ${accentColor};">
      <div style="font-size:11px; font-weight:800; letter-spacing:1.4px; color:#E8C574; text-transform:uppercase;">
        ${BRAND_NAME} &bull; THE LOST CIVILIZATION
      </div>
      <div style="font-size:12.5px; font-weight:700; letter-spacing:0.6px; color:#C7BFA9; margin-top:2px;">
        "${THEME_TAGLINE}"
      </div>
    </div>

    <!-- Congratulations / Notice & Description -->
    <div style="margin:0 0 16px; padding:14px; background-color:#15251C; border:1px solid #3A4D3E; border-radius:6px;">
      <h2 style="margin:0 0 8px; font-size:16px; color:#E8C574; font-weight:800;">
        ${escapeHtml(headline || `Congratulations & Official Notice for ${team.teamName}`)}
      </h2>
      <div style="font-size:13.5px; line-height:1.7; color:#E8DFC8; white-space:pre-wrap;">${escapeHtml(message)}</div>
      ${ctaText && safeCtaLink ? `
        <div style="margin-top:14px;">
          <a href="${escapeHtml(safeCtaLink)}" target="_blank" style="display:inline-block; padding:10px 22px; background-color:#C69B43; color:#080D0B; font-weight:800; font-size:12.5px; text-transform:uppercase; letter-spacing:0.8px; text-decoration:none; border-radius:4px;">
            ${escapeHtml(ctaText)} &rarr;
          </a>
        </div>
      ` : ''}
    </div>

    ${buildUnifiedTeamTablesHtml(team)}
  `;

  return buildResponsiveEmailDocument({
    badgeText,
    title: headline || BRAND_NAME,
    accentColor,
    bodyHtml
  });
};

const buildTeamConfirmationEmailPayload = (team, isManual = false) => {
  if (!team.leader?.email) {
    throw new Error('Team leader email is missing');
  }

  const leaderEmail = team.leader.email.trim();
  const uniqueMemberEmails = getUniqueMemberEmails(team);
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
  THEME_TAGLINE,
  FRONTEND_URL,
  EMAIL_BANNER_URL,
  WHATSAPP_GROUP_URL,
  IDENTITY,
  transporters,
  sendMailRoundRobin,
  getUniqueMemberEmails,
  buildTeamConfirmationEmailPayload,
  sendTeamConfirmationWithMembersCc,
  buildUnifiedAdminDispatchHtml,
  EVENT_DISPLAY_NAMES,
  getEventDisplay,
  escapeHtml,
  buildResponsiveEmailDocument,
  generateRegistrationConfirmationHtml
};
