// ============================================================================
// METAL THEME STYLES - StyleSheet factory for React Native
// ============================================================================

import { StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography, FontWeights, Shadows } from './index';

export const createMetalStyles = <T extends Record<string, unknown>>(
  styles: T
): T => styles as T;

// Common reusable styles
export const baseStyles = createMetalStyles({
  // Container
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 100,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray800,
  },
  headerTitle: {
    fontSize: Typography.titleLG,
    fontWeight: FontWeights.bold,
    color: Colors.white,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },

  // Typography
  title: {
    fontSize: Typography.titleXL,
    fontWeight: FontWeights.black,
    color: Colors.white,
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
  titleLG: {
    fontSize: Typography.titleLG,
    fontWeight: FontWeights.bold,
    color: Colors.white,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  titleMD: {
    fontSize: Typography.titleMD,
    fontWeight: FontWeights.bold,
    color: Colors.white,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: Typography.bodyMD,
    fontWeight: FontWeights.medium,
    color: Colors.gray400,
  },
  body: {
    fontSize: Typography.bodyMD,
    fontWeight: FontWeights.regular,
    color: Colors.gray300,
  },
  bodySM: {
    fontSize: Typography.bodySM,
    fontWeight: FontWeights.regular,
    color: Colors.gray400,
  },
  label: {
    fontSize: Typography.labelLG,
    fontWeight: FontWeights.semibold,
    color: Colors.gray500,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // Cards
  card: {
    backgroundColor: Colors.darkGreen,
    borderWidth: 1,
    borderColor: Colors.gray700,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  cardCompact: {
    backgroundColor: Colors.darkGreen,
    borderWidth: 1,
    borderColor: Colors.gray700,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
  },

  // Buttons - Polygonal/Jagged style
  button: {
    backgroundColor: Colors.green,
    borderWidth: 1,
    borderColor: Colors.acidGreen,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  buttonPrimary: {
    backgroundColor: Colors.green,
    borderColor: Colors.acidGreen,
  },
  buttonSecondary: {
    backgroundColor: Colors.gray800,
    borderColor: Colors.gray600,
  },
  buttonDanger: {
    backgroundColor: Colors.gray800,
    borderColor: Colors.danger,
  },
  buttonText: {
    fontSize: Typography.bodyMD,
    fontWeight: FontWeights.bold,
    color: Colors.acidGreen,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  buttonTextSecondary: {
    color: Colors.gray300,
  },
  buttonTextDanger: {
    color: Colors.danger,
  },

  // Input
  input: {
    backgroundColor: Colors.black,
    borderWidth: 1,
    borderColor: Colors.gray700,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: Typography.bodyMD,
    color: Colors.white,
    minHeight: 52,
  },
  inputFocused: {
    borderColor: Colors.acidGreen,
  },
  labelSecondary: {
    fontSize: Typography.labelLG,
    fontWeight: FontWeights.semibold,
    color: Colors.gray500,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.xs,
  },

  // Section
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.titleMD,
    fontWeight: FontWeights.bold,
    color: Colors.white,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: Spacing.sm,
    paddingBottom: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray700,
  },

  // Grid
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -Spacing.xs,
  },
  gridItem: {
    paddingHorizontal: Spacing.xs,
    marginBottom: Spacing.sm,
  },

  // Badge
  badge: {
    backgroundColor: Colors.gray800,
    borderWidth: 1,
    borderColor: Colors.gray600,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  badgeText: {
    fontSize: Typography.labelMD,
    fontWeight: FontWeights.semibold,
    color: Colors.gray300,
  },
  badgeAccent: {
    backgroundColor: Colors.green,
    borderColor: Colors.acidGreen,
  },
  badgeAccentText: {
    color: Colors.acidGreen,
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: Colors.gray700,
    marginVertical: Spacing.md,
  },

  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Empty state
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyText: {
    fontSize: Typography.bodyMD,
    color: Colors.gray500,
    textAlign: 'center',
  },
});

export default baseStyles;
