import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

import AvatarUploader from './AvatarUploader';
import ProfileBioInput from './ProfileBioInput';
import LanguageSelector from './LanguageSelector';
import LearningStyleSelector from './LearningStyleSelector';
import AvailabilityInput from './AvailabilityInput';

import { useProfile } from '../../contexts/ProfileContext';

export default function ProfileForm() {
  const router = useRouter();
  const { profile, updateProfile } = useProfile();

  const [avatar, setAvatar] = useState<string | null>(profile.avatar);
  const [bio, setBio] = useState(profile.bio);
  const [languagesKnown, setLanguagesKnown] = useState(profile.languagesKnown);
  const [languagesLearning, setLanguagesLearning] = useState(profile.languagesLearning);
  const [learningStyle, setLearningStyle] = useState(profile.learningStyle);
  const [availability, setAvailability] = useState(profile.availability);

  useEffect(() => {
    setAvatar(profile.avatar);
    setBio(profile.bio);
    setLanguagesKnown(profile.languagesKnown);
    setLanguagesLearning(profile.languagesLearning);
    setLearningStyle(profile.learningStyle);
    setAvailability(profile.availability);
  }, [profile]);

  const toggleLang = (arr: string[], lang: string, setter: (v: string[]) => void) => {
    if (arr.includes(lang)) {
      setter(arr.filter(l => l !== lang));
    } else {
      setter([...arr, lang]);
    }
  };

const handleAvatarPress = async () => {
  const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permissionResult.granted) {
    Alert.alert("Permission required", "Please allow photo library access.");
    return;
  }

  const pickerResult = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });

  if (!pickerResult.canceled && pickerResult.assets?.length > 0) {
    const selected = pickerResult.assets[0].uri;
    setAvatar(selected);
    updateProfile({ avatar: selected });
  }
};

  const saveProfile = () => {
    updateProfile({
      avatar,
      bio,
      languagesKnown,
      languagesLearning,
      learningStyle,
      availability,
    });
  };

  const goToDashboard = () => {
    saveProfile();
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
        onPress={goToDashboard}
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
        onPress={saveProfile}
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
