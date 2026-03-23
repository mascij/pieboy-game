# Deploying Pie Boy to Vercel (with Global Leaderboard)

## What you'll get
- Game hosted at `https://your-project.vercel.app`
- Global leaderboard backed by **Upstash Redis** (free, serverless Redis)
- Live stats bar: total miles run, enemies stopped, unique players
- `/stats` plain-text telemetry page
- Player IP + geo data logged privately on the backend

---

## Step 1 — Create a free Upstash Redis database

Upstash is a serverless Redis provider — free tier gives you **10,000 commands/day** and **256MB storage**, more than enough.

1. Go to **https://console.upstash.com** → sign up / log in
2. Click **Create Database**
3. Name it `pieboy-redis`, choose region **US-East-1** (closest to Boston 🥧), leave TLS on
4. Click **Create**
5. On the database page, scroll to **REST API** section
6. Copy **UPSTASH_REDIS_REST_URL** and **UPSTASH_REDIS_REST_TOKEN** — you'll need these in Step 3

---

## Step 2 — Install Vercel CLI and deploy

```powershell
npm install -g vercel
cd C:\Users\John\Documents\pieboy\pieboy-game
vercel
```

Follow the prompts:
- **Set up and deploy?** → Y
- **Which scope?** → your personal account
- **Link to existing project?** → N
- **Project name?** → `pieboy-game`
- **Directory?** → `.`
- **Override settings?** → N

Vercel will deploy and give you a URL like `https://pieboy-game-abc123.vercel.app`.

---

## Step 3 — Add Upstash env vars to Vercel

```powershell
vercel env add UPSTASH_REDIS_REST_URL
# paste the URL from Upstash, press Enter

vercel env add UPSTASH_REDIS_REST_TOKEN
# paste the token from Upstash, press Enter
```

When prompted for environment, select **Production, Preview, Development** (all three).

---

## Step 4 — Redeploy with env vars active

```powershell
vercel --prod
```

Done! The leaderboard, stats, and telemetry are now live.

---

## Step 5 — Pull env vars for local dev (optional)

```powershell
vercel env pull .env.local
vercel dev
```

This runs the game + API functions locally with the real Upstash database.

---

## Endpoints

| URL | What it does |
|-----|-------------|
| `/` | The game |
| `/api/scores` | GET top 10 leaderboard / POST new score |
| `/api/session` | POST session start (logs IP + geo) |
| `/api/telemetry` | POST end-of-game stats |
| `/api/stats` | GET stats as JSON |
| `/stats` | GET stats as plain text |

---

## Upstash Free Tier Limits

| Limit | Value |
|-------|-------|
| Commands/day | 10,000 |
| Storage | 256 MB |
| Databases | 1 |
| Bandwidth | 200 MB/day |

For a personal game this is plenty. If you somehow go viral, upgrade is $0.20 per 100k additional commands.
