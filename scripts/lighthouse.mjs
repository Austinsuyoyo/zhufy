#!/usr/bin/env node
// Runs the SAME Lighthouse engine as the Brave/Chrome DevTools "Lighthouse" panel,
// but scriptable and repeatable. Saves a JSON + HTML report and prints category
// scores plus the audits dragging each score down.
//
// Usage:
//   npm run lighthouse                              # default URL, mobile preset, 1 run
//   npm run lighthouse -- <url>                     # custom URL
//   npm run lighthouse -- <url> --preset=desktop    # desktop emulation
//   npm run lighthouse -- <url> --runs=5            # median of 5 (perf is noisy)
//   npm run lighthouse -- <url> --min-perf=85 --min-bp=90   # fail (exit 1) below threshold
//
// Chrome: uses CHROME_PATH if set, else the agent-browser Chrome for Testing.
import { writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import * as chromeLauncher from 'chrome-launcher'
import lighthouse from 'lighthouse'
import desktopConfig from 'lighthouse/core/config/desktop-config.js'

const args = process.argv.slice(2)
const flagOf = (name, def) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`))
  return hit ? hit.split('=')[1] : def
}
const url = args.find((a) => !a.startsWith('--')) || 'https://www.austinsuyoyo.com/zhufy/editor/'
const preset = flagOf('preset', 'mobile')
const runs = parseInt(flagOf('runs', '1'), 10)
const thresholds = {
  performance: parseFloat(flagOf('min-perf', '0')),
  accessibility: parseFloat(flagOf('min-a11y', '0')),
  'best-practices': parseFloat(flagOf('min-bp', '0')),
  seo: parseFloat(flagOf('min-seo', '0')),
}

const CHROME_PATH =
  process.env.CHROME_PATH ||
  '/home/austinsuyoyo/.agent-browser/browsers/chrome-149.0.7827.115/chrome'

const CATS = ['performance', 'accessibility', 'best-practices', 'seo']
const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b)
  const m = Math.floor(s.length / 2)
  return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2)
}

async function runOnce(chrome) {
  const flags = { port: chrome.port, output: ['json', 'html'], logLevel: 'error' }
  const config = preset === 'desktop' ? desktopConfig : undefined
  const { lhr, report } = await lighthouse(url, flags, config)
  return { lhr, json: report[0], html: report[1] }
}

const failingAudits = (lhr, category) =>
  lhr.categories[category].auditRefs
    .map((ref) => lhr.audits[ref.id])
    .filter((a) => a.score !== null && a.score < 1)
    .map((a) => `      - ${a.title}${a.displayValue ? ` (${a.displayValue})` : ''}`)

const reportsDir = 'lighthouse-reports'
if (!existsSync(reportsDir)) mkdirSync(reportsDir, { recursive: true })

console.log(`\n  URL:     ${url}`)
console.log(`  preset:  ${preset}    runs: ${runs}    chrome: ${CHROME_PATH.split('/').pop()}\n`)

const chrome = await chromeLauncher.launch({
  chromePath: CHROME_PATH,
  chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
})

const scores = { performance: [], accessibility: [], 'best-practices': [], seo: [] }
let last
try {
  for (let i = 0; i < runs; i++) {
    last = await runOnce(chrome)
    for (const c of CATS) scores[c].push(Math.round((last.lhr.categories[c].score ?? 0) * 100))
    if (runs > 1) console.log(`  run ${i + 1}/${runs}: ${CATS.map((c) => scores[c][i]).join(' / ')}`)
  }
} finally {
  await chrome.kill()
}

const slug = url.replace(/^https?:\/\//, '').replace(/[^a-z0-9]+/gi, '-').replace(/-+$/, '')
writeFileSync(join(reportsDir, `${slug}.report.html`), last.html)
writeFileSync(join(reportsDir, `${slug}.lhr.json`), last.json)

const label = { performance: 'Performance', accessibility: 'Accessibility', 'best-practices': 'Best Practices', seo: 'SEO' }
console.log('\n  ┌─────────────────┬────────┐')
console.log('  │ Category        │ Score  │')
console.log('  ├─────────────────┼────────┤')
let failed = false
for (const c of CATS) {
  const score = runs > 1 ? median(scores[c]) : scores[c][0]
  const min = thresholds[c]
  const bad = min > 0 && score < min
  if (bad) failed = true
  const note = bad ? ` ✗ < ${min}` : ''
  console.log(`  │ ${label[c].padEnd(15)} │ ${String(score).padStart(4)}   │${note}`)
}
console.log('  └─────────────────┴────────┘')

// Explain the two scores that aren't perfect, so the report is actionable.
for (const c of ['accessibility', 'best-practices', 'performance']) {
  const fa = failingAudits(last.lhr, c)
  if (fa.length) {
    console.log(`\n  ${label[c]} — audits not passing:`)
    console.log(fa.join('\n'))
  }
}

console.log(`\n  Reports: ${reportsDir}/${slug}.report.html  (open in browser)\n`)
process.exit(failed ? 1 : 0)
