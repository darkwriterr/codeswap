import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const LANGUAGES = ['JavaScript', 'Python', 'Java', 'C++', 'C#', 'Ruby', 'PHP', 'SQL', 'Other'];
const COLORS = ['#f6c338', '#43a0e5', '#f38d51', '#5a8dee', '#ac68e2', '#e15692', '#aaa8e1', '#25c381', '#7d7e84'];

interface LanguageSelectorProps {
  selected: string[];
  onSelect: (lang: string) => void;
  label: string;
}

export default function LanguageSelector({ selected, onSelect, label }: LanguageSelectorProps) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ color: '#b0b5c9', fontSize: 16, marginBottom: 8 }}>{label}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {LANGUAGES.map((lang, idx) => (
          <TouchableOpacity
            key={lang}
            onPress={() => onSelect(lang)}
            style={{
              backgroundColor: selected.includes(lang) ? COLORS[idx] : '#242849',
              borderRadius: 20,
              paddingHorizontal: 12,
              paddingVertical: 6,
              margin: 4
            }}
          >
            <Text style={{
              color: selected.includes(lang) ? '#fff' : COLORS[idx],
              fontWeight: 'bold'
            }}>{lang}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
