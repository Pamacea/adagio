import { View, Text, ScrollView } from 'react-native';

export default function TabIndexScreen() {
  return (
    <View className="flex-1 bg-midnight-950 pt-20 px-4">
      <Text className="text-3xl font-bold text-midnight-100 mb-4">
        Harmonic Engine
      </Text>
      <Text className="text-midnight-400">
        Explorez les modes et gammes par émotion.
      </Text>

      <ScrollView className="flex-1 mt-8 space-y-4">
        <View className="bg-midnight-900/50 rounded-lg p-4 border border-midnight-800">
          <Text className="text-xl font-semibold text-interval-third mb-2">
            🎵 Modes
          </Text>
          <Text className="text-midnight-300">
            Découvrez les 7 modes de la gamme majeure avec leurs couleurs émotionnelles.
          </Text>
        </View>

        <View className="bg-midnight-900/50 rounded-lg p-4 border border-midnight-800">
          <Text className="text-xl font-semibold text-interval-fifth mb-2">
            🎸 Fretboard
          </Text>
          <Text className="text-midnight-300">
            Visualisez les notes sur un manche de guitare interactif.
          </Text>
        </View>

        <View className="bg-midnight-900/50 rounded-lg p-4 border border-midnight-800">
          <Text className="text-xl font-semibold text-interval-ninth mb-2">
            🎭 Emotions
          </Text>
          <Text className="text-midnight-300">
            Filtrez les modes par sensation : Aérien, Sombre, Espagnol...
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
