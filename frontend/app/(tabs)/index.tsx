import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Header from "../../components/ui/Header";
import { Redirect, useRouter } from "expo-router";
import { isUserLoggedIn, getUserName, logoutUser } from "../../lib/auth";

export default function HomeScreen() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [checking, setChecking] = useState(true);
    const [name, setName] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const checkLogin = async () => {
            const logged = await isUserLoggedIn();
            const username = await getUserName();
            setLoggedIn(logged);
            setName(username);
            setChecking(false);
        };

        checkLogin();
    }, []);

    if (checking) return null;
    if (!loggedIn) return <Redirect href="/(auth)/sign-up" />;

    const handleLogout = async () => {
        await logoutUser();
        router.replace("/(auth)/login");
    };

    return (
        <View style={styles.container}>
            <Header />
            <View style={styles.content}>
                <Text style={styles.title}>Welcome, {name || "User"}!</Text>

                <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#000" },
    content: { flex: 1, justifyContent: "center", alignItems: "center" },
    title: { fontSize: 24, color: "#fff", marginBottom: 20 },
    logoutButton: {
        backgroundColor: "#dc2626",
        padding: 12,
        borderRadius: 8
    },
    logoutText: {
        color: "#fff",
        fontWeight: "bold"
    }
});
