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
                        profile: "person",
                    };
                    return <Ionicons name={icons[route.name] as any} size={size} color={color} />;
                },
            })}
        >
            <Tabs.Screen name="index" options={{ tabBarLabel: "Home" }} />
            <Tabs.Screen name="forum" options={{ tabBarLabel: "Forum" }} />
            <Tabs.Screen name="features" options={{ tabBarLabel: "Features" }} />
            <Tabs.Screen
                name="profile"
                options={{
                    href: null, // 👈 полностью исключает из таббарного навигационного массива
                }}
            />


        </Tabs>
    );
}
