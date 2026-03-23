// api/scores.js — Global leaderboard (top 100 stored, top 10 returned)
import { Redis } from '@upstash/redis';
const redis = Redis.fromEnv(); // reads UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(req, res) {
  Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v));
  if (req.method === 'OPTIONS') return res.status(200).end();

  // ── GET: fetch top 10 ────────────────────────────────────────────────────
  if (req.method === 'GET') {
    try {
      const limit = Math.min(parseInt(req.query?.limit) || 10, 50);
      // Use negative indices to get highest-ranked members, then reverse client-side
      // This avoids REV flag compatibility issues across Redis versions
      const raw = await redis.zrange('leaderboard', -limit, -1) || [];
      const members = raw.reverse();
      const scores = members.map(m => {
        try { return typeof m === 'string' ? JSON.parse(m) : m; } catch { return null; }
      }).filter(Boolean);
      return res.json({ scores });
    } catch (err) {
      console.error('GET /api/scores error:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  // ── POST: submit a score ─────────────────────────────────────────────────
  if (req.method === 'POST') {
    try {
      const body = req.body || {};
      const { name, score, distancePx } = body;

      // Log what we received for debugging
      console.log('POST /api/scores body:', JSON.stringify(body));

      if (!name || score == null) {
        return res.status(400).json({ error: 'Missing name or score', received: body });
      }

      const safeName  = String(name).slice(0, 16).replace(/[<>&"]/g, '').trim() || 'ANON';
      const safeScore = Math.min(Math.max(0, Math.floor(Number(score))), 9999999);
      const miles     = Math.max(0, Number(distancePx) / 72000).toFixed(2);

      const member = JSON.stringify({ n: safeName, s: safeScore, d: miles, t: Date.now() });

      console.log('zadd member:', member, 'score:', safeScore);

      await redis.zadd('leaderboard', { score: safeScore, member: member });

      // Trim to top 100 (keep only highest scores)
      await redis.zremrangebyrank('leaderboard', 0, -101);

      return res.json({ ok: true, name: safeName, score: safeScore, miles });
    } catch (err) {
      console.error('POST /api/scores error:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  res.status(405).end();
}
