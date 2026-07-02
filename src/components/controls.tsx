import React from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';

import { AppText } from './AppText';
import { colors } from '../theme';

/**
 * iOS-style toggle — 50×30 track with 25px white knob by default (design 1p);
 * prayer rows use the compact 44×27 variant (design 1m).
 */
export function IOSToggle({
  value,
  onValueChange,
  goldWhenOn = false,
  width = 50,
  height = 30,
}: {
  value: boolean;
  onValueChange: (value: boolean) => void;
  goldWhenOn?: boolean;
  width?: number;
  height?: number;
}) {
  const onColor = goldWhenOn ? 'rgba(196,164,95,0.9)' : colors.emerald800;
  const knob = height - 5;
  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      hitSlop={8}
      style={[
        styles.track,
        { width, height, borderRadius: height / 2 },
        { backgroundColor: value ? onColor : colors.trackOff },
      ]}
    >
      <View
        style={[
          styles.knob,
          { width: knob, height: knob, borderRadius: knob / 2 },
          value ? styles.knobOn : styles.knobOff,
        ]}
      />
    </Pressable>
  );
}

/** Segmented control — أمس/اليوم/غدًا, appearance switch, etc. */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  compact = false,
  style,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  compact?: boolean;
  style?: ViewStyle;
}) {
  return (
    <View style={[styles.segmentTrack, compact && styles.segmentTrackCompact, style]}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[
              styles.segment,
              compact && styles.segmentCompact,
              active && styles.segmentActive,
            ]}
          >
            <AppText
              size={compact ? 12.5 : 14}
              weight={active ? 'bold' : 'medium'}
              color={active ? colors.emerald800 : colors.muted}
            >
              {option.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

/** 22px emerald check circle used on selected cards. */
export function CheckCircle({ checked = true, size = 22 }: { checked?: boolean; size?: number }) {
  if (!checked) {
    return (
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 1.5,
          borderColor: 'rgba(13,53,40,0.2)',
        }}
      />
    );
  }
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: colors.emerald800,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <AppText size={12} color={colors.creamText}>
        ✓
      </AppText>
    </View>
  );
}

/** Thin progress bar with gold fill (quiz progress, reading progress). */
export function ProgressBar({
  progress,
  height = 5,
  trackColor = colors.fill10,
  fillColor = colors.gold500,
  style,
}: {
  /** 0..1 */
  progress: number;
  height?: number;
  trackColor?: string;
  fillColor?: string;
  style?: ViewStyle;
}) {
  return (
    <View style={[{ height, borderRadius: height / 2, backgroundColor: trackColor, overflow: 'hidden' }, style]}>
      <View
        style={{
          width: `${Math.min(100, Math.max(0, progress * 100))}%`,
          height: '100%',
          borderRadius: height / 2,
          backgroundColor: fillColor,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 50,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    paddingHorizontal: 2.5,
  },
  knob: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  // In RTL the layout mirrors automatically; flex-end = "on" side
  knobOn: { alignSelf: 'flex-end' },
  knobOff: { alignSelf: 'flex-start' },
  segmentTrack: {
    flexDirection: 'row',
    backgroundColor: colors.fill6,
    borderRadius: 14,
    padding: 4,
  },
  segmentTrackCompact: { borderRadius: 11, padding: 3 },
  segment: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 11,
  },
  segmentCompact: { flex: 0, paddingHorizontal: 13, paddingVertical: 5, borderRadius: 8 },
  segmentActive: {
    backgroundColor: '#fff',
    shadowColor: '#0D3528',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});
