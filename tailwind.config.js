/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist', 'Inter', 'sans-serif'],
      },
      colors: {
        darkbg: '#0b080c',
        darkcard: '#120d14',
        accent: {
          purple: '#c2a4ff',
          neon: '#a87cff',
          glow: 'rgba(194, 164, 255, 0.15)'
        }
      }
    },
  },
  plugins: [],
}
