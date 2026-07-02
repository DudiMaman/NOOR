import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../../navigation/types';
import { AppText, Card, DiamondBullet, ProgressBar, RadialGlow } from '../../components';
import { ADHKAR } from '../../content/adhkar';
import { useContentStore } from '../../store/useContentStore';
import { dateKey } from '../../services/dates';
import { colors, gradients, radii, shadows } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'AdhkarReader'>;

const TITLE_KEYS = {
  morning: 'reader.morningAdhkar',
  evening: 'reader.eveningAdhkar',
  afterPrayer: 'reader.afterPrayer',
} as const;

/**
 * Adhkar reader — the serene full-text reading room for the morning/evening/
 * after-prayer adhkar. Each card is a tasbih: tapping it counts down the
 * remaining repetitions; completing every dhikr reveals a quiet celebration
 * and records the day in the content store.
 */
export function AdhkarReaderScreen({ navigation, route }: Props) {
  const { kind } = route.params;
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const items = ADHKAR[kind];

  const markedRef = useRef(false);
  const [remaining, setRemaining] = useState<number[]>(() => items.map((item) => item.repeat));
  // navigate() can update params in place — reset progress for the new set
  const [trackedKind, setTrackedKind] = useState(kind);
  if (trackedKind !== kind) {
    setTrackedKind(kind);
    setRemaining(items.map((item) => item.repeat));
    markedRef.current = false;
  }
  const done = remaining.filter((count) => count === 0).length;
  const allDone = items.length > 0 && done === items.length;

  const markAdhkarCompleted = useContentStore((s) => s.markAdhkarCompleted);
  useEffect(() => {
    if (allDone && !markedRef.current) {
      markedRef.current = true;
      markAdhkarCompleted(dateKey());
    }
  }, [allDone, markAdhkarCompleted]);

  const onPressItem = useCallback((index: number) => {
    setRemaining((prev) => {
      const left = prev[index] ?? 0;
      if (left <= 0) return prev;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      const next = [...prev];
      next[index] = left - 1;
      return next;
    });
  }, []);

  return (
    <View style={[styles.root, { paddingTop: insets.top + 14 }]}>
      {/* Back */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('common.back')}
        hitSlop={8}
        onPress={() => navigation.goBack()}
        style={({ pressed }) => [styles.backCircle, pressed && styles.pressedDim]}
      >
        <AppText weight="bold" size={17} color={colors.emerald800}>
          ›
        </AppText>
      </Pressable>

      {/* Ornament header */}
      <LinearGradient
        colors={gradients.heroCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.35, y: 1 }}
        style={styles.header}
      >
        <RadialGlow size={240} opacity={0.22} style={{ top: -50 }} />
        <View style={[styles.cornerDiamond, { right: 16 }]} />
        <View style={[styles.cornerDiamond, { left: 16 }]} />
        <AppText amiri size={27} color={colors.creamText} center>
          {t(TITLE_KEYS[kind])}
        </AppText>
        <AppText size={11.5} color="rgba(245,238,220,0.6)" center style={styles.headerSub}>
          {t('reader.progress', { done, total: items.length })}
        </AppText>
        <View style={styles.hairlineRow}>
          <LinearGradient
            colors={['rgba(196,164,95,0.5)', 'rgba(196,164,95,0)']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.hairline}
          />
          <DiamondBullet size={6} color={colors.gold500} />
          <LinearGradient
            colors={['rgba(196,164,95,0)', 'rgba(196,164,95,0.5)']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.hairline}
          />
        </View>
      </LinearGradient>

      {/* Sticky progress */}
      <ProgressBar
        progress={items.length > 0 ? done / items.length : 0}
        height={5}
        style={styles.progress}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {items.map((item, index) => {
          const left = remaining[index] ?? 0;
          const itemDone = left === 0;
          return (
            <Card
              key={item.id}
              padded={false}
              onPress={() => onPressItem(index)}
              style={[styles.dhikrCard, itemDone && styles.dhikrCardDone]}
            >
              <AppText amiri size={20} lineHeight={38} color={colors.ink}>
                {item.text}
              </AppText>
              <View style={styles.dhikrFooter}>
                <AppText size={12.5} color={colors.muted} style={styles.sourceText}>
                  {item.source ?? ''}
                </AppText>
                <View style={styles.repeatPill}>
                  <AppText weight="bold" size={12} color={colors.goldDark}>
                    {itemDone ? '✓' : t('reader.repeat', { count: left })}
                  </AppText>
                </View>
              </View>
              {item.virtue ? (
                <AppText size={12.5} color={colors.faint} lineHeight={22} style={styles.virtue}>
                  {item.virtue}
                </AppText>
              ) : null}
            </Card>
          );
        })}

        {allDone && (
          <View style={styles.celebration}>
            <AppText amiri size={20} color={colors.gold300} center>
              {t('reader.completed')}
            </AppText>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.cream,
    paddingHorizontal: 20,
  },
  backCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.hairlineStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressedDim: { opacity: 0.8 },
  header: {
    marginTop: 8,
    borderRadius: 22,
    paddingTop: 18,
    paddingHorizontal: 20,
    paddingBottom: 16,
    alignItems: 'center',
    overflow: 'hidden',
    ...shadows.heroCard,
  },
  cornerDiamond: {
    position: 'absolute',
    top: 14,
    width: 9,
    height: 9,
    borderWidth: 1,
    borderColor: 'rgba(196,164,95,0.6)',
    transform: [{ rotate: '45deg' }],
  },
  headerSub: { marginTop: 3 },
  hairlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
    alignSelf: 'stretch',
  },
  hairline: { flex: 1, height: 1 },
  progress: { marginTop: 12 },
  scroll: { marginTop: 12 },
  scrollContent: { gap: 10 },
  dhikrCard: {
    borderRadius: 20,
    padding: 18,
  },
  dhikrCardDone: {
    backgroundColor: colors.creamTint,
    borderWidth: 1.5,
    borderColor: colors.gold500,
    ...shadows.selectedCard,
  },
  dhikrFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 12,
  },
  sourceText: { flexShrink: 1 },
  repeatPill: {
    backgroundColor: colors.goldTint12,
    borderWidth: 1,
    borderColor: colors.gold500,
    borderRadius: radii.pill,
    paddingVertical: 4,
    paddingHorizontal: 12,
    flexShrink: 0,
  },
  virtue: { marginTop: 8 },
  celebration: {
    backgroundColor: colors.emerald800,
    borderRadius: 22,
    padding: 22,
    alignItems: 'center',
  },
});
