// app/(tabs)/profile/_layout.tsx
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
        </Stack>
    );
}
