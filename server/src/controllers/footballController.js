const asyncHandler = require('../utils/asyncHandler');
const { ok } = require('../utils/apiResponse');
const fd = require('../services/footballDataService');
const { stats: cacheStats } = require('../services/cacheService');

const setCacheHeader = (res, hit) => {
  res.setHeader('X-Cache', hit ? 'HIT' : 'MISS');
};

const competitions = asyncHandler(async (req, res) => {
  const { data, hit } = await fd.getCompetitions();
  setCacheHeader(res, hit);
  return ok(res, { competitions: data, mock: fd.useMock() });
});

const live = asyncHandler(async (req, res) => {
  const { data, hit } = await fd.getLive();
  setCacheHeader(res, hit);
  return ok(res, { matches: data });
});

const today = asyncHandler(async (req, res) => {
  const { data, hit } = await fd.getTodayFixtures();
  setCacheHeader(res, hit);
  return ok(res, { matches: data });
});

const competitionMatches = asyncHandler(async (req, res) => {
  const { code } = req.params;
  const status = (req.query.status || 'SCHEDULED').toUpperCase();
  const { data, hit } = await fd.getCompetitionMatches(code, status);
  setCacheHeader(res, hit);
  return ok(res, { matches: data });
});

const standings = asyncHandler(async (req, res) => {
  const { code } = req.params;
  const { data, hit } = await fd.getStandings(code);
  setCacheHeader(res, hit);
  return ok(res, data);
});

const team = asyncHandler(async (req, res) => {
  const { compCode, teamId } = req.params;
  const { data, hit } = await fd.getTeam(compCode, teamId);
  setCacheHeader(res, hit);
  return ok(res, { team: data });
});

const debug = asyncHandler(async (req, res) =>
  ok(res, { cache: cacheStats(), mockMode: fd.useMock() })
);

module.exports = { competitions, live, today, competitionMatches, standings, team, debug };
