import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Animated,
  ScrollView,
  Appearance
} from 'react-native';
import ExpoCheckbox from 'expo-checkbox';
import { useRouter } from 'expo-router';

export default function Signup() {
  const router = useRouter();

  const [email, setEmail] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [knownLangs, setKnownLangs] = useState<string>('');
  const [wantedLangs, setWantedLangs] = useState<string>('');
  const [knownTags, setKnownTags] = useState<string[]>([]);
  const [wantedTags, setWantedTags] = useState<string[]>([]);
  const [agreed, setAgreed] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(Appearance.getColorScheme() === 'dark');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const bgColorAnim = useRef(new Animated.Value(darkMode ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    Animated.timing(bgColorAnim, {
      toValue: darkMode ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [darkMode, bgColorAnim]);

  const backgroundColor = bgColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#f2f4f8', '#1e1e1e'],
  });

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (text && !text.endsWith('@student.nhlstenden.com')) {
      setEmailError('Email must end in @student.nhlstenden.com');
    } else {
      setEmailError('');
    }
  };

  const handleTagInput = (text: string, type: 'known' | 'wanted') => {
    if (text.endsWith(' ')) {
      const tag = text.trim();
      if (tag.length > 0) {
        if (type === 'known') {
          setKnownTags([...knownTags, tag]);
          setKnownLangs('');
        } else {
          setWantedTags([...wantedTags, tag]);
          setWantedLangs('');
        }
      }
    } else {
      if (type === 'known') setKnownLangs(text);
      else setWantedLangs(text);
    }
  };

  const renderTags = (tags: string[]) => {
    return tags.map((tag, index) => (
      <View key={index} style={styles.tag}>
        <Text style={styles.tagText}>{tag}</Text>
      </View>
    ));
  };

  return (
    <Animated.View style={[styles.container, { backgroundColor }]}>
      <Switch
        value={darkMode}
        onValueChange={setDarkMode}
        style={{ alignSelf: 'flex-end', marginBottom: 10 }}
      />

      <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
        <ScrollView keyboardShouldPersistTaps="handled">

          <Text style={[styles.title, darkMode ? darkStyles.text : lightStyles.text]}>
            Create Account
          </Text>

          <TextInput
            style={[styles.input, darkMode ? darkStyles.input : lightStyles.input]}
            placeholder="Email"
            placeholderTextColor={darkMode ? '#999' : '#555'}
            value={email}
            onChangeText={handleEmailChange}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

          <TextInput
            style={[styles.input, darkMode ? darkStyles.input : lightStyles.input]}
            placeholder="Password"
            placeholderTextColor={darkMode ? '#999' : '#555'}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Text style={[styles.label, darkMode ? darkStyles.text : lightStyles.text]}>
            Known Programming Languages
          </Text>
          <View style={styles.tagContainer}>{renderTags(knownTags)}</View>
          <TextInput
            style={[styles.input, darkMode ? darkStyles.input : lightStyles.input]}
            placeholder="e.g. Java "
            placeholderTextColor={darkMode ? '#999' : '#555'}
            value={knownLangs}
            onChangeText={(text) => handleTagInput(text, 'known')}
            autoCapitalize="none"
          />

          <Text style={[styles.label, darkMode ? darkStyles.text : lightStyles.text]}>
            Languages You Want to Learn
          </Text>
          <View style={styles.tagContainer}>{renderTags(wantedTags)}</View>
          <TextInput
            style={[styles.input, darkMode ? darkStyles.input : lightStyles.input]}
            placeholder="e.g. Python "
            placeholderTextColor={darkMode ? '#999' : '#555'}
            value={wantedLangs}
            onChangeText={(text) => handleTagInput(text, 'wanted')}
            autoCapitalize="none"
          />

          <View style={styles.termsContainer}>
            <ExpoCheckbox
              value={agreed}
              onValueChange={setAgreed}
              color={agreed ? '#007bff' : undefined}
              style={{ marginRight: 6 }}
            />
            <Text style={darkMode ? darkStyles.text : lightStyles.text}>
              I agree to the <Text style={styles.link}>Terms of Service</Text> and{' '}
              <Text style={styles.link}>Privacy Policy</Text>
            </Text>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/(tabs)/signin')}
            disabled={!email || !!emailError || !password || !agreed}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 100,
    paddingBottom: 60,
    flex: 1,
  },
  logo: {
    width: 100,
    height: 100,
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
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  link: {
    color: '#007bff',
    textDecorationLine: 'underline',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 6,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  tag: {
    backgroundColor: '#007bff',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    color: '#fff',
    fontSize: 14,
  },
});

const lightStyles = StyleSheet.create({
  text: {
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    color: '#000',
  },
});

const darkStyles = StyleSheet.create({
  text: {
    color: '#fff',
  },
  input: {
    backgroundColor: '#2a2a2a',
    color: '#fff',
  },
});
