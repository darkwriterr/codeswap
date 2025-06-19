import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const STYLES = ['1-on-1', 'Group', 'Flexible'];

interface LearningStyleSelectorProps {
  value: string;
  onSelect: (v: string) => void;
}

export default function LearningStyleSelector({ value, onSelect }: LearningStyleSelectorProps) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ color: '#b0b5c9', fontSize: 16, marginBottom: 8 }}>Preferred learning style</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {STYLES.map(style => (
          <TouchableOpacity
            key={style}
            onPress={() => onSelect(style)}
            style={{
              flex: 1,
              backgroundColor: value === style ? '#405be4' : '#242849',
              marginHorizontal: 4,
              paddingVertical: 12,
              borderRadius: 10,
              alignItems: 'center'
            }}
          >
            <Text style={{ color: value === style ? '#fff' : '#b0b5c9', fontWeight: 'bold' }}>{style}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
