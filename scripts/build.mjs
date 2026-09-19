// Generates every SVG in /assets. Run: node scripts/build.mjs
// Edit the STACK list below to add/remove chips, then paste the printed markup into README.md.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const icons = JSON.parse(fs.readFileSync(path.join(root, 'scripts/icons.json'), 'utf8'))
const out = (rel, svg) => {
  const file = path.join(root, 'assets', rel)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, svg.replace(/\n\s+/g, '\n').trim() + '\n')
}

const MONO = "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace"
const SANS = "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif"

const THEMES = {
  dark: {
    bg: '#0a0d12', border: '#21262d', text: '#f0f6fc', muted: '#9198a1', faint: '#30363d',
    ember1: '#ff4d14', ember2: '#ffb52e', glow: 0.34, grid: '#ffffff', gridOpacity: 0.07,
  },
  light: {
    bg: '#ffffff', border: '#d1d9e0', text: '#1f2328', muted: '#59636e', faint: '#d1d9e0',
    ember1: '#e03e0b', ember2: '#f08c00', glow: 0.18, grid: '#1f2328', gridOpacity: 0.08,
  },
}

// deterministic pseudo-random so rebuilds don't churn the diff
let seed = 7
const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646
const f = (n) => Number(n.toFixed(1))

/* ------------------------------------------------------------------ hero */

function phoenix(cx, cy) {
  const paths = []
  const pt = (deg, len) => [cx + Math.cos((deg * Math.PI) / 180) * len, cy - Math.sin((deg * Math.PI) / 180) * len]
  // wings: a fan of feathers that dip out of the body and sweep up to the tips, mirrored
  const N = 13
  for (const side of [1, -1]) {
    for (let i = 0; i < N; i++) {
      const t = i / (N - 1)
      const deg = 2 + t * 76
      const len = 120 + 172 * Math.sin(Math.PI * (0.12 + 0.74 * t))
      const end = side === 1 ? deg : 180 - deg
      const ctl = side === 1 ? deg - 30 : 180 - deg + 30
      const [ex, ey] = pt(end, len)
      const [mx, my] = pt(ctl, len * 0.58)
      paths.push({ d: `M${f(cx)} ${f(cy)} Q${f(mx)} ${f(my)} ${f(ex)} ${f(ey)}`, w: 2.5 - t * 1.2, o: 1 - t * 0.3, i })
    }
  }
  // tail: long streamers trailing down past the frame
  for (let i = 0; i < 7; i++) {
    const t = i / 6 - 0.5
    paths.push({
      d: `M${f(cx)} ${f(cy)} C${f(cx + t * 30)} ${f(cy + 80)} ${f(cx + t * 300)} ${f(cy + 110)} ${f(cx + t * 210)} ${f(cy + 240 - Math.abs(t) * 60)}`,
      w: 2 - Math.abs(t) * 1.3, o: 0.85 - Math.abs(t) * 0.6, i: i + 3,
    })
  }
  // neck, head, beak and crest
  const hx = cx + 10, hy = cy - 78
  paths.push({ d: `M${f(cx)} ${f(cy)} C${f(cx - 14)} ${f(cy - 30)} ${f(cx + 16)} ${f(cy - 48)} ${f(hx)} ${f(hy)}`, w: 3, o: 1, i: 0 })
  paths.push({ d: `M${f(hx)} ${f(hy)} q10 -4 22 4`, w: 2.4, o: 1, i: 1 })
  for (let i = 0; i < 3; i++) {
    paths.push({ d: `M${f(hx)} ${f(hy)} q${f(-10 - i * 6)} ${f(-22 + i * 5)} ${f(-36 - i * 8)} ${f(-26 + i * 14)}`, w: 1.4, o: 0.75, i: i + 2 })
  }
  return paths
}

