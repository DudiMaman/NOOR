import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { createBottomTabNavigator, type BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import type { MainTabsParamList } from './types';
import { AppText } from '../components';
import { useTheme } from '../theme';
import { useIsPremium } from '../store/useSubscriptionStore';

import { HomeScreen } from '../screens/main/HomeScreen';
import { PrayerTimesScreen } from '../screens/main/PrayerTimesScreen';
import { QuranReaderScreen } from '../screens/main/QuranReaderScreen';
import { DailyContentScreen } from '../screens/main/DailyContentScreen';
import { SettingsScreen } from '../screens/main/SettingsScreen';

const Tab = createBottomTabNavigator<MainTabsParamList>();

/**
 * Tabs reachable without a subscription. Home is view-only; Settings must stay
 * reachable so a free user can always get to "manage subscription" (the
 * comparison paywall) and "restore purchase" — every feature row inside
 * Settings is individually gated.
 */
const FREE_TABS: (keyof MainTabsParamList)[] = ['Home', 'Settings'];

function TabIcon({ route, active }: { route: keyof MainTabsParamList; active: boolean }) {
  const { colors } = useTheme();
  const tint = active ? colors.emerald800 : colors.ink;
  switch (route) {
    case 'Home':
      return (
        <View
          style={{
            width: 11,
            height: 11,
            backgroundColor: active ? tint : 'transparent',
            borderWidth: active ? 0 : 1.5,
            borderColor: tint,
            transform: [{ rotate: '45deg' }],
            borderRadius: 2,
          }}
        />
      );
    case 'PrayerTimes':
      return (
        <View style={[styles.clockCircle, { borderColor: tint }]}>
          <View style={[styles.clockHand, { backgroundColor: tint }]} />
        </View>
      );
    case 'Quran':
      return <View style={[styles.bookIcon, { borderColor: tint }]} />;
    case 'DailyContent':
      return (
        <View
          style={{
            width: 12,
            height: 12,
            borderWidth: 1.5,
            borderColor: tint,
            borderRadius: 2,
            transform: [{ rotate: '45deg' }],
          }}
        />
      );
    case 'Settings':
      return (
        <View style={{ gap: 2.5 }}>
          <View style={[styles.menuLine, { backgroundColor: tint }]} />
          <View style={[styles.menuLine, { backgroundColor: tint }]} />
          <View style={[styles.menuLine, { backgroundColor: tint }]} />
        </View>
      );
  }
}

function NoorTabBar({ state, navigation }: BottomTabBarProps) {
  const { colors, scheme } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const isPremium = useIsPremium();

  const labels: Record<keyof MainTabsParamList, string> = {
    Home: t('tabs.home'),
    PrayerTimes: t('tabs.times'),
    Quran: t('tabs.quran'),
    DailyContent: t('tabs.content'),
    Settings: t('tabs.settings'),
  };

  const barBg = scheme === 'dark' ? 'rgba(11,29,22,0.92)' : 'rgba(246,243,236,0.92)';
  return (
    <BlurView
      intensity={40}
      tint={scheme === 'dark' ? 'dark' : 'light'}
      style={[
        styles.tabBar,
        { paddingBottom: Math.max(insets.bottom, 14), backgroundColor: barBg, borderTopColor: colors.hairline },
      ]}
    >
      {state.routes.map((route, index) => {
        const routeName = route.name as keyof MainTabsParamList;
        const active = state.index === index;
        const onPress = () => {
          // The paywall gate: every tab except Home requires entitlement.
          if (!isPremium && !FREE_TABS.includes(routeName)) {
            navigation.getParent()?.navigate('TrialPaywall', { source: 'gate' });
            return;
          }
          if (!active) navigation.navigate(route.name);
        };
        return (
          <Pressable key={route.key} onPress={onPress} style={styles.tabItem} hitSlop={6}>
            <View style={{ opacity: active ? 1 : 0.4, alignItems: 'center', gap: 4 }}>
              <View style={styles.iconBox}>
                <TabIcon route={routeName} active={active} />
              </View>
              <AppText size={10.5} weight={active ? 'bold' : 'regular'} color={active ? colors.emerald800 : colors.ink}>
                {labels[routeName]}
              </AppText>
            </View>
          </Pressable>
        );
      })}
    </BlurView>
  );
}

export function MainTabs() {
  const { colors } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.cream } }}
      tabBar={(props) => <NoorTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="PrayerTimes" component={PrayerTimesScreen} />
      <Tab.Screen name="Quran" component={QuranReaderScreen} />
      <Tab.Screen name="DailyContent" component={DailyContentScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 26,
    paddingTop: 10,
    borderTopWidth: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  tabItem: { alignItems: 'center', minWidth: 52 },
  iconBox: { height: 14, alignItems: 'center', justifyContent: 'center' },
  clockCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  clockHand: { width: 1.5, height: 4, marginTop: 1.5 },
  bookIcon: { width: 12, height: 13, borderWidth: 1.5, borderRadius: 3 },
  menuLine: { width: 12, height: 1.5, borderRadius: 1 },
});
