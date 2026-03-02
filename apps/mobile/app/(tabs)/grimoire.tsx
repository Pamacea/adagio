import { View, Text } from 'react-native';

export default function TabGrimoireScreen() {
  return (
    <View className="flex-1 bg-midnight-950 pt-20 px-4">
      <Text className="text-3xl font-bold text-midnight-100 mb-4">
        The Grimoire
      </Text>
      <Text className="text-midnight-400">
        Base de connaissances des techniques de guitare.
      </Text>
    </View>
  );
}
