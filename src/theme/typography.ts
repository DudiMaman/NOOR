/**
 * NOOR design tokens — typography.
 * UI font: IBM Plex Sans Arabic (300–700). Quran/calligraphy: Amiri.
 */
export const fonts = {
  light: 'IBMPlexSansArabic_300Light',
  regular: 'IBMPlexSansArabic_400Regular',
  medium: 'IBMPlexSansArabic_500Medium',
  semibold: 'IBMPlexSansArabic_600SemiBold',
  bold: 'IBMPlexSansArabic_700Bold',
  quran: 'Amiri_400Regular',
  quranBold: 'Amiri_700Bold',
} as const;

export const typography = {
  wordmarkLarge: { fontFamily: fonts.quran, fontSize: 96, lineHeight: 125 },
  wordmark: { fontFamily: fonts.quran, fontSize: 64, lineHeight: 84 },
  screenTitle: { fontFamily: fonts.bold, fontSize: 28 },
  sheetTitle: { fontFamily: fonts.bold, fontSize: 27, lineHeight: 39 },
  quizTitle: { fontFamily: fonts.bold, fontSize: 25, lineHeight: 36 },
  heroClock: { fontFamily: fonts.bold, fontSize: 52, fontVariant: ['tabular-nums'] as const },
  cardTitle: { fontFamily: fonts.bold, fontSize: 15.5 },
  body: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 27 },
  bodyMuted: { fontFamily: fonts.regular, fontSize: 15.5, lineHeight: 28 },
  caption: { fontFamily: fonts.regular, fontSize: 12.5 },
  quranBody: { fontFamily: fonts.quran, fontSize: 23, lineHeight: 54 },
  quoteAmiri: { fontFamily: fonts.quran, fontSize: 17.5, lineHeight: 33 },
} as const;
