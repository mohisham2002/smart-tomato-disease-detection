/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        forest: {
          50: '#f2fcf5',
          100: '#e1f8e8',
          200: '#c3efd1',
          300: '#96e2ab',
          400: '#5ecf7a',
          500: '#34b549',
          600: '#288f38',
          700: '#237032',
          800: '#20582d',
          900: '#1a4726',
        },
        earth: {
          50: '#faf8f5',
          100: '#f3ede4',
          200: '#e5d9c9',
          300: '#d3bea7',
          400: '#be9d82',
          500: '#a88264',
          600: '#8f6a51',
          700: '#755442',
          800: '#604537',
          900: '#4f3a2f',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Textworthy', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