function hero(name) {
  const c = THEMES[name]
  seed = 7
  const W = 1280, H = 420
  const bird = phoenix(1046, 240)
  const embers = Array.from({ length: 22 }, () => ({
    x: 780 + rnd() * 480, y: 300 + rnd() * 130, r: 1 + rnd() * 2.2, dur: 5 + rnd() * 6, delay: -rnd() * 11, drift: -30 + rnd() * 60, rise: 220 + rnd() * 160,
  }))
  const lines = [
    'next.js · react · typescript · tailwind',
    'bun · hono · postgres · drizzle · payload',
    'flutter · react native · electron · .net',
    'lua · fivem · nui · tebex',
    'claude agent sdk · gemini · fastapi',
    'remotion · gsap · three.js',
  ]
  const CH = 12.05 // forced glyph advance for the mono line (px)
  const STEP = 3.2
  const TOTAL = lines.length * STEP
  const pct = (s) => f((s / TOTAL) * 100)

  return `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Phoenix GoD — full-stack developer building for web, mobile, desktop and game servers">
    <defs>
      <linearGradient id="ember" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="${c.ember1}"/><stop offset="1" stop-color="${c.ember2}"/></linearGradient>
      <radialGradient id="feather" gradientUnits="userSpaceOnUse" cx="1046" cy="240" r="305"><stop offset="0" stop-color="${c.ember2}"/><stop offset=".45" stop-color="${c.ember1}"/><stop offset="1" stop-color="${c.ember1}" stop-opacity="0"/></radialGradient>
      <radialGradient id="glow" gradientUnits="userSpaceOnUse" cx="1046" cy="262" r="430"><stop offset="0" stop-color="${c.ember1}" stop-opacity="${c.glow}"/><stop offset=".55" stop-color="${c.ember1}" stop-opacity="${f(c.glow * 0.25)}"/><stop offset="1" stop-color="${c.ember1}" stop-opacity="0"/></radialGradient>
      <radialGradient id="core" gradientUnits="userSpaceOnUse" cx="1046" cy="240" r="60"><stop offset="0" stop-color="${c.ember2}" stop-opacity=".9"/><stop offset="1" stop-color="${c.ember2}" stop-opacity="0"/></radialGradient>
      <pattern id="dots" width="26" height="26" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.1" fill="${c.grid}" fill-opacity="${c.gridOpacity}"/></pattern>
      <linearGradient id="fade" x1="0" x2="1"><stop offset=".35" stop-color="#fff" stop-opacity="0"/><stop offset=".8" stop-color="#fff"/></linearGradient>
      <mask id="dotmask"><rect width="${W}" height="${H}" fill="url(#fade)"/></mask>
      <clipPath id="frame"><rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="26"/></clipPath>
    </defs>
    <style>
      .feather { fill: none; stroke: url(#feather); stroke-linecap: round; }
      .spark { fill: none; stroke: ${c.ember2}; stroke-linecap: round; stroke-width: 2.2; stroke-dasharray: 26 1000; animation: spark 4.2s linear infinite; }
      .bird { transform-origin: 1046px 240px; animation: breathe 6s ease-in-out infinite; }
      .ember { fill: ${c.ember2}; animation: rise linear infinite; opacity: 0; }
      .core { animation: pulse 3s ease-in-out infinite; transform-origin: 1046px 240px; }
      .dot { animation: pulse 2.4s ease-in-out infinite; transform-origin: 80px 85px; }
      .line { opacity: 0; animation: cycle ${TOTAL}s linear infinite; }
      .caret { animation: blink 1s steps(1) infinite; }
      @keyframes spark { from { stroke-dashoffset: 26; } to { stroke-dashoffset: -420; } }
      @keyframes breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.025) translateY(-3px); } }
      @keyframes rise { 0% { transform: translate(0, 0); opacity: 0; } 12% { opacity: .95; } 70% { opacity: .5; } 100% { transform: translate(var(--dx), var(--dy)); opacity: 0; } }
      @keyframes pulse { 0%, 100% { opacity: .55; transform: scale(1); } 50% { opacity: 1; transform: scale(1.18); } }
      @keyframes cycle { 0% { opacity: 0; transform: translateY(8px); } ${pct(0.35)}% { opacity: 1; transform: translateY(0); } ${pct(STEP - 0.35)}% { opacity: 1; transform: translateY(0); } ${pct(STEP)}% { opacity: 0; transform: translateY(-8px); } 100% { opacity: 0; } }
      @keyframes blink { 0%, 55% { opacity: 1; } 56%, 100% { opacity: 0; } }
      @media (prefers-reduced-motion: reduce) { .spark, .bird, .ember, .core, .dot, .line, .caret { animation: none; } .line { opacity: 0; } .line.first { opacity: 1; } .ember { opacity: .6; } }
    </style>

    <rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="26" fill="${c.bg}" stroke="${c.border}" stroke-width="2"/>
    <g clip-path="url(#frame)">
      <rect width="${W}" height="${H}" fill="url(#dots)" mask="url(#dotmask)"/>
      <rect width="${W}" height="${H}" fill="url(#glow)"/>
      <g class="bird">
        ${bird.map((p) => `<path class="feather" d="${p.d}" stroke-width="${f(p.w)}" opacity="${f(p.o)}"/>`).join('\n')}
        ${bird.filter((_, i) => i % 2 === 0).map((p) => `<path class="spark" d="${p.d}" style="animation-delay:${f(-p.i * 0.37)}s"/>`).join('\n')}
        <circle class="core" cx="1046" cy="240" r="60" fill="url(#core)"/>
        <circle cx="1046" cy="240" r="5" fill="${c.ember2}"/>
      </g>
      ${embers.map((e) => `<circle class="ember" cx="${f(e.x)}" cy="${f(e.y)}" r="${f(e.r)}" style="--dx:${f(e.drift)}px;--dy:${f(-e.rise)}px;animation-duration:${f(e.dur)}s;animation-delay:${f(e.delay)}s"/>`).join('\n')}
    </g>

    <circle class="dot" cx="80" cy="85" r="5" fill="url(#ember)"/>
    <text x="98" y="90" font-family="${MONO}" font-size="15" letter-spacing="2.6" fill="${c.muted}">ARKA ROY  /  @PHOENIXGODDEV</text>

    <text x="70" y="196" font-family="${SANS}" font-size="104" font-weight="800" letter-spacing="-4.5" fill="${c.text}">Phoenix <tspan fill="url(#ember)">GoD</tspan></text>
    <text x="76" y="252" font-family="${SANS}" font-size="25" fill="${c.muted}">Full-stack developer — web, mobile, desktop &amp; game servers.</text>

    <rect x="76" y="292" width="${f(lines.reduce((m, l) => Math.max(m, l.length), 0) * CH + 74)}" height="52" rx="12" fill="${c.text}" fill-opacity=".04" stroke="${c.faint}"/>
    <text x="96" y="325" font-family="${MONO}" font-size="20" font-weight="700" fill="url(#ember)">~$</text>
    ${lines.map((l, i) => `
      <g class="line${i === 0 ? ' first' : ''}" style="animation-delay:${f(i * STEP)}s">
        <text x="132" y="325" font-family="${MONO}" font-size="20" fill="${c.text}" textLength="${f(l.length * CH)}" lengthAdjust="spacing">${l}</text>
        <rect class="caret" x="${f(132 + l.length * CH + 8)}" y="307" width="11" height="23" rx="2" fill="url(#ember)"/>
      </g>`).join('')}

    <text x="78" y="384" font-family="${MONO}" font-size="14" letter-spacing="1.6" fill="${c.muted}">IST · UTC+05:30<tspan dx="26" fill="url(#ember)">/</tspan><tspan dx="26">FOUNDER @PX-SCRIPTS</tspan><tspan dx="26" fill="url(#ember)">/</tspan><tspan dx="26">STILL ROLLIN'</tspan></text>
  </svg>`
}

