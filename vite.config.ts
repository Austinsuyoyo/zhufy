import { fileURLToPath, URL } from 'node:url'
import { existsSync, mkdirSync, copyFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import sitemapPlugin from 'vite-plugin-sitemap'
import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'

// Plugin to copy index.html to sub-routes for SPA support on GitHub Pages
function copyIndexToRoutes(routes: string[]): Plugin {
  return {
    name: 'copy-index-to-routes',
    writeBundle(options) {
      const outDir = options.dir || 'dist'
      const indexPath = resolve(outDir, 'index.html')

      for (const route of routes) {
        const routeDir = resolve(outDir, route.replace(/^\//, ''))
        const routeIndex = resolve(routeDir, 'index.html')

        if (!existsSync(routeDir)) {
          mkdirSync(routeDir, { recursive: true })
        }
        copyFileSync(indexPath, routeIndex)
      }
    },
  }
}

// https://vite.dev/config/
const base = process.env.GITHUB_REPOSITORY
  ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/`
  : process.env.VITE_BASE_PATH || '/zhufy/'

const hostname = 'https://www.austinsuyoyo.com'
const basePath = base === '/' ? '' : base.replace(/\/$/, '')

export default defineConfig({
  base,
  plugins: [
    vue(),
    ...(process.env.NODE_ENV === 'development' ? [vueDevTools()] : []),
    sitemapPlugin({
      hostname,
      basePath,
      dynamicRoutes: ['/editor'],
      exclude: ['/404'],
      changefreq: {
        '/': 'weekly',
        '/editor': 'monthly',
      },
      priority: {
        '/': 1.0,
        '/editor': 0.8,
      },
      readable: true,
      generateRobotsTxt: false,
    }),
    copyIndexToRoutes(['/editor']),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss(),
        autoprefixer({
          overrideBrowserslist: [
            'Android 4.1',
            'iOS 7.1',
            'Chrome > 31',
            'ff > 31',
            'ie >= 8',
            'last 2 versions',
          ],
        }),
      ],
    },
  },
  esbuild: {
    drop: ['console', 'debugger'],
  },
  preview: {
    host: '0.0.0.0',
  },
  build: {
    target: 'es2015',
    minify: 'esbuild',
    cssMinify: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        chunkFileNames: 'js/[name].[hash].js',
        entryFileNames: 'js/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
        manualChunks: {
          'vendor-vue': ['vue', 'pinia'],
          'vendor-fabric': ['fabric'],
          'vendor-icons': ['lucide-vue-next'],
        },
      },
    },
  },
})
