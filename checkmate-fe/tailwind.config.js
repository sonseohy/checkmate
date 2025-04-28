/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        black: '#202020',
      },
      fontFamily: {
        pretendard: ['Pretendard'],
      },
      colors: {
        'text-point-blue': '#60A5FA',
        'point-blue': '#3B82F6',
        'checkmate-blue-700': '#1D4ED8',
        'checkmate-blue-300': '#93C5FD',
      },
      backgroundImage: {
        'gradient-move':
          'linear-gradient(to bottom, #ffffff 65%, #e0f2fe 100%)',
        'checkmate-gradient':
          'linear-gradient(to right, var(--tw-gradient-stops))',
      },
      animation: {
        'gradient-move': 'gradientMove 30s ease-in-out infinite',
      },
      keyframes: {
        gradientMove: {
          '0%': { backgroundPosition: '0% 0%' },
          '50%': { backgroundPosition: '0% 100%' },
          '100%': { backgroundPosition: '0% 0%' },
        },
      },
      gradientColorStops: (theme) => ({
        'checkmate-start': theme('colors.checkmate-blue-700'),
        'checkmate-end': theme('colors.checkmate-blue-300'),
      }),
    },
  },
  plugins: [],
};
