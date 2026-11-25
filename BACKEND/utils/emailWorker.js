const mongoose = require('mongoose');
const EmailLog = require('../models/EmailLog');
const EventTeam = require('../models/EventTeam');
const { sendMailRoundRobin, transporters } = require('./mailer');
const { buildRegistrationFilterQuery } = require('./queryBuilder');
const { buildFormattedRegistrationWorkbook } = require('./excelReport');

let workerInterval = null;
let isDraining = false;

/**
 * Reconstruct optional formatted Excel attachment for queued/resent report emails
 * so large spreadsheet binaries don't bloat MongoDB EmailLog documents.
 */
const buildAttachmentsForLog = async (logDoc) => {
  const params = logDoc.reportParams;
  if (!params || !params.attachExcel) return [];

  const query = buildRegistrationFilterQuery(params.filterInput || {});
  if (params.istDayRange) {
    query.appliedAt = {
      $gte: new Date(params.istDayRange.start),
      $lt: new Date(params.istDayRange.end)
    };
  }

  const teams = await EventTeam.find(query).sort({ appliedAt: -1 }).lean();
  if (teams.length === 0) return [];

  const workbook = await buildFormattedRegistrationWorkbook(teams, params.scopeLabel || 'All Registrations');
  const buffer = await workbook.xlsx.writeBuffer();
  return [
    {
      filename: logDoc.attachmentFilename || 'CROSSROADS_2027_Report.xlsx',
      content: buffer,
      contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }
  ];
};

/**
 * Atomically claim and dispatch a single EmailLog entry via persistent Round Robin SMTP,
 * recording exact `sentVia`, `messageId`, or `lastError` for full observability & 1-click resend.
 */
const processSingleEmailLog = async (logOrId) => {
  const logId = typeof logOrId === 'string' || logOrId instanceof mongoose.Types.ObjectId ? logOrId : logOrId._id;

  const claimed = await EmailLog.findOneAndUpdate(
    { _id: logId, status: { $in: ['queued', 'failed'] } },
    { $set: { status: 'sending', lastError: '' }, $inc: { attempts: 1 } },
    { new: true }
  );

  if (!claimed) {
    return { skipped: true };
  }

  try {
    const attachments = await buildAttachmentsForLog(claimed);

    const mailOptions = {
      ...(claimed.to?.length ? { to: claimed.to } : {}),
      ...(claimed.cc?.length ? { cc: claimed.cc } : {}),
      ...(claimed.bcc?.length ? { bcc: claimed.bcc } : {}),
      ...(claimed.replyTo ? { replyTo: claimed.replyTo } : {}),
      subject: claimed.subject,
      html: claimed.html,
      ...(attachments.length > 0 ? { attachments } : {})
    };

    const result = await sendMailRoundRobin(mailOptions, {
      preferredSmtpUser: claimed.preferredSmtpUser || null
    });

    claimed.status = 'sent';
    claimed.sentVia = result.sentVia || '';
    claimed.messageId = result.messageId || '';
    claimed.sentAt = new Date();
    claimed.lastError = '';
    await claimed.save();

    return { success: true, log: claimed, sentVia: result.sentVia };
  } catch (err) {
    claimed.status = 'failed';
    claimed.lastError = String(err.message || 'SMTP delivery failed').slice(0, 600);
    await claimed.save();

    return { success: false, log: claimed, error: claimed.lastError };
  }
};

/**
 * Create an EmailLog entry (`queued`) and optionally attempt immediate delivery
 * (ideal for Vercel serverless where background intervals don't outlive the HTTP response).
 */
const enqueueEmail = async (payload, { sendImmediately = true } = {}) => {
  const doc = await EmailLog.create({
    category: payload.category || 'registration_confirmation',
    status: 'queued',
    to: Array.isArray(payload.to) ? payload.to : payload.to ? [payload.to] : [],
    cc: Array.isArray(payload.cc) ? payload.cc : payload.cc ? [payload.cc] : [],
    bcc: Array.isArray(payload.bcc) ? payload.bcc : payload.bcc ? [payload.bcc] : [],
    replyTo: payload.replyTo || '',
    subject: payload.subject,
    html: payload.html,
    preferredSmtpUser: payload.preferredSmtpUser || '',
    teamId: payload.teamId || '',
    teamRef: payload.teamRef || undefined,
    event: payload.event || '',
    hasAttachment: Boolean(payload.hasAttachment || payload.reportParams?.attachExcel),
    attachmentFilename: payload.attachmentFilename || '',
    reportParams: payload.reportParams || null,
    queuedAt: new Date()
  });

  if (!sendImmediately) {
    return { success: true, queued: true, log: doc };
  }

  return processSingleEmailLog(doc);
};

/**
 * Queue a batch of EmailLog entries and process as many as safely fit within
 * Vercel's inline execution budget using pooled Round Robin concurrency.
 * Any remaining items stay safely `queued` for manual drain, Cron, or local worker.
 */
