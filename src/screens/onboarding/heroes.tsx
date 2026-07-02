import React, { useEffect, type PropsWithChildren, type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

import {
  AppText,
  DiamondBullet,
  EmeraldRadialBackground,
  Floating,
  GlassChip,
  Glow,
  Orbit,
  PulseRing,
  RadialGlow,
  Twinkle,
} from '../../components';
import { colors, gradients, shadows } from '../../theme';

// ————————————————————————————————————————————————————————————————————————
// Design values from the onboarding HTML references (2a–2d) that have no
// theme token — kept as local constants for pixel fidelity.
// ————————————————————————————————————————————————————————————————————————
const SILHOUETTE = '#061E16'; // skyline dome + minarets
const ON_DARK_70 = 'rgba(245,238,220,0.7)'; // time-chip labels
const ARC_BORDER = 'rgba(196,164,95,0.4)';
const HORIZON_GOLD = 'rgba(196,164,95,0.45)';
const GOLD_TRANSPARENT = 'rgba(196,164,95,0)';
const PUCK_BG = 'rgba(196,164,95,0.14)';
const PUCK_BORDER = 'rgba(196,164,95,0.6)';
const NOTIF_BG = 'rgba(246,243,236,0.97)';
const BACK_CARD_A = 'rgba(246,243,236,0.14)';
const BACK_CARD_B = 'rgba(246,243,236,0.24)';
const DIAMOND_OUTLINE = 'rgba(196,164,95,0.7)';
const CARD_SHIMMER = 'rgba(196,164,95,0.18)';
const ORBIT_SOLID = 'rgba(196,164,95,0.3)';
const ORBIT_DASHED = 'rgba(196,164,95,0.22)';
const WORDMARK_GLOW = 'rgba(232,217,180,0.5)';

// ————————————————————————————————————————————————————————————————————————
// Shared animated helpers
// ————————————————————————————————————————————————————————————————————————

/** Sun traveling along the arc (design `nSun`): rotate −58°↔58°, 9s alternate. */
function TravelingSun() {
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 9000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [progress]);
  const arm = useAnimatedStyle(() => ({
    transform: [{ rotate: `${-58 + progress.value * 116}deg` }],
  }));
  return (
    <Animated.View pointerEvents="none" style={[styles.sunArm, arm]}>
      <View style={styles.sunDot} />
    </Animated.View>
  );
}

