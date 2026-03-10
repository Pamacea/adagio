// ============================================================================
// TOGGLE - Custom toggle switch component
// ============================================================================

import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';

export interface ToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  trackColor?: {
    false: string;
    true: string;
  };
  thumbColor?: {
    false: string;
    true: string;
  };
}

export function Toggle({
  value,
  onValueChange,
  disabled = false,
  trackColor = { false: '#2a2a25', true: '#fbbf24' },
  thumbColor = { false: '#6b7280', true: '#fff' },
}: ToggleProps) {
  const handlePress = () => {
    if (!disabled) {
      onValueChange(!value);
    }
  };

  const thumbPosition = value ? 22 : 2;

  return (
    <TouchableOpacity
      style={[styles.track, { backgroundColor: value ? trackColor.true : trackColor.false }]}
      onPress={handlePress}
      activeOpacity={0.8}
      disabled={disabled}
    >
      <View
        style={[
          styles.thumb,
          {
            marginLeft: thumbPosition,
            backgroundColor: value ? thumbColor.true : thumbColor.false,
          },
        ]}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 48,
    height: 28,
    borderRadius: 14,
    padding: 2,
    justifyContent: 'center',
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
  },
});
