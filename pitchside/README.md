# PitchSide ⚽

A football fixtures, standings, and live scores app demonstrating **smart caching around free-tier API rate limits**.

## Engineering lesson

Football-Data.org's free tier is **10 requests/minute**. PitchSide layers `node-cache` on the server with TTLs tuned per data type so multiple concurrent users (and the live page's polling) all map onto a single upstream call. `express-rate-limit` protects our own routes. A mock-data fallback means the full UX works with **no API key required**.

## Tech stack

- **Frontend:** React 17.0.2 (CRA 5), React Router 6.3, React Query 3.39, axios 0.27, Tailwind 3.1, react-toastify 9, dayjs
- **Backend:** Node 16, Express 4.18, Mongoose 6.5, node-cache 5, express-rate-limit 6, helmet 6, morgan, axios
- **Data source:** [Football-Data.org](https://www.football-data.org) (free tier) with a deterministic mock fallback

## Cache TTLs

| Resource | TTL | Why |
|---|---|---|
| Live scores | 30s | Fresh enough to feel live, slow enough to survive the rate limit |
| Today's fixtures | 2min | Lineup/time changes are rare intraday |
| Competition fixtures | 5min | Future fixtures barely move |
| Standings | 1hr | Updated only after matches finish |
| Teams (squad/info) | 24hr | Roster changes are rare |

## Setup

```bash
# from project root
cd server && npm install
cd ../client && npm install

# create env files
cp server/.env.example server/.env
cp client/.env.example client/.env

# seed (optional — populates favorites demo)
cd server && npm run seed

# one command boots both (from /server)
npm run dev
```

The server runs on `:5000`, the client on `:3000`. Without a `FOOTBALL_DATA_KEY` the backend serves deterministic mock data so every screen still works.

## Features

- Live, upcoming, and finished fixtures (filter by competition)
- League standings (Premier League, La Liga, Serie A, Bundesliga, Ligue 1, Champions League)
- Team pages with squad and recent form
- Auto-refresh on live pages (client polls our cache, not the upstream API)
- Optional auth with favorite competitions/teams (JWT)
- Loading / empty / error states throughout
- Cache hit/miss debug headers (`X-Cache: HIT|MISS`) for verification

## Accent

Pitch green (`#0b8f3a`) on warm neutrals — clean, on-broadcast feel.
