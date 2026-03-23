// api/stats.js — Public stats endpoint
// GET /api/stats        → JSON (used by game frontend for stats bar)
// GET /stats            → plain text (rewritten via vercel.json, for humans)
import { kv } from '@vercel/kv';

const CORS = { 'Access-Control-Allow-Origin': '*' };

export default async function handler(req, res) {
  Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v));

  const [stats, uniquePlayers, highScore] = await Promise.all([
    kv.hgetall('gstats'),
    kv.scard('unique_ips'),
    kv.get('high_score'),
  ]);

  const s            = stats || {};
  const totalPx      = parseFloat(s.dist_px)     || 0;
  const totalMiles   = totalPx / 72000;
  const totalKills   = parseInt(s.kills)          || 0;
  const totalSessions= parseInt(s.sessions)       || 0;
  const totalGames   = parseInt(s.games)          || 0;
  const playtimeMs   = parseInt(s.playtime_ms)    || 0;
  const playtimeHrs  = playtimeMs / 3_600_000;
  const bossKills    = parseInt(s.boss_kills)     || 0;
  const burps        = parseInt(s.burps)          || 0;
  const pickups      = parseInt(s.pickups)        || 0;
  const topScore     = parseInt(highScore)        || 0;

  const isText = req.query?.format === 'text';

  if (isText) {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.send([
      '╔══════════════════════════════════════════╗',
      '║  PIE BOY: THE GREAT BOSTON ESCAPE        ║',
      '║  Live Stats                              ║',
      '╚══════════════════════════════════════════╝',
      '',
      `Unique Players       ${uniquePlayers.toLocaleString()}`,
      `Total Sessions       ${totalSessions.toLocaleString()}`,
      `Total Games Played   ${totalGames.toLocaleString()}`,
      ``,
      `Miles Run (total)    ${totalMiles.toFixed(1)} mi`,
      `Enemies Stopped      ${totalKills.toLocaleString()}`,
      `Boss Defeats         ${bossKills.toLocaleString()}`,
      `Burps Fired          ${burps.toLocaleString()}`,
      `Pickups Collected    ${pickups.toLocaleString()}`,
      ``,
      `Total Play Time      ${playtimeHrs.toFixed(1)} hrs`,
      `All-Time High Score  ${topScore.toLocaleString()}`,
      ``,
      `Generated: ${new Date().toUTCString()}`,
      ``,
      `🥧  A game by Harrison, age 6.`,
    ].join('\n'));
  }

  return res.json({
    uniquePlayers,
    totalSessions,
    totalGames,
    totalMiles:   parseFloat(totalMiles.toFixed(1)),
    totalKills,
    bossKills,
    burps,
    pickups,
    playtimeHours:parseFloat(playtimeHrs.toFixed(1)),
    highScore:    topScore,
  });
}
