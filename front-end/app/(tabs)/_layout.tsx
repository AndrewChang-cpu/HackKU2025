import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export default function TabLayout() {
    return (
    <Tabs
        screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
            backgroundColor: "white",
            height: 70,
            paddingBottom: 8,
            paddingTop: 8,
            borderTopWidth: 1,
            borderColor: "#ccc",
        },
        tabBarShowLabel: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'home-outline';
          let label = 'Tab';

          if (route.name === 'Home') {
            iconName = 'home-outline';
            label = 'Home';
          } else if (route.name === 'Profile') {
            iconName = 'person-outline';
            label = 'Profile';
          }

          return (
            <View style={{ alignItems: 'center', justifyContent: 'center', width: 60 }}>
              <Ionicons
                name={iconName}
                size={22}
                color={focused ? "black" : "#aaa"}
                />
                <Text
                style={{
                    fontSize: 12,
                    color: focused ? "black" : "#aaa",
                    marginTop: 2,
                }}
                numberOfLines={1}
                ellipsizeMode="tail"
                >
                {label}
                </Text>
            </View>
          );
        },
      })}
    >
      <Tabs.Screen name="Home" />
      <Tabs.Screen name="Profile" />
    </Tabs>
    );
}
