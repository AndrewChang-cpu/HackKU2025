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
                    icon: ''
                }}
            />
            <Tabs.Screen name="scanner"/>
            <Tabs.Screen name="profile"/>
        </Tabs>
    );
}
