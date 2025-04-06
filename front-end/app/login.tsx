import { useState, useEffect } from 'react';
import { ImageBackground } from 'react-native';
import { View, Text, Button, TextField } from 'react-native-ui-lib';
import { Link } from 'expo-router';
import BottomButton from '@/components/BottomButton';
import Heading from '@/components/Heading';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailFocus, setEmailFocue] = useState(false);

  return (
    <ImageBackground
      source={require('../assets/backgrounds/bg1.png')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      {/* Heading area */}
      <View className="absolute flex-1 justify-start w-full items-center pt-[250px]">
        <Heading text="Login" />
      </View>

      {/* Main content */}
      <View className="flex-1">
        <View className="flex-1 justify-center items-center">
          <Text>Login Screen</Text>
          <View className="flex flex-col gap-3">
            <TextField
              placeholder="Email"
              floatingPlaceholder
              floatOnFocus // The placeholder floats when focused or filled
              fieldStyle={{
                borderBottomWidth: 1,
                borderBottomColor: emailFocus ? '#6200EE' : '#ccc',
              }}
              floatingPlaceholderStyle={{ color: '#aaa' }}
              containerStyle={{ width: 300 }}
            />
            <TextField
              className="text-blue-600"
              secureTextEntry
              placeholder="Password"
              floatingPlaceholder
              floatOnFocus
              fieldStyle={{
                borderBottomWidth: 1,
                borderBottomColor: emailFocus ? '#6200EE' : '#ccc',
              }}
              floatingPlaceholderStyle={{ color: '#aaa' }}
              containerStyle={{ width: 300 }}
            />
          </View>
          <Button style={{ backgroundColor: '#5BD9C2' }} label="Login" />
            <View className="flex flex-row gap-2 justify-center items-center">
            <Text>Don't have an account?</Text>
            <Link href="/signup">
                <Text>Signup!</Text>
            </Link>
        </View>
        </View>
      </View>

      {/* Bottom container (adjusted to not cover full screen) */}
      <View className="absolute bottom-0 w-full z-50 flex flex-col gap-5 justify-end px-[20px] pb-[50px]">
        <Button style={{ backgroundColor: '#5BD9C2' }} label="Login" />
        <View className="flex flex-row gap-2 justify-center items-center">
          <Text>Don't have an account?</Text>
          <Link href="/signup">
            <Text>Signup!</Text>
          </Link>
        </View>
      </View>
    </ImageBackground>
  );
}
