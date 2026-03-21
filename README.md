# 🥧 Pie Boy: The Great Boston Escape

> *They want your pie. Don't let them have it.*

Pie Boy is a browser-based endless runner set on the streets of Boston. You play as Pie Boy — a plucky little pie on the run — dodging buses, fighting off hungry enemies, and collecting cupcakes, cookies, and donuts to stay alive. How long can you last before they eat you?

**[▶ Play Now](https://mascij.github.io/pieboy-game)**

---

## How to Play

| Key | Action |
|---|---|
| `SPACE` / `↑` | Jump (press again to double-jump) |
| `↓` | Crouch |
| `X` | Fork Attack — melee strike |
| `C` | Creamy Burp — ranged projectile |

**Survive as long as possible.** The city speeds up every 2,000 points. Buses start appearing after 2,000 points and get more frequent the longer you last. You can jump on top of a bus to ride it — just don't let the front bumper hit you.

---

## Scoring

| Event | Points |
|---|---|
| Distance | +1 every 0.1s |
| Kill an enemy | +100 |
| 🧁 Cupcake | +50 + 1 health |
| 🍩 Donut | +40 + 1 health |
| 🍪 Cookie | +30 + 1 health |
| 🔑 Key | +25 |
| Defeat the boss | +500 |

Every 500 points triggers a milestone flash. Every 2,000 points the city speeds up and Pie Boy gets a word of encouragement (or warning).

---

## About the Game

Pie Boy started as a weekend experiment to see how far a single HTML file could go. No build tools, no frameworks, no install step — just one file that loads [Phaser 3](https://phaser.io) from a CDN and runs entirely in your browser.

The whole game — engine, art placeholders, physics, combat, leaderboard, music — lives in `index.html`. Drop custom PNG files into the `assets/` folder and the game picks them up automatically. The placeholder graphics are drawn in code, so it works out of the box even with no art at all.

It's a love letter to old-school Flash games, Boston, and the idea that a pie should never, ever be eaten by anyone other than its rightful owner.

---

## Features

- Infinite procedural runner with parallax Boston streetscape
- Double jump with satisfying flutter physics
- Melee (fork) and ranged (creamy burp) attacks
- Jumpable buses — ride the roof or get flattened by the bumper
- Hungry enemy NPCs that chase you down
- A giant Boss that crashes the party every 2,000 points
- 🧁🍩🍪 Emoji food pickups that heal you
- Leaderboard with local high score persistence (top 10, enter your name)
- Speed ramps up progressively — it doesn't stop getting harder
- Milestone banners and screen flashes every 500 points
- Full background music that loops through the whole run
- Custom **Gloomie Saturday** font throughout
- Fully skinable — swap any graphic by dropping a PNG in `assets/`

---

## Running Locally

Just open a terminal in this folder and run:

```
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser. (You need a local server because browsers block loading assets from `file://` URLs directly.)

On Windows you can double-click `start-game.bat` which does this automatically.

---

## Customizing the Art

Every visual in the game has an image slot. Drop your PNG files into the `assets/` folder and uncomment the matching line in the `preload()` function near the top of `index.html`. See `SKINNING_GUIDE.md` for exact dimensions and a quick-start priority list.

---

## Built With

- [Phaser 3](https://phaser.io) — game framework (loaded from CDN, no install)
- [Gloomie Saturday](https://www.dafont.com/gloomie-saturday.font) — display font
- Vanilla JavaScript, no build step, one file

---

*Made in Boston. Protect the pie.*
