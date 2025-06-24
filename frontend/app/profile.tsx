import React, { useEffect, useState } from 'react';
import {
  View,
  Keyboard,
  TouchableWithoutFeedback,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Header from '@/components/ui/Header';
import ProfileForm from '../components/ui/ProfileForm';
import { getCredentials } from '../lib/auth';
import { getInformation } from '../lib/api';
import { useRouter } from 'expo-router';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function ProfileScreen() {
  const [userData, setUserData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const loadProfile = async () => {
      const { email, password } = await getCredentials();
      if (!email || !password) {
        Alert.alert("You must be logged in.");
        router.replace("/(auth)/login");
        return;
      }

      try {
        const res = await getInformation(email, password);
        setUserData(res.data);
      } catch (err) {
        console.error(err);
        Alert.alert("Failed to load profile.");
      }
    };

    loadProfile();
  }, []);

  const handleSave = async (updatedData: any) => {
    const { email, password } = await getCredentials();
    if (!email || !password) return;

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      if (updatedData.avatar?.startsWith("file://")) {
        formData.append("avatar", {
          uri: updatedData.avatar,
          name: "avatar.jpg",
          type: "image/jpeg",
        } as any);
      }

      formData.append("userData", JSON.stringify(updatedData));

      const response = await fetch(`${API_URL}/add_information`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Failed to update profile");
      }

      router.replace("/")
    } catch (err) {
      console.error(err);
      Alert.alert("Failed to update profile.");
    }
  };

  if (!userData) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#141627' }} edges={['left', 'right']}>
      <Header />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAwareScrollView
          enableOnAndroid
          extraScrollHeight={40}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View style={{ width: '100%', alignItems: 'center' }}>
            <ProfileForm initialData={userData} onSave={handleSave} />
          </View>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
