const axios = require('axios');
const { getOrSet, TTL } = require('./cacheService');
const mock = require('./mockData');

const BASE = 'https://api.football-data.org/v4';

const useMock = () => !process.env.FOOTBALL_DATA_KEY;

const client = axios.create({
  baseURL: BASE,
  timeout: 8000,
});

const headers = () => ({ 'X-Auth-Token': process.env.FOOTBALL_DATA_KEY || '' });

// Normalize Football-Data v4 match shape into our app shape.
const normalizeMatch = (m) => ({
  id: String(m.id),
  competition: { code: m.competition?.code, name: m.competition?.name },
  utcDate: m.utcDate,
  status: m.status, // SCHEDULED | LIVE | IN_PLAY | PAUSED | FINISHED | POSTPONED
  minute: m.minute || null,
  homeTeam: {
    id: m.homeTeam?.id,
    name: m.homeTeam?.name || 'TBD',
    shortName: m.homeTeam?.shortName || m.homeTeam?.tla || '',
    crest: m.homeTeam?.crest,
  },
  awayTeam: {
    id: m.awayTeam?.id,
    name: m.awayTeam?.name || 'TBD',
    shortName: m.awayTeam?.shortName || m.awayTeam?.tla || '',
    crest: m.awayTeam?.crest,
  },
  score: {
    home: m.score?.fullTime?.home ?? m.score?.halfTime?.home ?? null,
    away: m.score?.fullTime?.away ?? m.score?.halfTime?.away ?? null,
  },
  venue: m.venue || null,
});

const COMPETITIONS = [
  { code: 'PL', name: 'Premier League', area: 'England' },
  { code: 'PD', name: 'La Liga', area: 'Spain' },
  { code: 'SA', name: 'Serie A', area: 'Italy' },
  { code: 'BL1', name: 'Bundesliga', area: 'Germany' },
  { code: 'FL1', name: 'Ligue 1', area: 'France' },
  { code: 'CL', name: 'Champions League', area: 'Europe' },
];

const getCompetitions = async () => {
  const { data, hit } = await getOrSet('competitions', TTL.teams, async () => {
    if (useMock()) return mock.mockCompetitions();
    const res = await client.get('/competitions', { headers: headers() });
    return (res.data?.competitions || [])
      .filter((c) => COMPETITIONS.some((k) => k.code === c.code))
      .map((c) => ({ code: c.code, name: c.name, area: c.area?.name, emblem: c.emblem }));
  });
  return { data, hit };
};

const getLive = async () => {
  const { data, hit } = await getOrSet('matches:live', TTL.live, async () => {
    if (useMock()) return mock.mockLive();
    const res = await client.get('/matches', {
      headers: headers(),
      params: { status: 'LIVE' },
    });
    return (res.data?.matches || []).map(normalizeMatch);
  });
  return { data, hit };
};

const getTodayFixtures = async () => {
  const { data, hit } = await getOrSet('matches:today', TTL.today, async () => {
    if (useMock()) return mock.mockTodayFixtures();
    const res = await client.get('/matches', { headers: headers() });
    return (res.data?.matches || []).map(normalizeMatch);
  });
  return { data, hit };
};

const getCompetitionMatches = async (compCode, status = 'SCHEDULED') => {
  const key = `matches:${compCode}:${status}`;
  const ttl = status === 'LIVE' ? TTL.live : TTL.fixtures;
  const { data, hit } = await getOrSet(key, ttl, async () => {
    if (useMock()) return mock.mockCompetitionMatches(compCode, status);
    const res = await client.get(`/competitions/${compCode}/matches`, {
      headers: headers(),
      params: { status },
    });
    return (res.data?.matches || []).map(normalizeMatch);
  });
  return { data, hit };
};

const getStandings = async (compCode) => {
  const key = `standings:${compCode}`;
  const { data, hit } = await getOrSet(key, TTL.standings, async () => {
    if (useMock()) return mock.mockStandings(compCode);
    const res = await client.get(`/competitions/${compCode}/standings`, { headers: headers() });
    const tableRows = res.data?.standings?.find((s) => s.type === 'TOTAL')?.table || [];
    return {
      competition: { code: compCode, name: res.data?.competition?.name },
      table: tableRows.map((row) => ({
        position: row.position,
        team: {
          id: row.team?.id,
          name: row.team?.name,
          shortName: row.team?.shortName || row.team?.tla,
          crest: row.team?.crest,
        },
        playedGames: row.playedGames,
        won: row.won,
        drawn: row.draw,
        lost: row.lost,
        goalsFor: row.goalsFor,
        goalsAgainst: row.goalsAgainst,
        goalDifference: row.goalDifference,
        points: row.points,
      })),
    };
  });
  return { data, hit };
};

const getTeam = async (compCode, teamId) => {
  const key = `team:${compCode}:${teamId}`;
  const { data, hit } = await getOrSet(key, TTL.teams, async () => {
    if (useMock()) return mock.mockTeam(compCode, teamId);
    const res = await client.get(`/teams/${teamId}`, { headers: headers() });
    const t = res.data || {};
    return {
      id: t.id,
      name: t.name,
      shortName: t.shortName || t.tla,
      crest: t.crest,
      founded: t.founded,
      venue: t.venue,
      website: t.website,
      competition: { code: compCode, name: '' },
      squad: (t.squad || []).map((p) => ({
        id: p.id,
        name: p.name,
        position: p.position,
        shirtNumber: p.shirtNumber,
        nationality: p.nationality,
      })),
    };
  });
  return { data, hit };
};

module.exports = {
  useMock,
  getCompetitions,
  getLive,
  getTodayFixtures,
  getCompetitionMatches,
  getStandings,
  getTeam,
};
