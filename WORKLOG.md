# 🥧 Pie Boy: The Great Boston Escape — Dev Worklog

Running notes from every session. Update this file as we go.

---

## 📋 Changelog

| Version | What Changed |
|---------|-------------|
| v1.13 | Burp ammo (3 shots, HUD icons, recharge 5s→7s→9s); boss never flees, must be killed; sewer gives 5s protection then deals damage with warning; `_announce()` message queue prevents on-screen stacking |
| v1.12 | Boss laser eye attack: eyes glow red (pulsing) for 1.5s, lock onto Pie Boy's current position, fire twin red beams across screen; dodge to safety or take damage |
| v1.11 | Fix cream burp spread (allowGravity set after group.add); version tag on splash |
| v1.10 | Cream burp fires 3 spread projectiles; boss 3-hit feedback (red flash → dark strobe → epic explosion death); sewer floor is one-way so player can jump back up; starting speed 220 → 340; version tag on splash screen; cache-busting bat file |
| v1.9 | Super Pie Boy star power (key pickup → 3× size, rainbow flash, auto-kill enemies, bus immunity, 6s); `_getActivePad` helper for reliable Bluetooth gamepad detection |
| v1.8 | Bluetooth gamepad support (b0/b1=jump, b2=burp, b3=melee); controller indicator on menu; GameOver gamepad retry |
| v1.7 | GitHub Pages deployment; README; `.gitignore`; `deploy-to-github.ps1` |
| v1.6 | Emoji pickup system (🧁🍪🍩🔑) with manual proximity collision; score now updates from kills/pickups (was broken); spawn height fix |
| v1.5 | Removed weapon HUD, boss warning banner, key-toggles-weapon logic |
| v1.4 | Milestone messages stay up longer (delay:2000, duration:800) |
| v1.3 | Controls restored to splash screen |
| v1.2 | Skins: pie_boy, enemies, boss, bus textures replaced with designed sprites |
| v1.1 | Menu scene, Game Over scene, music, font (Gloomie Saturday) |
| v1.0 | Initial single-file build: runner, pickups, enemies, boss, HUD |

---

## Session 1 — Initial Build

**Goal:** Get all 4 design-doc phases running as a single HTML file.

**Delivered:**
- Vite + Phaser 3 project scaffolded (`package.json`, `vite.config.js`, modular `src/` files)
- Pivoted to single-file `PieBoy.html` (loads Phaser from CDN) — no build step, just open in browser
- All placeholder textures generated in code via `BootScene` (no external images needed)
- **Phase 1 — Engine:** Infinite scrolling ground + sewer tiles, parallax background (3 layers: skyline, Charlestown houses, sidewalk)
- **Phase 2 — Verticality:** `ObstacleManager` spawning box trucks (jumpable platforms) and sewer gap markers
- **Phase 3 — Combat:** Hungry People enemies, melee fork attack (X), creamy burp projectile (C), window pickups (food heals, key swaps weapon), Mini Pie rescue pop on kill
- **Phase 4 — Boss & HUD:** 3-heart health bar, score counter, boss spawns every 2000 pts, bounces around screen, takes 3 hits or auto-exits after 13s
- Menu scene + Game Over scene with fade transitions
- `SKINNING_GUIDE.md` written with exact pixel dimensions for every asset

---

## Session 2 — Crash Fixes (Round 1)

**Bugs reported:** Game crashed immediately on load.

**Root causes found & fixed:**
1. `_platforms.create(x, y, null)` — Phaser throws on null texture. Added `'pixel'` (2×2 transparent texture) in `BootScene._sewerTile()` and used it for invisible platform bodies.
2. `this._projectiles.get(x, y, 'burp')` — `group.get()` unreliable on physics groups. Replaced with `this.physics.add.image()` + `group.add()`.

---

## Session 3 — Crash Fixes (Round 2)

**Bugs reported:** Still crashing.

**Root causes found & fixed:**
1. **`_truckData` class field not reset on scene restart** — Phaser reuses scene instances; class fields initialize only once. On restart, `_truckData` held destroyed objects. `refreshBody()` on a dead physics body = crash. Fixed by explicitly resetting `this._truckData = []` in `create()`.
2. **`d.food` stale reference** — When player grabs food off a truck, `_grabPickup` destroys it. Next frame `_handleObstacles` called `d.food.refreshBody()` on the destroyed body. Fixed with `if(d.food && d.food.active)` guard.
3. **Window pickup tween on static body** — Static physics AABBs don't move with tweens (need `refreshBody()` each frame). Replaced tween with per-frame manual scroll + `refreshBody()` in `_handlePickups`. Pickups now actually collectable.

