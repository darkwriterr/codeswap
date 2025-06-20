import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type AvatarUploaderProps = {
  avatarUrl: string | null;
  onPress: () => void;
};

export default function AvatarUploader({ avatarUrl, onPress }: AvatarUploaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.avatarWrapper}>
        <Image
          source={{ uri: avatarUrl || 'https://placehold.co/100x100' }}
          style={styles.avatar}
        />
        <TouchableOpacity style={styles.iconButton} onPress={onPress}>
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
