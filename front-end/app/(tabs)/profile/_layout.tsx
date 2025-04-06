// app/(tabs)/profile/_layout.tsx
import { View } from 'react-native';
import { Stack } from "expo-router";

export default function ProfileStackLayout() {
    return (
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
            <Stack.Screen 
                name='AllMedicationScreen'
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen 
                name='DocumentCameraScreen'
                options={{
                    headerShown: false,
                }}
            />
        </Stack>
    );
}
