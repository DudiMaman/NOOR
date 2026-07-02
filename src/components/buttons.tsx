import React from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { AppText } from './AppText';
import { Shimmer } from './Shimmer';
import { colors, gradients, shadows } from '../theme';

interface CtaProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  /** show the round arrow circle at the trailing edge (onboarding style) */
  withArrow?: boolean;
  /** ambient shimmer sweep across the button */
  shimmer?: boolean;
  height?: number;
  style?: ViewStyle;
}

/** Primary emerald pill CTA — "متابعة". */
export function PrimaryButton({
  label,
  onPress,
  disabled,
  withArrow,
  shimmer,
  height = 54,
  style,
}: CtaProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        shadows.primaryCta,
        {
          height,
          borderRadius: height / 2,
          backgroundColor: colors.emerald800,
          opacity: disabled ? 0.45 : pressed ? 0.9 : 1,
          paddingHorizontal: withArrow ? 8 : 20,
        },
        style,
      ]}
    >
      {shimmer && <Shimmer light />}
      <AppText weight="bold" size={17} color={colors.creamText} style={styles.label}>
        {label}
      </AppText>
      {withArrow && (
        <LinearGradient
          colors={gradients.goldCta}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.arrowCircle}
        >
          <AppText weight="bold" size={18} color={colors.emerald800}>
            ←
          </AppText>
        </LinearGradient>
      )}
    </Pressable>
  );
}

/** Gold gradient CTA — trial / "لنبدأ". */
export function GoldButton({
  label,
  onPress,
  disabled,
  withArrow,
  shimmer,
  height = 56,
  style,
}: CtaProps) {
  return (
    <Pressable onPress={onPress} disabled={disabled} style={({ pressed }) => [{ opacity: pressed ? 0.92 : 1 }, style]}>
      <LinearGradient
        colors={gradients.goldCta}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.base,
          shadows.goldCta,
          { height, borderRadius: height / 2, paddingHorizontal: withArrow ? 8 : 20, opacity: disabled ? 0.5 : 1 },
        ]}
      >
        {shimmer && <Shimmer />}
        <AppText weight="bold" size={17.5} color={colors.emerald800} style={styles.label}>
          {label}
        </AppText>
        {withArrow && (
          <View style={[styles.arrowCircle, { backgroundColor: colors.emerald800 }]}>
            <AppText weight="bold" size={18} color={colors.gold300}>
              ←
            </AppText>
          </View>
        )}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  label: { flex: 1, textAlign: 'center' },
  arrowCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
});
