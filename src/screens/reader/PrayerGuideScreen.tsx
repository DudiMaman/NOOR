import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../../navigation/types';
import { AppText, Card, RadialGlow } from '../../components';
import { PRAYER_GUIDES } from '../../content/prayerGuides';
import { colors, gradients, radii, shadows } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'PrayerGuide'>;

/**
 * Prayer guide — a step-by-step "how to pray" walkthrough for one of the five
 * daily prayers. Every step carries its full recitation so a worshipper can
 * pray directly from the page. Sacred texts render verbatim from content.
 */
export function PrayerGuideScreen({ navigation, route }: Props) {
  const { prayer } = route.params;
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const guide = PRAYER_GUIDES[prayer];

  return (
    <View style={[styles.root, { paddingTop: insets.top + 14 }]}>
      {/* Back */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('common.back')}
        hitSlop={8}
        onPress={() => navigation.goBack()}
        style={({ pressed }) => [styles.backCircle, pressed && styles.pressedDim]}
      >
        <AppText weight="bold" size={17} color={colors.emerald800}>
          ›
        </AppText>
      </Pressable>

      {/* Ornament header */}
      <LinearGradient
        colors={gradients.heroCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.35, y: 1 }}
        style={styles.header}
      >
        <RadialGlow size={240} opacity={0.22} style={{ top: -50 }} />
        <View style={[styles.cornerDiamond, { right: 16 }]} />
        <View style={[styles.cornerDiamond, { left: 16 }]} />
        <AppText weight="bold" size={12} color={colors.gold300} style={styles.kicker}>
          {t('reader.howToPray')}
        </AppText>
        <AppText amiri size={27} color={colors.creamText} center style={styles.title}>
          {t(`prayers.${prayer}`)}
        </AppText>
        <AppText size={11.5} color="rgba(245,238,220,0.6)" center style={styles.headerSub}>
          {t('reader.rakaat', { count: guide.rakaat })}
        </AppText>
        {guide.note ? (
          <AppText size={13} color={colors.onDarkMuted} center lineHeight={22} style={styles.note}>
            {guide.note}
          </AppText>
        ) : null}
      </LinearGradient>

      {/* Sunnah rak'ahs chips */}
      {(guide.sunnahBefore != null || guide.sunnahAfter != null) && (
        <View style={styles.chipsRow}>
          {guide.sunnahBefore != null && (
            <View style={styles.chip}>
              <AppText weight="medium" size={12} color={colors.inkBody}>
                {`سنة قبلية · ${t('reader.rakaat', { count: guide.sunnahBefore })}`}
              </AppText>
            </View>
          )}
          {guide.sunnahAfter != null && (
            <View style={styles.chip}>
              <AppText weight="medium" size={12} color={colors.inkBody}>
                {`سنة بعدية · ${t('reader.rakaat', { count: guide.sunnahAfter })}`}
              </AppText>
            </View>
          )}
        </View>
      )}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {guide.steps.map((step, index) => (
          <Card key={`${guide.prayer}-${index}`} padded={false} style={styles.stepCard}>
            <View style={styles.diamondWrap}>
              <View style={styles.diamond}>
                <AppText weight="bold" size={12} color={colors.goldDark} style={styles.diamondNumber}>
                  {index + 1}
                </AppText>
              </View>
            </View>
            <View style={styles.stepBody}>
              <AppText weight="bold" size={15.5} color={colors.ink}>
                {step.title}
              </AppText>
              <AppText size={14} lineHeight={25} color={colors.inkBody} style={styles.stepText}>
                {step.body}
              </AppText>
              {step.recitation ? (
                <View style={styles.recitation}>
                  <AppText amiri size={19} lineHeight={36} color={colors.inkQuran}>
                    {step.recitation}
                  </AppText>
                </View>
              ) : null}
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.cream,
    paddingHorizontal: 20,
  },
  backCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.hairlineStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressedDim: { opacity: 0.8 },
  header: {
    marginTop: 8,
    borderRadius: 22,
    paddingTop: 18,
    paddingHorizontal: 20,
    paddingBottom: 16,
    alignItems: 'center',
    overflow: 'hidden',
    ...shadows.heroCard,
  },
  cornerDiamond: {
    position: 'absolute',
    top: 14,
    width: 9,
    height: 9,
    borderWidth: 1,
    borderColor: 'rgba(196,164,95,0.6)',
    transform: [{ rotate: '45deg' }],
  },
  kicker: { letterSpacing: 0.4 },
  title: { marginTop: 5 },
  headerSub: { marginTop: 3 },
  note: { marginTop: 8 },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  chip: {
    backgroundColor: colors.fill6,
    borderRadius: radii.pill,
    paddingVertical: 6,
    paddingHorizontal: 13,
  },
  scroll: { marginTop: 12 },
  scrollContent: { gap: 10 },
  stepCard: {
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  diamondWrap: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 2,
  },
  diamond: {
    width: 34,
    height: 34,
    borderWidth: 1.2,
    borderColor: colors.gold500,
    transform: [{ rotate: '45deg' }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  diamondNumber: { transform: [{ rotate: '-45deg' }] },
  stepBody: { flex: 1 },
  stepText: { marginTop: 4 },
  recitation: {
    marginTop: 10,
    backgroundColor: colors.creamTint,
    borderRadius: 14,
    padding: 14,
    borderStartWidth: 3,
    borderStartColor: colors.gold500,
  },
});