/* ----------------------------------------------------------------- chips */

const CUSTOM = {
  globe: `<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9.5"/><path d="M2.5 12h19M12 2.5c3 3.2 3 15.8 0 19M12 2.5c-3 3.2-3 15.8 0 19"/></g>`,
  bag: `<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 8h15l-1.2 12.5h-12.6z"/><path d="M8.5 8V6.5a3.5 3.5 0 0 1 7 0V8"/></g>`,
  play: `<g fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="2.5" y="4.5" width="19" height="15" rx="3"/><path d="M10 9v6l5-3z" fill="currentColor"/></g>`,
}

function chip(label, icon, { h = 32, size = 12.5, primary = false } = {}) {
  const adv = size * 0.62
  const tw = f(label.length * adv)
  const ix = h * 0.36, is = h * 0.47
  const tx = ix + is + h * 0.28
  const W = Math.ceil(tx + tw + h * 0.42)
  const ink = primary ? '#160a02' : '#e6edf3'
  const tint = primary ? '#160a02' : '#ff8a3d'
  const glyph = CUSTOM[icon] ?? `<path fill="currentColor" d="${icons[icon]}"/>`
  if (!CUSTOM[icon] && !icons[icon]) throw new Error(`missing icon: ${icon}`)
  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${h}" viewBox="0 0 ${W} ${h}" role="img" aria-label="${label.replace(/&/g, '&amp;')}">
    ${primary ? `<defs><linearGradient id="g" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#ff5a1f"/><stop offset="1" stop-color="#ffb52e"/></linearGradient></defs>` : ''}
    <rect x=".5" y=".5" width="${W - 1}" height="${h - 1}" rx="${f(h * 0.28)}" fill="${primary ? 'url(#g)' : '#12161d'}" stroke="${primary ? '#ffb52e' : '#2d333b'}"/>
    <g transform="translate(${f(ix)} ${f((h - is) / 2)}) scale(${(is / 24).toFixed(4)})" color="${tint}">${glyph}</g>
    <text x="${f(tx)}" y="${f(h / 2 + size * 0.35)}" font-family="${MONO}" font-size="${size}" font-weight="600" fill="${ink}" textLength="${tw}" lengthAdjust="spacing">${label.replace(/&/g, '&amp;')}</text>
  </svg>`
}

const STACK = [
  ['Languages', [['TypeScript', 'typescript'], ['JavaScript', 'javascript'], ['Python', 'python'], ['Dart', 'dart'], ['Lua', 'lua'], ['C#', 'dotnet']]],
  ['Frontend', [['React 19', 'react'], ['Next.js 16', 'nextdotjs'], ['Tailwind CSS 4', 'tailwindcss'], ['Vite', 'vite'], ['shadcn/ui', 'shadcnui'], ['GSAP', 'greensock'], ['Motion', 'framer'], ['Three.js', 'threedotjs']]],
  ['Backend', [['Node.js', 'nodedotjs'], ['Bun', 'bun'], ['Hono', 'hono'], ['Express', 'express'], ['FastAPI', 'fastapi'], ['Socket.IO', 'socketdotio'], ['GraphQL', 'graphql'], ['Zod', 'zod'], ['Better Auth', 'betterauth']]],
  ['Data & CMS', [['PostgreSQL', 'postgresql'], ['Drizzle', 'drizzle'], ['Prisma', 'prisma'], ['Payload CMS', 'payloadcms'], ['MongoDB', 'mongodb'], ['MySQL', 'mysql'], ['Redis', 'redis'], ['PocketBase', 'pocketbase']]],
  ['Mobile & Desktop', [['Flutter', 'flutter'], ['React Native', 'react'], ['Expo', 'expo'], ['Capacitor', 'capacitor'], ['Electron', 'electron'], ['.NET 8', 'dotnet']]],
  ['Game & Creative', [['FiveM', 'fivem'], ['Tebex', 'bag'], ['Discord.js', 'discorddotjs'], ['Remotion', 'play'], ['Rive', 'rive'], ['Blender', 'blender']]],
  ['AI & Automation', [['Claude Agent SDK', 'claude'], ['Gemini API', 'googlegemini'], ['Puppeteer', 'puppeteer'], ['Playwright', 'playwright']]],
  ['Ship & Test', [['Docker', 'docker'], ['Vercel', 'vercel'], ['Git', 'git'], ['pnpm', 'pnpm'], ['Vitest', 'vitest']]],
]
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'x'

/* ------------------------------------------------------- headers + footer */

function heading(name, num, word, sub) {
  const c = THEMES[name]
  const A = 9.4, B = 8.1
  const x1 = 34, x2 = x1 + word.length * (A + 3) + 16
  const W = Math.ceil(x2 + sub.length * B + 4)
  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="28" viewBox="0 0 ${W} 28" role="img" aria-label="${word}: ${sub}">
    <defs><linearGradient id="e" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="${c.ember1}"/><stop offset="1" stop-color="${c.ember2}"/></linearGradient></defs>
    <text x="0" y="20" font-family="${MONO}" font-size="15" font-weight="700" fill="url(#e)" textLength="22" lengthAdjust="spacingAndGlyphs">${num}</text>
    <text x="${x1}" y="20" font-family="${MONO}" font-size="15.5" font-weight="700" fill="${c.text}" textLength="${f(word.length * (A + 3) - 3)}" lengthAdjust="spacing">${word}</text>
    <text x="${f(x2)}" y="20" font-family="${MONO}" font-size="13.5" fill="${c.muted}" textLength="${f(sub.length * B)}" lengthAdjust="spacing">${sub}</text>
  </svg>`
}

