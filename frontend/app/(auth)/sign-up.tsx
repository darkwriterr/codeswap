import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import Checkbox from "expo-checkbox";
import { useRouter } from "expo-router";
import { saveCredentials } from "@/lib/auth";
import { register } from "@/lib/api";

export default function SignUpScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignUp = async () => {
    setError("");

    if (!fullName || !email || !password || !confirmPassword) {
      return setError("Please fill in all fields.");
    }
    if (!agreed) {
      return setError("You must agree to the terms.");
    }
    if (password.length < 8) {
      return setError("Password must be at least 8 characters.");
    }
    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    try {
      setLoading(true);
      await register(email, password, fullName);
      await saveCredentials(email, password);
      router.replace("/");
    } catch (err: any) {
      const msg = err?.response?.data?.error || err.message || "Registration failed.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>CodeSwap</Text>
      <Text style={styles.subtitle}>Create your account</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

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

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={handleSignUp}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign Up</Text>
        )}
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
    backgroundColor: "#000",
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
  },
  error: {
    backgroundColor: "#dc2626",
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
    color: "#fff",
    textAlign: "center"
  }
});
