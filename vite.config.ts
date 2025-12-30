import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.GITHUB_REPOSITORY 
    ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/` 
    : process.env.VITE_BASE_PATH || '/',
  plugins: [
    vue(),
    ...(process.env.NODE_ENV === 'development' ? [vueDevTools()] : []),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
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
        },
      },
    },
  },
})
