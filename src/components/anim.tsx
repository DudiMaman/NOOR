import React, { useEffect, type PropsWithChildren } from 'react';
import type { ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { DiamondBullet } from './StarLogo';
import { colors } from '../theme';

/** Entrance (design `nUp`): translateY(26)+fade → 0, 0.7s, staggered delays. */
export function FadeUp({
  delay = 0,
  children,
  style,
}: PropsWithChildren<{ delay?: number; style?: ViewStyle }>) {
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withDelay(delay, withTiming(1, { duration: 700, easing: Easing.out(Easing.ease) }));
  }, [delay, progress]);
  const animated = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: 26 * (1 - progress.value) }],
  }));
  return <Animated.View style={[style, animated]}>{children}</Animated.View>;
}

/** Ambient bobbing (design `nFloat`/`nFloat2`): ±7–11px loop. */
export function Floating({
  amplitude = 11,
  duration = 5000,
  delay = 0,
  children,
  style,
}: PropsWithChildren<{ amplitude?: number; duration?: number; delay?: number; style?: ViewStyle }>) {
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withDelay(
      delay,
      withRepeat(withTiming(1, { duration: duration / 2, easing: Easing.inOut(Easing.ease) }), -1, true)
    );
  }, [delay, duration, progress]);
  const animated = useAnimatedStyle(() => ({
    transform: [{ translateY: -amplitude * progress.value }],
  }));
  return <Animated.View style={[style, animated]}>{children}</Animated.View>;
}

/** Twinkling gold diamond particle (design `nTwinkle`). */
export function Twinkle({
  size = 8,
  duration = 3800,
  delay = 0,
  style,
}: {
  size?: number;
  duration?: number;
  delay?: number;
  style?: ViewStyle;
}) {
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withDelay(
      delay,
      withRepeat(withTiming(1, { duration: duration / 2, easing: Easing.inOut(Easing.ease) }), -1, true)
    );
  }, [delay, duration, progress]);
  const animated = useAnimatedStyle(() => ({
    opacity: 0.12 + progress.value * 0.83,
    transform: [{ scale: 0.6 + progress.value * 0.6 }, { rotate: '45deg' }],
  }));
  return (
    <Animated.View style={[{ position: 'absolute' }, style, animated]}>
      <DiamondBullet size={size} color={colors.gold300} />
    </Animated.View>
  );
}

/** Breathing radial glow opacity (design `nGlow`). */
export function Glow({
  duration = 6000,
  children,
  style,
}: PropsWithChildren<{ duration?: number; style?: ViewStyle }>) {
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withRepeat(withTiming(1, { duration: duration / 2, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, [duration, progress]);
  const animated = useAnimatedStyle(() => ({ opacity: 0.3 + progress.value * 0.55 }));
  return (
    <Animated.View pointerEvents="none" style={[style, animated]}>
      {children}
    </Animated.View>
  );
}

/** Expanding radar ring (design `nPulse`): scale .45→1.7, fade out, staggered. */
export function PulseRing({
  size = 90,
  delay = 0,
  style,
}: {
  size?: number;
  delay?: number;
  style?: ViewStyle;
}) {
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withDelay(
      delay,
      withRepeat(
        withSequence(withTiming(0, { duration: 0 }), withTiming(1, { duration: 3200, easing: Easing.out(Easing.ease) })),
        -1,
        false
      )
    );
  }, [delay, progress]);
  const animated = useAnimatedStyle(() => ({
    opacity: 0.9 * (1 - progress.value),
    transform: [{ scale: 0.45 + progress.value * 1.25 }],
  }));
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 1.5,
          borderColor: 'rgba(196,164,95,0.55)',
        },
        style,
        animated,
      ]}
    />
  );
}

/** Continuous rotation container (design `nOrbit`/`nOrbitR`). */
export function Orbit({
  duration = 14000,
  reverse = false,
  children,
  style,
}: PropsWithChildren<{ duration?: number; reverse?: boolean; style?: ViewStyle }>) {
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withRepeat(withTiming(1, { duration, easing: Easing.linear }), -1, false);
  }, [duration, progress]);
  const animated = useAnimatedStyle(() => ({
    transform: [{ rotate: `${(reverse ? -360 : 360) * progress.value}deg` }],
  }));
  return <Animated.View style={[style, animated]}>{children}</Animated.View>;
}