/** Slow tilt + bob loop (design `nCardBack`/`nCardBack2`/`nCardTop`). */
function TiltFloat({
  fromDeg,
  toDeg,
  toY,
  duration,
  delay = 0,
  style,
  children,
}: PropsWithChildren<{
  fromDeg: number;
  toDeg: number;
  toY: number;
  duration: number;
  delay?: number;
  style?: StyleProp<ViewStyle>;
}>) {
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, { duration: duration / 2, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      )
    );
  }, [delay, duration, progress]);
  const animated = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${fromDeg + (toDeg - fromDeg) * progress.value}deg` },
      { translateY: toY * progress.value },
    ],
  }));
  return <Animated.View style={[style, animated]}>{children}</Animated.View>;
}

/** Gold light sweep across the hadith card (design `nShimmer`, gold tint). */
function GoldCardShimmer({ width = 70, duration = 4500 }: { width?: number; duration?: number }) {
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration, easing: Easing.inOut(Easing.ease) }),
      -1,
      false
    );
  }, [duration, progress]);
  const animated = useAnimatedStyle(() => ({
    transform: [{ translateX: 220 - progress.value * 440 }, { skewX: '-18deg' }],
  }));
  return (
    <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { width }, animated]}>
      <LinearGradient
        colors={[GOLD_TRANSPARENT, CARD_SHIMMER, GOLD_TRANSPARENT]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.fill}
      />
    </Animated.View>
  );
}

/**
 * Live notification card cycling in/out (design `nNotif`, 6.5s loop):
 * slide-up in (20px + scale .96) → hold → fade-up out.
 */
function NotifCard({
  top,
  delay = 0,
  icon,
  title,
  subtitle,
  trailing,
}: {
  top: number;
  delay?: number;
  icon: ReactNode;
  title: string;
  subtitle: string;
  trailing: string;
}) {
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withDelay(
      delay,
      withRepeat(withTiming(1, { duration: 6500, easing: Easing.linear }), -1, false)
    );
  }, [delay, progress]);
  const animated = useAnimatedStyle(() => {
    const stops = [0, 0.12, 0.22, 0.78, 0.9, 1];
    return {
      opacity: interpolate(progress.value, stops, [0, 0, 1, 1, 0, 0]),
      transform: [
        { translateY: interpolate(progress.value, stops, [20, 20, 0, 0, -12, -12]) },
        { scale: interpolate(progress.value, stops, [0.96, 0.96, 1, 1, 0.98, 0.98]) },
      ],
    };
  });
  return (
    <Animated.View style={[styles.notifCard, shadows.notification, { top }, animated]}>
      {icon}
      <View style={styles.notifTexts}>
        <AppText weight="bold" size={13} color={colors.ink}>
          {title}
        </AppText>
        <AppText size={11} color={colors.muted} style={styles.notifSub}>
          {subtitle}
        </AppText>
      </View>
      <AppText size={10} color={colors.faint}>
        {trailing}
      </AppText>
    </Animated.View>
  );
}

/** Floating glass prayer-time chip (label over tabular time). */
function TimeChip({ label, time }: { label: string; time: string }) {
  return (
    <GlassChip pill={false} style={styles.timeChip}>
      <AppText size={11.5} color={ON_DARK_70}>
        {label}
      </AppText>
      <AppText weight="bold" size={15} color={colors.creamText} tabular>
        {time}
      </AppText>
    </GlassChip>
  );
}

// ————————————————————————————————————————————————————————————————————————
// 2a — Prayer times: arc + traveling sun, skyline, floating time chips
// ————————————————————————————————————————————————————————————————————————
export function TimesHero() {
  const { t } = useTranslation();
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient
        colors={gradients.onboarding1}
        locations={[0, 0.42, 0.78, 1] as const}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <Glow duration={6000} style={styles.timesGlow}>
        <RadialGlow size={380} opacity={0.28} style={styles.inlineGlow} />
      </Glow>
      <Twinkle size={9} duration={3400} style={{ top: 88, right: 44 }} />
      <Twinkle size={7} duration={4200} delay={1100} style={{ top: 150, left: 38 }} />
      <Twinkle size={6} duration={3800} delay={2000} style={{ top: 330, right: 34 }} />

      {/* gold arc (top half of a 270px circle, clipped) */}
      <View style={styles.arcClip}>
        <View style={styles.arcCircle} />
      </View>
      <TravelingSun />

      {/* horizon hairline */}
      <LinearGradient
        colors={[GOLD_TRANSPARENT, HORIZON_GOLD, GOLD_TRANSPARENT]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.horizon}
      />

      {/* skyline silhouette: minaret · dome · minaret */}
      <View style={styles.skyline}>
        <View style={[styles.minaret, styles.minaretShort]}>
          <View style={styles.finial} />
        </View>
        <View style={styles.dome} />
        <View style={[styles.minaret, styles.minaretTall]}>
          <View style={styles.finial} />
        </View>
      </View>

      {/* floating time chips */}
      <Floating duration={5000} style={{ position: 'absolute', top: 128, right: 26 }}>
        <TimeChip label={t('prayers.fajr')} time="4:12" />
      </Floating>
      {/* nFloat2 phase: base offset +7, amplitude 13 (−6↔+7 range) */}
      <Floating amplitude={13} duration={6000} delay={800} style={{ position: 'absolute', top: 219, left: 22 }}>
        <TimeChip label={t('prayers.dhuhr')} time="12:46" />
      </Floating>
      <Floating duration={5600} delay={1600} style={{ position: 'absolute', top: 342, right: 52 }}>
        <TimeChip label={t('prayers.maghrib')} time="19:48" />
      </Floating>
    </View>
  );
}

// ————————————————————————————————————————————————————————————————————————
// 2b — Smart reminders: pulsing radar + live notification cards
// ————————————————————————————————————————————————————————————————————————
export function RemindersHero() {
  const { t } = useTranslation();
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <EmeraldRadialBackground highlight={colors.emerald600} cy="0%" />
      <Twinkle size={8} duration={3600} style={{ top: 96, left: 40 }} />
      <Twinkle size={6} duration={4400} delay={1400} style={{ top: 210, right: 30 }} />
      <Twinkle size={7} duration={4000} delay={2200} style={{ top: 400, left: 34 }} />

      {/* pulsing radar */}
      <PulseRing size={90} style={styles.radarRing} />
      <PulseRing size={90} delay={1100} style={styles.radarRing} />
      <PulseRing size={90} delay={2200} style={styles.radarRing} />
      <View style={styles.radarPuck}>
        <View style={styles.pinRing}>
          <View style={styles.pinDot} />
        </View>
      </View>

      {/* live notifications */}
      <NotifCard
        top={132}
        icon={
          <View style={[styles.notifIcon, styles.notifIconEmerald]}>
            <View style={styles.bell} />
          </View>
        }
        title={t('onboarding.s2.notif1Title')}
        subtitle={t('onboarding.s2.notif1Sub')}
        trailing={t('common.now')}
      />
      <NotifCard
        top={420}
        delay={3250}
        icon={
          <View style={[styles.notifIcon, styles.notifIconGold]}>
            <AppText amiri size={17} color={colors.emerald800}>
              ذ
            </AppText>
          </View>
        }
        title={t('onboarding.s2.notif2Title')}
        subtitle={t('onboarding.s2.notif2Sub')}
        trailing={t('common.soon')}
      />
    </View>
  );
}

// ————————————————————————————————————————————————————————————————————————
// 2c — Daily content: fanned hadith card stack + floating tag chips
// ————————————————————————————————————————————————————————————————————————
export function ContentHero() {
  const { t } = useTranslation();
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient
        colors={gradients.onboarding3}
        locations={[0, 0.55, 1] as const}
        start={{ x: 0.37, y: 0 }}
        end={{ x: 0.63, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <Glow duration={7000} style={styles.contentGlow}>
        <RadialGlow size={360} opacity={0.2} style={styles.inlineGlow} />
      </Glow>
      <Twinkle size={8} duration={3800} style={{ top: 100, right: 36 }} />
      <Twinkle size={6} duration={4600} delay={1800} style={{ top: 440, right: 56 }} />
      <Twinkle size={7} duration={4200} delay={900} style={{ top: 390, left: 40 }} />

      {/* card stack */}
      <TiltFloat fromDeg={-8} toDeg={-5} toY={-7} duration={7000} style={[styles.backCard, styles.backCardA]} />
      <TiltFloat fromDeg={7} toDeg={10} toY={6} duration={7000} delay={400} style={[styles.backCard, styles.backCardB]} />
      <TiltFloat fromDeg={0} toDeg={1.6} toY={-7} duration={6000} style={[styles.topCard, styles.topCardShadow]}>
        <GoldCardShimmer />
        <View style={styles.topCardRow}>
          <AppText weight="bold" size={11} color={colors.gold500} style={styles.hadithKicker}>
            {t('content.hadithOfDay')}
          </AppText>
          <DiamondBullet size={9} outline color={DIAMOND_OUTLINE} />
        </View>
        {/* sacred demo content — rendered verbatim, not via i18n */}
        <AppText amiri size={18.5} lineHeight={36} color={colors.ink} style={styles.hadithText}>
          «إنما الأعمال بالنيات، وإنما لكل امرئٍ ما نوى»
        </AppText>
        <View style={[styles.topCardRow, styles.topCardFooter]}>
          <AppText size={11} color={colors.muted}>
            متفق عليه
          </AppText>
          <View style={styles.readPill}>
            <AppText weight="bold" size={11} color={colors.emerald800}>
              {t('onboarding.s3.readMinutes')}
            </AppText>
          </View>
        </View>
      </TiltFloat>

      {/* floating tags */}
      <Floating duration={5400} style={{ position: 'absolute', top: 120, left: 26 }}>
        <GlassChip label={t('onboarding.s3.tag1')} />
      </Floating>
      <Floating amplitude={13} duration={6200} delay={700} style={{ position: 'absolute', top: 375, right: 30 }}>
        <GlassChip label={t('onboarding.s3.tag2')} />
      </Floating>
      <Floating duration={5800} delay={1500} style={{ position: 'absolute', top: 412, left: 58 }}>
        <GlassChip label={t('onboarding.s3.tag3')} />
      </Floating>
    </View>
  );
}

// ————————————————————————————————————————————————————————————————————————
// 2d — Arabic experience: glowing wordmark inside two gold orbits
// ————————————————————————————————————————————————————————————————————————
export function ExperienceHero() {
  const { t } = useTranslation();
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <EmeraldRadialBackground cy="8%" />
      <Glow duration={4500} style={styles.expGlow}>
        <RadialGlow size={220} opacity={0.4} style={styles.inlineGlow} />
      </Glow>

      {/* solid orbit + traveling diamond */}
      <View style={styles.orbitSolid} />
      <Orbit duration={14000} style={styles.orbitBox200}>
        <DiamondBullet size={12} color={colors.gold300} style={styles.orbitDiamond} />
      </Orbit>

      {/* dashed orbit + reverse-traveling dot */}
      <View style={styles.orbitDashed} />
      <Orbit duration={22000} reverse style={styles.orbitBox280}>
        <View style={styles.orbitDot} />
      </Orbit>

      <AppText amiri size={96} lineHeight={125} color={colors.creamText} style={styles.wordmark}>
        نور
      </AppText>

      <Twinkle size={8} duration={3500} style={{ top: 92, right: 40 }} />
      <Twinkle size={6} duration={4300} delay={1200} style={{ top: 420, right: 60 }} />
      <Twinkle size={7} duration={4000} delay={2100} style={{ top: 150, left: 36 }} />

      {/* floating chips */}
      <Floating duration={5600} style={{ position: 'absolute', top: 430, left: '50%', marginLeft: -128 }}>
        <GlassChip label={t('onboarding.s4.chip1')} />
      </Floating>
      <Floating amplitude={13} duration={6400} delay={900} style={{ position: 'absolute', top: 437, left: '50%', marginLeft: 14 }}>
        <GlassChip label={t('onboarding.s4.chip2')} />
      </Floating>
    </View>
  );
}

// ————————————————————————————————————————————————————————————————————————

const styles = StyleSheet.create({
  fill: { flex: 1 },
  inlineGlow: { position: 'relative' },

  // 2a — times
  timesGlow: { position: 'absolute', top: 150, alignSelf: 'center' },
  arcClip: {
    position: 'absolute',
    top: 170,
    alignSelf: 'center',
    width: 270,
    height: 135,
    overflow: 'hidden',
  },
  arcCircle: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 270,
    height: 270,
    borderRadius: 135,
    borderWidth: 1.5,
    borderColor: ARC_BORDER,
  },
  sunArm: {
    position: 'absolute',
    top: 175,
    alignSelf: 'center',
    width: 260,
    height: 260,
  },
  sunDot: {
    position: 'absolute',
    top: -10,
    alignSelf: 'center',
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.gold300,
    shadowColor: colors.gold300,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.95,
    shadowRadius: 34,
    elevation: 12,
  },
  horizon: {
    position: 'absolute',
    top: 305,
    alignSelf: 'center',
    width: 320,
    height: 1,
  },
  skyline: {
    position: 'absolute',
    top: 249,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 14,
    opacity: 0.9,
  },
  minaret: {
    width: 4,
    backgroundColor: SILHOUETTE,
    borderTopStartRadius: 2,
    borderTopEndRadius: 2,
  },
  minaretShort: { height: 44 },
  minaretTall: { height: 54 },
  finial: {
    position: 'absolute',
    top: -5,
    left: -1.5,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: SILHOUETTE,
  },
  dome: {
    width: 64,
    height: 32,
    borderTopStartRadius: 32,
    borderTopEndRadius: 32,
    backgroundColor: SILHOUETTE,
  },
  timeChip: { paddingHorizontal: 14, paddingVertical: 9 },

  // 2b — reminders
  radarRing: { top: 268, alignSelf: 'center' },
  radarPuck: {
    position: 'absolute',
    top: 281,
    alignSelf: 'center',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: PUCK_BG,
    borderWidth: 1.5,
    borderColor: PUCK_BORDER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinRing: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2.5,
    borderColor: colors.gold300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.gold300 },
  notifCard: {
    position: 'absolute',
    alignSelf: 'center',
    width: 248,
    backgroundColor: NOTIF_BG,
    borderRadius: 17,
    paddingVertical: 12,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  notifIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  notifIconEmerald: { backgroundColor: colors.emerald800 },
  notifIconGold: { backgroundColor: colors.gold500 },
  bell: {
    width: 12,
    height: 12,
    borderWidth: 1.5,
    borderColor: colors.gold300,
    borderTopStartRadius: 6,
    borderTopEndRadius: 6,
    borderBottomStartRadius: 4,
    borderBottomEndRadius: 4,
  },
  notifTexts: { flex: 1 },
  notifSub: { marginTop: 1 },

  // 2c — content
  contentGlow: { position: 'absolute', top: 60, alignSelf: 'center' },
  backCard: {
    position: 'absolute',
    top: 158,
    alignSelf: 'center',
    width: 240,
    height: 170,
    borderRadius: 22,
  },
  backCardA: { backgroundColor: BACK_CARD_A },
  backCardB: { backgroundColor: BACK_CARD_B },
  topCard: {
    position: 'absolute',
    top: 150,
    alignSelf: 'center',
    width: 250,
    borderRadius: 22,
    backgroundColor: colors.cream,
    paddingVertical: 18,
    paddingHorizontal: 20,
    overflow: 'hidden',
  },
  topCardShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.45,
    shadowRadius: 30,
    elevation: 16,
  },
  topCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hadithKicker: { letterSpacing: 0.4 },
  hadithText: { marginTop: 8 },
  topCardFooter: { marginTop: 10 },
  readPill: {
    backgroundColor: colors.fill7,
    paddingVertical: 4,
    paddingHorizontal: 11,
    borderRadius: 999,
  },

  // 2d — experience
  expGlow: { position: 'absolute', top: 150, alignSelf: 'center' },
  orbitSolid: {
    position: 'absolute',
    top: 160,
    alignSelf: 'center',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: ORBIT_SOLID,
  },
  orbitBox200: {
    position: 'absolute',
    top: 160,
    alignSelf: 'center',
    width: 200,
    height: 200,
  },
  orbitDiamond: {
    position: 'absolute',
    top: -6,
    alignSelf: 'center',
    shadowColor: colors.gold300,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 14,
    elevation: 8,
  },
  orbitDashed: {
    position: 'absolute',
    top: 120,
    alignSelf: 'center',
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: ORBIT_DASHED,
  },
  orbitBox280: {
    position: 'absolute',
    top: 120,
    alignSelf: 'center',
    width: 280,
    height: 280,
  },
  orbitDot: {
    position: 'absolute',
    top: '50%',
    marginTop: -5,
    right: -5,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.gold500,
    shadowColor: colors.gold500,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 8,
  },
  wordmark: {
    position: 'absolute',
    top: 196,
    alignSelf: 'center',
    textShadowColor: WORDMARK_GLOW,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 50,
  },
});
