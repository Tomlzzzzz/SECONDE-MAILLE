/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vakita: {
          aqua: '#5EEAD4',
          deep: '#0D9488',
          black: '#0F2926',
        },
        lveb: {
          navy: '#115E59',
          sand: '#F5FBF9',
          coral: '#0D9488',
          green: '#0D9488',
        }
      },
      fontFamily: {
        condensed: ['"Anton"', 'Impact', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 10px 30px -10px rgba(15, 41, 38, 0.07)',
        'soft-lg': '0 20px 45px -15px rgba(15, 41, 38, 0.12)',
        'phone': '0 25px 60px -15px rgba(15, 41, 38, 0.18), 0 0 0 1px rgba(15, 41, 38, 0.08)',
      }
    },
  },
  plugins: [],
}
