#!/usr/bin/env node
// Deterministic bundle snapshot for before/after optimization deltas.
//
// Usage:
//   npm run build-only && node scripts/measure.mjs            # print snapshot
//   npm run build-only && node scripts/measure.mjs > a.json   # save a baseline
//
// Content hashes in filenames are stripped so two snapshots diff cleanly.
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { gzipSync } from 'node:zlib'
import { join } from 'node:path'

const DIST = 'dist'
if (!existsSync(DIST)) {
  console.error('dist/ not found — run `npm run build-only` first.')
  process.exit(1)
}

const stripHash = (f) => f.replace(/\.[A-Za-z0-9_-]+\.(js|css)$/, '.$1')
const sizeOf = (relPath) => {
  const buf = readFileSync(join(DIST, relPath))
  return { raw: buf.length, gzip: gzipSync(buf).length }
}

// Chunks referenced directly by index.html = what the landing page must download.
const html = readFileSync(join(DIST, 'index.html'), 'utf8')
const criticalChunks = [...html.matchAll(/(?:src|href)="[^"]*\/(js\/[^"]+\.js)"/g)].map((m) => m[1])
const criticalSet = new Set(criticalChunks)
const fabricInCriticalPath = criticalChunks.some((c) => c.includes('vendor-fabric'))

const jsDir = join(DIST, 'js')
const jsFiles = existsSync(jsDir) ? readdirSync(jsDir).filter((f) => f.endsWith('.js')) : []
const chunks = jsFiles
  .map((f) => ({ name: stripHash(f), ...sizeOf(join('js', f)) }))
  .sort((a, b) => b.gzip - a.gzip)

const landingJsGzip = jsFiles
  .filter((f) => criticalSet.has('js/' + f))
  .reduce((sum, f) => sum + sizeOf(join('js', f)).gzip, 0)

const assetsDir = join(DIST, 'assets')
const cssFiles = existsSync(assetsDir)
  ? readdirSync(assetsDir).filter((f) => f.endsWith('.css'))
  : []
let cssRaw = 0
let cssGzip = 0
let vendorPrefixes = 0
for (const f of cssFiles) {
  const buf = readFileSync(join(assetsDir, f))
  cssRaw += buf.length
  cssGzip += gzipSync(buf).length
  vendorPrefixes += (buf.toString('utf8').match(/-webkit-|-moz-|-ms-/g) || []).length
}

const snapshot = {
  criticalPath: {
    chunks: criticalChunks.map(stripHash),
    fabricInCriticalPath,
    landingJsGzip,
  },
  chunks,
  totalJsGzip: chunks.reduce((s, c) => s + c.gzip, 0),
  css: { raw: cssRaw, gzip: cssGzip, vendorPrefixes },
}

console.log(JSON.stringify(snapshot, null, 2))
