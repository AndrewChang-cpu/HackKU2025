import { useState, useEffect } from 'react';
import { View, Text, Button, TextField } from 'react-native-ui-lib';
import { tw } from 'tailwind-react-native-classnames';

export default function LoginScreen() {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    return (
        <View className="flex-1 bg-cyan-300">
            <View className="flex-1 justify-center items-center">
                <Text>Login Screen</Text>
                <TextField
                    placeHolder={'Placeholder'}
                    floatingPlaceholder
                    onChangeText={email => setEmail(email)}
                    enableErrors
                />
                <Button
                    label={'Login'}
                    enableShadow
                    animateTo='left'
                />
            </View>
            <View className='absolute w-full h-full px-[25px] pb-[50px]'>
                <View className="flex-1 justify-end">
                </View>
            </View>
        </View>
    );
}