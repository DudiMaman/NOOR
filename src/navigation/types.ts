import type { NavigatorScreenParams } from '@react-navigation/native';

/** Bottom tabs of the main app. */
export type MainTabsParamList = {
  Home: undefined;
  PrayerTimes: undefined;
  Quran: undefined;
  DailyContent: undefined;
  Settings: undefined;
};

/** Root stack — setup flow, main tabs, and modals. */
export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  QuizGender: undefined;
  QuizAge: undefined;
  QuizGoals: undefined;
  QuizReligiosity: undefined;
  AuthSignUp: undefined;
  AuthSignIn: undefined;
  TrialPaywall: { source: 'setup' | 'gate' } | undefined;
  LocationSetup: { fromSettings?: boolean } | undefined;
  Main: NavigatorScreenParams<MainTabsParamList> | undefined;

  // Modals / pushed screens
  SubscriptionPaywall: undefined;
  Reminders: undefined;
  CustomsHolidays: undefined;
  AdhkarReader: { kind: 'morning' | 'evening' | 'afterPrayer' };
  PrayerGuide: { prayer: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha' };
  SurahList: undefined;
  Profile: undefined;
  LanguagePicker: undefined;
};

declare global {
  // Type-safe useNavigation() everywhere
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
