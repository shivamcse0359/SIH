/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#080B10',
          900: '#0B0F14',
          800: '#0F141B',
          700: '#141B24',
          600: '#1B2530',
          500: '#26323F',
        },
        signal: {
          cyan: '#2DE8C9',
          blue: '#4C8DFF',
        },
        risk: {
          safe: '#22C55E',
          low: '#B7C93B',
          suspicious: '#F59E0B',
          dangerous: '#F0563D',
          high: '#DC2626',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        grid: 'linear-gradient(rgba(45,232,201,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(45,232,201,0.06) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '32px 32px',
      },
      keyframes: {
        sweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(0.9)', opacity: '0.6' },
          '100%': { transform: 'scale(1.5)', opacity: '0' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.35' },
        },
      },
      animation: {
        sweep: 'sweep 3s linear infinite',
        pulseRing: 'pulseRing 2s ease-out infinite',
        blink: 'blink 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