const enqueueBatchEmails = async (payloads, { maxInlineDurationMs = 7500 } = {}) => {
  if (!Array.isArray(payloads) || payloads.length === 0) {
    return { queued: 0, sent: 0, failed: 0, remainingQueued: 0, usedAccounts: [] };
  }

  const docsToInsert = payloads.map((p) => ({
    category: p.category || 'broadcast',
    status: 'queued',
    to: Array.isArray(p.to) ? p.to : p.to ? [p.to] : [],
    cc: Array.isArray(p.cc) ? p.cc : p.cc ? [p.cc] : [],
    bcc: Array.isArray(p.bcc) ? p.bcc : p.bcc ? [p.bcc] : [],
    replyTo: p.replyTo || '',
    subject: p.subject,
    html: p.html,
    preferredSmtpUser: p.preferredSmtpUser || '',
    teamId: p.teamId || '',
    teamRef: p.teamRef || undefined,
    event: p.event || '',
    hasAttachment: Boolean(p.hasAttachment),
    attachmentFilename: p.attachmentFilename || '',
    reportParams: p.reportParams || null,
    queuedAt: new Date()
  }));

  const inserted = await EmailLog.insertMany(docsToInsert, { ordered: false });

  const startTime = Date.now();
  const concurrency = Math.max(1, Math.min(transporters.length, 4));
  let sent = 0;
  let failed = 0;
  let processed = 0;
  const usedAccounts = new Set();

  for (let i = 0; i < inserted.length; i += concurrency) {
    if (Date.now() - startTime > maxInlineDurationMs) {
      break;
    }

    const chunk = inserted.slice(i, i + concurrency);
    const results = await Promise.all(chunk.map((logDoc) => processSingleEmailLog(logDoc)));
    processed += chunk.length;

    results.forEach((r) => {
      if (r.success) {
        sent += 1;
        if (r.sentVia) usedAccounts.add(r.sentVia);
      } else if (!r.skipped) {
        failed += 1;
      }
    });
  }

  return {
    queued: inserted.length,
    processed,
    sent,
    failed,
    remainingQueued: Math.max(0, inserted.length - processed),
    usedAccounts: Array.from(usedAccounts)
  };
};

/**
 * Drain pending queued emails in batches of `batchSize` (default 15),
 * rescuing any stale `sending` entries older than 2 minutes.
 */
const processPendingEmailQueue = async (batchSize = 15, { maxDurationMs = 8000 } = {}) => {
  if (isDraining || mongoose.connection.readyState !== 1) {
    return { busy: true, processed: 0, sent: 0, failed: 0 };
  }

  isDraining = true;
  const startTime = Date.now();

  try {
    // Re-queue orphaned 'sending' rows stuck > 2 minutes (e.g. abrupt lambda termination)
    const staleCutoff = new Date(Date.now() - 2 * 60 * 1000);
    await EmailLog.updateMany(
      { status: 'sending', updatedAt: { $lt: staleCutoff }, attempts: { $lt: 3 } },
      { $set: { status: 'queued' } }
    );

    const pending = await EmailLog.find({ status: 'queued' })
      .sort({ queuedAt: 1 })
      .limit(batchSize)
      .select('_id')
      .lean();

    if (pending.length === 0) {
      return { busy: false, processed: 0, sent: 0, failed: 0, remainingQueued: 0 };
    }

    const concurrency = Math.max(1, Math.min(transporters.length, 4));
    let sent = 0;
    let failed = 0;
    let processed = 0;

    for (let i = 0; i < pending.length; i += concurrency) {
      if (Date.now() - startTime > maxDurationMs) break;
      const chunk = pending.slice(i, i + concurrency);
      const results = await Promise.all(chunk.map((item) => processSingleEmailLog(item._id)));
      processed += chunk.length;
      results.forEach((r) => {
        if (r.success) sent += 1;
        else if (!r.skipped) failed += 1;
      });
    }

    const remainingQueued = await EmailLog.countDocuments({ status: 'queued' });
    return { busy: false, processed, sent, failed, remainingQueued };
  } finally {
    isDraining = false;
  }
};

/**
 * Re-queue and immediately resend a specific EmailLog entry by ID.
 */
const resendEmailLogById = async (logId) => {
  const existing = await EmailLog.findById(logId);
  if (!existing) {
    return null;
  }

  existing.status = 'queued';
  existing.lastError = '';
  existing.queuedAt = new Date();
  await existing.save();

  return processSingleEmailLog(existing);
};

/**
 * Start a 15-second background worker polling loop for non-serverless Node environments.
 * On Vercel serverless, inline dispatch + `/api/admin/email-logs/process-queue` handle queue draining.
 */
const startEmailWorker = () => {
  if (process.env.VERCEL || workerInterval) return;

  workerInterval = setInterval(() => {
    processPendingEmailQueue(15).catch((err) => {
      console.warn('[EmailWorker] Queue drain error:', err.message);
    });
  }, 15000);

  if (typeof workerInterval.unref === 'function') {
    workerInterval.unref();
  }
};

const stopEmailWorker = () => {
  if (workerInterval) {
    clearInterval(workerInterval);
    workerInterval = null;
  }
};

module.exports = {
  processSingleEmailLog,
  enqueueEmail,
  enqueueBatchEmails,
  processPendingEmailQueue,
  resendEmailLogById,
  startEmailWorker,
  stopEmailWorker
};
