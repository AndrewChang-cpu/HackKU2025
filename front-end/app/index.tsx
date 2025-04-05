import { useState, useEffect } from 'react';
import { Button, View, Text } from 'react-native-ui-lib';
import { useRouter } from 'expo-router';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './(tabs)/HomeScreen';
import CameraScreen from './(tabs)/CameraScreen';

const Stack = createNativeStackNavigator();

export default function Index() {
    const router = useRouter();

    return (
        // <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="CameraScreen" component={CameraScreen} />
            </Stack.Navigator>
        // </NavigationContainer>
    );
    return (
        <View className="flex-1 bg-cyan-300">
            <View className="flex-1 justify-center items-center">
                <Text>Welcome Screen</Text>
            </View>
            <View className='absolute w-full h-full px-[25px] pb-[50px]'>
                <View className="flex-1 justify-end">
                    <Button
                        label={'Get Started'}
                        labelStyle={{ fontWeight: 'bold'}}
                        onPress={() => {router.push('/login')}}
                        enableShadow
                        animateTo='left'
                    />
                </View>
            </View>
        </View>
    )
}
