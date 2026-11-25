// index.js   (main entry point — for Vercel serverless or local Node.js)

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const eventRoutes = require('./routes/event');  // ← your only route right now
const adminRoutes = require('./routes/adminRoutes');
const { startEmailWorker, processPendingEmailQueue } = require('./utils/emailWorker');

// Cached DB connection (important for Vercel/serverless — avoids reconnecting every request)
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
      minPoolSize: 2,
      socketTimeoutMS: 20000,
      family: 4,                 // Prefer IPv4
    });

    cachedDb = db;
    console.log('MongoDB connected (cached)');
    // Ensure $text and analytics indexes exist cleanly without blocking requests
    require('./models/EventTeam').createIndexes().catch(() => {});
    require('./utils/seedAdmin').ensureInitialAdminExists().catch(() => {});
    startEmailWorker();
    return db;
  } catch (err) {
    cachedDb = null;
    console.error('MongoDB connection error:', err);
    throw err;
  }
}

const app = express();

// Middleware — honor FRONTEND_URL when configured (supports comma-separated origins)
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map((o) => o.trim()).filter(Boolean)
  : null;

app.use(
  cors({
    origin: allowedOrigins && allowedOrigins.length > 0 ? allowedOrigins : '*',
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Lazy DB connection per request
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (err) {
    console.error('DB connection failed:', err);
    return res.status(503).json({ 
      message: 'Database unavailable — try again later' 
    });
  }
});

// ── Only event routes right now ──
app.use('/api', eventRoutes);
app.use('/api/admin', adminRoutes);

// Cron / webhook endpoint to drain queued emails in serverless (Vercel Cron compatible)
app.get('/api/cron/process-email-queue', async (req, res) => {
  try {
    if (process.env.CRON_SECRET && req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
      return res.status(401).json({ message: 'Unauthorized cron trigger' });
    }
    const result = await processPendingEmailQueue(15);
    res.status(200).json({ ok: true, ...result });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

// Simple root / health check
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'CROSSROADS 2027 Registration API is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

// For local development (Vercel ignores listen)
const PORT = process.env.PORT || 5000;

if (!process.env.VERCEL && process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    startEmailWorker();
  });
}

// Export for Vercel
module.exports = app;