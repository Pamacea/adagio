/**
 * Type stubs for expo-font
 */

declare module 'expo-font' {
  export enum FontWeight {
    Regular = '400',
    Medium = '500',
    Semibold = '600',
    Bold = '700',
    Extrabold = '800',
  }

  export interface FontSource {
    fontFamily: string;
    fonts: Record<string, number>;
  }

  export function loadAsync(font: FontSource | FontSource[]): Promise<void>;

  export const useFonts: (config: Record<string, number>) => {
    isLoaded: boolean;
    error: Error | null;
  };
}
