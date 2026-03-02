import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#78716c',
        tabBarStyle: {
          backgroundColor: '#0a0a05',
          borderTopColor: '#1c1c14',
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Engine',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="music-note" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="composer"
        options={{
          title: 'Composer',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="piano" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="grimoire"
        options={{
          title: 'Grimoire',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="menu-book" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="person" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
