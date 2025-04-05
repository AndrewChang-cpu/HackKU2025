import { useState, useEffect } from 'react';
import { View, Text, Button, TextField } from 'react-native-ui-lib';
import { tw } from 'tailwind-react-native-classnames';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailFocus, setEmailFocue] = useState(false);

    return (
        <View className="flex-1">
            <View className="flex-1 justify-center items-center">
                <Text>Login Screen</Text>
                <TextField
                    placeholder="Floating"
                    floatingPlaceholder
                    floatOnFocus      // The placeholder floats when focused or filled
                    fieldStyle={{
                        borderBottomWidth: 1,
                        borderBottomColor: emailFocus ? '#6200EE' : '#ccc',
                    }}
                    floatingPlaceholderStyle={{ color: '#aaa' }}
                    containerStyle={{ flex: 1, marginRight: 8 }}
                />
            </View>
        </View>
    );
}