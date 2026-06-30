// Deterministic mock data so the app works end-to-end without a Football-Data key.
// Shape matches what the real service normalizes to.

const dayjs = require('../utils/dayjs');

const COMPETITIONS = [
  { code: 'PL', name: 'Premier League', area: 'England', emblem: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { code: 'PD', name: 'La Liga', area: 'Spain', emblem: '🇪🇸' },
  { code: 'SA', name: 'Serie A', area: 'Italy', emblem: '🇮🇹' },
  { code: 'BL1', name: 'Bundesliga', area: 'Germany', emblem: '🇩🇪' },
  { code: 'FL1', name: 'Ligue 1', area: 'France', emblem: '🇫🇷' },
  { code: 'CL', name: 'Champions League', area: 'Europe', emblem: '⭐' },
];

const TEAMS_BY_COMP = {
  PL: [
    'Arsenal', 'Manchester City', 'Liverpool', 'Tottenham', 'Manchester United',
    'Chelsea', 'Newcastle', 'Aston Villa', 'Brighton', 'West Ham',
    'Brentford', 'Crystal Palace', 'Fulham', 'Wolves', 'Everton',
    'Nottingham Forest', 'Bournemouth', 'Leicester', 'Ipswich', 'Southampton',
  ],
  PD: [
    'Real Madrid', 'Barcelona', 'Atletico Madrid', 'Athletic Bilbao', 'Real Sociedad',
    'Villarreal', 'Real Betis', 'Sevilla', 'Valencia', 'Girona',
  ],
  SA: [
    'Inter', 'Juventus', 'AC Milan', 'Napoli', 'Atalanta',
    'Roma', 'Lazio', 'Fiorentina', 'Bologna', 'Torino',
  ],
  BL1: [
    'Bayern Munich', 'Borussia Dortmund', 'RB Leipzig', 'Bayer Leverkusen', 'Stuttgart',
    'Eintracht Frankfurt', 'Wolfsburg', 'Freiburg', 'Hoffenheim', 'Mainz',
  ],
  FL1: [
    'Paris Saint-Germain', 'Monaco', 'Marseille', 'Lille', 'Nice',
    'Lyon', 'Lens', 'Rennes', 'Toulouse', 'Strasbourg',
  ],
  CL: [
    'Real Madrid', 'Manchester City', 'Bayern Munich', 'Paris Saint-Germain',
    'Inter', 'Arsenal', 'Barcelona', 'Borussia Dortmund',
  ],
};

// Simple deterministic PRNG so output is stable per day.
const seedFor = (str) => {
  let h = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};
const rng = (seed) => {
  let s = seed || 1;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
};
const pick = (rand, arr) => arr[Math.floor(rand() * arr.length)];

const teamObj = (id, name) => ({
  id,
  name,
  shortName: name.split(' ').slice(-1)[0],
  crest: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0b8f3a&color=fff&bold=true`,
});

const buildMatches = (compCode, { status, days, count }) => {
  const teams = TEAMS_BY_COMP[compCode] || TEAMS_BY_COMP.PL;
  const rand = rng(seedFor(`${compCode}-${status}-${dayjs().format('YYYY-MM-DD')}`));
  const out = [];
  for (let i = 0; i < count; i += 1) {
    const home = pick(rand, teams);
    let away = pick(rand, teams);
    while (away === home) away = pick(rand, teams);
    const dayOffset = days[Math.floor(rand() * days.length)];
    const hour = 12 + Math.floor(rand() * 8);
    const minute = (Math.floor(rand() * 4) * 15) % 60;
    const utcDate = dayjs().add(dayOffset, 'day').hour(hour).minute(minute).second(0).toISOString();

    let score = { home: null, away: null };
    let minuteInGame = null;
    if (status === 'LIVE' || status === 'IN_PLAY') {
      score = { home: Math.floor(rand() * 4), away: Math.floor(rand() * 4) };
      minuteInGame = 5 + Math.floor(rand() * 85);
    } else if (status === 'FINISHED') {
      score = { home: Math.floor(rand() * 5), away: Math.floor(rand() * 5) };
    }

    out.push({
      id: `${compCode}-${status}-${i}-${seedFor(home + away)}`,
      competition: { code: compCode, name: COMPETITIONS.find((c) => c.code === compCode)?.name || compCode },
      utcDate,
      status,
      minute: minuteInGame,
      homeTeam: teamObj(seedFor(home), home),
      awayTeam: teamObj(seedFor(away), away),
      score,
      venue: `${home} Stadium`,
    });
  }
  return out.sort((a, b) => new Date(a.utcDate) - new Date(b.utcDate));
};

const buildStandings = (compCode) => {
  const teams = TEAMS_BY_COMP[compCode] || TEAMS_BY_COMP.PL;
  const rand = rng(seedFor(`${compCode}-standings-${dayjs().format('YYYY-MM')}`));
  return teams.map((name, idx) => {
    const played = 20 + Math.floor(rand() * 5);
    const won = Math.max(0, Math.floor(played * (0.7 - idx * 0.03)) + Math.floor(rand() * 3));
    const drawn = Math.floor(rand() * (played - won));
    const lost = played - won - drawn;
    const gf = won * 2 + drawn + Math.floor(rand() * 10);
    const ga = lost * 2 + Math.floor(rand() * 10);
    return {
      position: idx + 1,
      team: teamObj(seedFor(name), name),
      playedGames: played,
      won, drawn, lost,
      goalsFor: gf,
      goalsAgainst: ga,
      goalDifference: gf - ga,
      points: won * 3 + drawn,
    };
  }).sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference)
    .map((row, i) => ({ ...row, position: i + 1 }));
};

const buildTeam = (compCode, teamId) => {
  const teams = TEAMS_BY_COMP[compCode] || TEAMS_BY_COMP.PL;
  const name = teams.find((n) => seedFor(n) === Number(teamId)) || teams[0];
  const rand = rng(seedFor(`team-${name}`));
  const positions = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'];
  const firstNames = ['James', 'Marco', 'Luis', 'Kai', 'Pedro', 'Ousmane', 'Lukas', 'Diego', 'Mason', 'Riyad'];
  const lastNames = ['Silva', 'Garcia', 'Müller', 'Rossi', 'Smith', 'Dubois', 'Kovac', 'Schmidt', 'Hernandez', 'Bernardo'];
  const squad = Array.from({ length: 23 }).map((_, i) => ({
    id: i + 1,
    name: `${pick(rand, firstNames)} ${pick(rand, lastNames)}`,
    position: positions[Math.min(3, Math.floor(i / 6))],
    shirtNumber: i + 1,
    nationality: pick(rand, ['Spain', 'England', 'Brazil', 'France', 'Germany', 'Italy', 'Argentina']),
  }));
  return {
    id: seedFor(name),
    name,
    shortName: name.split(' ').slice(-1)[0],
    crest: teamObj(seedFor(name), name).crest,
    founded: 1880 + Math.floor(rand() * 130),
    venue: `${name} Stadium`,
    website: `https://example.com/${name.toLowerCase().replace(/\s+/g, '-')}`,
    competition: COMPETITIONS.find((c) => c.code === compCode),
    squad,
  };
};

module.exports = {
  COMPETITIONS,
  mockCompetitions: () => COMPETITIONS,
  mockLive: () => {
    const all = [];
    for (const c of COMPETITIONS.slice(0, 4)) {
      all.push(...buildMatches(c.code, { status: 'LIVE', days: [0], count: 2 }));
    }
    return all;
  },
  mockTodayFixtures: () => {
    const all = [];
    for (const c of COMPETITIONS) {
      all.push(...buildMatches(c.code, { status: 'SCHEDULED', days: [0], count: 3 }));
    }
    return all;
  },
  mockCompetitionMatches: (compCode, status) => {
    if (status === 'LIVE') return buildMatches(compCode, { status: 'LIVE', days: [0], count: 3 });
    if (status === 'FINISHED') return buildMatches(compCode, { status: 'FINISHED', days: [-1, -2, -3, -4], count: 8 });
    return buildMatches(compCode, { status: 'SCHEDULED', days: [1, 2, 3, 4, 5, 6, 7], count: 10 });
  },
  mockStandings: (compCode) => ({
    competition: COMPETITIONS.find((c) => c.code === compCode),
    table: buildStandings(compCode),
  }),
  mockTeam: (compCode, teamId) => buildTeam(compCode, teamId),
};
