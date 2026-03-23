# Deploying Pie Boy to Vercel (with Global Leaderboard)

## What you'll get
- Game hosted at `https://your-project.vercel.app`
- Global leaderboard at the bottom of the page (backed by Vercel KV / Redis)
- Live stats bar: total miles run, enemies stopped, unique players
- `/stats` endpoint with plain-text telemetry summary
- All player IP + geo data logged privately on the backend

---

## Step 1 — Install Vercel CLI

Open PowerShell and run:
```powershell
npm install -g vercel
```

---

## Step 2 — Deploy the project

```powershell
cd C:\Users\John\Documents\pieboy\pieboy-game
vercel
```

Follow the prompts:
- **Set up and deploy?** → Y
- **Which scope?** → your personal account
- **Link to existing project?** → N
- **Project name?** → `pieboy-game` (or whatever you like)
- **In which directory is your code?** → `.` (current directory)
- **Override settings?** → N

Vercel will deploy and give you a URL like `https://pieboy-game-abc123.vercel.app`.

---

## Step 3 — Create the KV (Redis) Store

1. Go to https://vercel.com/dashboard → **Storage** tab
2. Click **Create Database** → choose **KV**
3. Name it `pieboy-kv` → click **Create**
4. On the KV store page, click **Connect to Project** → select `pieboy-game`
5. Vercel automatically adds the env vars (`KV_REST_API_URL`, `KV_REST_API_TOKEN`, etc.)

---

## Step 4 — Redeploy with KV connected

```powershell
vercel --prod
```

That's it! The leaderboard, stats, and telemetry are now live.

---

## Step 5 — Pull env vars for local dev (optional)

If you want API routes to work when running locally:
```powershell
vercel env pull .env.local
```
Then run with:
```powershell
vercel dev
```
(This runs both the static game AND the API functions locally.)

---

## Endpoints

| URL | What it does |
|-----|-------------|
| `/` | The game |
| `/api/scores` | GET top 10 leaderboard / POST new score |
| `/api/session` | POST session start (logs IP + geo) |
| `/api/telemetry` | POST end-of-game stats |
| `/api/stats` | GET stats as JSON |
| `/stats` | GET stats as plain text (human readable) |

---

## Keeping GitHub Pages in sync

After deploying to Vercel, you can either:
- **Use Vercel only** (remove GitHub Pages) — simpler
- **Keep both** — GitHub Pages serves the game without the leaderboard backend; Vercel serves the full version

To set a custom domain on Vercel: Dashboard → Project → Settings → Domains.
