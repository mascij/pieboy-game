# 🥧 Pie Boy — Sprite Skinning Guide

How to replace the placeholder shapes with real artwork.

---

## How It Works

The game draws simple rectangles and circles as stand-ins for every character and background. Once you drop a real image into the `assets/` folder and uncomment one line in `PieBoy.html`, the game uses your art instead — automatically. You can swap one thing at a time, in any order.

---

## Step-by-Step

1. Create a folder called `assets` next to `PieBoy.html`
2. Save your image there with the exact filename shown in the table below
3. Open `PieBoy.html` in a text editor, find the `preload()` section near the top, and remove the `//` from the matching line
4. Open the file in a browser — your art appears

> **Tip:** You can swap one sprite at a time. Anything you haven't replaced yet keeps its placeholder shape.

---

## Asset Reference Table

### Characters

| Key / Filename | Canvas Size | Notes |
|---|---|---|
| `pie_boy.png` | **48 × 42 px** | The main hero. Draw him facing right. Pie body, fork arm on left, knife arm on right. |
| `mini_pie.png` | **22 × 18 px** | The tiny rescued-family pies that float up when an enemy is defeated. Small and cute. |

### Enemies

| Key / Filename | Canvas Size | Notes |
|---|---|---|
| `enemy_person.png` | **32 × 58 px** | A "Hungry Person" — tall, upright. Drawn facing left (walking toward Pie Boy). |
| `boss_giant.png` | **96 × 140 px** | The Giant Boss. About 3× the size of a regular enemy. Scary open mouth. Faces left. |

### Pickups & Projectiles

| Key / Filename | Canvas Size | Notes |
|---|---|---|
| `pickup_food.png` | **28 × 30 px** | A cupcake or cookie that restores health. Bright and appetising. |
| `pickup_key.png` | **28 × 24 px** | A gold key that swaps your weapon. |
| `burp.png` | **28 × 16 px** | Pie Boy's "Creamy Burp" projectile — a puff of whipped cream flying right. |

### Menu / UI

| Key / Filename | Canvas Size | Notes |
|---|---|---|
| `menu_bg.png` | **800 × 400 px** | Full backdrop for the main menu screen. This is your big establishing shot — Boston at night, a dark alley, dramatic sky, whatever sets the mood. Solid background (no transparency needed). This replaces the entire sky+buildings placeholder. |
| `logo_banner.png` | **800 × 160 px** | The game logo shown at the top of the menu, bobbing gently. Design your title art here — "PIE BOY" lettering, Boston skyline, pie character, whatever feels right. **Transparent background recommended** so it floats over `menu_bg`. |

### HUD (Heads-Up Display)

| Key / Filename | Canvas Size | Notes |
|---|---|---|
| `heart_full.png` | **22 × 20 px** | A filled red heart — shown for each health point you have. |
| `heart_empty.png` | **22 × 20 px** | An outline heart — shown for lost health. Same shape, just hollow/grey. |

### Backgrounds

These scroll left at different speeds to create a 3-layer parallax effect. **The left and right edges of each image must match** so the loop is seamless.

All three layers are **400px tall** (full canvas height) with **transparent backgrounds above the artwork**. This lets you control exactly where each layer sits using transparency rather than fixed image heights — draw your artwork in the lower portion and leave the rest transparent.

| Key / Filename | Canvas Size | What it shows |
|---|---|---|
| `bg_far.png` | **800 × 400 px** | Distant Boston skyline silhouette. Scrolls slowest. Fill the full height (this is the base sky layer — no transparency needed). |
| `bg_mid.png` | **900 × 400 px** | Charlestown row houses / mid-ground buildings. Scrolls at medium speed. Transparent above the rooftops. |
| `bg_fore.png` | **800 × 400 px** | Foreground detail — sidewalk, lampposts, fences, etc. Scrolls fastest. Transparent above the ground line (~y=340). |

### Ground Tiles

These 32×32 tiles repeat endlessly side-by-side, so the **left and right edges must match** (i.e. the tile should tile seamlessly horizontally).

| Key / Filename | Canvas Size | Notes |
|---|---|---|
| `ground_tile.png` | **32 × 32 px** | Street-level ground. Brick, pavement, or asphalt look. |
| `sewer_tile.png` | **32 × 32 px** | Lower sewer path. Mossy, darker, underground feel. |

### Platforms

| Key / Filename | Canvas Size | Notes |
|---|---|---|
| `bus.png` | **247 × 68 px** | A Boston bus (platform). Drawn facing left. The **top surface** (y=0 to ~10px) is where Pie Boy lands — keep it flat. Wheels at the bottom. Loaded as the `truck` key in code. |

---

## Size Tips for Drawing

All sizes above are in **pixels at 1×**. These are small! Here's a practical workflow:

- **Draw big, export small.** Sketch at 4× or 8× the size (e.g. draw `pie_boy` at 384×336), then scale down to the final size when exporting. This is how pixel art is traditionally made.
- **Use a pixel art tool** like [Piskel](https://www.piskelapp.com) (free, in-browser) or [Aseprite](https://www.aseprite.org). Piskel is great for kids.
- **PNG format** is required — it supports transparent backgrounds, which most sprites need.
- **Transparent backgrounds** are important for characters and pickups so they don't have a white box around them.
- For **backgrounds and tiles**, a solid (non-transparent) background is fine.

---

## AI Image Generation Tips

If you're using an AI image generator (like DALL·E, Midjourney, etc.):

- Ask for **"pixel art, transparent background, facing right"** for characters
- Specify the style: **"cartoon, chunky, bright colors, kid-friendly"**
- For Pie Boy: *"pixel art sprite of a sentient pumpkin pie character with fork and knife arms, facing right, transparent background, 48x42 pixels, cartoon style"*
- For backgrounds: *"seamlessly tiling pixel art side-scrolling background, Boston cityscape at night, silhouette style"*
- After generating, resize to the exact pixel dimensions in the table using any image editor

---

## Controls Reference

These controls are no longer shown on the menu screen — they're baked into your logo/banner art instead. Here they are for reference:

| Action | Key(s) |
|---|---|
| Jump | `SPACE` or `↑` |
| Double jump | Press jump again while airborne |
| Crouch | `↓` |
| Fork attack (melee) | `X` |
| Creamy Burp (projectile) | `C` |
| Download debug log | `L` (during gameplay) |

> Weapon swaps between fork and burp when you pick up the gold key `🔑`.

---

## Quick Start: Easiest Ones First

Start with these — they're the most fun and have the biggest visual impact:

1. **`menu_bg.png`** — the full menu backdrop; instantly transforms first impressions
2. **`logo_banner.png`** — your game title floating above the hero
3. **`pie_boy.png`** — the star of the show
4. **`enemy_person.png`** — you'll see these a lot
5. **`pickup_food.png`** — cupcakes are always fun to draw
6. **`bg_far.png`** — transforms the in-game world feel

Everything else can stay as a placeholder while you work on those.
