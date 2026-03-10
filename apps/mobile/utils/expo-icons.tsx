// ============================================================================
// EXPO ICONS - Icon utility for React Native
// ============================================================================

import { Text } from 'react-native';

/**
 * Simple icon mapping using emoji for React Native
 * For production, consider using @expo/vector-icons or react-native-vector-icons
 */

export type IconName =
  | 'home'
  | 'music'
  | 'compose'
  | 'library'
  | 'user'
  | 'settings'
  | 'close'
  | 'check'
  | 'chevron-right'
  | 'chevron-left'
  | 'chevron-down'
  | 'search'
  | 'filter'
  | 'star'
  | 'star-filled'
  | 'heart'
  | 'heart-filled'
  | 'share'
  | 'play'
  | 'pause'
  | 'stop'
  | 'refresh'
  | 'trash'
  | 'edit'
  | 'plus'
  | 'minus'
  | 'info'
  | 'warning'
  | 'error'
  | 'success';

const ICONS: Record<IconName, string> = {
  'home': '🏠',
  'music': '🎵',
  'compose': '🎼',
  'library': '📚',
  'user': '👤',
  'settings': '⚙️',
  'close': '✕',
  'check': '✓',
  'chevron-right': '→',
  'chevron-left': '←',
  'chevron-down': '↓',
  'search': '🔍',
  'filter': '🔽',
  'star': '☆',
  'star-filled': '★',
  'heart': '🤍',
  'heart-filled': '❤️',
  'share': '📤',
  'play': '▶️',
  'pause': '⏸️',
  'stop': '⏹️',
  'refresh': '🔄',
  'trash': '🗑️',
  'edit': '✏️',
  'plus': '+',
  'minus': '−',
  'info': 'ℹ️',
  'warning': '⚠️',
  'error': '❌',
  'success': '✅',
};

export function getIcon(name: IconName): string {
  return ICONS[name] || '?';
}

export interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
}

export function Icon({ name, size = 24, color = '#000' }: IconProps) {
  return (
    <Text style={{ fontSize: size, color }}>
      {getIcon(name)}
    </Text>
  );
}
