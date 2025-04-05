import { useState, useEffect } from 'react';
import { ImageBackground } from 'react-native';
import { View, Text, Button, TextField } from 'react-native-ui-lib';
import { router, Link } from 'expo-router';
import BottomButton from '@/components/BottomButton'

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailFocus, setEmailFocue] = useState(false);

    return (
        <ImageBackground
            source={require('../assets/backgrounds/bg1.png')}
            style={{ flex: 1 }}
            resizeMode='cover'
        >
            <View className="absolute flex-1 justify-start">
                
            </View>
            <View className="flex-1">
                <View className="flex-1 justify-center items-center">
                    <Text>Signup Screen</Text>
                    <View className="flex flex-col gap-3">
                        <TextField
                            placeholder="Email"
                            floatingPlaceholder
                            floatOnFocus      // The placeholder floats when focused or filled
                            fieldStyle={{
                                borderBottomWidth: 1,
                                borderBottomColor: emailFocus ? '#6200EE' : '#ccc',
                            }}
                            floatingPlaceholderStyle={{ color: '#aaa' }}
                            containerStyle={{ 
                                //marginRight: 0
                                width: 300
                            }}
                        />
                        <TextField
                            className="text-blue-600"
                            placeholder="Password"
                            floatingPlaceholder
                            floatOnFocus      // The placeholder floats when focused or filled
                            fieldStyle={{
                                borderBottomWidth: 1,
                                borderBottomColor: emailFocus ? '#6200EE' : '#ccc',
                            }}
                            floatingPlaceholderStyle={{ color: '#aaa' }}
                            containerStyle={{ 
                                //marginRight: 0
                                width: 300
                            }}
                        />
                        <TextField
                            className="text-blue-600"
                            secureTextEntry
                            placeholder="Re-enter password"
                            floatingPlaceholder
                            floatOnFocus      // The placeholder floats when focused or filled
                            fieldStyle={{
                                borderBottomWidth: 1,
                                borderBottomColor: emailFocus ? '#6200EE' : '#ccc',
                            }}
                            floatingPlaceholderStyle={{ color: '#aaa' }}
                            containerStyle={{ 
                                //marginRight: 0
                                width: 300
                            }}
                        />
                    </View>
                </View>
            </View>
            <View className="absolute flex-1 gap-5 w-full h-full z-50 flex justify-end px-[20px] pb-[50px]">
                <Button
                    style={{ backgroundColor: '#5BD9C2' }}
                    label={'Login'}
                />
                <View className='flex flex-row gap-2 justify-center items-center'>
                    <Text>Already have an account?</Text>
                    <Link href='/login'>
                        <Text>
                            Login!
                        </Text>
                    </Link>
                </View>
            </View>
        </ImageBackground>
    );
}