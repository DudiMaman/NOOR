import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { RootStackParamList } from './types';
import { MainTabs } from './MainTabs';
import { useTheme } from '../theme';

import { SplashScreen } from '../screens/SplashScreen';
import { OnboardingScreen } from '../screens/onboarding/OnboardingScreen';
import { QuizGenderScreen } from '../screens/quiz/QuizGenderScreen';
import { QuizAgeScreen } from '../screens/quiz/QuizAgeScreen';
import { QuizGoalsScreen } from '../screens/quiz/QuizGoalsScreen';
import { QuizReligiosityScreen } from '../screens/quiz/QuizReligiosityScreen';
import { SignUpScreen } from '../screens/auth/SignUpScreen';
import { SignInScreen } from '../screens/auth/SignInScreen';
import { TrialPaywallScreen } from '../screens/paywall/TrialPaywallScreen';
import { SubscriptionPaywallScreen } from '../screens/paywall/SubscriptionPaywallScreen';
import { LocationSetupScreen } from '../screens/LocationSetupScreen';
import { RemindersScreen } from '../screens/RemindersScreen';
import { CustomsHolidaysScreen } from '../screens/main/CustomsHolidaysScreen';
import { AdhkarReaderScreen } from '../screens/reader/AdhkarReaderScreen';
import { PrayerGuideScreen } from '../screens/reader/PrayerGuideScreen';
import { SurahListScreen } from '../screens/main/SurahListScreen';
import { ProfileScreen } from '../screens/settings/ProfileScreen';
import { LanguagePickerScreen } from '../screens/settings/LanguagePickerScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { colors } = useTheme();
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.cream },
        animation: 'slide_from_right',
      }}
    >
      {/* Setup flow */}
      <Stack.Screen name="Splash" component={SplashScreen} options={{ animation: 'fade' }} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ animation: 'fade' }} />
      <Stack.Screen name="QuizGender" component={QuizGenderScreen} />
      <Stack.Screen name="QuizAge" component={QuizAgeScreen} />
      <Stack.Screen name="QuizGoals" component={QuizGoalsScreen} />
      <Stack.Screen name="QuizReligiosity" component={QuizReligiosityScreen} />
      <Stack.Screen name="AuthSignUp" component={SignUpScreen} />
      <Stack.Screen name="AuthSignIn" component={SignInScreen} />
      <Stack.Screen name="LocationSetup" component={LocationSetupScreen} />

      {/* Main app */}
      <Stack.Screen name="Main" component={MainTabs} options={{ animation: 'fade' }} />

      {/* Paywalls */}
      <Stack.Screen
        name="TrialPaywall"
        component={TrialPaywallScreen}
        options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name="SubscriptionPaywall"
        component={SubscriptionPaywallScreen}
        options={{ presentation: 'modal' }}
      />

      {/* Pushed feature screens */}
      <Stack.Screen name="Reminders" component={RemindersScreen} />
      <Stack.Screen name="CustomsHolidays" component={CustomsHolidaysScreen} />
      <Stack.Screen name="AdhkarReader" component={AdhkarReaderScreen} />
      <Stack.Screen name="PrayerGuide" component={PrayerGuideScreen} />
      <Stack.Screen name="SurahList" component={SurahListScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="LanguagePicker" component={LanguagePickerScreen} />
    </Stack.Navigator>
  );
}
