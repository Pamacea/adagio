import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './features/**/*.{js,ts,jsx,tsx,mdx}',
    './ui/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Midnight theme colors
        midnight: {
          50: '#f5f5dc',
          100: '#e5e5c0',
          200: '#d4d4a3',
          300: '#c3c386',
          400: '#b2b269',
          500: '#a1a14c',
          600: '#7a7a3a',
          700: '#525328',
          800: '#2b2c15',
          900: '#15150a',
          950: '#0a0a05',
        },
        // Interval colors
        interval: {
          root: '#ef4444', // Red - Root (1)
          third: '#3b82f6', // Blue - Thirds (3, b3)
          fifth: '#22c55e', // Green - Fifths (5, b5)
          seventh: '#eab308', // Yellow - Sevenths (7, b7)
          ninth: '#f97316', // Orange - Extensions (9, 11, 13)
          altered: '#a855f7', // Purple - Altered (#4, b2, etc.)
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-in',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
