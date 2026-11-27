const mongoose = require('mongoose');
const crypto = require('crypto');

const SCRYPT_KEYLEN = 64;

const hashPassword = (plainPassword) => {
  if (!plainPassword || typeof plainPassword !== 'string') {
    throw new Error('Password must be a non-empty string');
  }
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(plainPassword, salt, SCRYPT_KEYLEN).toString('hex');
  return `${salt}:${derivedKey}`;
};

const verifyPasswordHash = (plainPassword, storedHash) => {
  if (!plainPassword || !storedHash || !storedHash.includes(':')) return false;
  const [salt, originalHex] = storedHash.split(':');
  if (!salt || !originalHex) return false;
  const derivedBuf = crypto.scryptSync(plainPassword, salt, SCRYPT_KEYLEN);
  const originalBuf = Buffer.from(originalHex, 'hex');
  if (derivedBuf.length !== originalBuf.length) return false;
  return crypto.timingSafeEqual(derivedBuf, originalBuf);
};

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    default: 'Admin',
    trim: true
  },
  passwordHash: {
    type: String,
    required: true,
    select: false
  },
  role: {
    type: String,
    enum: ['superadmin', 'admin'],
    default: 'admin'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  failedLoginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date,
    default: null
  },
  lastLoginAt: {
    type: Date
  }
}, { timestamps: true });

adminSchema.statics.hashPassword = hashPassword;

adminSchema.methods.verifyPassword = function(plainPassword) {
  return verifyPasswordHash(plainPassword, this.passwordHash);
};

module.exports = mongoose.model('Admin', adminSchema);
