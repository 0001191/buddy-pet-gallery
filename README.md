# 🐾 Buddy Pet Gallery

> All 18 companion species from Claude Code — interactive web gallery + CLI hatch tool

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen?style=flat-square)](https://your-username.github.io/buddy-pet-gallery/)
[![npm](https://img.shields.io/badge/npx-buddy--pet--gallery-blue?style=flat-square)](https://www.npmjs.com/package/buddy-pet-gallery)
[![License: MIT](https://img.shields.io/badge/license-MIT-yellow?style=flat-square)](LICENSE)

Claude Code ships with a hidden easter egg: a companion system that hatches a unique pet based on your user ID. This repo reverse-engineers the full sprite data and logic so anyone can play with it.

---

## 🌐 Web Gallery — Try It Now

**[→ Open Live Demo](https://your-username.github.io/buddy-pet-gallery/)**

### Features

| Feature | Description |
|---------|-------------|
| **18 animated species** | All pets play 3-frame ASCII animations at 500 ms/frame |
| **Hatch your own** | Enter any string → get your unique deterministic pet |
| **Shareable URLs** | `?id=alice` — share your pet with a link |
| **Eye filter** | Toggle · ✦ × ◉ @ ° to see all variants |
| **Pet detail modal** | Click any card for full stat bars |
| **Star field background** | Because why not |

### Run locally

```bash
git clone https://github.com/your-username/buddy-pet-gallery.git
cd buddy-pet-gallery
npx serve .
# → open http://localhost:3000
```

---

## 🖥️ CLI Tool

Hatch pets right in your terminal.

### One-shot with npx (no install needed)

```bash
npx buddy-pet-gallery alice
npx buddy-pet-gallery your-github-username
npx buddy-pet-gallery legendary-hunter xXx_gamer_xXx
```

### Flags

```
npx buddy-pet-gallery <seed>      hatch the pet for any string
npx buddy-pet-gallery --all       show all 18 species
npx buddy-pet-gallery --demo      5 fun example hatches
npx buddy-pet-gallery --help      show help
```

### Example output

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  🐰  RABBIT
  seed: "alice"

   (\__/)
  ( ◉  ◉ )
 =( .  . )=
  (")__(")

  Rarity  🟦 RARE
  Eye     ◉   Hat  🎩 tophat

  Stats
  DEBUGGING  ███████████░░░░░░░  67
  PATIENCE   ██████████████████  98 ▲ PEAK
  CHAOS      ████░░░░░░░░░░░░░░  22
  WISDOM     ███████████████░░░  84
  SNARK      ██████░░░░░░░░░░░░   8 ▼ dump

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🧬 How it Works

Each pet is **deterministically generated** from a string seed:

1. The seed string is hashed with FNV-1a → a 32-bit integer
2. That integer seeds a Mulberry32 PRNG
3. The PRNG picks: **rarity** (weighted) → **species** → **eye type** → **hat** → **5 stats**
4. Same seed = same pet, every time, forever

```
"alice" ──hash──→ 0x5f3a1b04 ──PRNG──→ RARE · RABBIT · ◉ eye · tophat
```

The salt `friend-2026-401` is the one baked into the original Claude Code source.

---

## 🐾 All 18 Species

| Emoji | Species | Emoji | Species | Emoji | Species |
|-------|---------|-------|---------|-------|---------|
| 🦆 | duck | 🪿 | goose | 🫧 | blob |
| 🐱 | cat | 🐉 | dragon | 🐙 | octopus |
| 🦉 | owl | 🐧 | penguin | 🐢 | turtle |
| 🐌 | snail | 👻 | ghost | 🦎 | axolotl |
| 🐭 | capybara | 🌵 | cactus | 🤖 | robot |
| 🐰 | rabbit | 🍄 | mushroom | 🫙 | chonk |

**Rarities:** Common (60%) · Uncommon (25%) · Rare (10%) · Epic (4%) · Legendary (1%)

**Eye types:** · ✦ × ◉ @ °

**Hats:** none · crown 👑 · tophat 🎩 · propeller 🌀 · halo 😇 · wizard 🧙 · beanie 🧶 · tinyduck 🐤

---

## 📁 Files

```
buddy-pet-gallery/
├── index.html       ← web gallery (single HTML file, no deps)
├── buddy-roll.js    ← CLI tool (Node.js, no deps)
├── package.json     ← for npx support
└── README.md
```

Everything is **zero-dependency**. The web gallery is a single self-contained HTML file.

---

## 🙏 Credits

Sprite data and companion logic reverse-engineered from  
[`@anthropic-ai/claude-code`](https://www.npmjs.com/package/@anthropic-ai/claude-code) `src/buddy/` module.

Original easter egg was active on **2026-04-01** 🥚

---

## License

MIT — do whatever, have fun.
