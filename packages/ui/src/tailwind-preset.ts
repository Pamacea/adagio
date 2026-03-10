/**
 * Adagio Design System - Tailwind Preset
 *
 * A musical & elegant dark theme for music theory learning.
 * Colors are inspired by musical notation, instruments, and mood.
 */

import type { Config } from 'tailwindcss';

// Content paths are defined in the consuming app's tailwind.config.ts
// Using Omit to exclude required 'content' property from preset
const config: Omit<Config, 'content'> = {
  darkMode: ['class'],
  // Note: Content paths are defined in the consuming app's tailwind.config.ts

  theme: {
    extend: {
      colors: {
        // Primary - Deep midnight blue (the night of music)
        primary: {
          50: '#e8f0fc',
          100: '#d0e1f9',
          200: '#a3c3f3',
          300: '#75a5ed',
          400: '#4787e7',
          500: '#1a69e1',
          600: '#1354c7',
          700: '#0f4097',
          800: '#0a2c68',
          900: '#061839',
          950: '#030d1c',
        },

        // Accent - Golden warmth (like brass instruments)
        accent: {
          50: '#fdf8e8',
          100: '#fbeec4',
          200: '#f7e08e',
          300: '#f3d258',
          400: '#f0c422',
          500: '#ecb605',
          600: '#dca104',
          700: '#b38503',
          800: '#8a6903',
          900: '#614c02',
          950: '#352901',
        },

        // Secondary - Rose warmth (emotional music)
        rose: {
          50: '#fef2f4',
          100: '#fce7eb',
          200: '#f9d0db',
          300: '#f6b9cb',
          400: '#f3a2bb',
          500: '#f088ad',
          600: '#d86c8f',
          700: '#a84c68',
          800: '#783047',
          900: '#491926',
          950: '#280d14',
        },

        // Modes - Greek mode colors for emotional mapping
        mode: {
          ionian: '#f7c948',    // Bright, major - yellow
          dorian: '#8eb8f0',    // Jazzy, cool - blue
          phrygian: '#f08b8b',  // Spanish, passionate - red
          lydian: '#b8a3f0',    // Dreamy, ethereal - lavender
          mixolydian: '#a3d9a5',// Bluesy, dominant - green
          aeolian: '#8f9aaa',   // Natural minor - gray-blue
          locrian: '#d4a57c',   // Tense, dark - bronze
        },

        // Scale degrees color coding
        degree: {
          I: '#1a69e1',      // Tonic - primary blue
          ii: '#8eb8f0',     // Supertonic - light blue
          iii: '#a3d9a5',    // Mediant - green
          IV: '#f7c948',     // Subdominant - yellow
          V: '#f088ad',      // Dominant - rose
          vi: '#8f9aaa',     // Submediant - gray
          vii: '#d4a57c',    // Leading tone - bronze
        },

        // Neutral - Score paper aesthetic
        neutral: {
          50: '#f9f8f6',     // Cream paper
          100: '#f0ede8',    // Warm white
          150: '#e8e4da',
          200: '#ddd6c7',    // Light parchment
          250: '#d1c9b5',
          300: '#c5bcad',    // Warm gray
          400: '#a89d8d',
          500: '#8b7f70',    // Taupe
          600: '#6e6156',
          700: '#51463c',
          800: '#342b25',    // Dark coffee
          850: '#261e1a',
          900: '#18110f',    // Almost black
          950: '#0c0808',    // Deep black
        },

        // Semantic
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },

        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },

        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },

        // Fretboard colors
        fretboard: {
          wood: '#8b6914',
          fret: '#c0c0c0',
          string: '#e8e8e8',
          note: '#1a69e1',
          root: '#ecb605',
          inScale: '#10b981',
        },
      },

      fontFamily: {
        // Music notation friendly fonts
        sans: [
          'var(--font-inter)',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        serif: [
          'var(--font-merriweather)',
          'Georgia',
          'Cambria',
          'Times New Roman',
          'serif',
        ],
        mono: [
          'var(--font-jetbrains-mono)',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace',
        ],
        music: ['Bravura', 'Leland', 'Petaluma', 'var(--font-sans)'],
      },

      fontSize: {
        // Musical notation sizing
        'score-xs': ['0.625rem', { lineHeight: '1' }],
        'score-sm': ['0.75rem', { lineHeight: '1.25' }],
        'score-base': ['0.875rem', { lineHeight: '1.5' }],
        'score-lg': ['1rem', { lineHeight: '1.75' }],
        'score-xl': ['1.25rem', { lineHeight: '2' }],
        'score-2xl': ['1.5rem', { lineHeight: '2' }],
        'score-3xl': ['2rem', { lineHeight: '2.25' }],
        'score-4xl': ['2.5rem', { lineHeight: '2.5' }],
      },

      borderRadius: {
        // Musical instrument inspired
        'lg': '0.75rem',
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        // Guitar curve
        'guitar': '50% 50% 50% 50% / 60% 60% 40% 40%',
        // Pick shape
        'pick': '50% 50% 50% 50% / 60% 60% 40% 40%',
      },

      boxShadow: {
        // Musical instrument depth
        'guitar': '0 4px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'piano': '0 2px 10px rgba(0, 0, 0, 0.2)',
        'note': '0 2px 8px rgba(26, 105, 225, 0.3)',
        'glow': '0 0 20px rgba(236, 182, 5, 0.5)',
      },

      animation: {
        // Music-themed animations
        'strum': 'strum 0.3s ease-in-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'vibrate': 'vibrate 0.1s linear infinite',
        'note-float': 'noteFloat 3s ease-in-out infinite',
      },

      keyframes: {
        strum: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-2px)' },
        },
        vibrate: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-1px)' },
          '75%': { transform: 'translateX(1px)' },
        },
        noteFloat: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(5deg)' },
        },
      },

      // Spacing scale for musical layouts
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '38': '9.5rem',
        '42': '10.5rem',
        '46': '11.5rem',
        '50': '12.5rem',
        '52': '13rem',
        '56': '14rem',
        '60': '15rem',
        '64': '16rem',
        '72': '18rem',
        '80': '20rem',
        '96': '24rem',
      },

      // Z-index for layered interfaces
      zIndex: {
        'staff': '1',
        'note': '10',
        'fretboard': '20',
        'modal': '100',
        'tooltip': '200',
        'notification': '300',
      },
    },
  },

  plugins: [require('tailwindcss-animate')],
};

export default config;
