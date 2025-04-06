import React, { useState } from 'react';
import { ImageBackground, TouchableOpacity, Image } from 'react-native';
import { View, Text, TextField } from 'react-native-ui-lib';
import { useRouter, Link } from 'expo-router';
import Heading from '@/components/Heading';
import supabase from '@/api/supabaseClient';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailFocus, setEmailFocus] = useState(false);

  const router = useRouter();

  const handleSignin = async () => {
    console.log('hello world');
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.log('invalid signin info', error);
    } else {
      router.push('/(tabs)');
    }
  };

  return (
    <ImageBackground
      source={require('../assets/backgrounds/bg1.png')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View className="flex-1 justify-center items-center px-6">
        {/* Heading */}
        <Heading text="Login" />

        {/* Goose image */}
        <View className="mt-[-150px] mb-8">
          <Image
            source={require('../assets/goose/goose-flying.png')}
            //style={{ width: 150, height: 150 }}
            resizeMode="contain"
          />
        </View>

        {/* Input Fields */}
        <View className="mb-6">
          <TextField
            placeholder="Email"
            onChangeText={setEmail}
            floatingPlaceholder
            floatOnFocus
            fieldStyle={{
              borderBottomWidth: 1,
              borderBottomColor: emailFocus ? '#6200EE' : '#ccc',
            }}
            floatingPlaceholderStyle={{ color: '#aaa' }}
            containerStyle={{ width: 300 }}
          />
          <TextField
            secureTextEntry
            placeholder="Password"
            onChangeText={setPassword}
            floatingPlaceholder
            floatOnFocus
            fieldStyle={{
              borderBottomWidth: 1,
              borderBottomColor: emailFocus ? '#6200EE' : '#ccc',
            }}
            floatingPlaceholderStyle={{ color: '#aaa' }}
            containerStyle={{ width: 300, marginTop: 16 }}
          />
        </View>

        {/* Login Button */}
        <TouchableOpacity
          className="w-[80%] py-3 bg-white rounded-full border border-black shadow-lg items-center mb-4"
          onPress={handleSignin}
        >
          <Text className="text-lg">Login</Text>
        </TouchableOpacity>

        {/* Signup Link */}
        <View className="flex-row items-center">
          <Text>Don't have an account? </Text>
          <Link href="/signup">
            <Text className="text-blue-500">Signup!</Text>
          </Link>
        </View>
      </View>
    </ImageBackground>
  );
}
