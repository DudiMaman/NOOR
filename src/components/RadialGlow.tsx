import React from 'react';
import type { ViewStyle } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

/**
 * Soft gold radial glow — the design's
 * `radial-gradient(circle, rgba(196,164,95,α) 0%, transparent ~65%)`.
 */
export function RadialGlow({
  size = 340,
  opacity = 0.22,
  color = '#C4A45F',
  style,
}: {
  size?: number;
  opacity?: number;
  color?: string;
  style?: ViewStyle;
}) {
  return (
    <Svg width={size} height={size} style={[{ position: 'absolute' }, style]} pointerEvents="none">
      <Defs>
        <RadialGradient id="glow" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor={color} stopOpacity={opacity} />
          <Stop offset="65%" stopColor={color} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Circle cx={size / 2} cy={size / 2} r={size / 2} fill="url(#glow)" />
    </Svg>
  );
}

/**
 * Dark emerald screen background with a radial highlight near the top —
 * approximates `radial-gradient(120% 60% at 50% -5%, #1B5B44, #0D3528, #082A1F)`.
 */
export function EmeraldRadialBackground({
  highlight = '#1B5B44',
  mid = '#0D3528',
  dark = '#082A1F',
  cy = '-5%',
}: {
  highlight?: string;
  mid?: string;
  dark?: string;
  cy?: string;
}) {
  return (
    <Svg width="100%" height="100%" style={{ position: 'absolute' }} pointerEvents="none">
      <Defs>
        <RadialGradient id="emeraldBg" cx="50%" cy={cy} r="100%">
          <Stop offset="0%" stopColor={highlight} stopOpacity={1} />
          <Stop offset="55%" stopColor={mid} stopOpacity={1} />
          <Stop offset="100%" stopColor={dark} stopOpacity={1} />
        </RadialGradient>
      </Defs>
      <Rect x="0" y="0" width="100%" height="100%" fill="url(#emeraldBg)" />
    </Svg>
  );
}
