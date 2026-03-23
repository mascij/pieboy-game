// api/scores.js — Global leaderboard (top 100 stored, top 10 returned)
import { kv } from '@vercel/kv';

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
    const limit = Math.min(parseInt(req.query?.limit) || 10, 50);
    // Members are JSON strings; Z-score is the game score
    const members = await kv.zrange('leaderboard', 0, limit - 1, { rev: true });
    const scores = (members || []).map(m => {
      try { return JSON.parse(m); } catch { return null; }
    }).filter(Boolean);
    return res.json({ scores });
  }

  // ── POST: submit a score ─────────────────────────────────────────────────
  if (req.method === 'POST') {
    const { name, score, distancePx } = req.body || {};
    if (!name || score == null) return res.status(400).json({ error: 'Missing name or score' });

    const safeName  = String(name).slice(0, 16).replace(/[<>&"]/g, '').trim() || 'ANON';
    const safeScore = Math.min(Math.max(0, Math.floor(Number(score))), 9999999);
    const miles     = Math.max(0, Number(distancePx) / 72000).toFixed(2);

    // Embed all display data in the member so GET doesn't need WITHSCORES
    const member = JSON.stringify({ n: safeName, s: safeScore, d: miles, t: Date.now() });
    await kv.zadd('leaderboard', { score: safeScore, member });

    // Trim to top 100
    await kv.zremrangebyrank('leaderboard', 0, -101);

    return res.json({ ok: true });
  }

  res.status(405).end();
}
