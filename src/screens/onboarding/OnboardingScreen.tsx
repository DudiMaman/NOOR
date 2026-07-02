import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  AppText,
  FadeUp,
  GlassChip,
  GoldButton,
  KickerLabel,
  PrimaryButton,
} from '../../components';
import { colors, radii, shadows } from '../../theme';
import type { RootStackParamList } from '../../navigation/types';
import { useUserStore } from '../../store/useUserStore';
import { ContentHero, ExperienceHero, RemindersHero, TimesHero } from './heroes';

const PAGE_COUNT = 4;

/**
 * Onboarding (design 2a–2d) — one screen, four animated value pages.
 * Full-bleed animated hero per page, glass skip chip, and a cream bottom
 * sheet whose content re-runs the FadeUp stagger on every page change.
 */
export function OnboardingScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const setFlowStage = useUserStore((s) => s.setFlowStage);
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [page, setPage] = useState(0);

  const stepKey = `onboarding.s${page + 1}`;
  const isLast = page === PAGE_COUNT - 1;

  const finish = () => {
    setFlowStage('quiz');
    navigation.replace('QuizGender');
  };
  const next = () => {
    if (isLast) finish();
    else setPage(page + 1);
  };

  return (
    <View style={styles.root}>
      {/* hero */}
      {page === 0 && <TimesHero />}
      {page === 1 && <RemindersHero />}
      {page === 2 && <ContentHero />}
      {page === 3 && <ExperienceHero />}

      {/* skip */}
      <View style={[styles.skip, { top: insets.top + 14 }]}>
        <GlassChip
          softBorder
          label={t('common.skip')}
          labelSize={13.5}
          labelWeight="medium"
          labelColor="rgba(245,238,220,0.85)"
          onPress={finish}
          style={styles.skipChip}
        />
      </View>

      {/* bottom sheet */}
      <View style={[styles.sheet, shadows.sheet]}>
        {/* key={page} remounts the stagger on page change */}
        <View key={page}>
          <FadeUp delay={50}>
            <KickerLabel label={t(`${stepKey}.kicker`)} />
          </FadeUp>
          <FadeUp delay={150}>
            <AppText weight="bold" size={27} lineHeight={39} color={colors.ink} style={styles.title}>
              {t(`${stepKey}.title`)}
            </AppText>
          </FadeUp>
          <FadeUp delay={280}>
            <AppText size={15.5} lineHeight={28} color={colors.muted} style={styles.body}>
              {t(`${stepKey}.body`)}
            </AppText>
          </FadeUp>
          <FadeUp delay={400} style={styles.progressRow}>
            <View style={styles.dotsRow}>
              {Array.from({ length: PAGE_COUNT }, (_, i) => (
                <View key={i} style={i === page ? styles.dotActive : styles.dot} />
              ))}
            </View>
            <AppText weight="semibold" size={12.5} color={colors.faint} style={styles.counter}>
              {`${page + 1} / ${PAGE_COUNT}`}
            </AppText>
          </FadeUp>
          <FadeUp delay={500} style={styles.ctaWrap}>
            {isLast ? (
              <GoldButton
                label={t('onboarding.s4.letsStart')}
                onPress={finish}
                height={58}
                withArrow
                shimmer
              />
            ) : (
              <PrimaryButton
                label={t('common.continue')}
                onPress={next}
                height={58}
                withArrow
                shimmer
              />
            )}
          </FadeUp>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.emerald900,
    overflow: 'hidden',
  },
  skip: { position: 'absolute', left: 22 },
  skipChip: { paddingVertical: 7 },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.cream,
    borderTopStartRadius: radii.sheet,
    borderTopEndRadius: radii.sheet,
    paddingTop: 30,
    paddingHorizontal: 26,
    paddingBottom: 48,
  },
  title: { marginTop: 10 },
  body: { marginTop: 10 },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  dotsRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.trackOff,
  },
  dotActive: {
    width: 28,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.gold500,
  },
  counter: { writingDirection: 'ltr' },
  ctaWrap: { marginTop: 16 },
});
