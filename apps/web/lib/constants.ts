/**
 * ADAGIO - App Constants
 */

// API URL (injected by Next.js at build time)
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

// App URL
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// App Routes
export const ROUTES = {
  DASHBOARD: '/',
  THEORY: '/theory',
  COMPOSE: '/compose',
  FRETBOARD: '/fretboard',
  NOTATION: '/notation',
  SESSIONS: '/sessions',
  LESSONS: '/lessons',
  ACHIEVEMENTS: '/achievements',
  PROFILE: '/profile',
  GRIMOIRE: '/grimoire',
  SETTINGS: '/settings',
  LOGIN: '/login',
  REGISTER: '/register',

  // Theory sub-routes
  CIRCLE_OF_FIFTHS: '/theory/circle',
  MODES: '/theory/modes',
  SCALES: '/theory/scales',
  CHORDS: '/theory/chords',
  PROGRESSIONS: '/theory/progressions',
} as const;
