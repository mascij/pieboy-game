// api/session.js — Called when a game session starts
// Logs unique IPs, geo data (from Vercel's built-in headers), and user agent.
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

  // Vercel injects these headers automatically — no external geo API needed
  const ip      = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  const country = req.headers['x-vercel-ip-country']        || '';
  const region  = req.headers['x-vercel-ip-country-region'] || '';
  const city    = req.headers['x-vercel-ip-city']           || '';
  const lat     = req.headers['x-vercel-ip-latitude']       || '';
  const lon     = req.headers['x-vercel-ip-longitude']      || '';
  const ua      = (req.headers['user-agent'] || '').slice(0, 200);
  const now     = Date.now();

  await Promise.all([
    // Track unique IP
    kv.sadd('unique_ips', ip),

    // Store/update IP detail record
    kv.hset(`ip:${ip}`, {
      country, region, city, lat, lon,
      ua,
      last_seen: now,
      // Only set first_seen if key doesn't exist yet
    }),

    // Set first_seen only on first visit (HSETNX = set if not exists)
    kv.hsetnx(`ip:${ip}`, 'first_seen', now),

    // Increment global session counter
    kv.hincrby('gstats', 'sessions', 1),
  ]);

  return res.json({ ok: true });
}
