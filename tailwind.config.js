/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1A73E8',
          dark: '#1557B0', // Slightly darker for hover
        },
        accent: {
          DEFAULT: '#FF6D00',
          dark: '#E65100', // Slightly darker for hover
        },
      },
      fontFamily: {
        sans: ['"Public Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
