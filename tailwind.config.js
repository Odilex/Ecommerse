/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF4B2B',
          dark: '#E63E1C',
          light: '#FF6B4A'
        },
        secondary: {
          DEFAULT: '#2B7FFF',
          dark: '#1C63E6',
          light: '#4A8FFF'
        },
        background: {
          light: '#F8F9FA',
          dark: '#121212'
        }
      },
      fontFamily: {
        sans: ['System'],
        heading: ['System-Bold']
      }
    },
  },
  plugins: [],
} 