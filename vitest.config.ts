import { defineConfig } from 'vitest/config'

// Minimal, plugin-free config: the unit tests cover plain TS utilities
// (no SFC compilation needed), so we keep this separate from vite.config.ts.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/__tests__/**/*.{test,spec}.ts'],
  },
})
