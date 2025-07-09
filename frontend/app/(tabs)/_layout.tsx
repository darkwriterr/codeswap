import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const icons: Record<string, string> = {
  index: "home-outline",
  "forum/forum": "chatbubble-outline",
  features: "rocket-outline",
  quiz: "help-circle-outline",
  match: "people-outline",
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#4338ca",
        tabBarInactiveTintColor: "#aaa",
        tabBarStyle: {
          backgroundColor: "#1c1c34",
          borderTopColor: "#333",
          height: 60,
        },
        tabBarIcon: ({ color, size }) => (
          <Ionicons
            name={(icons[route.name] ?? "ellipse-outline") as any}
            size={size}
            color={color}
          />
        ),
      })}
    >
      <Tabs.Screen name="index" options={{ tabBarLabel: "Home" }} />
      <Tabs.Screen name="forum/forum" options={{ tabBarLabel: "Forum" }} />
      <Tabs.Screen name="quiz" options={{ tabBarLabel: "Quiz" }} />
      <Tabs.Screen name="match" options={{ tabBarLabel: "Match" }} />

      <Tabs.Screen name="forum/[id]" options={{ href: null }} />
      <Tabs.Screen name="rate-partner/[userId]" options={{ href: null }} />
      <Tabs.Screen name="profile" options={{ href: null }} />
    </Tabs>
  );
}
