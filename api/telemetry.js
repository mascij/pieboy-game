// api/telemetry.js — End-of-game telemetry (called on game over before name submit)
// Updates all global aggregate stats.
import { Redis } from '@upstash/redis';
const redis = Redis.fromEnv();

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(req, res) {
  Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v));
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const b = req.body || {};
  const distPx    = Math.max(0, parseInt(b.distancePx)  || 0);
  const kills     = Math.max(0, parseInt(b.kills)        || 0);
  const durationMs= Math.max(0, parseInt(b.durationMs)   || 0);
  const pickups   = Math.max(0, parseInt(b.pickups)      || 0);
  const bossKills = Math.max(0, parseInt(b.bossKills)    || 0);
  const burps     = Math.max(0, parseInt(b.burpsFired)   || 0);
  const score     = Math.max(0, parseInt(b.score)        || 0);

  // Update aggregate stats in parallel
  await Promise.all([
    redis.hincrbyfloat('gstats', 'dist_px',     distPx),
    redis.hincrby     ('gstats', 'kills',       kills),
    redis.hincrby     ('gstats', 'playtime_ms', durationMs),
    redis.hincrby     ('gstats', 'pickups',     pickups),
    redis.hincrby     ('gstats', 'boss_kills',  bossKills),
    redis.hincrby     ('gstats', 'burps',       burps),
    redis.hincrby     ('gstats', 'games',       1),
  ]);

  // Track all-time high score (Upstash doesn't support Lua eval over HTTP,
  // so we do a simple get-then-set — race condition is acceptable for a game)
  const curHigh = parseInt(await redis.get('high_score')) || 0;
  if (score > curHigh) await redis.set('high_score', score);

  return res.json({ ok: true });
}
