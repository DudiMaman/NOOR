/**
 * NOOR design tokens — colors.
 * Source of truth: design/README.md (Claude Design handoff).
 */
export const colors = {
  // Emerald scale
  emerald900: '#082A1F',
  emerald800: '#0D3528', // primary
  emerald700: '#124534',
  emerald600: '#16503C',
  emerald550: '#1B5B44',

  // Gold scale
  gold500: '#C4A45F', // accent
  gold300: '#E8D9B4',
  gold100: '#F0EAD9',
  goldDark: '#8A7440',

  // Surfaces
  cream: '#F6F3EC', // app background
  creamTint: '#FBF7EE', // selected card bg
  card: '#FFFFFF',
  creamText: '#F5EEDC', // light text on emerald

  // Ink
  ink: '#14231E', // headings
  inkQuran: '#1B2A23', // Quran body
  inkBody: '#3E4E45', // body
  muted: '#66756B', // secondary
  faint: '#9AA79F', // tertiary
  chevron: '#C9D2CC',

  // Semantic
  destructive: '#B05B4C',
  success: '#5B8A72',

  // Hairlines / overlays
  hairline: 'rgba(13,53,40,0.07)',
  hairlineStrong: 'rgba(13,53,40,0.10)',
  separator: 'rgba(13,53,40,0.06)',
  trackOff: 'rgba(13,53,40,0.15)',
  fill4: 'rgba(13,53,40,0.04)',
  fill5: 'rgba(13,53,40,0.05)',
  fill6: 'rgba(13,53,40,0.06)',
  fill7: 'rgba(13,53,40,0.07)',
  fill8: 'rgba(13,53,40,0.08)',
  fill10: 'rgba(13,53,40,0.10)',

  // Glass on dark
  glassBg: 'rgba(246,243,236,0.10)',
  glassBorder: 'rgba(232,217,180,0.35)',
  glassBorderSoft: 'rgba(245,238,220,0.20)',
  onDarkFaint: 'rgba(245,238,220,0.55)',
  onDarkMuted: 'rgba(245,238,220,0.65)',
  onDarkStrong: 'rgba(245,238,220,0.90)',

  // Gold overlays
  goldTint12: 'rgba(196,164,95,0.12)',
  goldTint16: 'rgba(196,164,95,0.16)',
  goldTint20: 'rgba(196,164,95,0.20)',
  goldBorder45: 'rgba(196,164,95,0.45)',
  goldBorder50: 'rgba(196,164,95,0.50)',
} as const;

export const gradients = {
  /** Dark hero/splash: radial approximation top→bottom */
  splash: ['#1B5B44', '#0D3528', '#082A1F'] as const,
  /** Card/hero panel */
  heroCard: ['#124534', '#0D3528'] as const,
  /** Gold CTA */
  goldCta: ['#E8D9B4', '#C4A45F'] as const,
  /** Contextual (now) reading card */
  contextCard: ['#FBF4E2', '#F3E7C9'] as const,
  /** Onboarding backgrounds */
  onboarding1: ['#082A1F', '#0D3528', '#16503C', '#1B5B44'] as const,
  onboarding3: ['#0D3528', '#124534', '#16503C'] as const,
} as const;

export const shadows = {
  primaryCta: {
    shadowColor: '#0D3528',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 8,
  },
  goldCta: {
    shadowColor: '#C4A45F',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 15,
    elevation: 8,
  },
  card: {
    shadowColor: '#0D3528',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  heroCard: {
    shadowColor: '#0D3528',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
  },
  selectedCard: {
    shadowColor: '#C4A45F',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 4,
  },
  sheet: {
    shadowColor: '#061E16',
    shadowOffset: { width: 0, height: -20 },
    shadowOpacity: 0.45,
    shadowRadius: 25,
    elevation: 24,
  },
  notification: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
} as const;
