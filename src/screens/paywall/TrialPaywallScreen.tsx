import React, { useCallback, useMemo } from 'react';
import { Linking, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../../navigation/types';
import {
  AppText,
  DiamondBullet,
  EmeraldRadialBackground,
  GoldButton,
  StarLogo,
} from '../../components';
import { useSubscriptionStore } from '../../store/useSubscriptionStore';
import { useUserStore } from '../../store/useUserStore';
import { getPlanPrices } from '../../services/currency';
import { colors, radii, spacing } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'TrialPaywall'>;

const BENEFIT_KEYS = ['paywall.benefit1', 'paywall.benefit2', 'paywall.benefit3'] as const;

const TERMS_URL = 'https://noor-app.example/terms';
const PRIVACY_URL = 'https://noor-app.example/privacy';

/**
 * Trial paywall (design 1j) — full-screen dark emerald offer with the 3-day
 * free trial CTA. Shown during setup (`source:'setup'` → continues to
 * LocationSetup) and as a gate modal (`source:'gate'` → closes back).
 */
export function TrialPaywallScreen({ navigation, route }: Props) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const prices = useMemo(() => getPlanPrices(), []);
  const selectedPlan = useSubscriptionStore((s) => s.selectedPlan);
  const selectPlan = useSubscriptionStore((s) => s.selectPlan);
  const yearlySelected = selectedPlan === 'yearly';

  const finish = useCallback(() => {
    if (route.params?.source === 'setup') {
      useUserStore.getState().setFlowStage('location');
      navigation.replace('LocationSetup');
    } else {
      navigation.goBack();
    }
  }, [navigation, route.params?.source]);

  const onStartTrial = useCallback(() => {
    useSubscriptionStore.getState().startTrial(selectedPlan);
    finish();
  }, [finish, selectedPlan]);

  const openUrl = (url: string) => {
    Linking.openURL(url).catch(() => {});
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + 10 }]}>
      <EmeraldRadialBackground />

      {/* Close — sits at the screen's left edge (flex-end under RTL) */}
      <View style={styles.topRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('common.close')}
          hitSlop={10}
          onPress={finish}
          style={({ pressed }) => [styles.closeBtn, pressed && styles.pressedDim]}
        >
          <AppText size={14} color="rgba(245,238,220,0.7)">
            ✕
          </AppText>
        </Pressable>
      </View>

      {/* Hero */}
      <View style={styles.hero}>
        <StarLogo size={38} dotSize={7} borderWidth={1.2} />
        <View style={styles.trialBadge}>
          <AppText weight="bold" size={12.5} color={colors.gold300} style={styles.trialBadgeText}>
            {t('paywall.trialBadge')}
          </AppText>
        </View>
        <AppText weight="bold" size={27} color={colors.creamText} style={styles.title}>
          {t('paywall.title')}
        </AppText>
        <AppText size={15} color={colors.onDarkMuted} center lineHeight={25} style={styles.subtitle}>
          {t('paywall.subtitle')}
        </AppText>
      </View>

      {/* Benefits */}
      <View style={styles.benefits}>
        {BENEFIT_KEYS.map((key) => (
          <View key={key} style={styles.benefitRow}>
            <DiamondBullet size={7} color={colors.gold500} />
            <AppText size={14.5} color={colors.onDarkStrong} style={styles.benefitText}>
              {t(key)}
            </AppText>
          </View>
        ))}
      </View>

      {/* Plans */}
      <View style={styles.plans}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: yearlySelected }}
          onPress={() => selectPlan('yearly')}
          style={[styles.yearlyCard, yearlySelected ? styles.cardSelected : styles.yearlyCardIdle]}
        >
          <View style={styles.bestValueBadge}>
            <AppText weight="bold" size={11.5} color={colors.emerald800}>
              {t('paywall.bestValue')}
            </AppText>
          </View>
          <View style={styles.planRow}>
            <View>
              <AppText weight="bold" size={17} color={colors.ink}>
                {t('paywall.yearly')}
              </AppText>
              <AppText size={13} color={colors.muted} style={styles.planSub}>
                {t('paywall.perMonthOnly', { price: prices.yearlyPerMonth })}
              </AppText>
            </View>
            <View style={styles.priceCol}>
              <AppText weight="bold" size={19} color={colors.emerald800} tabular>
                {prices.yearly}
              </AppText>
              <AppText size={12} color={colors.muted}>
                {t('paywall.perYear')}
              </AppText>
            </View>
          </View>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: !yearlySelected }}
          onPress={() => selectPlan('monthly')}
          style={[
            styles.monthlyCard,
            yearlySelected ? styles.monthlyCardIdle : styles.cardSelected,
          ]}
        >
          <AppText weight="semibold" size={17} color={colors.creamText}>
            {t('paywall.monthly')}
          </AppText>
          <View style={styles.priceCol}>
            <AppText weight="bold" size={19} color={colors.creamText} tabular>
              {prices.monthly}
            </AppText>
            <AppText size={12} color={colors.onDarkFaint}>
              {t('paywall.perMonth')}
            </AppText>
          </View>
        </Pressable>
      </View>

      <View style={styles.spacer} />

      {/* CTA */}
      <GoldButton height={56} label={t('paywall.startTrial')} onPress={onStartTrial} />
      <AppText size={12.5} color={colors.onDarkFaint} center style={styles.reassurance}>
        {t('paywall.noCommitment')}
      </AppText>

      {/* Footer links */}
      <View style={styles.footer}>
        <Pressable
          accessibilityRole="button"
          hitSlop={8}
          onPress={() => {
            useSubscriptionStore.getState().restorePurchase();
          }}
        >
          <AppText size={12} color="rgba(245,238,220,0.4)">
            {t('paywall.restore')}
          </AppText>
        </Pressable>
        <Pressable accessibilityRole="link" hitSlop={8} onPress={() => openUrl(TERMS_URL)}>
          <AppText size={12} color="rgba(245,238,220,0.4)">
            {t('paywall.terms')}
          </AppText>
        </Pressable>
        <Pressable accessibilityRole="link" hitSlop={8} onPress={() => openUrl(PRIVACY_URL)}>
          <AppText size={12} color="rgba(245,238,220,0.4)">
            {t('paywall.privacy')}
          </AppText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: spacing.screenHWide,
    backgroundColor: colors.emerald900,
    overflow: 'hidden',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(245,238,220,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressedDim: { opacity: 0.7 },
  hero: {
    alignItems: 'center',
    marginTop: 2,
  },
  trialBadge: {
    marginTop: 14,
    backgroundColor: colors.goldTint16,
    borderWidth: 1,
    borderColor: 'rgba(196,164,95,0.4)',
    borderRadius: radii.pill,
    paddingVertical: 5,
    paddingHorizontal: 14,
  },
  trialBadgeText: { letterSpacing: 0.3 },
  title: { marginTop: 12 },
  subtitle: { marginTop: 6 },
  benefits: {
    gap: 10,
    marginTop: 22,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  benefitText: { flexShrink: 1 },
  plans: {
    gap: 12,
    marginTop: 24,
  },
  yearlyCard: {
    backgroundColor: 'rgba(246,243,236,0.98)',
    borderRadius: radii.card,
    paddingVertical: 16,
    paddingHorizontal: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  yearlyCardIdle: {
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  cardSelected: {
    borderWidth: 1.5,
    borderColor: colors.gold500,
  },
  bestValueBadge: {
    position: 'absolute',
    top: -11,
    start: 18,
    backgroundColor: colors.gold500,
    borderRadius: radii.pill,
    paddingVertical: 3,
    paddingHorizontal: 12,
  },
  planRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planSub: { marginTop: 2 },
  priceCol: { alignItems: 'flex-end' },
  monthlyCard: {
    backgroundColor: 'rgba(246,243,236,0.08)',
    borderRadius: radii.card,
    paddingVertical: 16,
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  monthlyCardIdle: {
    borderWidth: 1,
    borderColor: 'rgba(245,238,220,0.25)',
  },
  spacer: { flex: 1 },
  reassurance: { marginTop: 10 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 18,
    marginTop: 12,
    marginBottom: 46,
  },
});
