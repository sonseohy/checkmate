// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        black: '#202020',
        'point-blue-text': '#60A5FA',
        'point-blue': '#3B82F6',
      },
      fontFamily: {
        pretendard: ['Pretendard'],
      },
    },
  },
  plugins: [],
};

export default config;
