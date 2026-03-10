// ============================================================================
// CONSTANTS - App-wide constants
// ============================================================================

/**
 * Color palette - Adagio theme
 */
export const Colors = {
  // Primary
  primary: '#fbbf24',
  primaryDark: '#f59e0b',
  primaryLight: '#fcd34d',

  // Backgrounds
  background: '#0a0a05',
  backgroundLight: '#f8f8f4',
  card: '#1f1f1a',
  cardLight: '#ffffff',

  // Text
  text: '#f3f4f6',
  textSecondary: '#9ca3af',
  textMuted: '#6b7280',

  // Borders
  border: '#2a2a25',
  borderLight: '#e5e7eb',

  // Status
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',

  // Musical intervals (for theory visualization)
  intervals: {
    root: '#ef4444',
    second: '#a855f7',
    third: '#3b82f6',
    fourth: '#22c55e',
    fifth: '#22c55e',
    sixth: '#a855f7',
    seventh: '#eab308',
    extension: '#f97316',
  },

  // Rarity colors
  rarity: {
    common: '#9ca3af',
    rare: '#3b82f6',
    epic: '#a855f7',
    legendary: '#fbbf24',
  },
} as const;

/**
 * Spacing constants
 */
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

/**
 * Border radius constants
 */
export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
} as const;

/**
 * Font sizes
 */
export const FontSizes = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 24,
  xxxl: 32,
} as const;

/**
 * Font weights
 */
export const FontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
} as const;

/**
 * Animation durations
 */
export const AnimationDuration = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;

/**
 * Screen dimensions helpers
 */
export const getScreenDimensions = () => {
  const { width, height } = Dimensions.get('window');
  return { width, height, isSmallScreen: width < 375 };
};

import { Dimensions, Platform } from 'react-native';

/**
 * Platform detection
 */
export const isAndroid = () => Platform.OS === 'android';
export const isIOS = () => Platform.OS === 'ios';
export const isWeb = () => Platform.OS === 'web';
