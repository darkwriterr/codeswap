import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Pressable
} from 'react-native';
import { Provider as PaperProvider, Checkbox } from 'react-native-paper';

type TagInputProps = {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
  placeholder: string;
};

const TagInput: React.FC<TagInputProps> = ({ tags, setTags, placeholder }) => {
  const [text, setText] = useState<string>('');

  const handleKeyPress = ({ nativeEvent }: { nativeEvent: any }) => {
    if (nativeEvent.key === ' ' && text.trim()) {
      setTags([...tags, text.trim()]);
      setText('');
    }
  };

  const removeTag = (index: number) => {
    const updated = [...tags];
    updated.splice(index, 1);
    setTags(updated);
  };

  return (
    <View style={styles.tagInputContainer}>
      {tags.map((tag, index) => (
        <View key={index} style={styles.tag}>
          <Text style={styles.tagText}>{tag}</Text>
          <Pressable onPress={() => removeTag(index)}>
            <Text style={styles.tagRemove}>×</Text>
          </Pressable>
        </View>
      ))}
      <TextInput
        style={styles.tagTextInput}
        value={text}
        onChangeText={setText}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
      />
    </View>
  );
};

const Signup: React.FC = () => {
  const [isChecked, setChecked] = useState<boolean>(false);
  const [knownLanguages, setKnownLanguages] = useState<string[]>([]);
  const [learningLanguages, setLearningLanguages] = useState<string[]>([]);

  return (
    <PaperProvider>
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={require('../assets/images/logo.png')} style={styles.logo} />
        <Text style={styles.title}>CodeSwap</Text>
        <Text style={styles.subtitle}>Create your account</Text>

        <TextInput style={styles.input} placeholder="Full Name" placeholderTextColor="#9CA3AF" />
        <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" placeholderTextColor="#9CA3AF" />
        <TextInput style={styles.input} placeholder="Password" secureTextEntry placeholderTextColor="#9CA3AF" />
        <TextInput style={styles.input} placeholder="Confirm Password" secureTextEntry placeholderTextColor="#9CA3AF" />

        <Text style={styles.label}>Known Programming Languages</Text>
        <TagInput tags={knownLanguages} setTags={setKnownLanguages} placeholder="Type and press space" />

        <Text style={styles.label}>Languages You Want to Learn</Text>
        <TagInput tags={learningLanguages} setTags={setLearningLanguages} placeholder="Type and press space" />

        <View style={styles.checkboxContainer}>
          <Checkbox
            status={isChecked ? 'checked' : 'unchecked'}
            onPress={() => setChecked(!isChecked)}
            color="#2563EB"
          />
          <Text style={styles.checkboxText}>
            I agree to the <Text style={styles.link}>Terms of Service</Text> and <Text style={styles.link}>Privacy Policy</Text>
          </Text>
        </View>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Already have an account? <Text style={styles.link}>Log in</Text>
        </Text>
      </ScrollView>
    </PaperProvider>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 40,
  },
  logo: {
    width: 70,
    height: 70,
    marginBottom: 16,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: '#6B7280',
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    marginBottom: 12,
    fontSize: 16,
    color: '#111827',
  },
  label: {
    alignSelf: 'flex-start',
    fontWeight: '600',
    color: '#374151',
    marginTop: 12,
    marginBottom: 4,
  },
  tagInputContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#fff',
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    width: '100%',
    marginBottom: 12,
  },
  tag: {
    flexDirection: 'row',
    backgroundColor: '#2563EB',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    margin: 4,
    alignItems: 'center',
  },
  tagText: {
    color: 'white',
    fontSize: 14,
    marginRight: 6,
  },
  tagRemove: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    paddingHorizontal: 4,
  },
  tagTextInput: {
    flex: 1,
    minWidth: 100,
    fontSize: 16,
    padding: 4,
    margin: 4,
    color: '#111827',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
  },
  checkboxText: {
    marginLeft: 8,
    color: '#374151',
    fontSize: 14,
    flex: 1,
    flexWrap: 'wrap',
  },
  link: {
    color: '#2563EB',
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
  },
});