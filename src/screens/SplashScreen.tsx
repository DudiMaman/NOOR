import React from 'react';
import { View } from 'react-native';

import { AppText } from '../components';

// Placeholder — implemented by the screen build pass.
export function SplashScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F6F3EC' }}>
      <AppText>SplashScreen</AppText>
    </View>
  );
}
