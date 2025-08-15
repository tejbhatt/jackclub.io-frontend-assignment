/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{svelte,js}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f4f1ff',
          100: '#e9e3ff',
          200: '#cfc4ff',
          300: '#b5a4ff',
          400: '#9b85ff',
          500: '#5D2BF5',
          600: '#4a21c4',
          700: '#381993',
          800: '#261262',
          900: '#140a31'
        }
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
};
