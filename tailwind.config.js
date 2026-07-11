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
          dark: '#0a0f1d',
          darker: '#060913',
          card: '#131b2f',
          blue: '#1e3a8a',
          cyan: '#06b6d4',
          accent: '#3b82f6'
        },
        status: {
          safe: '#10b981',
          medium: '#f59e0b',
          high: '#f97316',
          critical: '#ef4444'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
