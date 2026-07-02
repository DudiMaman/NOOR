import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { AppText, Card, IconChip, IOSToggle, SegmentedControl } from '../../components';
import { lightColors, shadows, useTheme } from '../../theme';
import { usePaywallGate } from '../../hooks/usePaywallGate';
import { usePrayerSchedule } from '../../hooks/usePrayerSchedule';
import { useSettingsStore, type CalcMethodKey } from '../../store/useSettingsStore';
import { formatDualDate, formatRemainingShort } from '../../services/dates';
import { formatTime, PRAYER_ORDER, type PrayerKey } from '../../services/prayerTimes';

type DayOffset = '-1' | '0' | '1';

const METHOD_KEY_MAP: Record<CalcMethodKey, string> = {
  UmmAlQura: 'methodUmmAlQura',
  MWL: 'methodMWL',
  Egyptian: 'methodEgyptian',
  Karachi: 'methodKarachi',
  ISNA: 'methodISNA',
  Dubai: 'methodDubai',
  Turkey: 'methodTurkey',
};

/** Distinct goldDark mini icon per prayer (dawn arc, half-circles, discs, crescent). */
function PrayerMiniIcon({ prayer }: { prayer: PrayerKey }) {
  const { colors } = useTheme();
  switch (prayer) {
    case 'fajr':
      return <View style={[styles.iconFajr, { borderColor: colors.goldDark }]} />;
    case 'sunrise':
      return <View style={[styles.iconSunrise, { borderColor: colors.goldDark }]} />;
    case 'dhuhr':
      return <View style={[styles.iconDhuhr, { backgroundColor: colors.goldDark }]} />;
    case 'asr':
      return (
        <View style={[styles.iconAsr, { backgroundColor: colors.goldDark, shadowColor: colors.goldDark }]} />
      );
    case 'maghrib':
      return <View style={[styles.iconMaghrib, { borderColor: colors.goldDark }]} />;
    case 'isha':
      return <View style={[styles.iconIsha, { borderColor: colors.goldDark }]} />;
  }
}

