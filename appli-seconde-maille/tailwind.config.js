/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Apparat Semi Condensed"', '"Barlow Semi Condensed"', '"Arial Narrow"', 'sans-serif'],
        sans: ['"Gilroy"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};
