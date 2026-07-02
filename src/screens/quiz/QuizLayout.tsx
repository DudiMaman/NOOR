import React, { type PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { AppText, PrimaryButton, ProgressBar } from '../../components';
import { useTheme } from '../../theme';

const TOTAL_STEPS = 4;

/**
 * Shared quiz screen chrome — gold progress bar + "n / 4" counter,
 * title, helper line, options (children), spacer and bottom CTA.
 */
export function QuizLayout({
  step,
  title,
  helper,
  ctaLabel,
  ctaDisabled = false,
  onContinue,
  children,
}: PropsWithChildren<{
  /** 1-based quiz step (1..4) */
  step: number;
  title: string;
  helper: string;
  /** Defaults to t('common.continue') */
  ctaLabel?: string;
  ctaDisabled?: boolean;
  onContinue: () => void;
}>) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: colors.cream, paddingTop: insets.top + 14 }]}
    >
      <View style={styles.progressRow}>
        <ProgressBar progress={step / TOTAL_STEPS} height={5} style={styles.progressBar} />
        <AppText
          weight="semibold"
          size={13}
          color={colors.muted}
          numberOfLines={1}
          style={styles.counter}
        >
          {step} / {TOTAL_STEPS}
        </AppText>
      </View>

      <AppText weight="bold" size={25} color={colors.ink} lineHeight={36} style={styles.title}>
        {title}
      </AppText>
      <AppText size={15} color={colors.muted} style={styles.helper}>
        {helper}
      </AppText>

      {children}

      <View style={styles.spacer} />
      <PrimaryButton
        label={ctaLabel ?? t('common.continue')}
        onPress={onContinue}
        disabled={ctaDisabled}
        height={54}
        labelWeight="semibold"
        style={styles.cta}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingBottom: 6,
  },
  progressBar: { flex: 1 },
  counter: { writingDirection: 'ltr' },
  title: { marginTop: 28 },
  helper: { marginTop: 8 },
  spacer: { flex: 1 },
  cta: { marginBottom: 48 },
});