function footer(name) {
  const c = THEMES[name]
  const W = 1280, H = 120
  let d = `M0 60`
  for (let x = 0; x < W; x += 80) d += ` q20 ${x % 160 === 0 ? -16 : 16} 40 0 t40 0`
  return `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Still rollin'">
    <defs>
      <linearGradient id="l" x1="0" x2="1"><stop offset="0" stop-color="${c.ember1}" stop-opacity="0"/><stop offset=".3" stop-color="${c.ember1}"/><stop offset=".7" stop-color="${c.ember2}"/><stop offset="1" stop-color="${c.ember2}" stop-opacity="0"/></linearGradient>
      <mask id="gap"><rect width="${W}" height="${H}" fill="#fff"/><rect x="505" y="30" width="270" height="60" fill="#000"/></mask>
    </defs>
    <style>
      .w { fill: none; stroke: url(#l); stroke-width: 2; stroke-linecap: round; }
      .s { fill: none; stroke: ${c.ember2}; stroke-width: 3; stroke-linecap: round; stroke-dasharray: 60 1400; animation: run 7s linear infinite; }
      @keyframes run { from { stroke-dashoffset: 60; } to { stroke-dashoffset: -1400; } }
      @media (prefers-reduced-motion: reduce) { .s { animation: none; opacity: 0; } }
    </style>
    <g mask="url(#gap)"><path class="w" d="${d}"/><path class="s" d="${d}"/></g>
    <text x="640" y="66" text-anchor="middle" font-family="${MONO}" font-size="17" letter-spacing="5" fill="${c.muted}">STILL ROLLIN'</text>
  </svg>`
}

