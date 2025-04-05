import 'react-native-gesture-handler';

import { TouchableOpacity } from 'react-native';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import HomeScreen from './(tabs)/home';

export default function Index() {
  const router = useRouter();


  // return <HomeScreen/>
    return (
        <View className="flex-1 bg-[#e3fcef] items-center justify-center px-6">
            <Text className="text-3xl font-semibold mb-12">Welcome!</Text>
            <TouchableOpacity onPress={() => {router.push('/login')}}>
                <Text>Get Started</Text>
            </TouchableOpacity> 
        </View>
    );
}
