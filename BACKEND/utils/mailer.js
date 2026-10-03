const nodemailer = require('nodemailer');

// Define SMTP Configurations for Round Robin
const smtpConfigs = [
  {
    name: 'SMTP 1 (hackathonhiet)',
    user: process.env.SMTP_1_USER || 'hackathonhiet@gmail.com',
    pass: process.env.SMTP_1_PASS || 'kuwahyfqzwlfqtmw'
  },
  {
    name: 'SMTP 2 (techfusion9560)',
    user: process.env.SMTP_2_USER || 'techfusion9560@gmail.com',
    pass: process.env.SMTP_2_PASS || 'frkyojklfplrxrjz'
  },
  {
    name: 'SMTP 3 (crossroads20255)',
    user: process.env.SMTP_3_USER || 'crossroads20255@gmail.com',
    pass: process.env.SMTP_3_PASS || 'lmrldubacijhcuqa'
  }
];

// Fallback if env provides single email user
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  const exists = smtpConfigs.some(c => c.user === process.env.EMAIL_USER);
  if (!exists) {
    smtpConfigs.push({
      name: 'SMTP Fallback',
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    });
  }
}

// Build transporter instances
const transporters = smtpConfigs.map(cfg => ({
  name: cfg.name,
  user: cfg.user,
  transporter: nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: cfg.user,
      pass: cfg.pass
    }
  })
}));

// Round Robin pointer
let currentSmtpIndex = 0;

const getNextTransporter = () => {
  if (transporters.length === 0) {
    throw new Error('No SMTP transporters configured');
  }
  const current = transporters[currentSmtpIndex % transporters.length];
  currentSmtpIndex = (currentSmtpIndex + 1) % transporters.length;
  return current;
};

