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
          yellow: '#FFEA00',
          black: '#111111',
        },
        lveb: {
          navy: '#12354A',
          sand: '#F8F9FA',
          coral: '#E85D3F',
          green: '#1F7A54',
        }
      },
      fontFamily: {
        condensed: ['"Anton"', 'Impact', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 10px 30px -10px rgba(17, 17, 17, 0.07)',
        'soft-lg': '0 20px 45px -15px rgba(17, 17, 17, 0.12)',
        'phone': '0 25px 60px -15px rgba(17, 17, 17, 0.18), 0 0 0 1px rgba(17, 17, 17, 0.08)',
      }
    },
  },
  plugins: [],
}
