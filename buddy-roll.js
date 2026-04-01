#!/usr/bin/env node
/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║        🐾  buddy-roll  —  Hatch your Buddy pet          ║
 * ║  Sprites reverse-engineered from @anthropic-ai/claude-code ║
 * ║                                                          ║
 * ║  Usage:  npx buddy-pet-gallery <any-string>              ║
 * ║     or:  node buddy-roll.js alice                        ║
 * ╚══════════════════════════════════════════════════════════╝
 */

// ─── ANSI colors ─────────────────────────────────────────────
const C = {
  reset:     '\x1b[0m',
  bold:      '\x1b[1m',
  dim:       '\x1b[2m',
  common:    '\x1b[37m',
  uncommon:  '\x1b[32m',
  rare:      '\x1b[34m',
  epic:      '\x1b[35m',
  legendary: '\x1b[33m',
  cyan:      '\x1b[36m',
  white:     '\x1b[97m',
  yellow:    '\x1b[93m',
}

// ─── Constants ───────────────────────────────────────────────
const SALT = 'friend-2026-401'

const SPECIES = [
  'duck','goose','blob','cat','dragon','octopus',
  'owl','penguin','turtle','snail','ghost','axolotl',
  'capybara','cactus','robot','rabbit','mushroom','chonk',
]

const SPECIES_EMOJI = {
  duck:'🦆', goose:'🪿', blob:'🫧', cat:'🐱', dragon:'🐉', octopus:'🐙',
  owl:'🦉', penguin:'🐧', turtle:'🐢', snail:'🐌', ghost:'👻', axolotl:'🦎',
  capybara:'🐭', cactus:'🌵', robot:'🤖', rabbit:'🐰', mushroom:'🍄', chonk:'🫙',
}

const RARITIES       = ['common','uncommon','rare','epic','legendary']
const RARITY_WEIGHTS = { common:60, uncommon:25, rare:10, epic:4, legendary:1 }
const RARITY_STARS   = { common:'★', uncommon:'★★', rare:'★★★', epic:'★★★★', legendary:'★★★★★' }
const RARITY_FLOOR   = { common:5, uncommon:15, rare:25, epic:35, legendary:50 }
const RARITY_LABELS  = {
  common:    '⬜ COMMON',
  uncommon:  '🟩 UNCOMMON',
  rare:      '🟦 RARE',
  epic:      '🟪 EPIC',
  legendary: '🌟 LEGENDARY',
}

const EYES      = ['·','✦','×','◉','@','°']
const HATS      = ['none','crown','tophat','propeller','halo','wizard','beanie','tinyduck']
const HAT_EMOJI = { none:'—', crown:'👑', tophat:'🎩', propeller:'🌀', halo:'😇', wizard:'🧙', beanie:'🧶', tinyduck:'🐤' }
const STAT_NAMES = ['DEBUGGING','PATIENCE','CHAOS','WISDOM','SNARK']

const HAT_LINES = {
  none:       '            ',
  crown:      '   \\^^^/    ',
  tophat:     '   [___]    ',
  propeller:  '    -+-     ',
  halo:       '   (   )    ',
  wizard:     '    /^\\     ',
  beanie:     '   (___)    ',
  tinyduck:   '    ,>      ',
}

