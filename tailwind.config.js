/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b5bdb', // Main blue color
        secondary: '#4c6ef5',
        danger: '#e03131',
        success: '#2f9e44',
        warning: '#f59f00',
      }
    },
  },
  plugins: [],
}

