const express = require('express');
const crypto = require('crypto');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// User inputs are sanitized at the boundary (stripNoSqlOperators + strict primitive coercion);
// global Mongoose sanitizeFilter rewrites internal $in/$lte/$gt operators into $eq and breaks queries.

const eventRoutes = require('./routes/event');
const adminRoutes = require('./routes/adminRoutes');
const EmailLog = require('./models/EmailLog');
const { createRateLimiter } = require('./middleware/rateLimit');
const {
  startEmailWorker,
  stopEmailWorker,
  processPendingEmailQueue
} = require('./utils/emailWorker');

// Singleton DB connection & in-flight promise coalescing prevent cold-start storms under bursts
let cachedDb = null;
let connectingPromise = null;

async function connectToDatabase() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }

  if (connectingPromise) {
    return connectingPromise;
  }

  connectingPromise = mongoose
    .connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 8000,
      maxPoolSize: Number(process.env.MONGO_MAX_POOL || 50),
      minPoolSize: 5,
      maxIdleTimeMS: 30000,
      waitQueueTimeoutMS: 10000,
      socketTimeoutMS: 25000,
      family: 4
    })
    .then((db) => {
      cachedDb = db;
      console.log('MongoDB connected (pool size 50)');
      Promise.all([
        require('./models/EventTeam').createIndexes().catch(() => {}),
        EmailLog.createIndexes().catch(() => {}),
        require('./utils/seedAdmin').ensureInitialAdminExists().catch(() => {})
      ]).catch(() => {});
      startEmailWorker();
      return db;
    })
    .catch((err) => {
      cachedDb = null;
      console.error('MongoDB connection error:', err);
      throw err;
    })
    .finally(() => {
      connectingPromise = null;
    });

  return connectingPromise;
}

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);

const stripNoSqlOperators = (value, depth = 0) => {
  if (depth > 8 || value === null || value === undefined) return value;
  if (Array.isArray(value)) {
    return value.map((item) => stripNoSqlOperators(item, depth + 1));
  }
  if (typeof value === 'object') {
    const clean = {};
    for (const [key, val] of Object.entries(value)) {
      if (
        key.startsWith('$') ||
        key.includes('.') ||
        key === '__proto__' ||
        key === 'constructor' ||
        key === 'prototype'
      ) {
        continue;
      }
      clean[key] = stripNoSqlOperators(val, depth + 1);
    }
    return clean;
  }
  return value;
};

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('X-XSS-Protection', '0');
  next();
});

const defaultOrigins = [
  'https://crossroads-hiet.netlify.app',
  'http://localhost:5173',
  'http://localhost:4173'
];
const envOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map((o) => o.trim().replace(/\/+$/, '')).filter((o) => o && o !== '*')
  : [];
const allowedOriginSet = new Set([...defaultOrigins, ...envOrigins]);

app.use(
  cors({
    origin: (requestOrigin, callback) => {
      if (!requestOrigin) return callback(null, true);
      const cleanOrigin = requestOrigin.replace(/\/+$/, '');
      if (allowedOriginSet.has(cleanOrigin)) {
        return callback(null, true);
      }
      const err = new Error(`Origin ${cleanOrigin} not allowed by CORS`);
      err.status = 403;
      return callback(err);
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
    optionsSuccessStatus: 200
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Strip MongoDB $ operators & prototype keys globally from JSON payloads before route handlers
app.use((req, _res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = stripNoSqlOperators(req.body);
  }
  next();
});

// Global burst shield before database access
const globalApiLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 600,
  message: 'Server is handling high traffic. Please retry in a few seconds.'
});
app.use('/api', globalApiLimiter);

// Lazy coalesced DB connection per request
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (err) {
    console.error('DB connection failed:', err);
    return res.status(503).json({
      message: 'Database busy — please retry in a moment'
    });
  }
});

app.use('/api', eventRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/cron/process-email-queue', async (req, res) => {
  try {
    const cronSecret = process.env.CRON_SECRET;
    const authHeader = String(req.headers.authorization || '');
    const expected = cronSecret ? `Bearer ${cronSecret}` : '';
    const isAuthorized =
      Boolean(cronSecret) &&
      authHeader.length === expected.length &&
      crypto.timingSafeEqual(Buffer.from(authHeader), Buffer.from(expected));

    if (!isAuthorized) {
      return res.status(401).json({ message: 'Unauthorized cron trigger' });
    }
    const result = await processPendingEmailQueue(25);
    return res.status(200).json({ ok: true, ...result });
  } catch {
    return res.status(500).json({ ok: false, message: 'Queue processing failed' });
  }
});

// Readiness Probe (minimal non-sensitive health status)
app.get('/api/health', async (_req, res) => {
  try {
    const dbReady = mongoose.connection.readyState === 1;
    res.status(dbReady ? 200 : 503).json({
      status: dbReady ? 'healthy' : 'degraded',
      dbConnected: dbReady
    });
  } catch {
    res.status(500).json({ status: 'error' });
  }
});

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'CROSSROADS 2027 Registration API is running',
    timestamp: new Date().toISOString()
  });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

// Global Express 5 crash-barrier error middleware (logs unhandled registration crashes cleanly)
app.use((err, req, res, _next) => {
  void _next;
  const statusCode =
    err instanceof SyntaxError && err.status === 400 && 'body' in err
      ? 400
      : err.status || err.statusCode || 500;
  const clientMsg =
    statusCode === 400
      ? 'Invalid JSON request payload'
      : statusCode >= 500
      ? 'Internal server error — please try again shortly'
      : err.message;

  if (
    mongoose.connection.readyState === 1 &&
    (req.originalUrl?.includes('event-register') || req.originalUrl?.includes('check-availability'))
  ) {
    const { recordFailedRegistration } = require('./controllers/eventRegisterController');
    recordFailedRegistration(req, {
      errorType: 'server_error',
      httpStatus: statusCode,
      errorMessage: err.message || clientMsg,
      source: 'express_error_guard'
    }).catch(() => {});
  }

  console.error('[Express Error Guard]', statusCode, err.message);
  return res.status(statusCode).json({ message: clientMsg });
});

// Process-level resilience prevents unhandled promise rejections from killing live bursts
if (!process._crCrashGuardsAttached) {
  process._crCrashGuardsAttached = true;
  process.on('unhandledRejection', (reason) => {
    console.error('[Unhandled Rejection Guard]', reason);
  });
  process.on('uncaughtException', (err) => {
    console.error('[Uncaught Exception Guard]', err);
  });
}

const PORT = process.env.PORT || 5000;
let server = null;

if (!process.env.VERCEL && require.main === module) {
  server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    startEmailWorker();
  });

  const gracefulShutdown = (signal) => {
    console.log(`[Shutdown] Received ${signal}, draining connections...`);
    stopEmailWorker();
    if (server) {
      server.close(() => {
        mongoose.connection.close(false).then(() => process.exit(0));
      });
    } else {
      process.exit(0);
    }
  };
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
}

module.exports = app;