/* ------------------------------------------------------------------ emit */

for (const t of ['dark', 'light']) {
  out(`hero-${t}.svg`, hero(t))
  out(`footer-${t}.svg`, footer(t))
  for (const [num, word, sub] of [['01', 'SPARK', 'who I am'], ['02', 'FORGE', 'what I build'], ['03', 'FUEL', 'the stack I ship with'], ['04', 'BURNING NOW', 'current focus'], ['05', 'EMBERS', 'activity'], ['06', 'POWERED BY', 'where my stuff runs']]) {
    out(`h/${num}-${t}.svg`, heading(t, num, word, sub))
  }
}

out('btn/website.svg', chip('phoenixdev.online', 'globe', { h: 40, size: 13.5, primary: true }))
out('btn/discord.svg', chip('Join the Discord', 'discord', { h: 40, size: 13.5 }))
out('btn/store.svg', chip('PX Scripts store', 'bag', { h: 40, size: 13.5 }))

let md = ''
for (const [group, items] of STACK) {
  md += `<tr>\n<td valign="top"><b>${group.replace(/&/g, '&amp;')}</b></td>\n<td>\n`
  for (const [label, icon] of items) {
    const file = `chips/${slug(label)}.svg`
    out(file, chip(label, icon))
    md += `<img src="assets/${file}" height="32" alt="${label.replace(/&/g, '&amp;')}" />\n`
  }
  md += `</td>\n</tr>\n`
}
console.log(`<table>
${md}</table>`)
console.log('built', fs.readdirSync(path.join(root, 'assets/chips')).length, 'chips')
