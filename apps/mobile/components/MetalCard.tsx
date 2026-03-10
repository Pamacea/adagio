// ============================================================================
// METAL CARD - Carte style Metal/Brutal
// ============================================================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  type ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { Colors, Spacing, BorderRadius, Typography, FontWeights } from '../theme';

export interface MetalCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'dark' | 'accent' | 'border';
  style?: ViewStyle | number | undefined;
  contentStyle?: ViewStyle | number | undefined;
  onPress?: () => void;
  disabled?: boolean;
}

export function MetalCard({
  children,
  variant = 'default',
  style,
  contentStyle,
  onPress,
  disabled = false,
}: MetalCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'dark':
        return styles.dark;
      case 'accent':
        return styles.accent;
      case 'border':
        return styles.border;
      default:
        return styles.default;
    }
  };

  const CardWrapper = onPress && !disabled ? TouchableOpacity : View;
  const wrapperProps = onPress && !disabled ? {
    onPress,
    activeOpacity: 0.7,
  } : {};

  return (
    <CardWrapper
      style={[styles.card, getVariantStyles(), disabled && styles.disabled, style]}
      {...wrapperProps}
    >
      <View style={[styles.content, contentStyle]}>{children}</View>
    </CardWrapper>
  );
}

// Card with header
export interface MetalCardWithHeaderProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  right?: React.ReactNode;
  variant?: 'default' | 'dark' | 'accent';
  style?: ViewStyle | number | undefined;
  onPress?: () => void;
  children?: React.ReactNode;
}

export function MetalCardWithHeader({
  title,
  subtitle,
  icon,
  right,
  variant = 'default',
  style,
  onPress,
  children,
}: MetalCardWithHeaderProps) {
  return (
    <MetalCard variant={variant} style={style} onPress={onPress}>
      {(title || icon || right) && (
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {icon && <View style={styles.headerIcon}>{icon}</View>}
            <View>
              {title && <Text style={styles.title}>{title}</Text>}
              {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>
          </View>
          {right && <View style={styles.headerRight}>{right}</View>}
        </View>
      )}
      <View style={styles.body}>{children}</View>
    </MetalCard>
  );
}

// Mode card specifically for theory
export interface ModeCardProps {
  name: string;
  frenchName: string;
  character: string;
  sensation: string;
  color: string;
  onPress?: () => void;
}

export function ModeCard({
  name,
  frenchName,
  character,
  sensation,
  color,
  onPress,
}: ModeCardProps) {
  return (
    <MetalCard variant="default" onPress={onPress} style={styles.modeCard}>
      <View style={styles.modeContent}>
        <View style={[styles.modeColorBar, { backgroundColor: color }]} />
        <View style={styles.modeInfo}>
          <Text style={styles.modeName}>{frenchName}</Text>
          <Text style={styles.modeOriginal}>{name}</Text>
          <Text style={styles.modeCharacter}>{character}</Text>
          <Text style={styles.modeSensation}>{sensation}</Text>
        </View>
      </View>
    </MetalCard>
  );
}

// Note/Key card
export interface NoteCardProps {
  note: string;
  frenchNote?: string;
  isRoot?: boolean;
  inScale?: boolean;
  onPress?: () => void;
}

export function NoteCard({
  note,
  frenchNote,
  isRoot = false,
  inScale = false,
  onPress,
}: NoteCardProps) {
  return (
    <MetalCard
      variant={isRoot ? 'accent' : inScale ? 'dark' : 'border'}
      onPress={onPress}
      style={styles.noteCard}
      contentStyle={styles.noteCardContent}
    >
      <Text
        style={[
          styles.noteText,
          isRoot && styles.noteTextRoot,
          inScale && styles.noteTextInScale,
        ]}
      >
        {frenchNote || note}
      </Text>
    </MetalCard>
  );
}

const styles = StyleSheet.create({
  // Base card
  card: {
    backgroundColor: Colors.darkGreen,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  default: {
    borderColor: Colors.gray700,
  },
  dark: {
    backgroundColor: Colors.gray800,
    borderColor: Colors.gray600,
  },
  accent: {
    backgroundColor: Colors.green,
    borderColor: Colors.acidGreen,
  },
  border: {
    backgroundColor: 'transparent',
    borderColor: Colors.gray600,
  },
  disabled: {
    opacity: 0.5,
  },
  content: {
    padding: Spacing.md,
  },

  // Card with header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray700,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerIcon: {
    marginRight: Spacing.sm,
  },
  headerRight: {
    marginLeft: Spacing.sm,
  },
  title: {
    fontSize: Typography.bodyMD,
    fontWeight: FontWeights.bold,
    color: Colors.white,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: Typography.bodySM,
    color: Colors.gray500,
    marginTop: 2,
  },
  body: {
    paddingTop: Spacing.md,
  },

  // Mode card
  modeCard: {
    borderWidth: 1,
    borderColor: Colors.gray700,
  },
  modeContent: {
    flexDirection: 'row',
  },
  modeColorBar: {
    width: 4,
    marginRight: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
  modeInfo: {
    flex: 1,
  },
  modeName: {
    fontSize: Typography.titleMD,
    fontWeight: FontWeights.bold,
    color: Colors.white,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 2,
  },
  modeOriginal: {
    fontSize: Typography.labelLG,
    color: Colors.gray500,
    marginBottom: 4,
  },
  modeCharacter: {
    fontSize: Typography.bodySM,
    color: Colors.acidGreen,
    marginBottom: 2,
  },
  modeSensation: {
    fontSize: Typography.bodyXS,
    color: Colors.gray400,
  },

  // Note card
  noteCard: {
    minWidth: 60,
    aspectRatio: 1,
  },
  noteCardContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.sm,
  },
  noteText: {
    fontSize: Typography.bodyLG,
    fontWeight: FontWeights.bold,
    color: Colors.gray500,
  },
  noteTextRoot: {
    color: Colors.acidGreen,
  },
  noteTextInScale: {
    color: Colors.gray300,
  },
});
