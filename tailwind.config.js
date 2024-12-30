/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
      colors: {
        accent: '#aaffdd',
        dark: '#060707',
        primary: '#1bffc6',
        secondary: '#7cbca4',
      },
    },
  },
  plugins: [],
}
