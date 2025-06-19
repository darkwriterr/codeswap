import React from 'react';
import {
  View,
  Keyboard,
  TouchableWithoutFeedback,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ProfileForm from '../components/ui/ProfileForm';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#141627' }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAwareScrollView
        enableOnAndroid
        extraScrollHeight={40}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: 40,
        }}
        >
  <View style={{ width: '100%', alignItems: 'center' }}>
    <ProfileForm />
  </View>
</KeyboardAwareScrollView>

      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
