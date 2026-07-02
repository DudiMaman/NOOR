import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { AppText, Card, IconChip, ProgressBar, RadialGlow } from '../../components';
import { colors, gradients, radii, shadows, spacing } from '../../theme';
import { usePaywallGate } from '../../hooks/usePaywallGate';
import { usePrayerSchedule } from '../../hooks/usePrayerSchedule';
import { formatDualDate, remainingParts } from '../../services/dates';
import { PRAYER_ORDER, dayProgress, formatTime } from '../../services/prayerTimes';
import { getDailyHadith } from '../../content/hadith';
import { getSurah } from '../../content/quran';
import { useUserStore } from '../../store/useUserStore';
import { useContentStore } from '../../store/useContentStore';

const KAHF_VERSES = 110;

/** Home — emerald hero with the next prayer, day arc and daily cards (design ref 1l). */
export function HomeScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const gate = usePaywallGate();

  const { now, today, next, locationLabel } = usePrayerSchedule(30000);
  const profile = useUserStore((s) => s.profile);
  const bookmark = useContentStore((s) => s.bookmark);
  const hadith = getDailyHadith(now);

  // Contextual adhkar window: fajr → duha+3h = morning; asr → isha = evening.
  const nowMs = now.getTime();
  const morningEnd = today.duha.getTime() + 3 * 60 * 60 * 1000;
  const adhkarKind: 'morning' | 'evening' | null =
    nowMs >= today.times.fajr.getTime() && nowMs <= morningEnd
      ? 'morning'
      : nowMs >= today.times.asr.getTime() && nowMs <= today.times.isha.getTime()
        ? 'evening'
        : null;

  // Remaining-time label under the big clock.
  const { hours, minutes } = remainingParts(next.remainingMs);
  const remainingLabel =
    hours > 0
      ? t('home.remainingHoursMinutes', { hours, minutes })
      : t('home.remainingMinutes', { minutes });

  // Sun position along the half-circle day arc (120×60, radius 52, 12px dot).
  const p = dayProgress(now, today);
  const sunAngle = Math.PI * (1 - p);
  const sunLeft = 60 + 52 * Math.cos(sunAngle) - 6;
  const sunTop = 60 - 52 * Math.sin(sunAngle) - 6;

  const kahfName = getSurah(18)?.namePlain ?? 'الكهف';
  const weeklyProgress = bookmark.surahNumber === 18 ? bookmark.verse / KAHF_VERSES : 0.35;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* ——— Emerald hero header (bleeds to the very top) ——— */}
      <LinearGradient
        colors={gradients.heroCard}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 16 }]}
      >
        <RadialGlow size={360} opacity={0.18} style={styles.headerGlow} />

        {/* Row 1 — greeting + location / reminders */}
        <View style={styles.topRow}>
          <View>
            <AppText size={13.5} color="rgba(245,238,220,0.6)">
              {t('home.greeting')}
            </AppText>
            <AppText weight="bold" size={21} color={colors.creamText} style={styles.name}>
              {profile?.name || t('home.guest')}
            </AppText>
          </View>
          <View style={styles.topActions}>
            <Pressable
              onPress={() =>
                gate(() => navigation.navigate('LocationSetup', { fromSettings: true } as never))
              }
              style={({ pressed }) => [styles.locationPill, pressed && styles.pressed]}
            >
              <View style={styles.locationRing} />
              <AppText weight="medium" size={13} color={colors.creamText}>
                {locationLabel}
              </AppText>
            </Pressable>
            <Pressable
              onPress={() => gate(() => navigation.navigate('Reminders' as never))}
              style={({ pressed }) => [styles.bellCircle, pressed && styles.pressed]}
            >
              <View style={styles.bellBody} />
              <View style={styles.bellBadge} />
            </Pressable>
          </View>
        </View>

        {/* Row 2 — dual hijri/gregorian date */}
        <AppText size={13} color={colors.onDarkFaint} style={styles.dateLine}>
          {formatDualDate(now, t)}
        </AppText>

        {/* Row 3 — next prayer + day arc */}
        <View style={styles.nextRow}>
          <View>
            <AppText weight="semibold" size={13.5} color={colors.gold300}>
              {t('home.nextPrayer', { prayer: t(`prayers.${next.prayer}`) })}
            </AppText>
            <AppText
              weight="bold"
              size={52}
              lineHeight={57}
              tabular
              color={colors.creamText}
              style={styles.bigTime}
            >
              {formatTime(next.time)}
            </AppText>
            <AppText size={13.5} color={colors.onDarkMuted} style={styles.remaining}>
              {remainingLabel}
            </AppText>
          </View>
          <View style={styles.arcWrap}>
            <View style={styles.arcCircle} />
            <View style={[styles.sunDot, { left: sunLeft, top: sunTop }]} />
          </View>
        </View>

        {/* Row 4 — all six times, next one highlighted */}
        <View style={styles.prayerStrip}>
          {PRAYER_ORDER.map((key) => {
            const isNext = key === next.prayer;
            return (
              <Pressable
                key={key}
                onPress={() => gate(() => navigation.navigate('PrayerTimes' as never))}
                style={isNext ? styles.prayerCellNext : styles.prayerCellIdle}
              >
                <AppText
                  size={11.5}
                  weight={isNext ? 'bold' : 'regular'}
                  color={isNext ? colors.gold300 : colors.creamText}
                  center
                >
                  {t(`prayers.${key}`)}
                </AppText>
                <AppText
                  size={13}
                  weight={isNext ? 'bold' : 'semibold'}
                  tabular
                  color={isNext ? colors.gold300 : colors.creamText}
                  center
                  style={styles.prayerCellTime}
                >
                  {formatTime(today.times[key])}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </LinearGradient>

      {/* ——— Body cards ——— */}
      <View style={styles.body}>
        {/* Contextual adhkar card — only inside a morning/evening window */}
        {adhkarKind && (
          <Pressable
            onPress={() =>
              gate(() => navigation.navigate('AdhkarReader', { kind: adhkarKind } as never))
            }
            style={({ pressed }) => pressed && styles.pressedSoft}
          >
            <LinearGradient
              colors={gradients.contextCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.contextCard}
            >
              <IconChip size={42} dark>
                <AppText amiri size={20} color={colors.gold300}>
                  ذ
                </AppText>
              </IconChip>
              <View style={styles.cardMiddle}>
                <AppText weight="bold" size={15.5} color={colors.ink}>
                  {t('home.nowAdhkar', {
                    title: t(adhkarKind === 'morning' ? 'reader.morningAdhkar' : 'reader.eveningAdhkar'),
                  })}
                </AppText>
                <AppText size={12.5} color={colors.muted} style={styles.cardSub}>
                  {t('home.readNowSub', { minutes: 5 })}
                </AppText>
              </View>
              <View style={styles.startPill}>
                <AppText weight="semibold" size={13} color={colors.creamText}>
                  {t('home.startReading')}
                </AppText>
              </View>
            </LinearGradient>
          </Pressable>
        )}

        {/* Weekly reading — Surat Al-Kahf */}
        <Card
          onPress={() => gate(() => navigation.navigate('Quran' as never))}
          style={styles.weeklyCard}
        >
          <IconChip size={42}>
            <View style={styles.bookIcon}>
              <View style={[styles.bookLine, styles.bookLineTop]} />
              <View style={[styles.bookLine, styles.bookLineBottom]} />
            </View>
          </IconChip>
          <View style={styles.cardMiddle}>
            <AppText weight="bold" size={12} color={colors.gold500} style={styles.kicker}>
              {t('home.weeklyReading')}
            </AppText>
            <AppText weight="bold" size={15.5} color={colors.ink} style={styles.weeklyTitle}>
              {`سورة ${kahfName}`}
            </AppText>
            <ProgressBar
              progress={weeklyProgress}
              height={4}
              trackColor={colors.fill8}
              style={styles.weeklyProgress}
            />
          </View>
          <View style={styles.outlinePill}>
            <AppText weight="semibold" size={13} color={colors.emerald800}>
              {t('home.continueBtn')}
            </AppText>
          </View>
        </Card>

        {/* Hadith of the day */}
        <Card
          onPress={() => gate(() => navigation.navigate('DailyContent' as never))}
          style={styles.hadithCard}
        >
          <View style={styles.hadithHeader}>
            <AppText weight="bold" size={12} color={colors.gold500} style={styles.kicker}>
              {t('home.hadithOfDay')}
            </AppText>
            <AppText size={12} color={colors.faint}>
              {hadith.attribution}
            </AppText>
          </View>
          <AppText amiri size={17.5} lineHeight={33} color={colors.ink} style={styles.hadithText}>
            {hadith.text}
          </AppText>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  scrollContent: { paddingBottom: 120 },
  pressed: { opacity: 0.7 },
  pressedSoft: { opacity: 0.9 },

  // Header
  header: {
    paddingHorizontal: spacing.screenH,
    paddingBottom: 58,
    borderBottomStartRadius: 34,
    borderBottomEndRadius: 34,
    overflow: 'hidden',
  },
  headerGlow: { top: -80, left: '50%', marginLeft: -180 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { marginTop: 2 },
  topActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(245,238,220,0.12)',
    borderRadius: radii.pill,
    paddingVertical: 7,
    paddingHorizontal: 13,
  },
  locationRing: {
    width: 8,
    height: 8,
    borderWidth: 1.5,
    borderColor: colors.gold300,
    borderRadius: 4,
  },
  bellCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(245,238,220,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellBody: {
    width: 13,
    height: 13,
    borderWidth: 1.5,
    borderColor: colors.gold300,
    borderTopLeftRadius: 6.5,
    borderTopRightRadius: 6.5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  bellBadge: {
    position: 'absolute',
    top: 8,
    left: 9,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.gold500,
    borderWidth: 1.5,
    borderColor: colors.emerald800,
  },
  dateLine: { marginTop: 14 },
  nextRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  bigTime: { marginTop: 4 },
  remaining: { marginTop: 4 },
  arcWrap: { width: 120, height: 60, marginBottom: 6, overflow: 'hidden' },
  arcCircle: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1.5,
    borderColor: 'rgba(196,164,95,0.35)',
  },
  sunDot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.gold300,
    shadowColor: colors.gold300,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 18,
    elevation: 6,
  },
  prayerStrip: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 22 },
  prayerCellIdle: { alignItems: 'center', opacity: 0.55 },
  prayerCellNext: {
    alignItems: 'center',
    backgroundColor: colors.goldTint20,
    borderWidth: 1,
    borderColor: colors.goldBorder50,
    borderRadius: 12,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginVertical: -6,
  },
  prayerCellTime: { marginTop: 3 },

  // Body
  body: { paddingHorizontal: spacing.screenH, paddingTop: 16, gap: spacing.gap },
  cardMiddle: { flex: 1 },
  cardSub: { marginTop: 1 },
  kicker: { letterSpacing: 0.3 },
  contextCard: {
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.goldBorder45,
    paddingVertical: 15,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    ...shadows.selectedCard,
  },
  startPill: {
    backgroundColor: colors.emerald800,
    borderRadius: radii.pill,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  weeklyCard: { flexDirection: 'row', alignItems: 'center', gap: 13 },
  bookIcon: {
    width: 18,
    height: 22,
    borderWidth: 1.5,
    borderColor: colors.goldDark,
    borderRadius: 3,
  },
  bookLine: {
    position: 'absolute',
    left: 3,
    right: 3,
    height: 1.5,
    backgroundColor: colors.goldDark,
  },
  bookLineTop: { top: 4 },
  bookLineBottom: { top: 8 },
  weeklyTitle: { marginTop: 2 },
  weeklyProgress: { width: 150, marginTop: 8 },
  outlinePill: {
    borderWidth: 1.5,
    borderColor: 'rgba(13,53,40,0.25)',
    borderRadius: radii.pill,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  hadithCard: { paddingVertical: 16 },
  hadithHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  hadithText: { marginTop: 8 },
});
