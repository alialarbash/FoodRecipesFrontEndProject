import { Tabs } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { colors } from "../../src/theme/colors";
import { Platform } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.mint,
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          borderTopWidth: 0,
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          paddingTop: 10,
          height: Platform.OS === 'ios' ? 80 : 60,
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          borderRadius: 30,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.1,
          shadowRadius: 40,
          elevation: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons 
              name="home" 
              size={focused ? 26 : 24} 
              color={color}
              style={{ transform: [{ translateY: focused ? -2 : 0 }] }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons 
              name="search" 
              size={focused ? 26 : 24} 
              color={color}
              style={{ transform: [{ translateY: focused ? -2 : 0 }] }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons 
              name="person" 
              size={focused ? 26 : 24} 
              color={color}
              style={{ transform: [{ translateY: focused ? -2 : 0 }] }}
            />
          ),
        }}
      />
    </Tabs>
  );
}


