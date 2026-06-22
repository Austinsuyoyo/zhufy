import { defineConfig } from 'vitest/config'

// Minimal, plugin-free config: the unit tests cover plain TS utilities
// (no SFC compilation needed), so we keep this separate from vite.config.ts.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/__tests__/**/*.{test,spec}.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text-summary', 'json-summary'],
      // Unit-testable TS surface. Components/.vue are covered by the Playwright
      // e2e suite (and aren't instrumented by this plugin-free config).
      include: ['src/**/*.ts'],
      exclude: ['src/**/__tests__/**', 'src/main.ts', 'src/**/*.d.ts', 'src/config/**'],
    },
  },
})
