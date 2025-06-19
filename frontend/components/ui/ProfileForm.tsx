import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

import AvatarUploader from './AvatarUploader';
import ProfileBioInput from './ProfileBioInput';
import LanguageSelector from './LanguageSelector';
import LearningStyleSelector from './LearningStyleSelector';
import AvailabilityInput from './AvailabilityInput';

export default function ProfileForm() {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [bio, setBio] = useState('');
  const [languagesKnown, setLanguagesKnown] = useState<string[]>([]);
  const [languagesLearning, setLanguagesLearning] = useState<string[]>([]);
  const [learningStyle, setLearningStyle] = useState('');
  const [availability, setAvailability] = useState('');

  const router = useRouter();

  // TODO: implement real avatar picker
  const handleAvatarPress = () => {
    // here you can implement image picker logic
  };

  const toggleLang = (arr: string[], lang: string, setter: (v: string[]) => void) => {
    setter(arr.includes(lang) ? arr.filter(l => l !== lang) : [...arr, lang]);
  };

  const goToHome = () => {
    router.push('/');
  };

  return (
    <View
      style={{
        backgroundColor: '#1b1e31',
        borderRadius: 22,
        padding: 20,
        margin: 10,
        shadowColor: '#000',
        shadowOpacity: 0.16,
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 12,
      }}
    >
      <Text
        style={{
          color: '#fff',
          fontWeight: 'bold',
          fontSize: 20,
          marginBottom: 4,
          alignSelf: 'center',
        }}
      >
        Set up your learning profile
      </Text>
      <Text
        style={{
          color: '#b0b5c9',
          textAlign: 'center',
          marginBottom: 16,
        }}
      >
        Let others know what you can teach and what you want to learn
      </Text>
      <AvatarUploader avatarUrl={avatar} onPress={handleAvatarPress} />
      <ProfileBioInput value={bio} onChange={setBio} />
      <LanguageSelector
        selected={languagesKnown}
        onSelect={lang => toggleLang(languagesKnown, lang, setLanguagesKnown)}
        label="Programming languages you know"
      />
      <LanguageSelector
        selected={languagesLearning}
        onSelect={lang => toggleLang(languagesLearning, lang, setLanguagesLearning)}
        label="Programming languages you want to learn"
      />
      <LearningStyleSelector value={learningStyle} onSelect={setLearningStyle} />
      <AvailabilityInput value={availability} onChange={setAvailability} />

      <TouchableOpacity
        onPress={goToHome}
        style={{
          backgroundColor: '#405be4',
          borderRadius: 12,
          padding: 15,
          alignItems: 'center',
          marginTop: 8,
          marginBottom: 8,
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 17 }}>
          Continue to Dashboard
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={goToHome}
        style={{
          borderColor: '#405be4',
          borderWidth: 2,
          borderRadius: 12,
          padding: 15,
          alignItems: 'center',
          marginBottom: 6,
        }}
      >
        <Text style={{ color: '#405be4', fontWeight: 'bold', fontSize: 17 }}>
          Save & Finish Later
        </Text>
      </TouchableOpacity>
    </View>
  );
}
