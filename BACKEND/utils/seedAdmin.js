const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const Admin = require('../models/Admin');

/**
 * Idempotently upsert an admin user into MongoDB with salted scrypt password hashing.
 */
const upsertAdminCredentials = async ({ email, password, name = 'Admin', role = 'superadmin' }) => {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  if (!normalizedEmail || !normalizedEmail.includes('@')) {
    throw new Error('A valid admin email address is required for seeding');
  }
  if (!password || String(password).length < 6) {
    throw new Error('Admin password must be at least 6 characters long');
  }

  const passwordHash = Admin.hashPassword(String(password));
  const admin = await Admin.findOneAndUpdate(
    { email: normalizedEmail },
    {
      $set: {
        email: normalizedEmail,
        name,
        passwordHash,
        role,
        isActive: true
      }
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return admin;
};

/**
 * Fallback bootstrap: if no Admin records exist in MongoDB yet,
 * automatically seed one from ADMIN_USERNAME / ADMIN_PASSWORD env vars.
 */
const ensureInitialAdminExists = async () => {
  const existingCount = await Admin.countDocuments();
  if (existingCount > 0) return null;

  const envEmail = process.env.ADMIN_USERNAME;
  const envPass = process.env.ADMIN_PASSWORD;
  if (!envEmail || !envPass) return null;

  return upsertAdminCredentials({
    email: envEmail,
    password: envPass,
    name: 'Admin',
    role: 'superadmin'
  });
};

// Direct CLI execution: `npm run seed:admin` or `node utils/seedAdmin.js`
if (require.main === module) {
  (async () => {
    try {
      const mongoUri = process.env.MONGO_URI;
      if (!mongoUri) {
        throw new Error('MONGO_URI is missing in environment variables');
      }

      const emailArgIdx = process.argv.indexOf('--email');
      const passArgIdx = process.argv.indexOf('--password');
      const email = emailArgIdx !== -1 ? process.argv[emailArgIdx + 1] : process.env.ADMIN_USERNAME;
      const password = passArgIdx !== -1 ? process.argv[passArgIdx + 1] : process.env.ADMIN_PASSWORD;

      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 10000,
        family: 4
      });

      const seeded = await upsertAdminCredentials({ email, password });
      console.log(`Admin seeded successfully in database: ${seeded.email} (role: ${seeded.role})`);
      await mongoose.disconnect();
      process.exit(0);
    } catch (err) {
      console.error('Failed to seed admin credentials:', err.message);
      await mongoose.disconnect().catch(() => {});
      process.exit(1);
    }
  })();
}

module.exports = {
  upsertAdminCredentials,
  ensureInitialAdminExists
};
