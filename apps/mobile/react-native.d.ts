/**
 * Global type declarations for React Native components
 * This file provides type stubs for commonly used React Native components
 */

import type { ComponentType, ReactNode } from 'react';

// Basic React Native components
export interface ViewProps {
  children?: ReactNode;
  style?: object;
  testID?: string;
  accessible?: boolean;
  accessibilityLabel?: string;
  onLayout?: (event: object) => void;
}

export interface TextProps {
  children?: ReactNode;
  style?: object;
  testID?: string;
  numberOfLines?: number;
  onPress?: () => void;
}

export interface TextInputProps {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  style?: object;
  testID?: string;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoComplete?: 'username' | 'password' | 'email';
}

export interface PressableProps {
  children?: ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  style?: object;
  disabled?: boolean;
  testID?: string;
}

export interface ScrollViewProps {
  children?: ReactNode;
  style?: object;
  contentContainerStyle?: object;
  testID?: string;
}

export interface ActivityIndicatorProps {
  size?: 'small' | 'large' | number;
  color?: string;
  animating?: boolean;
}

export interface AlertStatic {
  alert(title: string, message?: string, buttons?: Array<{ text?: string; onPress?: () => void }>): void;
}

export interface StyleSheetStatic {
  create(styles: Record<string, object>): Record<string, object>;
}

declare const View: ComponentType<ViewProps>;
declare const Text: ComponentType<TextProps>;
declare const TextInput: ComponentType<TextInputProps>;
declare const Pressable: ComponentType<PressableProps>;
declare const ScrollView: ComponentType<ScrollViewProps>;
declare const ActivityIndicator: ComponentType<ActivityIndicatorProps>;
declare const Alert: AlertStatic;
declare const StyleSheet: StyleSheetStatic;

export { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator, Alert, StyleSheet };

// Re-export from react-native
export * from 'react-native';
