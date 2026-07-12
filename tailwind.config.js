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
          dark: '#f8fafc',
          darker: '#e0f2fe',
          card: '#eff6ff',
          blue: '#2563eb',
          cyan: '#0ea5e9',
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
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
