import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

/**
 * Moving light-strip sweep (design keyframe `nShimmer`):
 * translateX 130% → −130% with an 18° skew, looping.
 */
export function Shimmer({
  light = false,
  duration = 3600,
  width = 60,
}: {
  /** brighter strip for dark buttons */
  light?: boolean;
  duration?: number;
  width?: number;
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(withTiming(1, { duration, easing: Easing.inOut(Easing.ease) }), -1, false);
  }, [duration, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: 320 - progress.value * 640 },
      { skewX: '-18deg' },
    ],
  }));

  const tint = light ? 'rgba(245,238,220,0.14)' : 'rgba(255,255,255,0.35)';

  return (
    <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { width }, animatedStyle]}>
      <LinearGradient
        colors={['transparent', tint, 'transparent']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={{ flex: 1, width }}
      />
    </Animated.View>
  );
}
