/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        pretendard: ["Pretendard"],
      },
      colors: {
        'checkmate-blue-700': '#1D4ED8',
        'checkmate-blue-300': '#93C5FD',
      },
      backgroundImage: {
        'checkmate-gradient':
          'linear-gradient(to right, var(--tw-gradient-stops))',
      },
      gradientColorStops: theme => ({
        'checkmate-start': theme('colors.checkmate-blue-700'),
        'checkmate-end':   theme('colors.checkmate-blue-300'),
      }),
    },
  },
  plugins: [],
}
