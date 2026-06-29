/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        'midcity-red': '#890706',
        'midcity-dark': '#212121',
        'midcity-card': '#212121',
      }
    },
  },
  plugins: [],
}
