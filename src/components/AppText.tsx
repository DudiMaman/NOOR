import React from 'react';
import { Text, type TextProps, type TextStyle } from 'react-native';

import { fonts, useTheme } from '../theme';

type Weight = 'light' | 'regular' | 'medium' | 'semibold' | 'bold';

export interface AppTextProps extends TextProps {
  weight?: Weight;
  size?: number;
  color?: string;
  /** Amiri — for Quran, calligraphy and quotes */
  amiri?: boolean;
  center?: boolean;
  lineHeight?: number;
  /** tabular numerals for times/prices */
  tabular?: boolean;
}

/** Themed text: IBM Plex Sans Arabic by default, Amiri via `amiri`. */
export function AppText({
  weight = 'regular',
  size = 15,
  color,
  amiri = false,
  center = false,
  lineHeight,
  tabular = false,
  style,
  ...rest
}: AppTextProps) {
  const { colors } = useTheme();
  const base: TextStyle = {
    fontFamily: amiri ? (weight === 'bold' ? fonts.quranBold : fonts.quran) : fonts[weight],
    fontSize: size,
    color: color ?? colors.ink,
    ...(center ? { textAlign: 'center' as const } : null),
    ...(lineHeight ? { lineHeight } : null),
    ...(tabular ? { fontVariant: ['tabular-nums' as const] } : null),
  };
  return <Text style={[base, style]} {...rest} />;
}
