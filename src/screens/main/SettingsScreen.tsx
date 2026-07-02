import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { AppText, ListCard, SectionLabel, SegmentedControl } from '../../components';
import { usePaywallGate } from '../../hooks/usePaywallGate';
import { LANGUAGES } from '../../i18n/languages';
import { formatShortDate } from '../../services/dates';
import {
  useSettingsStore,
  type AdhanSoundKey,
  type CalcMethodKey,
} from '../../store/useSettingsStore';
import { useIsPremium, useSubscriptionStore } from '../../store/useSubscriptionStore';
import { useUserStore } from '../../store/useUserStore';
import { colors, radii, shadows } from '../../theme';

/** Tap-to-cycle order for the calculation method row. */
const CALC_CYCLE: CalcMethodKey[] = [
  'UmmAlQura',
  'MWL',
  'Egyptian',
  'Karachi',
  'ISNA',
  'Dubai',
  'Turkey',
];

const METHOD_KEYS: Record<CalcMethodKey, string> = {
  UmmAlQura: 'methodUmmAlQura',
  MWL: 'methodMWL',
  Egyptian: 'methodEgyptian',
  Karachi: 'methodKarachi',
  ISNA: 'methodISNA',
  Dubai: 'methodDubai',
  Turkey: 'methodTurkey',
};

/** Tap-to-cycle order for the adhan sound row. */
const ADHAN_CYCLE: AdhanSoundKey[] = ['makkah', 'madinah', 'aqsa', 'egypt'];

const ADHAN_KEYS: Record<AdhanSoundKey, string> = {
  makkah: 'adhanMakkah',
  madinah: 'adhanMadinah',
  aqsa: 'adhanAqsa',
  egypt: 'adhanEgypt',
};

/** Standard settings list row — label · value · chevron. */
function SettingsRow({
  label,
  value,
  onPress,
}: {
  label: string;
  value?: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <AppText weight="semibold" size={15} color={colors.ink} style={styles.rowLabel}>
        {label}
      </AppText>
      {value !== undefined && (
        <AppText size={14} color={colors.muted} numberOfLines={1} style={styles.rowValue}>
          {value}
        </AppText>
      )}
      <AppText color={colors.chevron} style={value !== undefined ? styles.rowChevron : undefined}>
        ‹
      </AppText>
    </Pressable>
  );
}