// Send email using Round Robin with automatic failover
const sendMailRoundRobin = async (mailOptions) => {
  const attempts = transporters.length;
  let lastError = null;

  for (let i = 0; i < attempts; i++) {
    const smtp = getNextTransporter();
    try {
      const options = {
        ...mailOptions,
        from: mailOptions.from || `"CROSSROADS 2026" <${smtp.user}>`
      };

      const info = await smtp.transporter.sendMail(options);
      console.log(`[Round Robin ${smtp.name}] Sent successfully to: ${mailOptions.to || mailOptions.bcc}`);
      return { success: true, info, sentVia: smtp.user };
    } catch (err) {
      console.warn(`[Round Robin ${smtp.name}] Error: ${err.message}. Failing over to next SMTP...`);
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
  if (!eventKey) return 'CROSSROADS 2026 Event';
  return EVENT_DISPLAY_NAMES[eventKey] || eventKey.toUpperCase().replace(/-/g, ' ');
};

// Generates registration confirmation HTML
const generateRegistrationConfirmationHtml = (team) => {
  const memberListHtml = team.members && team.members.length > 0
    ? team.members.map((m, i) => `
      <tr>
        <td style="padding:10px; border-bottom:1px solid #334155; color:#cbd5e1;">Member ${i + 1}</td>
        <td style="padding:10px; border-bottom:1px solid #334155; color:#f8fafc; font-weight:500;">${m.name}</td>
        <td style="padding:10px; border-bottom:1px solid #334155; color:#94a3b8;">${m.email}</td>
      </tr>
    `).join('')
    : '<tr><td colspan="3" style="padding:12px; text-align:center; color:#94a3b8;">Solo Participant (Individual Registration)</td></tr>';

  const eventName = getEventDisplay(team.event);

  return `
    <div style="font-family:'Segoe UI',system-ui,sans-serif; max-width:720px; margin:auto; background:#0b1120; color:#e2e8f0; border-radius:20px; overflow:hidden; box-shadow:0 25px 60px rgba(0,0,0,0.6); border:1px solid rgba(255,255,255,0.08);">
      <div style="background:linear-gradient(135deg,#0ea5e9,#6366f1,#9333ea); padding:45px 30px; text-align:center; color:white;">
        <h1 style="margin:0; font-size:38px; letter-spacing:1px; font-weight:800;">CROSSROADS 2026</h1>
        <p style="margin:10px 0 0; font-size:17px; opacity:0.95;">✨ Team Registration Confirmed ✨</p>
        <div style="margin-top:22px; background:rgba(255,255,255,0.18); backdrop-filter:blur(10px); display:inline-block; padding:10px 26px; border-radius:999px; font-weight:700; font-size:15px; border:1px solid rgba(255,255,255,0.3); letter-spacing:0.5px;">
          🎟 Team ID: <strong>${team.teamId}</strong>
        </div>
      </div>

      <div style="padding:35px 30px; background:#111827;">
        <p style="font-size:17px; line-height:1.6; margin-top:0;">Hello <strong>${team.leader?.name}</strong> & Team,</p>
        <p style="font-size:15.5px; line-height:1.7; color:#cbd5e1;">
          Your team <strong style="color:#38bdf8;">${team.teamName}</strong> is successfully registered for <strong style="color:#fbbf24;">${eventName}</strong> at CROSSROADS 2026.
        </p>

        <div style="margin:28px 0; padding:22px; background:rgba(255,255,255,0.03); border-radius:14px; border:1px solid rgba(255,255,255,0.08);">
          <h3 style="margin-top:0; font-size:19px; color:#38bdf8; margin-bottom:15px;">📋 Registration Overview</h3>
          <table style="width:100%; font-size:14.5px; border-collapse:collapse;">
            <tr><td style="padding:8px 0; color:#94a3b8; font-weight:600; width:38%;">Team ID</td><td style="color:#38bdf8; font-weight:700; font-family:monospace;">${team.teamId}</td></tr>
            <tr><td style="padding:8px 0; color:#94a3b8; font-weight:600;">Team Name</td><td style="color:#f8fafc; font-weight:600;">${team.teamName}</td></tr>
            <tr><td style="padding:8px 0; color:#94a3b8; font-weight:600;">Event</td><td style="color:#fbbf24; font-weight:600;">${eventName}</td></tr>
            <tr><td style="padding:8px 0; color:#94a3b8; font-weight:600;">Fest Dates</td><td style="color:#38bdf8; font-weight:600;">November 28–29, 2026</td></tr>
            <tr><td style="padding:8px 0; color:#94a3b8; font-weight:600;">Team Size</td><td><span style="background:#1e293b; padding:4px 12px; border-radius:12px; color:#38bdf8;">${team.teamSize} member(s)</span></td></tr>
            <tr><td style="padding:8px 0; color:#94a3b8; font-weight:600;">Team Leader</td><td style="color:#f8fafc;">${team.leader?.name} (${team.leader?.email})</td></tr>
            <tr><td style="padding:8px 0; color:#94a3b8; font-weight:600;">Mobile / WhatsApp</td><td style="color:#f8fafc;">${team.leader?.mobile} / ${team.leader?.whatsapp || team.leader?.mobile}</td></tr>
            <tr><td style="padding:8px 0; color:#94a3b8; font-weight:600;">College</td><td style="color:#f8fafc;">${team.college}</td></tr>
            <tr><td style="padding:8px 0; color:#94a3b8; font-weight:600;">Branch & Year</td><td style="color:#f8fafc;">${team.branch} • ${team.year}</td></tr>
          </table>
        </div>

        <div style="margin:28px 0; padding:22px; background:rgba(255,255,255,0.03); border-radius:14px; border:1px solid rgba(255,255,255,0.08);">
          <h3 style="margin-top:0; font-size:18px; color:#fb923c; margin-bottom:15px;">👥 Team Members</h3>
          <table style="width:100%; font-size:14px; border-collapse:collapse;">
            <tr style="background:#1e293b; text-align:left;">
              <th style="padding:10px; color:#94a3b8;">Role</th>
              <th style="padding:10px; color:#94a3b8;">Name</th>
              <th style="padding:10px; color:#94a3b8;">Email</th>
            </tr>
            <tr>
              <td style="padding:10px; border-bottom:1px solid #334155; color:#38bdf8; font-weight:600;">Leader (Primary)</td>
              <td style="padding:10px; border-bottom:1px solid #334155; color:#f8fafc; font-weight:600;">${team.leader?.name}</td>
              <td style="padding:10px; border-bottom:1px solid #334155; color:#94a3b8;">${team.leader?.email}</td>
            </tr>
            ${memberListHtml}
          </table>
        </div>

        <div style="margin:30px 0; padding:24px; background:linear-gradient(135deg,#064e3b,#065f46); border-radius:16px; text-align:center;">
          <h3 style="margin:0 0 12px; font-size:19px; color:white;">📱 Official WhatsApp Community</h3>
          <p style="margin:0 0 18px; font-size:14px; color:#a7f3d0;">Join the WhatsApp community for schedule announcements and event briefings.</p>
          <a href="https://chat.whatsapp.com/KTyS5UeLX1q3wVX7omGqcg" style="display:inline-block; padding:12px 32px; background:white; color:#065f46; text-decoration:none; border-radius:999px; font-weight:700; font-size:15px;">
            Join WhatsApp Group →
          </a>
        </div>

        <hr style="border:none; border-top:1px solid #1f2937; margin:30px 0;">

        <div style="text-align:center; font-size:13px; color:#94a3b8;">
          <p style="margin:0;">CROSSROADS 2026 Organizing Committee</p>
          <p style="margin:4px 0 0;">Hi-Tech Institute of Engineering & Technology, Ghaziabad</p>
          <p style="margin:6px 0 0;">Email: <a href="mailto:crossroads20255@gmail.com" style="color:#38bdf8; text-decoration:none;">crossroads20255@gmail.com</a></p>
        </div>
      </div>
    </div>
  `;
};

// Dispatch confirmation email to leader (TO) and all team members (CC) via Round Robin
const sendTeamConfirmationWithMembersCc = async (team, isManual = false) => {
  if (!team.leader?.email) {
    throw new Error('Team leader email is missing');
  }

  // Extract all valid member emails for CC
  const memberEmails = (team.members || [])
    .map(m => m.email?.trim())
    .filter(e => e && e.includes('@') && e.toLowerCase() !== team.leader.email.toLowerCase());

  const uniqueMemberEmails = [...new Set(memberEmails)];
  const emailHtml = generateRegistrationConfirmationHtml(team);

  const subjectPrefix = isManual ? '[Official Update] ' : '';
  const subject = `${subjectPrefix}Team Registration Confirmed – ${team.teamName} (${team.teamId})`;

  const mailOptions = {
    to: team.leader.email,
    ...(uniqueMemberEmails.length > 0 && { cc: uniqueMemberEmails }),
    subject,
    html: emailHtml
  };

  const result = await sendMailRoundRobin(mailOptions);
  return {
    ...result,
    leaderEmail: team.leader.email,
    ccCount: uniqueMemberEmails.length,
    ccList: uniqueMemberEmails
  };
};

module.exports = {
  transporters,
  sendMailRoundRobin,
  sendTeamConfirmationWithMembersCc,
  EVENT_DISPLAY_NAMES,
  getEventDisplay,
  generateRegistrationConfirmationHtml
};
