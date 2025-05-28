import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Appearance,
  Switch,
  Animated,
  ScrollView,
} from 'react-native';
import Checkbox from 'expo-checkbox';

export default function App() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [knownLangs, setKnownLangs] = useState('');
  const [desiredLangs, setDesiredLangs] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(Appearance.getColorScheme() === 'dark');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const bgColorAnim = useRef(new Animated.Value(darkMode ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    Animated.timing(bgColorAnim, {
      toValue: darkMode ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [darkMode]);

  const backgroundColor = bgColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#f2f4f8', '#1e1e1e'],
  });

  const theme = darkMode ? styles.dark : styles.light;

  const handleSignUp = () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!agreeTerms) {
      setError('You must agree to the terms');
      return;
    }
    setError('');
    console.log('Signed up!');
  };

  return (
    <Animated.ScrollView style={{ flex: 1, backgroundColor }}>
      <View style={styles.container}>
        <Switch
          value={darkMode}
          onValueChange={setDarkMode}
          style={{ alignSelf: 'flex-end', marginBottom: 10 }}
        />

        <Animated.View style={{ opacity: fadeAnim }}>
          <Image
            source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }}
            style={styles.logo}
          />

          <Text style={[styles.title, theme.text]}>Create Your Account</Text>

          <TextInput
            style={[styles.input, theme.input]}
            placeholder="Full Name"
            placeholderTextColor={darkMode ? "#999" : "#555"}
            value={fullName}
            onChangeText={setFullName}
          />

          <TextInput
            style={[styles.input, theme.input]}
            placeholder="Email"
            placeholderTextColor={darkMode ? "#999" : "#555"}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <TextInput
            style={[styles.input, theme.input]}
            placeholder="Password"
            placeholderTextColor={darkMode ? "#999" : "#555"}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TextInput
            style={[styles.input, theme.input]}
            placeholder="Confirm Password"
            placeholderTextColor={darkMode ? "#999" : "#555"}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <TextInput
            style={[styles.input, theme.input]}
            placeholder="Known Programming Languages"
            placeholderTextColor={darkMode ? "#999" : "#555"}
            value={knownLangs}
            onChangeText={setKnownLangs}
          />

          <TextInput
            style={[styles.input, theme.input]}
            placeholder="Languages You Want to Learn"
            placeholderTextColor={darkMode ? "#999" : "#555"}
            value={desiredLangs}
            onChangeText={setDesiredLangs}
          />

          <View style={styles.termsContainer}>
            <Checkbox
              value={agreeTerms}
              onValueChange={setAgreeTerms}
              color={agreeTerms ? '#007bff' : undefined}
              style={{ marginRight: 6 }}
            />
            <Text style={[theme.text, { flex: 1 }]}>
              I agree to the{' '}
              <Text style={styles.link}>Terms of Service</Text> and{' '}
              <Text style={styles.link}>Privacy Policy</Text>
            </Text>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 100, // Moved content lower
    paddingBottom: 60,
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  light: {
    background: { backgroundColor: '#f2f4f8' },
    text: { color: '#333' },
    input: { backgroundColor: '#fff', color: '#000' },
  },
  dark: {
    background: { backgroundColor: '#1e1e1e' },
    text: { color: '#fff' },
    input: { backgroundColor: '#2a2a2a', color: '#fff' },
  },
  logo: {
    width: 60,
    height: 60,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  input: {
    padding: 14,
    borderRadius: 10,
    marginBottom: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 80,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginTop: 6,
    marginBottom: 10,
    textAlign: 'center',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  link: {
    color: '#007bff',
    textDecorationLine: 'underline',
  },
});
