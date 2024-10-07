/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customGray: '#212121',
        input: '#2F2F2F',
        navbar:'#202127',
        backgroundExercice:'#1E1F23',
      },
      backgroundImage: {
        'home-bg': "url('./assets/background.jpg')", // Add your image path here
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
  ],
}
