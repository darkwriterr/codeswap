import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ProfileData {
  avatar: string | null;
  bio: string;
  languagesKnown: string[];
  languagesLearning: string[];
  learningStyle: string;
  availability: string;
}

interface ProfileContextType {
  profile: ProfileData;
  updateProfile: (data: Partial<ProfileData>) => void;
}

const defaultProfile: ProfileData = {
  avatar: null,
  bio: '',
  languagesKnown: [],
  languagesLearning: [],
  learningStyle: '',
  availability: '',
};

const ProfileContext = createContext<ProfileContextType>({
  profile: defaultProfile,
  updateProfile: () => {},
});

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);

  useEffect(() => {
    const loadProfile = async () => {
      const stored = await AsyncStorage.getItem('@user_profile');
      if (stored) {
        setProfile(JSON.parse(stored));
      }
    };
    loadProfile();
  }, []);

  const updateProfile = (data: Partial<ProfileData>) => {
    setProfile((prev) => {
      const updated = { ...prev, ...data };
      AsyncStorage.setItem('@user_profile', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};
