import { colors as lightBase } from './colors';

/** Full color palette — both schemes expose exactly the same token names. */
export type Palette = { [K in keyof typeof lightBase]: string };

export const lightColors: Palette = { ...lightBase };

/**
 * Dark palette derived from the design tokens: deep-emerald surfaces, the
 * same gold accents, cream-leaning text. Tokens used on the already-dark
 * hero screens (creamText, glass, gold tints…) keep their light values so
 * splash/onboarding/paywall look identical in both schemes.
 */
export const darkColors: Palette = {
  ...lightBase,

  // Surfaces
  cream: '#0B1D16',
  creamTint: '#152A20',
  card: '#122620',

  // Ink → cream-leaning text on dark surfaces
  ink: '#F0EBE0',
  inkQuran: '#EDE7D8',
  inkBody: '#C6CFC7',
  muted: '#95A59A',
  faint: '#6E7E73',
  chevron: '#41544A',

  // Primary interactive surfaces get one step lighter for contrast
  emerald800: '#16503C',
  emerald700: '#1B5B44',

  // Semantic
  destructive: '#C97768',
  success: '#7BAA92',

  // Hairlines / fills flip to light-on-dark
  hairline: 'rgba(232,217,180,0.08)',
  hairlineStrong: 'rgba(232,217,180,0.12)',
  separator: 'rgba(232,217,180,0.07)',
  trackOff: 'rgba(246,243,236,0.18)',
  fill4: 'rgba(246,243,236,0.05)',
  fill5: 'rgba(246,243,236,0.06)',
  fill6: 'rgba(246,243,236,0.07)',
  fill7: 'rgba(246,243,236,0.08)',
  fill8: 'rgba(246,243,236,0.09)',
  fill10: 'rgba(246,243,236,0.12)',
};