---

## Session 4 — Features

**Added:**
- **Double jump** — `_jumpsLeft` counter, resets to 2 on landing. Uses `JustDown` (not `isDown`) so each keypress counts once. Second jump has slightly less velocity (−480 vs −560) for a "flutter" feel.
- **Console logging** — `[Boss]`, `[Pickup]`, `[Player]` prefixed logs for all key events.
- **Skinning system** — `preload()` added to `BootScene` with commented-out `this.load.image()` calls for every asset. `_g()` helper now skips placeholder generation if a real texture was already loaded. Just uncomment a line and drop a PNG in `assets/`.

---

## Session 5 — Crash Fixes (Round 3) + UX Polish

**Bugs reported:**
- Crash when boss goes off screen
- Yellow window box stuck after item grabbed
- Requested: double jump (moved to Session 4 retroactively)

**Root causes found & fixed:**

### Boss crash on exit
Two problems combined:
1. Boss is a `physics.add.image` (dynamic body). `_handleBoss` was doing `this._boss.x += ...` which the physics engine silently overwrites each step — boss wasn't actually moving. Fixed with `body.reset(newX, y)` which correctly repositions a dynamic body.
2. `_exitBoss` was tweening the boss and calling `this._boss.destroy()` inside `onComplete` — but player-boss overlap callbacks could still fire during the tween. Fixed by: (a) immediately disabling the physics body (`body.enable = false`), (b) setting `this._boss = null` right away, (c) holding a local `dyingBoss` reference for the tween to clean up.

### Yellow box orphan
`_grabPickup` destroyed the pickup sprite but the `win` rectangle had no reference. The `_winPickupData` filter was removing the entry from the array without calling `d.win.destroy()`. Added `if(d.win && d.win.active) d.win.destroy()` when `d.sprite.active` is false.

---

## Session 6 — Polish Pass

**Added:**
- **Log-to-file** — global `_LOG` buffer intercepts all `console.log/warn/error`. Press `L` during gameplay to download `pieboy_log_[timestamp].txt`. Use this to share logs when reporting crashes.
- **`GAME_TEXT` config** — all visible strings (titles, prompts, score text, boss messages, etc.) centralised in one `const GAME_TEXT = { ... }` block at the top of the script. Edit text without touching game logic.
- **Logo banner placeholder** — `logo_banner` texture (500×80) shown on menu screen. Replace with `assets/logo_banner.png` (uncomment one line in `preload()`). Gently bobs up/down.
- **Bigger, reactive score** — score is now 28px with orange drop shadow, centred in a dark pill background.
- **Milestone effects** — every 500 pts: score text does a 3× grow-pulse, screen flashes a cycling colour (gold → orange → pink → cyan → green), big `🎉 X,XXX PTS!` banner floats up.
- **Bigger kill/pickup pops** — enemy kills and item grabs now use `_floatBig()` (22–26px, drop shadow, scale-up tween). Much more readable and exciting.
- **Game Over screen** — final score displayed larger (46px) with drop shadow. All text pulled from `GAME_TEXT`.
- **WORKLOG.md** — this file.

---

## Session 8 — Menu Screen Cleanup + menu_bg Asset Slot

**Goal:** Clean up the menu screen so it's ready for real art; move controls out of the UI.

**Delivered:**
- **Removed from MenuScene:** subtitle text ("The Great Boston Escape"), keyboard controls text (SPACE/↑/↓/X/C)
- **New `menu_bg` image slot** — full 800×400 menu backdrop. Replaces the hand-drawn sky gradient + bg_far + bg_mid layers on the menu. Drop in `assets/menu_bg.png` and uncomment one line in `preload()` to use it
- **`_menuBg()` placeholder** added to `BootScene` — draws a dark Boston night skyline with stars, two building layers, and lit windows so it still looks good until the real art arrives
- **Hero nudged down** from y=210 to y=230 to better fill the now-cleaner screen
- **`SKINNING_GUIDE.md`** updated: `menu_bg.png` added to Menu/UI table, Controls Reference section added (keys are no longer on screen), `menu_bg` moved to #1 on Quick Start list

---

## Session 7 — Skinning Guide Update

**Goal:** Catch up docs after context reset.

**Delivered:**
- `SKINNING_GUIDE.md` updated to include `logo_banner.png` (500×80 px) in a new **Menu / UI** section — this asset was added to the game in Session 6 but was missing from the guide
- `logo_banner.png` moved to #1 on the Quick Start list (biggest visual bang for the buck)

