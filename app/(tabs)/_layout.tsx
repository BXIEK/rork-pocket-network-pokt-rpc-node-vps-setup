import { Tabs } from "expo-router";
import { Server, Settings } from "lucide-react-native";
import React from "react";

import Colors from "@/constants/colors";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.light.tint,
        headerShown: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Guia POKT",
          tabBarIcon: ({ color }) => <Server color={color} />,
        }}
      />
      <Tabs.Screen
        name="tools"
        options={{
          title: "Ferramentas",
          tabBarIcon: ({ color }) => <Settings color={color} />,
        }}
      />
    </Tabs>
  );
}