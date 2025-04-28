/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        black: '#202020',
      },
      fontFamily: {
        pretendard: ["Pretendard"]
      }
    }
  },
  plugins: []
};
