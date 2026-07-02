import React, { createContext, useContext, useMemo, type PropsWithChildren } from 'react';
import { useColorScheme } from 'react-native';

import { darkColors, lightColors, type Palette } from './palettes';
import { useSettingsStore } from '../store/useSettingsStore';

export interface Theme {
  colors: Palette;
  scheme: 'light' | 'dark';
}

const ThemeContext = createContext<Theme>({ colors: lightColors, scheme: 'light' });

/**
 * Resolves the active palette from the appearance setting
 * (فاتح / داكن / تلقائي — 'auto' follows the system scheme).
 */
export function ThemeProvider({ children }: PropsWithChildren) {
  const appearance = useSettingsStore((s) => s.appearance);
  const system = useColorScheme();
  const scheme: 'light' | 'dark' =
    appearance === 'auto' ? (system === 'dark' ? 'dark' : 'light') : appearance;

  const value = useMemo<Theme>(
    () => ({ colors: scheme === 'dark' ? darkColors : lightColors, scheme }),
    [scheme]
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  return useContext(ThemeContext);
}
