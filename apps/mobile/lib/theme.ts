// ============================================================================
// THEME - Theme configuration for the app
// ============================================================================

import { useColorScheme as useRNColorScheme } from 'react-native';
import { Colors } from './constants';

// Wrapper
export function useColorScheme() {
  return useRNColorScheme();
}

/**
 * Get the current theme based on system color scheme
 */
export function useTheme() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return {
    isDark,
    colors: {
      background: isDark ? Colors.background : Colors.backgroundLight,
      card: isDark ? Colors.card : Colors.cardLight,
      text: isDark ? Colors.text : '#1f1f1a',
      textSecondary: isDark ? Colors.textSecondary : '#6b7280',
      border: isDark ? Colors.border : Colors.borderLight,
      primary: Colors.primary,
      success: Colors.success,
      warning: Colors.warning,
      error: Colors.error,
    },
  };
}

/**
 * Theme spacing
 */
export const theme = {
  colors: Colors,
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999,
  },
  fontSize: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 24,
    xxxl: 32,
  },
} as const;
