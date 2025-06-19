import React, { useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function AvatarUploader() {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    // Ask for permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Media access is needed to upload your profile picture.');
      return;
    }

    // Open image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Square crop
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatarWrapper}>
        <Image
          source={{ uri: image || 'https://placehold.co/100x100' }}
          style={styles.avatar}
        />
        <TouchableOpacity style={styles.iconButton} onPress={pickImage}>
          <Ionicons name="camera" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    marginBottom: 24,
    alignItems: 'center',
  },
  avatarWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#1f253c',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  iconButton: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#4755f0',
    borderRadius: 16,
    padding: 4,
    borderWidth: 2,
    borderColor: '#141627',
    elevation: 3,
  },
});