const BODIES = {
  duck: [
    ['            ','    __      ','  <({E} )___  ','   (  ._>   ','    `--´    '],
    ['            ','    __      ','  <({E} )___  ','   (  ._>   ','    `--´~   '],
    ['            ','    __      ','  <({E} )___  ','   (  .__>  ','    `--´    '],
  ],
  goose: [
    ['            ','     ({E}>    ','     ||     ','   _(__)_   ','    ^^^^    '],
    ['            ','    ({E}>     ','     ||     ','   _(__)_   ','    ^^^^    '],
    ['            ','     ({E}>>   ','     ||     ','   _(__)_   ','    ^^^^    '],
  ],
  blob: [
    ['            ','   .----.   ','  ( {E}  {E} )  ','  (      )  ','   `----´   '],
    ['            ','  .------.  ',' (  {E}  {E}  ) ',' (        ) ','  `------´  '],
    ['            ','    .--.    ','   ({E}  {E})   ','   (    )   ','    `--´    '],
  ],
  cat: [
    ['            ','   /\\_/\\    ','  ( {E}   {E})  ','  (  ω  )   ','  (")_(")   '],
    ['            ','   /\\_/\\    ','  ( {E}   {E})  ','  (  ω  )   ','  (")_(")~  '],
    ['            ','   /\\-/\\    ','  ( {E}   {E})  ','  (  ω  )   ','  (")_(")   '],
  ],
  dragon: [
    ['            ','  /^\\  /^\\  ',' <  {E}  {E}  > ',' (   ~~   ) ','  `-vvvv-´  '],
    ['            ','  /^\\  /^\\  ',' <  {E}  {E}  > ',' (        ) ','  `-vvvv-´  '],
    ['   ~    ~   ','  /^\\  /^\\  ',' <  {E}  {E}  > ',' (   ~~   ) ','  `-vvvv-´  '],
  ],
  octopus: [
    ['            ','   .----.   ','  ( {E}  {E} )  ','  (______)  ','  /\\/\\/\\/\\  '],
    ['            ','   .----.   ','  ( {E}  {E} )  ','  (______)  ','  \\/\\/\\/\\/  '],
    ['     o      ','   .----.   ','  ( {E}  {E} )  ','  (______)  ','  /\\/\\/\\/\\  '],
  ],
  owl: [
    ['            ','   /\\  /\\   ','  (({E})({E}))  ','  (  ><  )  ','   `----´   '],
    ['            ','   /\\  /\\   ','  (({E})({E}))  ','  (  ><  )  ','   .----.   '],
    ['            ','   /\\  /\\   ','  (({E})(-)  )  ','  (  ><  )  ','   `----´   '],
  ],
  penguin: [
    ['            ','  .---.     ','  ({E}>{E})     ',' /(   )\\    ','  `---´     '],
    ['            ','  .---.     ','  ({E}>{E})     ',' |(   )|    ','  `---´     '],
    ['  .---.     ','  ({E}>{E})     ',' /(   )\\    ','  `---´     ','   ~ ~      '],
  ],
  turtle: [
    ['            ','   _,--._   ','  ( {E}  {E} )  ',' /[______]\\ ','  ``    ``  '],
    ['            ','   _,--._   ','  ( {E}  {E} )  ',' /[______]\\ ','   ``  ``   '],
    ['            ','   _,--._   ','  ( {E}  {E} )  ',' /[======]\\ ','  ``    ``  '],
  ],
  snail: [
    ['            ',' {E}    .--.  ','  \\  ( @ )  ','   \\_`--´   ','  ~~~~~~~   '],
    ['            ','  {E}   .--.  ','  |  ( @ )  ','   \\_`--´   ','  ~~~~~~~   '],
    ['            ',' {E}    .--.  ','  \\  ( @  ) ','   \\_`--´   ','   ~~~~~~   '],
  ],
  ghost: [
    ['            ','   .----.   ','  / {E}  {E} \\  ','  |      |  ','  ~`~``~`~  '],
    ['            ','   .----.   ','  / {E}  {E} \\  ','  |      |  ','  `~`~~`~`  '],
    ['    ~  ~    ','   .----.   ','  / {E}  {E} \\  ','  |      |  ','  ~~`~~`~~  '],
  ],
  axolotl: [
    ['            ','}~(______)~{','}~({E} .. {E})~{','  ( .--. )  ','  (_/  \\_)  '],
    ['            ','~}(______){~','~}({E} .. {E}){~','  ( .--. )  ','  (_/  \\_)  '],
    ['            ','}~(______)~{','}~({E} .. {E})~{','  (  --  )  ','  ~_/  \\_~  '],
  ],
  capybara: [
    ['            ','  n______n  ',' ( {E}    {E} ) ',' (   oo   ) ','  `------´  '],
    ['            ','  n______n  ',' ( {E}    {E} ) ',' (   Oo   ) ','  `------´  '],
    ['    ~  ~    ','  u______n  ',' ( {E}    {E} ) ',' (   oo   ) ','  `------´  '],
  ],
  cactus: [
    ['            ',' n  ____  n ',' | |{E}  {E}| | ',' |_|    |_| ','   |    |   '],
    ['            ','    ____    ',' n |{E}  {E}| n ',' |_|    |_| ','   |    |   '],
    [' n        n ',' |  ____  | ',' | |{E}  {E}| | ',' |_|    |_| ','   |    |   '],
  ],
  robot: [
    ['            ','   .[||].   ','  [ {E}  {E} ]  ','  [ ==== ]  ','  `------´  '],
    ['            ','   .[||].   ','  [ {E}  {E} ]  ','  [ -==- ]  ','  `------´  '],
    ['     *      ','   .[||].   ','  [ {E}  {E} ]  ','  [ ==== ]  ','  `------´  '],
  ],
  rabbit: [
    ['            ','   (\\__/)   ','  ( {E}  {E} )  ',' =(  ..  )= ','  (")__(")  '],
    ['            ','   (|__/)   ','  ( {E}  {E} )  ',' =(  ..  )= ','  (")__(")  '],
    ['            ','   (\\__/)   ','  ( {E}  {E} )  ',' =( .  . )= ','  (")__(")  '],
  ],
  mushroom: [
    ['            ',' .-o-OO-o-. ','(__________)','   |{E}  {E}|   ','   |____|   '],
    ['            ',' .-O-oo-O-. ','(__________)','   |{E}  {E}|   ','   |____|   '],
    ['   . o  .   ',' .-o-OO-o-. ','(__________)','   |{E}  {E}|   ','   |____|   '],
  ],
  chonk: [
    ['            ','  /\\    /\\  ',' ( {E}    {E} ) ',' (   ..   ) ','  `------´  '],
    ['            ','  /\\    /|  ',' ( {E}    {E} ) ',' (   ..   ) ','  `------´  '],
    ['            ','  /\\    /\\  ',' ( {E}    {E} ) ',' (   ..   ) ','  `------´~ '],
  ],
}

