const NodeCache = require('node-cache');

// TTLs in seconds. Tuned per data type so live screens feel fresh
// while standings/teams stay sticky and don't burn rate limit.
const TTL = {
  live: 30,         // live scores: fresh enough, rate-limit-safe
  today: 120,       // today's fixtures: kickoff/lineup changes are rare
  fixtures: 300,    // future fixtures: barely move
  standings: 3600,  // standings: only after matches finish
  teams: 86400,     // squad/team info: changes rarely
  default: 60,
};

const cache = new NodeCache({
  stdTTL: TTL.default,
  checkperiod: 60,
  useClones: false, // we return read-only data; skip cloning for perf
});

/**
 * getOrSet — the only function you actually need.
 * Returns { data, hit } so handlers can flag X-Cache headers.
 */
const getOrSet = async (key, ttlSeconds, fetcher) => {
  const cached = cache.get(key);
  if (cached !== undefined) {
    return { data: cached, hit: true };
  }
  const data = await fetcher();
  // Don't cache empties — let next request retry.
  if (data !== null && data !== undefined) {
    cache.set(key, data, ttlSeconds);
  }
  return { data, hit: false };
};

const invalidate = (key) => cache.del(key);
const flush = () => cache.flushAll();
const stats = () => ({ keys: cache.keys(), ...cache.getStats() });

module.exports = { cache, getOrSet, invalidate, flush, stats, TTL };
