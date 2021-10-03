/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        pitch: {
          50:  '#ecfaf0',
          100: '#d0f3da',
          200: '#a3e6b9',
          300: '#6dd293',
          400: '#37b86c',
          500: '#1aa052',
          600: '#0b8f3a', // primary accent
          700: '#097030',
          800: '#085828',
          900: '#053e1c',
        },
        chalk: {
          50:  '#fafaf8',
          100: '#f4f3ee',
          200: '#e6e4dc',
          300: '#c9c6bb',
          400: '#9c9889',
          500: '#6f6c5f',
          600: '#4f4d44',
          700: '#36352f',
          800: '#23221f',
          900: '#141413',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(20,20,19,0.04), 0 4px 12px rgba(20,20,19,0.06)',
      },
    },
  },
  plugins: [],
};
