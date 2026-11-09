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
          blue: '#38BDF8',
          deep: '#0284C7',
          black: '#0F172A',
        },
        lveb: {
          navy: '#12354A',
          sand: '#F8FAFC',
          coral: '#0284C7',
          green: '#0D9488',
        }
      },
      fontFamily: {
        condensed: ['"Anton"', 'Impact', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 10px 30px -10px rgba(15, 23, 42, 0.07)',
        'soft-lg': '0 20px 45px -15px rgba(15, 23, 42, 0.12)',
        'phone': '0 25px 60px -15px rgba(15, 23, 42, 0.18), 0 0 0 1px rgba(15, 23, 42, 0.08)',
      }
    },
  },
  plugins: [],
}
