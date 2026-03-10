// ============================================================================
// INPUT - Reusable text input component
// ============================================================================

import React from 'react';
import {
  TextInput,
  Text,
  View,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
}

export function Input({
  label,
  error,
  containerStyle,
  leftIcon,
  rightIcon,
  onRightIconPress,
  ...textInputProps
}: InputProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={[styles.inputContainer, error && styles.inputContainerError]}>
        {leftIcon && <Text style={styles.icon}>{leftIcon}</Text>}

        <TextInput
          style={styles.input}
          placeholderTextColor="#6b7280"
          {...textInputProps}
        />

        {rightIcon && (
          <Text
            style={[styles.icon, onRightIconPress && styles.pressableIcon]}
            onPress={onRightIconPress}
          >
            {rightIcon}
          </Text>
        )}
      </View>

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e5e7eb',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f1f1a',
    borderWidth: 1,
    borderColor: '#2a2a25',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  inputContainerError: {
    borderColor: '#ef4444',
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#f3f4f6',
    minHeight: 44,
  },
  icon: {
    fontSize: 18,
    marginHorizontal: 8,
  },
  pressableIcon: {
    opacity: 0.7,
  },
  error: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 4,
    marginLeft: 4,
  },
});