// ─── Engine ──────────────────────────────────────────────────

function mulberry32(seed) {
  let a = seed >>> 0
  return function() {
    a |= 0; a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hashString(s) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) }
  return h >>> 0
}

function pick(rng, arr) { return arr[Math.floor(rng() * arr.length)] }

function rollRarity(rng) {
  const total = Object.values(RARITY_WEIGHTS).reduce((a,b)=>a+b,0)
  let roll = rng() * total
  for (const r of RARITIES) { roll -= RARITY_WEIGHTS[r]; if (roll < 0) return r }
  return 'common'
}

function rollStats(rng, rarity) {
  const floor = RARITY_FLOOR[rarity]
  const peak = pick(rng, STAT_NAMES)
  let dump = pick(rng, STAT_NAMES)
  while (dump === peak) dump = pick(rng, STAT_NAMES)
  const stats = {}
  for (const name of STAT_NAMES) {
    if (name === peak)      stats[name] = Math.min(100, floor + 50 + Math.floor(rng() * 30))
    else if (name === dump) stats[name] = Math.max(1, floor - 10 + Math.floor(rng() * 15))
    else                    stats[name] = floor + Math.floor(rng() * 40)
  }
  return stats
}

function rollPet(userId) {
  const rng = mulberry32(hashString(userId + SALT))
  const rarity = rollRarity(rng)
  return {
    userId, rarity, species: pick(rng, SPECIES), eye: pick(rng, EYES),
    hat: rarity === 'common' ? 'none' : pick(rng, HATS),
    shiny: rng() < 0.01, stats: rollStats(rng, rarity),
  }
}

