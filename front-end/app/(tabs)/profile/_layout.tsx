// app/(tabs)/profile/_layout.tsx
import { View } from 'react-native';
import { Stack } from "expo-router";

export default function ProfileStackLayout() {
    return (
        <View className='flex-1 bg-[#e3fcef]'>
            <Stack>
                <Stack.Screen 
                    name='index'
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen 
                    name='allergens'
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen 
                    name='AddMedicationScreen'
                    options={{
                        headerShown: false,
                    }}
                />
            </Stack>
        </View>
    );
}
