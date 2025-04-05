import { useState, useEffect } from 'react';
import { View, Text, Button, TextField } from 'react-native-ui-lib';
//import { tw } from 'tailwind-react-native-classnames';

export default function LoginScreen() {
    return (
        <View className="flex-1">
            <View className="flex-1 justify-center items-center">
                <Text>Login Screen</Text>
                <TextField
                    placeholder="Email"
                    floatingPlaceholder
                    floatOnFocus      // The placeholder floats when focused or filled
                    fieldStyle={{
                        borderBottomWidth: 1,
                        borderBottomColor: emailFocus ? '#6200EE' : '#ccc',
                    }}
                    floatingPlaceholderStyle={{ color: '#aaa' }}s 
                    containerStyle={{ marginRight: 8 }}
                />
            </View>
            <View className='absolute w-full h-full px-[25px] pb-[50px]'>
                <View className="flex-1 justify-end">
                </View>
            </View>
        </View>
    );
}