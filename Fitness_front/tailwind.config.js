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
        backgroundExercice:'#302B31',
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
