import React from 'react';
import { TouchableOpacity } from 'react-native';
import { View, SafeAreaView, ImageBackground, Text, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require('../assets/backgrounds/bg1.png')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >

      <SafeAreaView className='flex justify-center items-center mt-[150px]'>
        <Image
          source={require('../assets/logo/black-logo.png')}
        />
      </SafeAreaView>
      <View className='flex justify-end pl-[200px]'>
        <Image
          source={require('../assets/goose/goose1.png')}
        />
      </View>
      <View className="pl-[80px] text-left justify-center px-6 mt-[-70px] gap-3">
        <Text className="text-6xl font-bold">Don't</Text>
        <Text className="text-6xl font-bold">forget to</Text>
        <Text className="text-6xl font-bold">take care of</Text>
        <Text className="text-6xl font-bold">yourself!</Text>
      </View>

      {/* Button positioned 60px from the bottom with left and right margins */}
      <TouchableOpacity
        className="absolute bottom-[60px] left-6 right-6 py-3 px-6 bg-white rounded-full border border-black shadow-lg items-center"
        onPress={() => router.push('/login')}
      >
        <Text className="text-lg">Get Started</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}
