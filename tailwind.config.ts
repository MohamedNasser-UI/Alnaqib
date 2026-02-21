import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#d4a012',
          600: '#b8860b',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
          950: '#422c06',
        },
        brand: {
          black: '#0a0a0a',
          gold: '#c9a227',
          goldLight: '#e5c76b',
        },
      },
      fontFamily: {
        sans: ['system-ui', 'sans-serif'],
        arabic: ['system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
