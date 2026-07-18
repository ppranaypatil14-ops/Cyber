/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#0a0f1c',
          darker: '#03050a',
          card: '#111a2d',
          blue: '#3b82f6',
          cyan: '#06b6d4',
          accent: '#0ea5e9'
        },
        status: {
          safe: '#10b981',
          medium: '#f59e0b',
          high: '#f97316',
          critical: '#ef4444'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
