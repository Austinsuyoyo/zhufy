/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'zen': ['Zen Maru Gothic', 'sans-serif'],
        'serif': ['Noto Serif TC', 'serif'],
        'sans': ['Noto Sans TC', 'sans-serif'],
        'callig': ['Zhi Mang Xing', 'cursive'],
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: true,
  },
  safelist: [],
}

