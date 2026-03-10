/// <reference types="expo" />
/// <reference types="expo-router" />

declare module 'react-native' {
  import type { ComponentType, ReactNode } from 'react';

  type StyleValue = object | object[] | number | null | undefined;

  export interface ViewProps {
    children?: ReactNode;
    style?: StyleValue;
    className?: string;
    testID?: string;
    accessible?: boolean;
    accessibilityLabel?: string;
    onLayout?: (event: { nativeEvent: { layout: { x: number; y: number; width: number; height: number } } }) => void;
  }

  export const View: ComponentType<ViewProps>;

  export interface TextProps {
    children?: ReactNode;
    style?: StyleValue;
    className?: string;
    testID?: string;
    numberOfLines?: number;
    onPress?: () => void;
    ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
  }

  export const Text: ComponentType<TextProps>;

  export interface TextInputProps {
    value?: string;
    onChangeText?: (text: string) => void;
    placeholder?: string;
    placeholderTextColor?: string;
    secureTextEntry?: boolean;
    style?: StyleValue;
    className?: string;
    testID?: string;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'number-pad';
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    autoComplete?: 'username' | 'password' | 'email' | 'off';
    autoFocus?: boolean;
    editable?: boolean;
  }

  export const TextInput: ComponentType<TextInputProps>;

  export interface PressableProps {
    children?: ReactNode;
    onPress?: () => void;
    onLongPress?: () => void;
    onPressIn?: (event: GestureResponderEvent) => void;
    style?: StyleValue | ((state: { pressed: boolean }) => StyleValue);
    className?: string;
    disabled?: boolean;
    testID?: string;
    hitSlop?: { top?: number; left?: number; bottom?: number; right?: number };
  }

  export const Pressable: ComponentType<PressableProps>;

  export interface ScrollViewProps {
    children?: ReactNode;
    style?: StyleValue;
    className?: string;
    contentContainerStyle?: StyleValue;
    testID?: string;
    horizontal?: boolean;
    showsHorizontalScrollIndicator?: boolean;
    showsVerticalScrollIndicator?: boolean;
  }

  export const ScrollView: ComponentType<ScrollViewProps>;

  export interface ActivityIndicatorProps {
    size?: 'small' | 'large' | number;
    color?: string;
    animating?: boolean;
    hidesWhenStopped?: boolean;
    className?: string;
  }

  export const ActivityIndicator: ComponentType<ActivityIndicatorProps>;

  export interface TouchableOpacityProps {
    children?: ReactNode;
    onPress?: () => void;
    onLongPress?: () => void;
    style?: StyleValue;
    className?: string;
    disabled?: boolean;
    activeOpacity?: number;
    testID?: string;
  }

  export const TouchableOpacity: ComponentType<TouchableOpacityProps>;

  export interface SafeAreaViewProps {
    children?: ReactNode;
    style?: StyleValue;
    className?: string;
    edges?: Array<'top' | 'right' | 'bottom' | 'left'>;
  }

  export const SafeAreaView: ComponentType<SafeAreaViewProps>;

  export interface ImageProps {
    source: { uri: string } | number;
    style?: StyleValue;
    className?: string;
    testID?: string;
    resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
    defaultSource?: { uri: string } | number;
  }

  export const Image: ComponentType<ImageProps>;

  export interface Dimensions {
    get(dim: 'window' | 'screen'): { width: number; height: number; scale: number; fontScale: number };
  }

  export const Dimensions: Dimensions;

  export interface EasingFunction {
    (value: number): number;
  }

  export interface AnimatedValue {
    setValue(value: number): void;
    addListener(listener: (value: number) => void): void;
    removeListener(listener: (value: number) => void);
    removeAllListeners(): void;
    interpolate(config: {
      inputRange: [number, number];
      outputRange: [number, number];
      easing?: EasingFunction;
    }): any;
  }

  export interface Animated {
    Value: new (value: number) => AnimatedValue;
    timing: (value: AnimatedValue, config: object) => any;
    spring: (value: AnimatedValue, config: object) => any;
    decay: (value: AnimatedValue, config: object) => any;
  }

  export const Animated: Animated;

  export interface PanResponderInstance {
    create(config: object): any;
  }

  export const PanResponder: PanResponderInstance;

  export interface GestureResponderEvent {
    nativeEvent: {
      changedTouches: Array<{
        locationX: number;
        locationY: number;
        pageX: number;
        pageY: number;
      }>;
      identifier: number;
      timestamp: number;
    };
  }

  export const GestureResponderEvent: GestureResponderEvent;

  export interface AlertButton {
    text?: string;
    onPress?: () => void;
    style?: 'default' | 'cancel' | 'destructive';
  }

  export interface AlertStatic {
    alert(title: string, message?: string, buttons?: AlertButton[], options?: { cancelable?: boolean }): void;
    prompt(title: string, message?: string, buttons?: AlertButton[], options?: { cancelable?: boolean; placeholder?: string }): void;
  }

  export const Alert: AlertStatic;

  export interface StyleSheet {
    create(styles: Record<string, object>): Record<string, number>;
    flatten(style: StyleValue): object;
    compose(style1: StyleValue, style2: StyleValue): object;
    absoluteFillObject: object;
  }

  export const StyleSheet: StyleSheet;
}

declare module '@expo/vector-icons' {
  import type { ComponentType, ReactNode } from 'react';

  export interface MaterialIconsProps {
    name: string;
    size?: number;
    color?: string;
    style?: object | object[];
  }

  export const MaterialIcons: ComponentType<MaterialIconsProps>;

  export interface IoniconsProps {
    name: string;
    size?: number;
    color?: string;
    style?: object | object[];
  }

  export const Ionicons: ComponentType<IoniconsProps>;

  export interface FontAwesomeProps {
    name: string;
    size?: number;
    color?: string;
    style?: object | object[];
  }

  export const FontAwesome: ComponentType<FontAwesomeProps>;

  export interface FontAwesome5Props {
    name: string;
    size?: number;
    color?: string;
    style?: object | object[];
  }

  export const FontAwesome5: ComponentType<FontAwesome5Props>;
}
