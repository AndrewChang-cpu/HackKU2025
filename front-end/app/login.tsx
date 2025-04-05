import { View, Text, Button } from 'react-native-ui-lib';

export default function LoginScreen() {
    return (
        <View className="flex-1 bg-cyan-300">
            <View className="flex-1 justify-center items-center">
                <Text>Login Screen</Text>
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
}