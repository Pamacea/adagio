// ============================================================================
// AUTH LAYOUT - Layout for authentication screens
// ============================================================================

import { Stack } from 'expo-router';
import { useColorScheme as useRNColorScheme } from 'react-native';

function useColorScheme() {
  return useRNColorScheme();
}

export default function AuthLayout() {
  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === 'dark' ? '#0a0a05' : '#f8f8f4';

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor },
        presentation: 'card',
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
