import { View, Text } from 'react-native';

export default function TabProfileScreen() {
  return (
    <View className="flex-1 bg-midnight-950 pt-20 px-4">
      <Text className="text-3xl font-bold text-midnight-100 mb-4">
        Profil
      </Text>
      <Text className="text-midnight-400">
        Gérez vos préférences et suivez votre progression.
      </Text>
    </View>
  );
}