/** Prayer times tab — day switcher, prayer rows with reminders, night/duha strip (design ref 1m). */
export function PrayerTimesScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const gate = usePaywallGate();
  const { colors } = useTheme();

  const { now, today, next, locationLabel, dayFor } = usePrayerSchedule(30000);
  const calcMethod = useSettingsStore((s) => s.calcMethod);
  const madhhab = useSettingsStore((s) => s.madhhab);
  const reminders = useSettingsStore((s) => s.reminders);
  const setPrayerReminder = useSettingsStore((s) => s.setPrayerReminder);

  const [offset, setOffset] = useState<DayOffset>('0');
  const day = offset === '0' ? today : dayFor(Number(offset));

  const statusFor = (key: PrayerKey, time: Date): string => {
    if (offset !== '0') return ' ';
    if (key === 'sunrise') return t('prayers.notPrayer');
    if (time.getTime() <= now.getTime()) return t('prayers.passed');
    const h = Math.round((time.getTime() - now.getTime()) / 3600000);
    return h <= 1 ? t('prayers.inHoursOne') : t('prayers.inHours', { count: h });
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.cream }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + 14,
          paddingHorizontal: 22,
          paddingBottom: 120,
        }}
      >
        {/* Header — title + location pill */}
        <View style={styles.headerRow}>
          <AppText weight="bold" size={28} color={colors.ink}>
            {t('prayers.title')}
          </AppText>
          <Pressable
            onPress={() =>
              gate(() => navigation.navigate('LocationSetup', { fromSettings: true } as never))
            }
            style={({ pressed }) => [
              styles.locationPill,
              { backgroundColor: colors.card, borderColor: colors.hairlineStrong },
              pressed && { opacity: 0.8 },
            ]}
            hitSlop={6}
          >
            <View style={[styles.locationRing, { borderColor: colors.emerald800 }]} />
            <AppText weight="semibold" size={13} color={colors.ink}>
              {locationLabel}
            </AppText>
          </Pressable>
        </View>

        {/* Day switcher */}
        <SegmentedControl<DayOffset>
          options={[
            { value: '-1', label: t('common.yesterday') },
            { value: '0', label: t('common.today') },
            { value: '1', label: t('common.tomorrow') },
          ]}
          value={offset}
          onChange={setOffset}
          style={{ marginTop: 16 }}
        />

        {/* Dual date line */}
        <AppText size={13} color={colors.muted} center style={{ marginTop: 12 }}>
          {formatDualDate(day.date, t)}
        </AppText>

        {/* Prayer rows */}
        <View style={styles.rows}>
          {PRAYER_ORDER.map((key) => {
            const time = day.times[key];
            const isNext = offset === '0' && key !== 'sunrise' && key === next.prayer;

            if (isNext) {
              return (
                <View key={key} style={[styles.heroRow, shadows.heroCard]}>
                  <IconChip size={36} gold>
                    <View
                      style={[styles.heroDot, { backgroundColor: colors.gold300, shadowColor: colors.gold300 }]}
                    />
                  </IconChip>
                  <Pressable
                    style={{ flex: 1 }}
                    onPress={() =>
                      gate(() =>
                        navigation.navigate('PrayerGuide', {
                          prayer: key as Exclude<PrayerKey, 'sunrise'>,
                        })
                      )
                    }
                  >
                    <AppText weight="bold" size={16.5} color={colors.creamText}>
                      {t(`prayers.${key}`)}
                    </AppText>
                    <AppText weight="semibold" size={12} color={colors.gold300}>
                      {t('prayers.nextRemaining', { time: formatRemainingShort(next.remainingMs) })}
                    </AppText>
                  </Pressable>
                  <AppText weight="bold" size={22} color={colors.gold300} tabular>
                    {formatTime(time)}
                  </AppText>
                  <IOSToggle
                    goldWhenOn
                    width={44}
                    height={27}
                    value={reminders.prayers[key]}
                    onValueChange={(v) => gate(() => setPrayerReminder(key, v))}
                  />
                </View>
              );
            }

            const passed = offset === '0' && time.getTime() <= now.getTime();
            return (
              <Card
                key={key}
                padded={false}
                style={[styles.row, key === 'sunrise' && { opacity: 0.75 }]}
              >
                <IconChip size={36}>
                  <PrayerMiniIcon prayer={key} />
                </IconChip>
                <Pressable
                  style={{ flex: 1 }}
                  disabled={key === 'sunrise'}
                  onPress={() =>
                    gate(() =>
                      navigation.navigate('PrayerGuide', {
                        prayer: key as Exclude<PrayerKey, 'sunrise'>,
                      })
                    )
                  }
                >
                  <AppText weight="bold" size={16} color={colors.ink}>
                    {t(`prayers.${key}`)}
                  </AppText>
                  <AppText size={12} color={colors.faint}>
                    {statusFor(key, time)}
                  </AppText>
                </Pressable>
                <AppText weight="bold" size={20} color={passed ? colors.muted : colors.ink} tabular>
                  {formatTime(time)}
                </AppText>
                <IOSToggle
                  width={44}
                  height={27}
                  value={reminders.prayers[key]}
                  onValueChange={(v) => gate(() => setPrayerReminder(key, v))}
                />
              </Card>
            );
          })}
        </View>

        {/* Night & duha strip */}
        <View style={[styles.extraStrip, { backgroundColor: colors.fill5 }]}>
          <View style={styles.extraCell}>
            <AppText size={11.5} color={colors.muted}>
              {t('prayers.midnight')}
            </AppText>
            <AppText weight="bold" size={14.5} color={colors.ink} tabular style={{ marginTop: 2 }}>
              {formatTime(day.midnight)}
            </AppText>
          </View>
          <View style={[styles.extraSeparator, { backgroundColor: colors.fill10 }]} />
          <View style={styles.extraCell}>
            <AppText size={11.5} color={colors.muted}>
              {t('prayers.lastThird')}
            </AppText>
            <AppText weight="bold" size={14.5} color={colors.ink} tabular style={{ marginTop: 2 }}>
              {formatTime(day.lastThird)}
            </AppText>
          </View>
          <View style={[styles.extraSeparator, { backgroundColor: colors.fill10 }]} />
          <View style={styles.extraCell}>
            <AppText size={11.5} color={colors.muted}>
              {t('prayers.duha')}
            </AppText>
            <AppText weight="bold" size={14.5} color={colors.ink} tabular style={{ marginTop: 2 }}>
              {formatTime(day.duha)}
            </AppText>
          </View>
        </View>

        {/* Calculation footer */}
        <AppText size={12} color={colors.faint} center style={styles.footer}>
          {t('prayers.calculationFooter', {
            method: t(`settingsOptions.${METHOD_KEY_MAP[calcMethod]}`),
            madhhab: t(`settingsOptions.${madhhab === 'shafi' ? 'madhhabShafi' : 'madhhabHanafi'}`),
          }) + ' · '}
          <AppText
            size={12}
            weight="semibold"
            color={colors.gold500}
            suppressHighlighting
            onPress={() => gate(() => navigation.navigate('Settings' as never))}
          >
            {t('common.change')}
          </AppText>
        </AppText>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 7,
    paddingHorizontal: 13,
  },
  locationRing: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
  },
  rows: {
    marginTop: 14,
    gap: 10,
  },
  heroRow: {
    // Next-prayer emerald hero row — design-dark in both schemes.
    backgroundColor: lightColors.emerald800,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  heroDot: {
    width: 11,
    height: 11,
    borderRadius: 5.5,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 4,
  },
  row: {
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  // Mini prayer icons — decorative absolutes copied from the RTL HTML (physical sides kept)
  iconFajr: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
    borderTopColor: 'transparent',
    transform: [{ rotate: '45deg' }],
  },
  iconSunrise: {
    width: 12,
    height: 6,
    borderWidth: 1.5,
    borderBottomWidth: 0,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  iconDhuhr: {
    width: 11,
    height: 11,
    borderRadius: 5.5,
  },
  iconAsr: {
    width: 11,
    height: 11,
    borderRadius: 5.5,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 3,
  },
  iconMaghrib: {
    width: 12,
    height: 6,
    borderWidth: 1.5,
    borderTopWidth: 0,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  iconIsha: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
    borderRightColor: 'transparent',
    transform: [{ rotate: '-45deg' }],
  },
  extraStrip: {
    borderRadius: 16,
    paddingVertical: 13,
    paddingHorizontal: 18,
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  extraCell: {
    alignItems: 'center',
  },
  extraSeparator: {
    width: 1,
  },
  footer: {
    marginTop: 12,
    marginBottom: 40,
  },
});
