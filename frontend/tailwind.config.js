/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#4F0DCE',
        secondary: '#5767D0',
        lightPurple: '#7765DA',
        grayText: '#6E6E6E',
        darkText: '#373737',
        lightBg: '#F2F2F2'
      }
    },
  },
  plugins: [],
}
