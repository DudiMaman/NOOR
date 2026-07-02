import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { AppText, IconChip, ListCard, RadialGlow } from '../../components';
import { gradients, radii, shadows, useTheme } from '../../theme';
import { HADITH_ITEMS } from '../../content/hadith';
import { getUpcomingEvents } from '../../services/islamicEvents';
import {
  dateKey,
  formatDualDateShort,
  gregorianMonthName,
  hijriMonthName,
  weekdayName,
} from '../../services/dates';
import { useNow } from '../../hooks/useNow';
import { usePaywallGate } from '../../hooks/usePaywallGate';
import { useSettingsStore } from '../../store/useSettingsStore';

/**
 * Customs & holidays (design 1n) — pushed root screen: next-occasion hero,
 * this week's sunnah cards and the upcoming occasions list.
 */
export function CustomsHolidaysScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const gate = usePaywallGate();

  const now = useNow(60000);
  const todayKey = dateKey(now);
  const setReminders = useSettingsStore((s) => s.setReminders);

  const [fastingOpen, setFastingOpen] = useState(false);

  const { next, upcoming } = useMemo(() => {
    const events = getUpcomingEvents(now);
    return { next: events[0], upcoming: events.slice(1, 6) };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todayKey]);

  const fastingHadith = useMemo(
    () => HADITH_ITEMS.find((h) => h.tags.some((tag) => tag.includes('صيام'))) ?? HADITH_ITEMS[0],
    []
  );

  return (
    <View style={[styles.screen, { backgroundColor: colors.cream, paddingTop: insets.top + 14 }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Back */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('common.back')}
          hitSlop={10}
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [
            styles.backCircle,
            { backgroundColor: colors.card, borderColor: colors.hairlineStrong },
            pressed && styles.pressedDim,
          ]}
        >
          <AppText weight="medium" size={19} color={colors.emerald800} style={{ marginTop: -2 }}>
            ›
          </AppText>
        </Pressable>

        <AppText weight="bold" size={28} color={colors.ink} style={{ marginTop: 14 }}>
          {t('customs.title')}
        </AppText>

        {/* Next occasion hero */}
        <LinearGradient
          colors={gradients.heroCard}
          start={{ x: 0.3, y: 0 }}
          end={{ x: 0.7, y: 1 }}
          style={[styles.hero, shadows.heroCard]}
        >
          <RadialGlow size={220} opacity={0.25} style={{ top: -70, start: -40 }} />
          <View style={styles.heroTopRow}>
            <View style={{ flexShrink: 1 }}>
              <AppText weight="bold" size={12} color={colors.gold300} style={{ letterSpacing: 0.4 }}>
                {t('customs.nextOccasion')}
              </AppText>
              <AppText weight="bold" size={23} color={colors.creamText} style={{ marginTop: 6 }}>
                {t(next.nameKey)}
              </AppText>
              <AppText size={13} color={colors.onDarkMuted} style={{ marginTop: 6 }}>
                {formatDualDateShort(next.date, t)}
              </AppText>
            </View>
            <View style={[styles.countCircle, { borderColor: colors.goldBorder50 }]}>
              <AppText weight="bold" size={21} color={colors.gold300} tabular>
                {next.daysAway}
              </AppText>
              <AppText size={10.5} color="rgba(245,238,220,0.7)">
                {t('common.days')}
              </AppText>
            </View>
          </View>
          <View style={styles.heroChipsRow}>
            <Pressable
              onPress={() => gate()}
              style={({ pressed }) => [styles.heroChip, pressed && styles.pressedDim]}
            >
              <AppText size={12} color={colors.creamText}>
                {t('customs.occasionSunnah')}
              </AppText>
            </Pressable>
            <Pressable
              onPress={() => gate(() => setReminders({ occasions: true }))}
              style={({ pressed }) => [styles.heroChip, pressed && styles.pressedDim]}
            >
              <AppText size={12} color={colors.creamText}>
                {t('customs.remindMe')}
              </AppText>
            </Pressable>
          </View>
        </LinearGradient>

        {/* This week's sunnah */}
        <AppText weight="bold" size={15} color={colors.ink} style={styles.sectionTitle}>
          {t('customs.weekSunnah')}
        </AppText>
        <View style={{ gap: 10 }}>
          {/* Fasting card */}
          <View
            style={[
              styles.fastingCard,
              { backgroundColor: colors.creamTint, borderColor: colors.goldBorder50 },
            ]}
          >
            <View style={styles.sunnahRow}>
              <IconChip size={38} dark>
                <View style={[styles.fastingDiamond, { backgroundColor: colors.gold300 }]} />
              </IconChip>
              <View style={{ flex: 1 }}>
                <AppText weight="bold" size={15} color={colors.ink}>
                  {t('customs.todayFasting', { day: weekdayName(now, t) })}
                </AppText>
                <AppText size={12.5} color={colors.muted} style={{ marginTop: 2 }}>
                  {t('customs.fastingSub')}
                </AppText>
              </View>
              <Pressable hitSlop={10} onPress={() => gate(() => setFastingOpen((open) => !open))}>
                <AppText weight="semibold" size={12.5} color={colors.gold500}>
                  {t('common.details')}
                </AppText>
              </Pressable>
            </View>
            {fastingOpen && (
              <View style={[styles.fastingInset, { backgroundColor: colors.creamTint }]}>
                <AppText amiri size={16} lineHeight={30} color={colors.ink}>
                  {fastingHadith.text}
                </AppText>
              </View>
            )}
          </View>

          {/* Kahf card */}
          <View
            style={[styles.kahfCard, { backgroundColor: colors.card, borderColor: colors.hairline }]}
          >
            <View style={styles.sunnahRow}>
              <IconChip size={38}>
                <View style={[styles.bookIcon, { borderColor: colors.goldDark }]} />
              </IconChip>
              <View style={{ flex: 1 }}>
                <AppText weight="bold" size={15} color={colors.ink}>
                  {t('customs.tomorrowKahf')}
                </AppText>
                <AppText size={12.5} color={colors.muted} style={{ marginTop: 2 }}>
                  {t('customs.kahfSub')}
                </AppText>
              </View>
              <Pressable
                hitSlop={10}
                onPress={() => gate(() => navigation.navigate('Main', { screen: 'Quran' } as never))}
              >
                <AppText weight="semibold" size={12.5} color={colors.gold500}>
                  {t('common.read')}
                </AppText>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Upcoming occasions */}
        <AppText weight="bold" size={15} color={colors.ink} style={styles.sectionTitle}>
          {t('customs.upcoming')}
        </AppText>
        <ListCard style={{ borderRadius: radii.cardLarge }}>
          {upcoming.map((event) => (
            <View key={event.id} style={styles.eventRow}>
              <View style={{ flexShrink: 1 }}>
                <AppText weight="bold" size={15} color={colors.ink}>
                  {t(event.nameKey)}
                </AppText>
                <AppText size={12.5} color={colors.muted} style={{ marginTop: 2 }}>
                  {`${event.hijriDay} ${hijriMonthName(event.hijriMonth, t)} · ${event.date.getDate()} ${gregorianMonthName(event.date, t)} ${event.date.getFullYear()}`}
                </AppText>
              </View>
              <AppText size={12.5} color={colors.faint}>
                {t('common.inDays', { count: event.daysAway })}
              </AppText>
            </View>
          ))}
        </ListCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 22,
    paddingBottom: 60,
  },
  backCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  pressedDim: { opacity: 0.7 },
  hero: {
    marginTop: 16,
    borderRadius: 24,
    padding: 22,
    overflow: 'hidden',
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  countCircle: {
    width: 74,
    height: 74,
    borderRadius: 37,
    borderWidth: 1.5,
    backgroundColor: 'rgba(196,164,95,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  heroChipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  heroChip: {
    backgroundColor: 'rgba(245,238,220,0.12)',
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 13,
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 10,
  },
  sunnahRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },
  fastingCard: {
    borderWidth: 1,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  fastingDiamond: {
    width: 9,
    height: 9,
    transform: [{ rotate: '45deg' }],
  },
  fastingInset: {
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },
  kahfCard: {
    borderWidth: 1,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  bookIcon: {
    width: 16,
    height: 19,
    borderWidth: 1.5,
    borderRadius: 3,
  },
  eventRow: {
    paddingVertical: 15,
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
