// ============================================================================
// REACT NATIVE MODULES DECLARATIONS
// ============================================================================
// This file provides type declarations for React Native modules

declare module 'react-native' {
  export interface ViewStyle {
    backgroundColor?: string;
    flex?: number;
    flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
    justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
    alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
    padding?: number;
    paddingHorizontal?: number;
    paddingVertical?: number;
    margin?: number;
    marginHorizontal?: number;
    marginVertical?: number;
    width?: number | string;
    height?: number | string;
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number;
    maxHeight?: number;
    borderRadius?: number;
    borderWidth?: number;
    borderColor?: string;
    borderLeftWidth?: number;
    borderLeftColor?: string;
    borderRightWidth?: number;
    borderRightColor?: string;
    borderTopWidth?: number;
    borderTopColor?: string;
    borderBottomWidth?: number;
    borderBottomColor?: string;
    opacity?: number;
    position?: 'absolute' | 'relative';
    top?: number | string;
    left?: number | string;
    right?: number | string;
    bottom?: number | string;
    shadowColor?: string;
    shadowOffset?: { width: number; height: number };
    shadowOpacity?: number;
    shadowRadius?: number;
    elevation?: number;
    overflow?: 'visible' | 'hidden' | 'scroll';
    transform?: Array<object>;
  }

  export interface TextStyle {
    color?: string;
    fontSize?: number;
    fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
    fontStyle?: 'normal' | 'italic';
    lineHeight?: number;
    textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify';
    textDecorationLine?: 'none' | 'underline' | 'line-through' | 'underline line-through';
    textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase';
    letterSpacing?: number;
  }

  export const useColorScheme: () => 'light' | 'dark' | null;
  export const KeyboardAvoidingView: React.ComponentType<any>;
  export const Platform: {
    OS: 'ios' | 'android' | 'web';
    Version: number | string;
  };
  export const Switch: React.ComponentType<any>;
}
