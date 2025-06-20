import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

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
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, string> = {
            index: "home",
            forum: "chatbubbles",
            features: "rocket",
            sessions: "calendar",
            quiz: "help-circle",
            match: "people",
            profile: "person",
          };
          return (
            <Ionicons
              name={(icons[route.name] ?? "ellipse") as any}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tabs.Screen name="index" options={{ tabBarLabel: "Home" }} />
      <Tabs.Screen name="forum" options={{ tabBarLabel: "Forum" }} />
      <Tabs.Screen name="features" options={{ tabBarLabel: "Features" }} />
      <Tabs.Screen name="quiz" options={{ tabBarLabel: "Quiz" }} />
      <Tabs.Screen name="match" options={{ tabBarLabel: "Match" }} /> 
      <Tabs.Screen
        name="profile"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
