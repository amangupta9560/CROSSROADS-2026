const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const ALLOWED_ADMIN_ROLES = new Set(['admin', 'superadmin']);

const protect = async (req, res, next) => {
  const bearerHeader = req.headers.authorization;
  const bearerToken =
    typeof bearerHeader === 'string' && bearerHeader.startsWith('Bearer ')
      ? bearerHeader.slice(7).trim()
      : '';
  const token = req.header('x-auth-token') || bearerToken;

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256']
    });

    if (!decoded?.id || !ALLOWED_ADMIN_ROLES.has(decoded.role)) {
      return res.status(403).json({ msg: 'Forbidden: admin privileges required' });
    }

    const admin = await Admin.findOne({ _id: decoded.id, isActive: true })
      .select('_id email name role')
      .lean();

    if (!admin || !ALLOWED_ADMIN_ROLES.has(admin.role)) {
      return res.status(403).json({ msg: 'Forbidden: admin account inactive or unauthorized' });
    }

    req.user = {
      id: admin._id.toString(),
      email: admin.email,
      username: admin.email,
      name: admin.name,
      role: admin.role
    };
    return next();
  } catch {
    return res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = protect;
