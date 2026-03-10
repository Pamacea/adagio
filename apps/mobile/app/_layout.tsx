// ============================================================================
// ROOT LAYOUT - Main layout for Adagio Mobile
// Design Metal/Brutal - ADAGIO
// ============================================================================

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme as useRNColorScheme, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors } from '../theme';

// Wrapper around React Native's useColorScheme
function useColorScheme() {
  return useRNColorScheme();
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: Colors.black,
          },
        }}
      >
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="achievements"
          options={{
            headerShown: true,
            headerTitle: 'SUCCÈS',
            headerBackTitle: 'Retour',
            headerStyle: {
              backgroundColor: Colors.black,
            },
            headerTintColor: Colors.acidGreen,
          }}
        />
        <Stack.Screen
          name="warning"
          options={{
            headerShown: false,
            presentation: 'fullScreenModal',
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
