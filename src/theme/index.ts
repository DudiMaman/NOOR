export { colors, gradients, shadows } from './colors';
export { fonts, typography } from './typography';
export { lightColors, darkColors, type Palette } from './palettes';
export { ThemeProvider, useTheme, type Theme } from './ThemeContext';

/** Shape tokens */
export const radii = {
  card: 20,
  cardLarge: 22,
  hero: 24,
  sheet: 38,
  pill: 999,
  chip: 15,
  segment: 14,
  iconChip: 12,
  arch: 170,
} as const;

/** Layout spacing */
export const spacing = {
  screenH: 22,
  screenHWide: 24,
  cardPad: 18,
  gap: 12,
} as const;
