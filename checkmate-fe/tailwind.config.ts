// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        black: '#202020',
        'text-point-blue': '#60A5FA',
        'point-blue': '#3B82F6',
        'checkmate-blue-700': '#1D4ED8',
        'checkmate-blue-300': '#93C5FD',
      },
      fontFamily: {
        pretendard: ['Pretendard'],
      },
      backgroundImage: {
        'gradient-move':
          'linear-gradient(to bottom, #ffffff 65%, #e0f2fe 100%)',
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
    },
  },
  plugins: [],
};

export default config;
