/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        medical: {
          blue: '#0369A1',
          lightblue: '#E0F2FE',
          green: '#16A34A',
          lightgreen: '#DCFCE7',
          red: '#DC2626',
          lightred: '#FEE2E2',
        }
      },
    },
  },
  plugins: [],
}