function renderSprite(species, eye, hat, frame = 0) {
  const frames = BODIES[species]
  const body = frames[frame % frames.length].map(l => l.replaceAll('{E}', eye))
  const lines = [...body]
  if (hat !== 'none' && !lines[0].trim()) lines[0] = HAT_LINES[hat]
  if (!lines[0].trim() && frames.every(f => !f[0].trim())) lines.shift()
  return lines
}

// ─── Terminal rendering ───────────────────────────────────────

function bar(val, width = 18) {
  const filled = Math.round((val / 100) * width)
  return '█'.repeat(filled) + '░'.repeat(width - filled)
}

function printPet(pet) {
  const rc = C[pet.rarity] || C.white
  const em = SPECIES_EMOJI[pet.species]
  const sprite = renderSprite(pet.species, pet.eye, pet.hat, 0)

  console.log()
  console.log(C.dim + '━'.repeat(52) + C.reset)
  console.log(C.bold + rc + `  ${em}  ${pet.species.toUpperCase()}` + C.reset +
              (pet.shiny ? C.yellow + '  ✨ SHINY!' + C.reset : ''))
  console.log(C.dim + `  seed: "${pet.userId}"` + C.reset)
  console.log()

  sprite.forEach(line => console.log('  ' + rc + line + C.reset))
  console.log()

  console.log(C.bold + '  Rarity  ' + rc + RARITY_LABELS[pet.rarity] + C.reset)
  console.log(C.dim  + `  Eye     ${C.reset}${pet.eye}   ` +
              C.dim  + `Hat  ${C.reset}${HAT_EMOJI[pet.hat]} ${pet.hat}`)
  console.log()
  console.log(C.bold + '  Stats' + C.reset)

  for (const name of STAT_NAMES) {
    const val  = pet.stats[name]
    const peak = val >= 80
    const dump = val <= 15
    const mark = peak ? C.yellow + ' ▲ PEAK' + C.reset
                      : dump ? C.dim + ' ▼ dump' + C.reset : ''
    console.log(
      C.dim + `  ${name.padEnd(10)}` + C.reset +
      rc + bar(val) + C.reset +
      ` ${String(val).padStart(3)}` + mark
    )
  }

  console.log()
  console.log(C.dim + '━'.repeat(52) + C.reset)
  console.log()
}

function printHelp() {
  console.log(`
${C.bold}${C.cyan}🐾  buddy-roll — Hatch your Buddy companion pet${C.reset}

${C.bold}Usage:${C.reset}
  npx buddy-pet-gallery <seed>          # hatch the pet for a given string
  npx buddy-pet-gallery alice bob       # hatch multiple at once
  npx buddy-pet-gallery --all           # show all 18 species
  npx buddy-pet-gallery --demo          # 5 fun example hatches
  npx buddy-pet-gallery --help          # show this help

  # or run locally:
  node buddy-roll.js <seed>

${C.bold}Examples:${C.reset}
  npx buddy-pet-gallery alice
  npx buddy-pet-gallery your-github-username
  npx buddy-pet-gallery legendary-hunter

${C.dim}Same seed → same pet every time (deterministic hash).${C.reset}
${C.dim}Sprites from @anthropic-ai/claude-code · buddy/ module.${C.reset}
  `)
}

// ─── Main ─────────────────────────────────────────────────────

const args = process.argv.slice(2)

if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  printHelp()
  process.exit(0)
}

if (args.includes('--all')) {
  console.log(C.bold + C.cyan + '\n📖  All 18 species  (species name as seed)\n' + C.reset)
  SPECIES.forEach(s => printPet(rollPet(s)))
  process.exit(0)
}

if (args.includes('--demo')) {
  const demos = ['alice', 'bob', 'legendary-hunter', 'xXx_gamer_xXx', String(Date.now())]
  console.log(C.bold + C.cyan + '\n🎭  Demo Rolls\n' + C.reset)
  demos.forEach(id => printPet(rollPet(id)))
  process.exit(0)
}

console.log(C.bold + C.cyan + '\n🥚  Hatching…\n' + C.reset)
args.filter(a => !a.startsWith('--')).forEach(id => printPet(rollPet(id)))
