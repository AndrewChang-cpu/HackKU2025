import { useState, useEffect } from 'react';
import { Button, View, Text } from 'react-native-ui-lib';

export default function Index() {
    return (
        <View className="flex-1 bg-cyan-300">
            <View className="flex-1 justify-center items-center">
                <Text>Welcome Screen</Text>
            </View>
            <View className='absolute w-full h-full px-[25px] pb-[50px]'>
                <View className="flex-1 justify-end">
                    <Button
                        label={'Get Started'}
                        enableShadow
                        animateTo='left'
                    />
                </View>
            </View>
        </View>
    );
};