export function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const gate = usePaywallGate();
  const entitled = useIsPremium();

  const profile = useUserStore((s) => s.profile);
  const signOut = useUserStore((s) => s.signOut);

  const language = useSettingsStore((s) => s.language);
  const appearance = useSettingsStore((s) => s.appearance);
  const location = useSettingsStore((s) => s.location);
  const calcMethod = useSettingsStore((s) => s.calcMethod);
  const madhhab = useSettingsStore((s) => s.madhhab);
  const adhanSound = useSettingsStore((s) => s.adhanSound);
  const setAppearance = useSettingsStore((s) => s.setAppearance);
  const setCalcMethod = useSettingsStore((s) => s.setCalcMethod);
  const setMadhhab = useSettingsStore((s) => s.setMadhhab);
  const setAdhanSound = useSettingsStore((s) => s.setAdhanSound);

  const status = useSubscriptionStore((s) => s.status);
  const plan = useSubscriptionStore((s) => s.plan);
  const trialEndsAt = useSubscriptionStore((s) => s.trialEndsAt);
  const renewsAt = useSubscriptionStore((s) => s.renewsAt);
  const restorePurchase = useSubscriptionStore((s) => s.restorePurchase);

  const planLabel =
    status === 'trial'
      ? t('settings.trialPlan')
      : plan === 'yearly'
        ? t('settings.yearlyPlan')
        : t('settings.monthlyPlan');

  const subscriptionValue =
    status === 'trial' && trialEndsAt
      ? t('settings.trialEndsOn', { date: formatShortDate(trialEndsAt) })
      : entitled && renewsAt
        ? t('settings.renewsOn', {
            plan: plan === 'yearly' ? t('settings.yearlyPlan') : t('settings.monthlyPlan'),
            date: formatShortDate(renewsAt),
          })
        : t('settings.upgrade');

  const onLogout = () =>
    Alert.alert(t('settings.logout'), undefined, [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('settings.logout'),
        style: 'destructive',
        onPress: () => {
          signOut();
          navigation.reset({ index: 0, routes: [{ name: 'Onboarding' as never }] });
        },
      },
    ]);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 14 }]}
      showsVerticalScrollIndicator={false}
    >
      <AppText weight="bold" size={28} color={colors.ink} style={styles.title}>
        {t('settings.title')}
      </AppText>

      {/* Profile card */}
      <Pressable
        onPress={() => gate(() => navigation.navigate('Profile' as never))}
        style={({ pressed }) => [styles.profileCard, shadows.heroCard, pressed && styles.pressed]}
      >
        <View style={styles.avatar}>
          <AppText amiri size={26} color={colors.gold300}>
            {(profile?.name || 'ض')[0]}
          </AppText>
        </View>
        <View style={styles.profileInfo}>
          <AppText weight="bold" size={17} color={colors.creamText}>
            {profile?.name || t('home.guest')}
          </AppText>
          <View style={styles.badgeRow}>
            {entitled ? (
              <>
                <View style={styles.premiumChip}>
                  <AppText weight="bold" size={11} color={colors.gold300}>
                    {t('common.premium') + ' ✦'}
                  </AppText>
                </View>
                <AppText size={12} color={colors.onDarkFaint}>
                  {planLabel}
                </AppText>
              </>
            ) : (
              <AppText size={12} color={colors.onDarkFaint}>
                {t('settings.freePlan')}
              </AppText>
            )}
          </View>
        </View>
        <AppText size={16} color="rgba(245,238,220,0.4)">
          ‹
        </AppText>
      </Pressable>

      {/* Prayer */}
      <SectionLabel>{t('settings.sectionPrayer')}</SectionLabel>
      <ListCard>
        <SettingsRow
          label={t('settings.calcMethod')}
          value={t(`settingsOptions.${METHOD_KEYS[calcMethod]}`)}
          onPress={() =>
            gate(() =>
              setCalcMethod(CALC_CYCLE[(CALC_CYCLE.indexOf(calcMethod) + 1) % CALC_CYCLE.length])
            )
          }
        />
        <SettingsRow
          label={t('settings.madhhab')}
          value={t(`settingsOptions.${madhhab === 'shafi' ? 'madhhabShafi' : 'madhhabHanafi'}`)}
          onPress={() => gate(() => setMadhhab(madhhab === 'shafi' ? 'hanafi' : 'shafi'))}
        />
        <SettingsRow
          label={t('settings.location')}
          value={location?.label ?? '—'}
          onPress={() =>
            gate(() => navigation.navigate('LocationSetup', { fromSettings: true } as never))
          }
        />
        <SettingsRow
          label={t('settings.adhanSound')}
          value={t(`settingsOptions.${ADHAN_KEYS[adhanSound]}`)}
          onPress={() =>
            gate(() =>
              setAdhanSound(ADHAN_CYCLE[(ADHAN_CYCLE.indexOf(adhanSound) + 1) % ADHAN_CYCLE.length])
            )
          }
        />
      </ListCard>

      {/* General */}
      <SectionLabel>{t('settings.sectionGeneral')}</SectionLabel>
      <ListCard>
        <SettingsRow
          label={t('settings.notifications')}
          onPress={() => gate(() => navigation.navigate('Reminders' as never))}
        />
        <SettingsRow
          label={t('settings.language')}
          value={LANGUAGES.find((l) => l.code === language)?.nativeName}
          onPress={() => gate(() => navigation.navigate('LanguagePicker' as never))}
        />
        <View style={styles.appearanceRow}>
          <AppText weight="semibold" size={15} color={colors.ink} style={styles.rowLabel}>
            {t('settings.appearance')}
          </AppText>
          {/* Dark theme derivation is future work — the control persists the choice. */}
          <SegmentedControl
            compact
            options={[
              { value: 'light', label: t('settings.light') },
              { value: 'dark', label: t('settings.dark') },
              { value: 'auto', label: t('settings.auto') },
            ]}
            value={appearance}
            onChange={setAppearance}
          />
        </View>
      </ListCard>

      {/* Subscription — paywalls stay reachable, so no gate here */}
      <SectionLabel>{t('settings.sectionSubscription')}</SectionLabel>
      <ListCard>
        <SettingsRow
          label={t('settings.manageSubscription')}
          value={subscriptionValue}
          onPress={() => navigation.navigate('SubscriptionPaywall' as never)}
        />
        <SettingsRow label={t('settings.restorePurchase')} onPress={() => restorePurchase()} />
      </ListCard>

      <Pressable onPress={onLogout} style={({ pressed }) => [styles.logout, pressed && styles.pressed]}>
        <AppText weight="semibold" size={14} color={colors.destructive} center>
          {t('settings.logout')}
        </AppText>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  content: { paddingHorizontal: 22, paddingBottom: 120 },
  title: { marginTop: 14 },
  pressed: { opacity: 0.8 },
  profileCard: {
    marginTop: 16,
    backgroundColor: colors.emerald800,
    borderRadius: radii.cardLarge,
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.goldTint20,
    borderWidth: 1.5,
    borderColor: colors.goldBorder50,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  profileInfo: { flex: 1 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  premiumChip: {
    backgroundColor: colors.goldTint20,
    borderWidth: 1,
    borderColor: colors.goldBorder50,
    borderRadius: radii.pill,
    paddingVertical: 2,
    paddingHorizontal: 9,
  },
  row: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowLabel: { flex: 1 },
  rowValue: { flexShrink: 1 },
  rowChevron: { marginStart: 8 },
  appearanceRow: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logout: { paddingTop: 18, paddingBottom: 36 },
});
