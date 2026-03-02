// ============================================================================
// USER TYPES - User, authentication, and progress tracking
// ============================================================================

import { Mode, Chord, ProgressionChord } from './music';

/**
 * User entity
 */
export interface User {
  id: string;
  email: string;
  emailVerified?: Date;
  name?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User session
 */
export interface Session {
  id: string;
  userId: string;
  expires: Date;
  token: string;
}

/**
 * User preferences
 */
export interface UserPreferences {
  id: string;
  userId: string;

  // Display
  theme: 'midnight' | 'light' | 'auto';
  showIntervals: boolean;
  showNotes: boolean;
  showDegrees: boolean;

  // Instrument
  tuning: Tuning;
  fretCount: number;

  // Audio
  volume: number; // 0-1
  metronomeVolume: number; // 0-1

  createdAt: Date;
  updatedAt: Date;
}

/**
 * Guitar tunings
 */
export type Tuning =
  | 'EADGBE' // Standard
  | 'DADGBE' // Drop D
  | 'DADGAD' // DADGAD
  | 'DGDGBD' // Open G
  | 'DADF#AD' // Open D
  | 'CGCGCE' // Open C
  | 'BEADGB'; // Baritone

/**
 * User progress on a technique
 */
export interface UserProgress {
  id: string;
  userId: string;
  techniqueId: string;
  status: ProgressStatus;
  xp: number;
  practiceCount: number;
  totalPracticeTime: number; // in minutes
  lastPracticed?: Date;
  milestonesCompleted: string[];
}

export type ProgressStatus =
  | 'locked'
  | 'in-progress'
  | 'learned'
  | 'mastered';

/**
 * Player level based on XP
 */
export interface PlayerLevel {
  level: number; // 1-10
  title: string;
  xpToNext: number;
  totalXP: number;
}

/**
 * Badge achievement
 */
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
}

/**
 * Achievement milestone
 */
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
}

/**
 * Saved progression
 */
export interface SavedProgression {
  id: string;
  userId: string;
  name?: string;
  key: string;
  timeSignature: string;
  chords: ProgressionChord[];
  analysis?: unknown;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Auth tokens
 */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Registration data
 */
export interface RegisterData {
  email: string;
  password: string;
  name?: string;
}

/**
 * Auth response
 */
export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}
