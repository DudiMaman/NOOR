import React, { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { AppText, IOSToggle, ListCard, SectionLabel } from '../components';
import { colors, radii } from '../theme';
import { useSettingsStore, type PreAlertMinutes } from '../store/useSettingsStore';
import { ensurePermissions } from '../services/notifications';

/** settingsOptions.* key for each adhan sound. */
const ADHAN_SOUND_KEYS = {
  makkah: 'adhanMakkah',
  madinah: 'adhanMadinah',
  aqsa: 'adhanAqsa',
  egypt: 'adhanEgypt',
} as const;

const PRE_ALERT_OPTIONS: PreAlertMinutes[] = [5, 10, 15];

/**
 * Reminders — notification preferences for prayers, adhkar and occasions.
 * Pushed root screen (design ref 1p). Entry points are premium-gated.
 */
export function RemindersScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const r = useSettingsStore((s) => s.reminders);
  const setReminders = useSettingsStore((s) => s.setReminders);
  const adhanSound = useSettingsStore((s) => s.adhanSound);

  useEffect(() => {
    ensurePermissions().catch(() => {});
  }, []);

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 14 }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Back */}
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={10}
          style={({ pressed }) => [styles.backCircle, pressed && { opacity: 0.7 }]}
        >
          <AppText weight="bold" size={17} color={colors.emerald800}>
            ›
          </AppText>
        </Pressable>

        {/* Header */}
        <AppText weight="bold" size={28} color={colors.ink} style={{ marginTop: 14 }}>
          {t('reminders.title')}
        </AppText>
        <AppText size={14} color={colors.muted} style={{ marginTop: 6 }}>
          {t('reminders.subtitle')}
        </AppText>

        {/* Prayers */}
        <SectionLabel>{t('reminders.sectionPrayers')}</SectionLabel>
        <ListCard>
          <View style={[styles.row, r.adhanEnabled && { backgroundColor: colors.creamTint }]}>
            <View style={{ flex: 1 }}>
              <AppText weight="bold" size={15.5} color={colors.ink}>
                {t('reminders.adhanEvery')}
              </AppText>
              <AppText size={12.5} color={colors.muted} style={{ marginTop: 2 }}>
                {t('reminders.adhanSound', {
                  sound: t(`settingsOptions.${ADHAN_SOUND_KEYS[adhanSound]}`),
                })}
              </AppText>
            </View>
            <IOSToggle
              value={r.adhanEnabled}
              onValueChange={(v) => setReminders({ adhanEnabled: v })}
            />
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <AppText weight="semibold" size={15} color={colors.ink}>
                {t('reminders.preAlert')}
              </AppText>
              <AppText size={12.5} color={colors.muted} style={{ marginTop: 2 }}>
                {t('reminders.preAlertSub', { minutes: r.preAlertMinutes })}
              </AppText>
            </View>
            <View style={styles.chipsRow}>
              {PRE_ALERT_OPTIONS.map((m) => {
                const selected = r.preAlertMinutes === m;
                return (
                  <Pressable
                    key={m}
                    onPress={() => setReminders({ preAlertMinutes: m })}
                    style={[styles.chip, selected ? styles.chipSelected : styles.chipIdle]}
                  >
                    <AppText
                      weight={selected ? 'bold' : 'semibold'}
                      size={12}
                      color={selected ? colors.creamText : colors.muted}
                    >
                      {`${m} ${t('common.minutesShort')}`}
                    </AppText>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <AppText weight="semibold" size={15} color={colors.ink}>
                {t('reminders.fridayReminder')}
              </AppText>
              <AppText size={12.5} color={colors.muted} style={{ marginTop: 2 }}>
                {t('reminders.fridaySub')}
              </AppText>
            </View>
            <IOSToggle value={r.friday} onValueChange={(v) => setReminders({ friday: v })} />
          </View>
        </ListCard>

        {/* Adhkar & Quran */}
        <SectionLabel>{t('reminders.sectionAdhkar')}</SectionLabel>
        <ListCard>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <AppText weight="semibold" size={15} color={colors.ink}>
                {t('reminders.morningAdhkar')}
              </AppText>
              <AppText size={12.5} color={colors.muted} style={{ marginTop: 2 }}>
                {t('reminders.morningSub')}
              </AppText>
            </View>
            <IOSToggle
              value={r.morningAdhkar}
              onValueChange={(v) => setReminders({ morningAdhkar: v })}
            />
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <AppText weight="semibold" size={15} color={colors.ink}>
                {t('reminders.eveningAdhkar')}
              </AppText>
              <AppText size={12.5} color={colors.muted} style={{ marginTop: 2 }}>
                {t('reminders.eveningSub')}
              </AppText>
            </View>
            <IOSToggle
              value={r.eveningAdhkar}
              onValueChange={(v) => setReminders({ eveningAdhkar: v })}
            />
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <AppText weight="semibold" size={15} color={colors.ink}>
                {t('reminders.dailyWard')}
              </AppText>
              <AppText size={12.5} color={colors.muted} style={{ marginTop: 2 }}>
                {t('reminders.dailyWardSub')}
              </AppText>
            </View>
            <IOSToggle value={r.dailyWard} onValueChange={(v) => setReminders({ dailyWard: v })} />
          </View>
        </ListCard>

        {/* Occasions */}
        <SectionLabel>{t('reminders.sectionOccasions')}</SectionLabel>
        <ListCard>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <AppText weight="semibold" size={15} color={colors.ink}>
                {t('reminders.holidays')}
              </AppText>
              <AppText size={12.5} color={colors.muted} style={{ marginTop: 2 }}>
                {t('reminders.holidaysSub')}
              </AppText>
            </View>
            <IOSToggle value={r.occasions} onValueChange={(v) => setReminders({ occasions: v })} />
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <AppText weight="semibold" size={15} color={colors.ink}>
                {t('reminders.mondayThursday')}
              </AppText>
              <AppText size={12.5} color={colors.muted} style={{ marginTop: 2 }}>
                {t('reminders.mondayThursdaySub')}
              </AppText>
            </View>
            <IOSToggle value={r.fasting} onValueChange={(v) => setReminders({ fasting: v })} />
          </View>
        </ListCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  content: {
    paddingHorizontal: 22,
    paddingBottom: 60,
  },
  backCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    paddingVertical: 15,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  chip: {
    borderRadius: radii.pill,
    paddingVertical: 5,
    paddingHorizontal: 11,
  },
  chipSelected: {
    backgroundColor: colors.emerald800,
  },
  chipIdle: {
    borderWidth: 1,
    borderColor: colors.trackOff,
  },
});
