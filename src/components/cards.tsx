import React, { type PropsWithChildren } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { AppText } from './AppText';
import { CheckCircle } from './controls';
import { radii, shadows, useTheme } from '../theme';

/** Plain white card with hairline border. */
export function Card({
  children,
  style,
  onPress,
  padded = true,
}: PropsWithChildren<{ style?: StyleProp<ViewStyle>; onPress?: () => void; padded?: boolean }>) {
  const { colors } = useTheme();
  const content = (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.hairline },
        padded && styles.cardPadding,
        style,
      ]}
    >
      {children}
    </View>
  );
  if (!onPress) return content;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}>
      {content}
    </Pressable>
  );
}

/** Grouped list card — children separated by inset hairlines. */
export function ListCard({
  children,
  style,
}: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  const { colors } = useTheme();
  const items = React.Children.toArray(children);
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.hairline, overflow: 'hidden' },
        style,
      ]}
    >
      {items.map((child, index) => (
        <React.Fragment key={index}>
          {child}
          {index < items.length - 1 && (
            <View style={[styles.separator, { backgroundColor: colors.separator }]} />
          )}
        </React.Fragment>
      ))}
    </View>
  );
}

/**
 * Selection card (quiz / plans): white by default; selected → cream tint,
 * 1.5px gold border, soft gold shadow + emerald check.
 */
export function SelectableCard({
  selected,
  onPress,
  children,
  showCheck = true,
  checkPosition = 'end',
  style,
}: PropsWithChildren<{
  selected: boolean;
  onPress: () => void;
  showCheck?: boolean;
  /** 'end' = inline trailing check; 'corner' = absolute top-corner check */
  checkPosition?: 'end' | 'corner' | 'none';
  style?: StyleProp<ViewStyle>;
}>) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.selectable,
        selected
          ? [styles.selectableSelected, { backgroundColor: colors.creamTint, borderColor: colors.gold500 }]
          : [styles.selectableIdle, { backgroundColor: colors.card, borderColor: colors.fill8 }],
        selected && shadows.selectedCard,
        pressed && { opacity: 0.9 },
        style,
      ]}
    >
      {showCheck && checkPosition === 'corner' && (
        <View style={styles.cornerCheck}>
          <CheckCircle checked={selected} size={22} />
        </View>
      )}
      {children}
      {showCheck && checkPosition === 'end' && <CheckCircle checked={selected} size={22} />}
    </Pressable>
  );
}

/** Small icon chip (36–42px rounded square) on light cards. */
export function IconChip({
  children,
  size = 36,
  dark = false,
  gold = false,
  style,
}: PropsWithChildren<{ size?: number; dark?: boolean; gold?: boolean; style?: StyleProp<ViewStyle> }>) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: radii.iconChip,
          backgroundColor: dark ? colors.emerald800 : gold ? colors.goldTint20 : colors.gold100,
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

/** Section label above grouped cards — "الصلوات". */
export function SectionLabel({ children, style }: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  const { colors } = useTheme();
  return (
    <AppText
      weight="bold"
      size={13}
      color={colors.muted}
      style={[{ marginHorizontal: 4, marginTop: 18, marginBottom: 8, letterSpacing: 0.3 }, style]}
    >
      {children}
    </AppText>
  );
}

/** Kicker row: small gold star outline + gold bold label. */
export function KickerLabel({ label }: { label: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.kickerRow}>
      <View style={styles.kickerStar}>
        <View style={[styles.kickerSquare, { transform: [{ rotate: '45deg' }] }]} />
        <View style={styles.kickerSquare} />
      </View>
      <AppText weight="bold" size={12.5} color={colors.gold500} style={{ letterSpacing: 0.5 }}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.card,
    borderWidth: 1,
  },
  cardPadding: { paddingHorizontal: 18, paddingVertical: 15 },
  separator: {
    height: 1,
    marginHorizontal: 18,
  },
  selectable: {
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectableIdle: {
    borderWidth: 1,
  },
  selectableSelected: {
    borderWidth: 1.5,
  },
  cornerCheck: { position: 'absolute', top: 12, left: 12, zIndex: 2 },
  kickerRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  kickerStar: { width: 14, height: 14, alignItems: 'center', justifyContent: 'center' },
  kickerSquare: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderWidth: 1.2,
    borderColor: '#C4A45F',
  },
});
