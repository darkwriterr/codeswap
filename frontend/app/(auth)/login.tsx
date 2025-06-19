import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert
} from "react-native";
import { useRouter } from "expo-router";
import { loginUser, checkCredentials  } from "../../lib/auth";

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Please fill in all fields.");
            return;
        }

        const valid = await checkCredentials(email, password);
        if (!valid) {
            Alert.alert("Incorrect email or password.");
            return;
        }

        await loginUser("mock-token");
        Alert.alert("Login successful!");
        router.push("/");
    };


    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>CodeSwap</Text>
            <Text style={styles.subtitle}>Welcome back</Text>

            <TextInput
                placeholder="Email"
                placeholderTextColor="#aaa"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
            />
            <TextInput
                placeholder="Password"
                placeholderTextColor="#aaa"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={styles.input}
            />

            <TouchableOpacity
                style={styles.forgotLink}
                onPress={() => Alert.alert("Redirect to password reset page")}
            >
                <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/(auth)/sign-up")}>
                <Text style={styles.link}>Do not have an account? Sign up</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 24,
        backgroundColor: "#000", // Черный фон
        flexGrow: 1,
        justifyContent: "center"
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 8,
        color: "#4338ca"
    },
    subtitle: {
        fontSize: 18,
        textAlign: "center",
        marginBottom: 24,
        color: "#fff"
    },
    input: {
        borderWidth: 1,
        borderColor: "#444",
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
        color: "#fff" // Цвет текста в инпуте
    },
    forgotLink: {
        alignItems: "flex-end",
        marginBottom: 16
    },
    forgotText: {
        color: "#9ca3af", // Светло-серый
        textDecorationLine: "underline"
    },
    button: {
        backgroundColor: "#4338ca",
        padding: 14,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 12
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold"
    },
    link: {
        textAlign: "center",
        color: "#60a5fa",
        textDecorationLine: "underline"
    }
});
