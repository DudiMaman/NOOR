import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import {
  AppText,
  DiamondBullet,
  EmeraldRadialBackground,
  FadeUp,
  RadialGlow,
  StarLogo,
} from '../components';
import { colors } from '../theme';
import type { RootStackParamList } from '../navigation/types';
import { useUserStore } from '../store/useUserStore';

/** Hold on the wordmark before routing to the persisted flow stage. */
const HOLD_MS = 1800;

/** Loading dots — gold at descending opacities (design 1a). */
const LOADING_DOT_OPACITIES = [0.9, 0.45, 0.2];

/**
 * Splash (design 1a) — dark radial emerald background, gold glow, 8-point
 * star logo, "نور" wordmark and tagline. Auto-advances after ~1.8s to the
 * screen matching `useUserStore.flowStage`.
 */
export function SplashScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const flowStage = useUserStore((s) => s.flowStage);
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => {
      switch (flowStage) {
        case 'onboarding':
          navigation.replace('Onboarding');
          break;
        case 'quiz':
          navigation.replace('QuizGender');
          break;
        case 'auth':
          navigation.replace('AuthSignUp');
          break;
        case 'paywall':
          navigation.replace('TrialPaywall', { source: 'setup' });
          break;
        case 'location':
          navigation.replace('LocationSetup');
          break;
        case 'main':
          navigation.replace('Main');
          break;
      }
    }, HOLD_MS);
    return () => clearTimeout(timer);
  }, [flowStage, navigation]);

  return (
    <View style={styles.root}>
      <EmeraldRadialBackground />
      <RadialGlow size={340} opacity={0.22} style={styles.glow} />

      <View style={styles.spacerTop} />

      <FadeUp style={styles.center}>
        <StarLogo size={66} withDot dotSize={12} />
        {/* wordmark line-height token adds ~10px above/below the glyph box —
            margins compensate to keep the design's 28/14 optical gaps */}
        <AppText amiri size={64} lineHeight={84} color={colors.creamText} center style={styles.wordmark}>
          نور
        </AppText>
        <AppText size={15} color={colors.onDarkMuted} center style={styles.tagline}>
          {t('splash.tagline')}
        </AppText>
      </FadeUp>

      <View style={styles.spacerBottom} />

      <FadeUp delay={200} style={styles.footer}>
        <View style={styles.dotsRow}>
          {LOADING_DOT_OPACITIES.map((opacity, index) => (
            <View key={index} style={[styles.dot, { opacity }]} />
          ))}
        </View>
        <View style={styles.diamondRow}>
          <DiamondBullet size={10} outline color={colors.gold500} />
          <DiamondBullet size={10} outline color={colors.gold500} />
          <DiamondBullet size={10} outline color={colors.gold500} />
        </View>
      </FadeUp>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.emerald900,
    overflow: 'hidden',
  },
  glow: { top: 120, alignSelf: 'center' },
  spacerTop: { flex: 1 },
  spacerBottom: { flex: 1.2 },
  center: { alignItems: 'center' },
  wordmark: { marginTop: 18 },
  tagline: { marginTop: 4, letterSpacing: 0.3 },
  footer: { alignItems: 'center' },
  dotsRow: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.gold500,
  },
  diamondRow: { flexDirection: 'row', gap: 14, marginBottom: 56, opacity: 0.5 },
});
