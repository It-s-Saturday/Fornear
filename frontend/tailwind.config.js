/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-unused-vars
const plugin = require('tailwindcss/plugin');

module.exports = {
  content: ['./src/**/*.html', './src/**/*.js', './src/**/*.jsx'],
  theme: {
    extend: {
      colors: {
        primary: '#ffdd00',
        secondary: '#bbb0a5',
        'accent-blue': '#71b2c9',
        'accent-blue-hover': '#497281',
        'accent-red': '#c8102e',
      },
    },
  },
  // eslint-disable-next-line global-require
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
};
