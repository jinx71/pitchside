const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { ok, fail } = require('../utils/apiResponse');

const sign = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const sanitize = (u) => ({
  id: u._id,
  name: u.name,
  email: u.email,
  favoriteCompetitions: u.favoriteCompetitions || [],
  favoriteTeams: u.favoriteTeams || [],
});

const register = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return fail(res, 'Validation error', 422, errors.array());

  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return fail(res, 'Email already registered', 409);

  const user = await User.create({ name, email, password });
  return ok(res, { user: sanitize(user), token: sign(user._id) }, 'Registered', 201);
});

const login = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return fail(res, 'Validation error', 422, errors.array());

  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    return fail(res, 'Invalid credentials', 401);
  }
  return ok(res, { user: sanitize(user), token: sign(user._id) }, 'Logged in');
});

const me = asyncHandler(async (req, res) => ok(res, { user: sanitize(req.user) }));

const updateFavorites = asyncHandler(async (req, res) => {
  const { favoriteCompetitions, favoriteTeams } = req.body;
  if (Array.isArray(favoriteCompetitions)) {
    req.user.favoriteCompetitions = favoriteCompetitions;
  }
  if (Array.isArray(favoriteTeams)) {
    req.user.favoriteTeams = favoriteTeams;
  }
  await req.user.save();
  return ok(res, { user: sanitize(req.user) }, 'Favorites updated');
});

module.exports = { register, login, me, updateFavorites };
