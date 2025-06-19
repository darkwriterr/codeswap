import React from 'react';
import { View, Text, TextInput } from 'react-native';

interface ProfileBioInputProps {
  value: string;
  onChange: (text: string) => void;
}

export default function ProfileBioInput({ value, onChange }: ProfileBioInputProps) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ color: '#b0b5c9', fontSize: 16, marginBottom: 8 }}>Short bio</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="Tell us about yourself in 2–3 sentences…"
        placeholderTextColor="#b0b5c9"
        multiline
        style={{
          backgroundColor: '#22273c',
          color: 'white',
          borderRadius: 10,
          padding: 12,
          fontSize: 15,
          minHeight: 60
        }}
      />
    </View>
  );
}
