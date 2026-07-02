import React, { type PropsWithChildren } from 'react';
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';

import { AppText } from './AppText';
import { colors } from '../theme';

/**
 * Floating glass chip on dark heroes:
 * rgba(246,243,236,0.10) + blur + gold hairline border, pill or rounded.
 */
export function GlassChip({
  label,
  children,
  onPress,
  pill = true,
  softBorder = false,
  style,
}: PropsWithChildren<{
  label?: string;
  onPress?: () => void;
  pill?: boolean;
  /** use the softer cream border (skip button) instead of gold */
  softBorder?: boolean;
  style?: StyleProp<ViewStyle>;
}>) {
  const content = (
    <BlurView
      intensity={20}
      tint="dark"
      style={[
        styles.chip,
        { borderRadius: pill ? 999 : 15, borderColor: softBorder ? colors.glassBorderSoft : colors.glassBorder },
        style,
      ]}
    >
      {label != null ? (
        <AppText weight="semibold" size={13} color={colors.creamText}>
          {label}
        </AppText>
      ) : (
        children
      )}
    </BlurView>
  );
  if (!onPress) return content;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: colors.glassBg,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    overflow: 'hidden',
    alignItems: 'center',
  },
});