---

## Session 9 — Score Fix + Emoji Pickups + UI Cleanup

**Goal:** Fix score not updating from kills/pickups; replace image-based pickups with emojis; clean up weapon HUD and boss warning.

**Delivered:**
- **Score bug fixed** — pickups were in a Phaser `staticGroup` and relied on `physics.add.overlap` for collection, which proved unreliable when bodies are moved manually. Replaced with a plain `_pickupItems` array of Phaser `Text` objects (emoji), scrolled manually each frame with a direct bounding-box proximity check. Kills still go through `_killEnemy → _addScore(100)` as before (always worked; melee and burp overlap both dynamic bodies).
- **Emoji pickups** — food pickups are now `🧁` (cupcake, +50 pts), `🍪` (cookie, +30 pts), `🍩` (donut, +40 pts), each giving +1 health. Key pickup is `🔑` (+25 pts, "Got a Key!" callout). No external images needed — native emoji rendered via Phaser text objects.
- **Controls back on splash screen** — "SPACE / ↑ Jump ↓ Crouch X Fork Attack C Creamy Burp" displayed below the PRESS SPACE prompt on MenuScene.
- **Removed weapon HUD** — "🍴 Fork / 💨 Burp" mode indicator removed from top-right. Both attacks (X=melee, C=burp) are always available without switching modes. Key pickups no longer toggle weapon mode.
- **Removed boss warning banner** — boss still spawns and shakes the screen; the "⚠️ BOSS INCOMING!" float message is gone.
- **Milestone messages stay up longer** — `_floatBig` tweened to hold for 2s then fade over 0.8s (matching intro message timing).

---

## Session 10 — Burp Spread, Boss Drama, Sewer Fix, Speed Boost

**Goal:** Polish combat feel, fix sewer one-way platform, increase starting pace.

**Delivered:**
- **Cream burp spread** — `_fireBurp()` now fires 3 whipped-cream ball projectiles in a spread (vy: −140 / −50 / +55). Each ball is a round white texture (`_burp()` redrawn as a circle). All three damage enemies and bosses.
- **Boss hit feedback** — 3-hit system now has visual stages:
  - Hit 1 (health=2): slow red pulse tween, "⚠️ 2 MORE!" float banner
  - Hit 2 (health=1): fast dark-red strobe flash + camera shake, "💀 FINISH HIM!" banner
  - Hit 3 (health=0): epic death — 5 concentric explosion ring bursts with debris blobs, boss spins/grows/fades out, camera shakes hard + white flash
- **Sewer fix** — `gFloor.body.checkCollision.down = false` makes the ground a one-way platform. Pie Boy can now jump back UP through the floor from the sewer. Problem was Phaser's static body blocked upward passage by default.
- **Starting speed increase** — Base speed changed from 220 → 340. Game now opens at roughly 4000-point pace. Speed formula: `Math.min(500, 340 + Math.floor(score/2000)*60)`.

---

## Known Issues / To-Do

- [x] Sewer gap is visual-only — player doesn't actually fall into a lower sewer layer yet (fixed: one-way floor)
- [ ] Truck food pickup on top of a platform has slightly off collision height (minor)
- [ ] Boss entrance tween doesn't play on first spawn because `body.reset()` moves the boss instantly — could add a short enter-from-right slide
- [ ] No sound / music yet
- [ ] No high-score persistence (localStorage would work)
- [ ] Sprite swap: `pie_boy_run`, `pie_boy_jump`, `pie_boy_attack` variants not yet used — currently all use `pie_boy`. Animate by swapping texture key on state change.
- [ ] Mobile / touch controls not implemented

## Asset Status

| Asset key | Status |
|---|---|
| `pie_boy` | Placeholder ✏️ |
| `mini_pie` | Placeholder ✏️ |
| `enemy_person` | Placeholder ✏️ |
| `boss_giant` | Placeholder ✏️ |
| `pickup_food` | Placeholder ✏️ |
| `pickup_key` | Placeholder ✏️ |
| `burp` | Placeholder ✏️ |
| `bg_far` | Placeholder ✏️ |
| `bg_mid` | Placeholder ✏️ |
| `bg_fore` | Placeholder ✏️ |
| `ground_tile` | Placeholder ✏️ |
| `sewer_tile` | Placeholder ✏️ |
| `truck` | Placeholder ✏️ |
| `heart_full` | Placeholder ✏️ |
| `heart_empty` | Placeholder ✏️ |
| `logo_banner` | Placeholder ✏️ |
| `menu_bg` | Placeholder ✏️ |
