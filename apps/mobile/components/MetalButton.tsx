// ============================================================================
// METAL BUTTON - Bouton polygonal style Metal/Brutal
// ============================================================================

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { Colors, Spacing, BorderRadius, Typography, FontWeights } from '../theme';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface MetalButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export function MetalButton({
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  icon,
  iconPosition = 'left',
}: MetalButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return styles.primary;
      case 'secondary':
        return styles.secondary;
      case 'danger':
        return styles.danger;
      case 'ghost':
        return styles.ghost;
      case 'outline':
        return styles.outline;
      default:
        return styles.primary;
    }
  };

  const getTextVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return styles.primaryText;
      case 'secondary':
        return styles.secondaryText;
      case 'danger':
        return styles.dangerText;
      case 'ghost':
        return styles.ghostText;
      case 'outline':
        return styles.outlineText;
      default:
        return styles.primaryText;
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return styles.sm;
      case 'md':
        return styles.md;
      case 'lg':
        return styles.lg;
      default:
        return styles.md;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getVariantStyles(),
        getSizeStyles(),
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <LoadingSpinner variant={variant} />
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === 'left' && <View style={styles.iconLeft}>{icon}</View>}
          <Text style={[styles.text, getTextVariantStyles(), textStyle]}>{children}</Text>
          {icon && iconPosition === 'right' && <View style={styles.iconRight}>{icon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
}

function LoadingSpinner({ variant }: { variant: ButtonVariant }) {
  const color = variant === 'primary' ? Colors.acidGreen :
                variant === 'danger' ? Colors.danger :
                Colors.gray300;

  return (
    <View style={styles.spinner}>
      <View style={[styles.spinnerDot, { backgroundColor: color }]} />
      <View style={[styles.spinnerDot, { backgroundColor: color }, styles.spinnerDotDelay1]} />
      <View style={[styles.spinnerDot, { backgroundColor: color }, styles.spinnerDotDelay2]} />
    </View>
  );
}

// Jagged/Polygonal button component for extra metal aesthetic
export interface JaggedButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'primary' | 'secondary';
  size?: 'md' | 'lg';
  disabled?: boolean;
  style?: ViewStyle;
}

export function JaggedButton({
  children,
  onPress,
  variant = 'primary',
  size = 'lg',
  disabled = false,
  style,
}: JaggedButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.jaggedButton,
        variant === 'primary' ? styles.jaggedPrimary : styles.jaggedSecondary,
        size === 'lg' ? styles.jaggedLg : styles.jaggedMd,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.jaggedText,
          variant === 'primary' ? styles.jaggedPrimaryText : styles.jaggedSecondaryText,
        ]}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Standard Metal Button
  button: {
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: Spacing.sm,
  },
  iconRight: {
    marginLeft: Spacing.sm,
  },
  text: {
    fontSize: Typography.bodyMD,
    fontWeight: FontWeights.bold,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },

  // Variants
  primary: {
    backgroundColor: Colors.green,
    borderColor: Colors.acidGreen,
    borderWidth: 2,
  },
  primaryText: {
    color: Colors.acidGreen,
  },
  secondary: {
    backgroundColor: Colors.gray800,
    borderColor: Colors.gray600,
  },
  secondaryText: {
    color: Colors.gray300,
  },
  danger: {
    backgroundColor: Colors.gray800,
    borderColor: Colors.danger,
  },
  dangerText: {
    color: Colors.danger,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  ghostText: {
    color: Colors.gray400,
  },
  outline: {
    backgroundColor: 'transparent',
    borderColor: Colors.gray600,
  },
  outlineText: {
    color: Colors.gray400,
  },

  // Sizes
  sm: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    minHeight: 40,
  },
  md: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    minHeight: 52,
  },
  lg: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    minHeight: 60,
  },

  // Modifiers
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },

  // Loading spinner
  spinner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  spinnerDot: {
    width: 8,
    height: 8,
    borderRadius: 2,
  },
  spinnerDotDelay1: {
    opacity: 0.6,
  },
  spinnerDotDelay2: {
    opacity: 0.3,
  },

  // Jagged/Polygonal Button
  jaggedButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    position: 'relative',
  },
  jaggedPrimary: {
    backgroundColor: Colors.green,
    borderColor: Colors.acidGreen,
  },
  jaggedSecondary: {
    backgroundColor: Colors.black,
    borderColor: Colors.gray600,
  },
  jaggedLg: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    minHeight: 64,
  },
  jaggedMd: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    minHeight: 52,
  },
  jaggedText: {
    fontSize: Typography.titleMD,
    fontWeight: FontWeights.black,
    textTransform: 'uppercase',
    letterSpacing: 4,
  },
  jaggedPrimaryText: {
    color: Colors.acidGreen,
  },
  jaggedSecondaryText: {
    color: Colors.gray300,
  },
});
