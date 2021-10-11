const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) {
    const err = new Error('Not authorized');
    err.status = 401;
    throw err;
  }
  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      const err = new Error('User not found');
      err.status = 401;
      throw err;
    }
    req.user = user;
    next();
  } catch (e) {
    const err = new Error('Invalid token');
    err.status = 401;
    throw err;
  }
});

// Optional protect: attach req.user if token valid, otherwise continue.
const maybeProtect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return next();
  try {
    const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
  } catch (_) {
    /* swallow */
  }
  next();
});

module.exports = { protect, maybeProtect };
