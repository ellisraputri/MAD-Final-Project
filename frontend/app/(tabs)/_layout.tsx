import { Tabs, usePathname } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ImageBackground, StyleSheet, View } from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import { useEffect } from "react";

export default function TabLayout() {
  const pathname = usePathname();

  useEffect(() => {
    NavigationBar.setBehaviorAsync("overlay-swipe");
    NavigationBar.setVisibilityAsync("hidden");
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#3AA6A6",
        tabBarInactiveTintColor: "white",
        tabBarStyle: {
          height: 60,
          borderTopWidth: 0,
          backgroundColor: "transparent",
          position: "absolute",
        },
        tabBarIconStyle: {
          marginTop: 8,
        },
        tabBarBackground: () => (
          <ImageBackground
            source={require("../../assets/images/header.png")}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          >
            <View
              style={{
                ...StyleSheet.absoluteFillObject,
                backgroundColor: "rgba(0,0,0,0.4)", // darkness level
              }}
            />
          </ImageBackground>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={30}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="activity/index"
        options={{
          tabBarIcon: ({ color }) => {
            const active = pathname.startsWith("/activity");

            return (
              <Ionicons
                name={active ? "compass" : "compass-outline"}
                size={30}
                color={active ? "#3AA6A6" : "white"}
              />
            );
          },
        }}
      />

      <Tabs.Screen
        name="leaderboard"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "bar-chart" : "bar-chart-outline"}
              size={30}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "settings" : "settings-outline"}
              size={30}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen name="activity/[id]" options={{ href: null }} />
    </Tabs>
  );
}
