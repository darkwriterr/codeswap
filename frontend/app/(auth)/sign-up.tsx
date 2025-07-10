import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Pressable
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
  const [showTerms, setShowTerms] = useState(false);

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
          <Text style={styles.checkboxLabel}>I agree to the </Text>
          <TouchableOpacity onPress={() => setShowTerms(true)}>
            <Text style={[styles.checkboxLabel, styles.link]}>
              Terms of Service and Privacy Policy
            </Text>
          </TouchableOpacity>
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

        {/* Модальное окно с условиями */}
        <Modal
            visible={showTerms}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowTerms(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ScrollView>
                <Text style={styles.modalTitle}>Terms of Service & Privacy Policy</Text>
                <Text style={styles.modalText}>
                  { }

                  <Text style={styles.modalText}>
                    Welcome to CodeSwap! By creating an account and using our platform, you agree to abide by these Terms of Service and Privacy Policy. CodeSwap is provided “as-is” with no warranties; you use it at your own risk.
                    {"\n\n"}
                    We respect your privacy and collect only the information necessary to deliver and improve our services—such as your name, email, profile details, and usage data. All data is encrypted in transit and stored securely.
                    {"\n\n"}
                    You retain ownership of any code or content you upload, and you grant us a perpetual, non-exclusive license to display and share it within the app. Please do not post anything unlawful or infringing on others’ rights.
                    {"\n\n"}
                    We may update these terms from time to time; continued use after changes constitutes acceptance. For questions or concerns, contact us at privacy@codeswap.example.com.
                  </Text>

                </Text>
              </ScrollView>
              <Pressable style={styles.closeButton} onPress={() => setShowTerms(false)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
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
    flexWrap: "wrap",
    marginBottom: 16
  },
  checkboxLabel: {
    marginLeft: 8,
    color: "#ccc"
  },
  link: {
    color: "#60a5fa",
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
  },
  error: {
    backgroundColor: "#dc2626",
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
    color: "#fff",
    textAlign: "center"
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    padding: 20
  },
  modalContent: {
    backgroundColor: "#111",
    borderRadius: 8,
    maxHeight: "80%",
    padding: 16
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#fff",
    textAlign: "center"
  },
  modalText: {
    fontSize: 14,
    color: "#ddd",
    lineHeight: 20
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: "#4338ca",
    padding: 12,
    borderRadius: 6,
    alignItems: "center"
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold"
  }
});
