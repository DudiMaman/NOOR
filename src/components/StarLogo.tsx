import React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { colors } from '../theme';

export interface StarLogoProps {
  /** side length of each square outline */
  size?: number;
  color?: string;
  borderWidth?: number;
  /** show the glowing center dot */
  withDot?: boolean;
  dotSize?: number;
  style?: ViewStyle;
}

/**
 * Brand motif: 8-point star — two overlapping square outlines, one rotated
 * 45°, with an optional glowing gold center dot.
 */
export function StarLogo({
  size = 66,
  color = colors.gold500,
  borderWidth = 1.5,
  withDot = true,
  dotSize = 12,
  style,
}: StarLogoProps) {
  const box = size * 1.45;
  const radius = Math.max(4, size * 0.15);
  const square: ViewStyle = {
    position: 'absolute',
    width: size,
    height: size,
    borderWidth,
    borderColor: color,
    borderRadius: radius,
  };
  return (
    <View style={[{ width: box, height: box, alignItems: 'center', justifyContent: 'center' }, style]}>
      <View style={[square, { transform: [{ rotate: '45deg' }] }]} />
      <View style={square} />
      {withDot && (
        <View
          style={[
            styles.dot,
            {
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              backgroundColor: color,
              shadowColor: color,
            },
          ]}
        />
      )}
    </View>
  );
}

/** Small diamond bullet (single rotated square), used for benefits/particles. */
export function DiamondBullet({
  size = 7,
  color = colors.gold500,
  outline = false,
  style,
}: {
  size?: number;
  color?: string;
  outline?: boolean;
  style?: ViewStyle;
}) {
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          transform: [{ rotate: '45deg' }],
          ...(outline ? { borderWidth: 1, borderColor: color } : { backgroundColor: color }),
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  dot: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 6,
  },
});
