// ============================================================================
// TABS LAYOUT - Bottom tab navigation for main app
// Design Metal/Brutal - ADAGIO
// ============================================================================

import { Tabs } from 'expo-router';
import { Text, useColorScheme as useRNColorScheme, View } from 'react-native';
import {
  HomeIcon,
  MusicIcon,
  NoteIcon,
  LibraryIcon,
  UserIcon,
} from '@/components';
import { Colors, FontWeights } from '@/theme';

function useColorScheme() {
  return useRNColorScheme();
}

const screenOptions = {
  headerShown: false,
};

export default function TabsLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        ...screenOptions,
        tabBarActiveTintColor: Colors.black,
        tabBarInactiveTintColor: Colors.gray500,
        tabBarStyle: {
          backgroundColor: Colors.black,
          borderTopWidth: 2,
          borderTopColor: Colors.gray700,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
          paddingHorizontal: 4,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: FontWeights.bold,
          textTransform: 'uppercase',
          letterSpacing: 1,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color, size }) => <TabIcon name="home" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="theory"
        options={{
          title: 'Théorie',
          tabBarIcon: ({ color, size }) => <TabIcon name="theory" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="composer"
        options={{
          title: 'Composer',
          tabBarIcon: ({ color, size }) => <TabIcon name="composer" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="grimoire"
        options={{
          title: 'Grimoire',
          tabBarIcon: ({ color, size }) => <TabIcon name="grimoire" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => <TabIcon name="profile" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}

// Icon component for tabs
function TabIcon({ name, color, size }: { name: string; color: string; size: number }) {
  const iconColor = color;

  const icons: Record<string, React.ReactNode> = {
    home: <HomeIcon size={size} color={iconColor} />,
    theory: <MusicIcon size={size} color={iconColor} />,
    composer: <NoteIcon size={size} color={iconColor} />,
    grimoire: <LibraryIcon size={size} color={iconColor} />,
    profile: <UserIcon size={size} color={iconColor} />,
  };

  return icons[name] || null;
}
