// api/telemetry.js — End-of-game telemetry (called on game over before name submit)
// Updates all global aggregate stats.
import { kv } from '@vercel/kv';

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

  await Promise.all([
    kv.hincrbyfloat('gstats', 'dist_px',    distPx),
    kv.hincrby     ('gstats', 'kills',      kills),
    kv.hincrby     ('gstats', 'playtime_ms',durationMs),
    kv.hincrby     ('gstats', 'pickups',    pickups),
    kv.hincrby     ('gstats', 'boss_kills', bossKills),
    kv.hincrby     ('gstats', 'burps',      burps),
    kv.hincrby     ('gstats', 'games',      1),
    // Track highest score ever
    kv.eval(
      `local cur = tonumber(redis.call('GET', KEYS[1])) or 0
       if tonumber(ARGV[1]) > cur then redis.call('SET', KEYS[1], ARGV[1]) end
       return 1`,
      1, 'high_score', score
    ),
  ]);

  return res.json({ ok: true });
}
