import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export default function TabLayout() {
    return (
        <Tabs>
            <Tabs.Screen 
                name="index"
                options={{
                    title: 'Dashboard',
                    icon: 'home',
                    headerShown: false
                }}
            />
            <Tabs.Screen name="profile"
                options={{
                    title: 'Profile',
                    icon: 'profile',
                    headerShown: false
                }}
            />
        </Tabs>
    );
}
