import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Linking
} from "react-native";
import { useRouter } from "expo-router";
import { saveCredentials } from "@/lib/auth";
import { login } from "@/lib/api";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    if (!email || !password) {
      return setError("Please fill in all fields.");
    }

    try {
      setLoading(true);
      await login(email, password);
      await saveCredentials(email, password);
      router.replace("/");
    } catch (err: any) {
      const msg = err?.response?.data?.error || err.message || "Login failed.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const GOOGLE_OAUTH_URL = `${process.env.EXPO_PUBLIC_API_URL || "https://your-backend.com"}/auth/google`;
      await Linking.openURL(GOOGLE_OAUTH_URL);
    } catch {
      setError("Could not open Google login.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>CodeSwap</Text>
      <Text style={styles.subtitle}>Welcome back</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

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
        onPress={() => setError("Reset password coming soon.")}
      >
        <Text style={styles.forgotText}>Forgot password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.googleButton}
        onPress={handleGoogleLogin}
      >
        <Text style={styles.buttonText}>Continue with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/(auth)/sign-up")}>
        <Text style={styles.link}>Don't have an account? Sign up</Text>
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
  forgotLink: {
    alignItems: "flex-end",
    marginBottom: 16
  },
  forgotText: {
    color: "#9ca3af",
    textDecorationLine: "underline"
  },
  button: {
    backgroundColor: "#4338ca",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12
  },
  googleButton: {
    backgroundColor: "#db4437",
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
