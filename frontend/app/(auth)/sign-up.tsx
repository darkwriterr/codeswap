import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Alert
} from "react-native";
import Checkbox from "expo-checkbox";
import { useRouter } from "expo-router";
import { loginUser, saveUserName, saveCredentials } from "@/lib/auth";

export default function SignUpScreen() {
    const router = useRouter();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [agreed, setAgreed] = useState(false);

    const handleSignUp = async () => {




        if (!fullName || !email || !password || !confirmPassword) {
            Alert.alert("Please fill in all fields.");
            return;
        }

        if (!agreed) {
            Alert.alert("You must agree to the terms.");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Passwords do not match.");
            return;
        }

        try {
            await saveCredentials(email, password);
            await loginUser("mock-token");
            await saveUserName(fullName);
            Alert.alert("Account created!");
            router.push("/");
        } catch (err) {
            Alert.alert("Something went wrong");
        }
    };


    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>CodeSwap</Text>
            <Text style={styles.subtitle}>Create your account</Text>

            <TextInput
                placeholder="Full Name"
                placeholderTextColor="#aaa"
                value={fullName}
                onChangeText={setFullName}
                style={styles.input}
            />
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
            <TextInput
                placeholder="Confirm Password"
                placeholderTextColor="#aaa"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                style={styles.input}
            />

            <View style={styles.checkboxContainer}>
                <Checkbox
                    value={agreed}
                    onValueChange={setAgreed}
                    color={agreed ? "#4338ca" : undefined}
                />
                <Text style={styles.checkboxLabel}>
                    I agree to the Terms of Service and Privacy Policy
                </Text>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
                <Text style={styles.link}>Already have an account? Log in</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 24,
        backgroundColor: "#000", // черный фон
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
        color: "#fff"
    },
    checkboxContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16
    },
    checkboxLabel: {
        marginLeft: 8,
        flex: 1,
        color: "#ccc"
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
