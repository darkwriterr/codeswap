import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Header() {
    const router = useRouter();

    return (
        <SafeAreaView edges={["top"]} style={styles.safeArea}>
            <View style={styles.header}>
                <View style={styles.logoBlock}>
                    <View style={styles.logoCircle}>
                        <Text style={styles.logoText}>{"</>"}</Text>
                    </View>
                    <Text style={styles.title}>CodeSwap</Text>
                </View>
                <Pressable onPress={() => router.push("/profile")}>
                    <Ionicons name="person-circle-outline" size={28} color="white" />
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: "#1c1c34",
    },
    header: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#1c1c34",
    },
    logoBlock: {
        flexDirection: "row",
        alignItems: "center",
    },
    logoCircle: {
        backgroundColor: "#4338ca",
        borderRadius: 999,
        paddingHorizontal: 6,
        paddingVertical: 4,
        marginRight: 8,
    },
    logoText: {
        color: "white",
        fontWeight: "bold",
    },
    title: {
        fontSize: 20,
        fontWeight: "600",
        color: "white",
    },
});
