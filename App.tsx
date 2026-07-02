import 'react-native-gesture-handler';
import React, { useEffect, useMemo, useState } from 'react';
import { AppState } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreenNative from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import {
  IBMPlexSansArabic_300Light,
  IBMPlexSansArabic_400Regular,
  IBMPlexSansArabic_500Medium,
  IBMPlexSansArabic_600SemiBold,
  IBMPlexSansArabic_700Bold,
} from '@expo-google-fonts/ibm-plex-sans-arabic';
import { Amiri_400Regular, Amiri_700Bold } from '@expo-google-fonts/amiri';
import { useTranslation } from 'react-i18next';

import { initI18n } from './src/i18n';
import { RootNavigator } from './src/navigation/RootNavigator';
import { LanguageSuggestionSheet } from './src/components';
import { darkColors, lightColors, ThemeProvider, useTheme } from './src/theme';
import { useSettingsStore } from './src/store/useSettingsStore';
import { useSubscriptionStore } from './src/store/useSubscriptionStore';
import { useUserStore } from './src/store/useUserStore';
import { useContentStore } from './src/store/useContentStore';
import { rescheduleAll } from './src/services/notifications';
import { registerForPushToken } from './src/services/pushToken';

SplashScreenNative.preventAutoHideAsync().catch(() => {});

function makeNavTheme(scheme: 'light' | 'dark') {
  const palette = scheme === 'dark' ? darkColors : lightColors;
  return {
    ...DefaultTheme,
    dark: scheme === 'dark',
    colors: {
      ...DefaultTheme.colors,
      background: palette.cream,
      card: palette.card,
      primary: palette.emerald800,
      text: palette.ink,
      border: palette.hairline,
    },
  };
}

/** Wait for zustand/AsyncStorage rehydration before rendering navigation. */
function useStoresHydrated(): boolean {
  const allHydrated = () =>
    useSettingsStore.persist.hasHydrated() &&
    useSubscriptionStore.persist.hasHydrated() &&
    useUserStore.persist.hasHydrated() &&
    useContentStore.persist.hasHydrated();
  const [hydrated, setHydrated] = useState(allHydrated);
  useEffect(() => {
    if (hydrated) return;
    const check = () => {
      if (allHydrated()) setHydrated(true);
    };
    const unsubs = [
      useSettingsStore.persist.onFinishHydration(check),
      useSubscriptionStore.persist.onFinishHydration(check),
      useUserStore.persist.onFinishHydration(check),
      useContentStore.persist.onFinishHydration(check),
    ];
    check();
    return () => unsubs.forEach((unsub) => unsub());
  }, [hydrated]);
  return hydrated;
}

function AppInner() {
  const language = useSettingsStore((s) => s.language);
  const location = useSettingsStore((s) => s.location);
  const calcMethod = useSettingsStore((s) => s.calcMethod);
  const madhhab = useSettingsStore((s) => s.madhhab);
  const reminders = useSettingsStore((s) => s.reminders);
  const trialEndsAt = useSubscriptionStore((s) => s.trialEndsAt);
  const refreshSubscription = useSubscriptionStore((s) => s.refresh);

  useMemo(() => initI18n(language), [language]);
  const { t } = useTranslation();

  // Keep the trial status fresh when the app returns to the foreground.
  useEffect(() => {
    refreshSubscription();
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') refreshSubscription();
    });
    return () => sub.remove();
  }, [refreshSubscription]);

  // Rebuild the local notification schedule whenever its inputs change.
  useEffect(() => {
    rescheduleAll({ t, location, calcMethod, madhhab, reminders, trialEndsAt }).catch(() => {});
  }, [t, location, calcMethod, madhhab, reminders, trialEndsAt]);

  // Remote-push infrastructure: register the device token once (no-op on
  // simulators or until an EAS project is configured).
  const setPushToken = useSettingsStore((s) => s.setPushToken);
  useEffect(() => {
    registerForPushToken().then((token) => token && setPushToken(token));
  }, [setPushToken]);

  const { scheme } = useTheme();
  return (
    <NavigationContainer theme={makeNavTheme(scheme)}>
      <StatusBar style="light" />
      <RootNavigator />
      <LanguageSuggestionSheet />
    </NavigationContainer>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    IBMPlexSansArabic_300Light,
    IBMPlexSansArabic_400Regular,
    IBMPlexSansArabic_500Medium,
    IBMPlexSansArabic_600SemiBold,
    IBMPlexSansArabic_700Bold,
    Amiri_400Regular,
    Amiri_700Bold,
  });
  const hydrated = useStoresHydrated();
  const ready = fontsLoaded && hydrated;

  useEffect(() => {
    if (ready) SplashScreenNative.hideAsync().catch(() => {});
  }, [ready]);

  if (!ready) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AppInner />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
