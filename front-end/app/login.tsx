import { useState, useEffect } from 'react';
import { ImageBackground } from 'react-native';
import { View, Text, Button, TextField } from 'react-native-ui-lib';
import BottomButton from '@/components/BottomButton'
import { tw } from 'tailwind-react-native-classnames';

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
            <View className="flex-1">
                <View className="flex-1 justify-center items-center">
                    <Text>Login Screen</Text>
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
                        <BottomButton label='login'/>
                    </View>
                </View>
            </View>
        </ImageBackground>
    );
}