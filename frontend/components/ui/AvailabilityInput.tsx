import React from 'react';
import { View, Text, TextInput } from 'react-native';

interface AvailabilityInputProps {
  value: string;
  onChange: (text: string) => void;
}

export default function AvailabilityInput({ value, onChange }: AvailabilityInputProps) {
  return (
    <View style={{ marginBottom: 24 }}>
      <Text style={{ color: '#b0b5c9', fontSize: 16, marginBottom: 8 }}>Availability</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="E.g. Weekdays after 6pm, Sat mornings"
        placeholderTextColor="#b0b5c9"
        style={{
          backgroundColor: '#22273c',
          color: 'white',
          borderRadius: 10,
          padding: 12,
          fontSize: 15
        }}
      />
    </View>
  );
}
