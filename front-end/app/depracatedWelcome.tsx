import { TouchableOpacity } from 'react-native';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#e3fcef] items-center justify-center px-6">
      <Text className="text-3xl font-semibold mb-12">Welcome!</Text>

      <TouchableOpacity
        className="w-full py-3 px-6 mb-4 bg-white rounded-full border border-black shadow-lg items-center"
        onPress={() => router.push('/login')}
      >
        <Text className="text-lg">Log in</Text>
      </TouchableOpacity>

      <Pressable
        className="w-full py-3 px-6 bg-white rounded-full border border-black shadow-lg items-center"
        onPress={() => router.push('/(tabs)')}
      >
        <Text className="text-lg">Sign up</Text>
      </Pressable>
    </View>
  );
}
