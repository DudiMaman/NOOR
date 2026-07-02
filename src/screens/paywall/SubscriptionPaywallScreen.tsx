import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { AppText, Card, DiamondBullet, PrimaryButton } from '../../components';
import { shadows, useTheme } from '../../theme';
import { useSubscriptionStore } from '../../store/useSubscriptionStore';
import { getPlanPrices } from '../../services/currency';

/** What the free tier gets for each compared feature. */
type FreeCell = 'check' | 'dash' | 'partial';

const FEATURES: { key: string; free: FreeCell }[] = [
  { key: 'featBasicTimes', free: 'check' },
  { key: 'featSmartAlerts', free: 'dash' },
  { key: 'featDailyContent', free: 'dash' },
  { key: 'featAdhkarQuran', free: 'partial' },
  { key: 'featNoAds', free: 'dash' },
];

/**
 * Subscription paywall — free vs premium comparison table + plan selector.
 * Presented as a full-screen modal (design ref 1q).
 */
export function SubscriptionPaywallScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const selectedPlan = useSubscriptionStore((s) => s.selectedPlan);
  const selectPlan = useSubscriptionStore((s) => s.selectPlan);
  const startTrial = useSubscriptionStore((s) => s.startTrial);
  const prices = useMemo(() => getPlanPrices(), []);

  const renderFreeCell = (free: FreeCell) => {
    if (free === 'check') {
      return (
        <AppText weight="bold" size={14} color={colors.success} center style={styles.freeCol}>
          ✓
        </AppText>
      );
    }
    if (free === 'partial') {
      return (
        <AppText size={12.5} color={colors.faint} center style={styles.freeCol}>
          {t('paywall.partial')}
        </AppText>
      );
    }
    return (
      <AppText size={14} color={colors.chevron} center style={styles.freeCol}>
        —
      </AppText>
    );
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.cream, paddingTop: insets.top + 10 }]}>
      {/* Close */}
      <Pressable
        onPress={() => navigation.goBack()}
        style={({ pressed }) => [
          styles.close,
          { backgroundColor: colors.card, borderColor: colors.hairline },
          { top: insets.top + 10, left: 22 },
          pressed && { opacity: 0.7 },
        ]}
        hitSlop={10}
      >
        <AppText size={14} color={colors.muted}>
          ✕
        </AppText>
      </Pressable>

      {/* Header — rating, title, subtitle */}
      <View style={styles.header}>
        <View style={styles.ratingRow}>
          <View style={styles.diamondsRow}>
            {[0, 1, 2, 3, 4].map((i) => (
              <DiamondBullet key={i} size={9} color={colors.gold500} />
            ))}
          </View>
          <AppText weight="bold" size={13} color={colors.ink} tabular>
            4.9
          </AppText>
          <AppText size={12.5} color={colors.muted}>
            {t('paywall.socialProof')}
          </AppText>
        </View>
        <AppText weight="bold" size={26} color={colors.ink} center lineHeight={36} style={{ marginTop: 12 }}>
          {t('paywall.compareTitle')}
        </AppText>
        <AppText size={14.5} color={colors.muted} center style={{ marginTop: 6 }}>
          {t('paywall.compareSubtitle')}
        </AppText>
      </View>

      {/* Comparison table */}
      <Card padded={false} style={[styles.table, shadows.card]}>
        <View style={[styles.tableHeader, { backgroundColor: colors.fill4 }]}>
          <View style={{ flex: 1 }} />
          <AppText weight="bold" size={12.5} color={colors.muted} center style={styles.freeCol}>
            {t('common.free')}
          </AppText>
          <AppText weight="bold" size={12.5} color={colors.gold500} center style={styles.premiumCol}>
            {t('common.premium') + ' ✦'}
          </AppText>
        </View>
        {FEATURES.map((feature, index) => (
          <React.Fragment key={feature.key}>
            {index > 0 && <View style={[styles.rowSeparator, { backgroundColor: colors.fill5 }]} />}
            <View style={styles.featureRow}>
              <AppText weight="medium" size={14} color={colors.ink} style={{ flex: 1 }}>
                {t(`paywall.${feature.key}`)}
              </AppText>
              {renderFreeCell(feature.free)}
              <AppText weight="bold" size={14} color={colors.gold500} center style={styles.premiumCol}>
                ✓
              </AppText>
            </View>
          </React.Fragment>
        ))}
      </Card>

      {/* Plan selector */}
      <View style={styles.plansRow}>
        <Pressable
          onPress={() => selectPlan('yearly')}
          style={[
            styles.planCard,
            { backgroundColor: colors.card, flex: 1.2 },
            selectedPlan === 'yearly'
              ? [styles.planSelected, { borderColor: colors.gold500 }]
              : [styles.planIdle, { borderColor: colors.hairlineStrong }],
            selectedPlan === 'yearly' && shadows.selectedCard,
          ]}
        >
          <View style={[styles.saveBadge, { backgroundColor: colors.gold500 }]}>
            <AppText weight="bold" size={10} color={colors.card}>
              {t('paywall.save50')}
            </AppText>
          </View>
          <AppText weight="bold" size={14} color={colors.ink}>
            {t('paywall.yearly')}
          </AppText>
          <AppText size={12} color={colors.muted} tabular style={{ marginTop: 2 }}>
            {t('paywall.perMonthShort', { price: prices.yearlyPerMonth })}
          </AppText>
        </Pressable>
        <Pressable
          onPress={() => selectPlan('monthly')}
          style={[
            styles.planCard,
            { backgroundColor: colors.card, flex: 1 },
            selectedPlan === 'monthly'
              ? [styles.planSelected, { borderColor: colors.gold500 }]
              : [styles.planIdle, { borderColor: colors.hairlineStrong }],
            selectedPlan === 'monthly' && shadows.selectedCard,
          ]}
        >
          <AppText weight="semibold" size={14} color={colors.ink}>
            {t('paywall.monthly')}
          </AppText>
          <AppText size={12} color={colors.muted} tabular style={{ marginTop: 2 }}>
            {t('paywall.perMonthShort', { price: prices.monthly })}
          </AppText>
        </Pressable>
      </View>

      <View style={{ flex: 1 }} />

      {/* CTA + trust line */}
      <PrimaryButton
        height={56}
        label={t('paywall.startFreeTrial')}
        onPress={() => {
          startTrial(selectedPlan);
          navigation.goBack();
        }}
      />
      <AppText size={12.5} color={colors.faint} center style={styles.trustLine}>
        {t('paywall.trustLine')}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 22,
  },
  close: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // overlay at the physical top-left, mirroring the trial paywall's ✕
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 2,
  },
  header: {
    alignItems: 'center',
    marginTop: 10,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  diamondsRow: {
    flexDirection: 'row',
    gap: 2.5,
  },
  table: {
    borderRadius: 24,
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 18,
    borderTopStartRadius: 23,
    borderTopEndRadius: 23,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  freeCol: { width: 64 },
  premiumCol: { width: 84 },
  rowSeparator: {
    height: 1,
    marginHorizontal: 18,
  },
  plansRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  planCard: {
    borderRadius: 18,
    paddingVertical: 13,
    paddingHorizontal: 15,
  },
  planIdle: {
    borderWidth: 1,
  },
  planSelected: {
    borderWidth: 1.5,
  },
  saveBadge: {
    position: 'absolute',
    top: -9,
    start: 14,
    paddingVertical: 2,
    paddingHorizontal: 9,
    borderRadius: 999,
  },
  trustLine: {
    marginTop: 10,
    marginBottom: 44,
  },
});
