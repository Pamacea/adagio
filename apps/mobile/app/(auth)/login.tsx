import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../features/auth/hooks/useAuth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-midnight-950 justify-center px-8">
      <LinearGradient
        colors={['#0a0a05', '#15150a', '#0a0a05']}
        className="absolute inset-0"
      />

      <View className="flex-1 justify-center">
        <Text className="text-6xl font-bold text-center text-transparent bg-gradient-to-r from-interval-third to-interval-fifth mb-2">
          ADAGIO
        </Text>
        <Text className="text-center text-midnight-400 mb-12">
          L'atlas harmonique intelligent
        </Text>

        <View className="space-y-4">
          <TextInput
            className="bg-midnight-900/50 border border-midnight-700 rounded-lg px-4 py-3 text-midnight-100"
            placeholder="Email"
            placeholderTextColor="#78716c"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TextInput
            className="bg-midnight-900/50 border border-midnight-700 rounded-lg px-4 py-3 text-midnight-100"
            placeholder="Mot de passe"
            placeholderTextColor="#78716c"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Pressable
            onPress={handleLogin}
            disabled={loading}
            className="bg-gradient-to-r from-interval-third to-interval-fifth rounded-lg py-4 items-center justify-center"
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-semibold text-lg">Se connecter</Text>
            )}
          </Pressable>

          <Pressable onPress={() => router.push('/register')}>
            <Text className="text-center text-interval-third mt-4">
              Pas encore de compte ? S'inscrire
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
