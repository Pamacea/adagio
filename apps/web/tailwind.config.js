/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './features/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  theme: {
    extend: {
      colors: {
        // Noir dominant - Metallica style
        abyss: '#000000',          /* Noir absolu */
        void: '#010101',            /* Noir profond */
        blackness: '#020202',       /* Noir pur */
        darkness: '#030303',        /* Noir très sombre */

        // Vert-noir - Presque noir
        toxic: '#0a0f0a',           /* Vert-noir extrême */
        circuit: '#0d130d',         /* Circuit presque noir */
        slime: '#111811',           /* Vert vaseux sombre */
        poisoned: '#0a120a',        /* Vert empoisonné */

        // Accents - Sang / Métal
        blood: '#8b1a1a',           /* Rouge sang */
        rust: '#b84a1a',            /* Rouille */
        steel: '#2a2a2a',           /* Acier sombre */
        iron: '#1a1a1a',            /* Fer */
        silver: '#4a4a4a',          /* Argent terni */

        // Contraste
        white: '#e0e0e0',           /* Blanc sale */
        gray: '#666666',            /* Gris moyen */

        // Fretboard colors
        fretboard: {
          wood: '#3d2914',
          fret: '#4a4a4a',
          string: '#888888',
          note: '#3b82f6',
          root: '#ef4444',
          inScale: '#22c55e',
        },
        fretroot: '#ef4444',
        fretnote: '#3b82f6',
        fretfret: '#4a4a4a',
        fretstring: '#888888',
      },

      fontFamily: {
        // Archivo Black pour les titres agressifs
        metal: ['var(--font-archivo)', 'Impact', 'sans-serif'],
        // Space Mono pour le texte machine
        mono: ['var(--font-space)', 'Courier New', 'monospace'],
      },

      fontSize: {
        // Tailles agressives mais ajustées
        'massive': 'clamp(3rem, 15vw, 10rem)',
        'huge': 'clamp(2rem, 10vw, 6rem)',
        'giant': 'clamp(1.5rem, 6vw, 4rem)',
        'brutal': 'clamp(1rem, 4vw, 2rem)',
      },

      letterSpacing: {
        // Tracking agressif
        'tighter': '-0.06em',
        'ultra-tight': '-0.1em',
      },

      borderWidth: {
        // Bordures plus fines mais présentes
        'brutal': '2px',
        'heavy': '3px',
        'massive': '4px',
      },
    },
  },

  plugins: [require('tailwindcss-animate')],
};
