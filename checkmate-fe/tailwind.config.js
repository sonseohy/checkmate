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
        'point-blue': '#3B82F6',
        't-blue': '#60A5FA',
      },
      fontFamily: {
        pretendard: ["Pretendard"]
      }
    }
  },
  plugins: []
};
