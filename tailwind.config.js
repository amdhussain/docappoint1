/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#007A87',
        primaryDark: '#005E6B',
        primaryLight: '#00a3b1',
        secondary: '#E8F4F8',
        accent: '#00B4D8',
        slateLight: '#F8FAFC',
        slateDark: '#1E293B',
        teal: {
          50: '#E8F4F8',
          100: '#C5E4EC',
          500: '#007A87',
          600: '#005E6B',
          700: '#004D59',
        },
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
};
