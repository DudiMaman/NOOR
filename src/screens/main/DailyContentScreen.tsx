import React, { useRef, useState } from 'react';
import { Pressable, ScrollView, Share, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { AppText, Card, ListCard } from '../../components';
import { radii, shadows, useTheme, type Palette } from '../../theme';
import { getArchive, getDailyHadith } from '../../content/hadith';
import type { HadithItem } from '../../content/types';
import { toHijri } from '../../services/hijri';
import { dateKey, hijriMonthName, weekdayName } from '../../services/dates';
import { useNow } from '../../hooks/useNow';
import { usePaywallGate } from '../../hooks/usePaywallGate';
import { useContentStore } from '../../store/useContentStore';

/** Archive category chip colors + labels per design 1o. */
const categoryChips = (
  colors: Palette
): Record<HadithItem['category'], { labelKey: string; color: string; bg: string }> => ({
  sunnah: { labelKey: 'content.catSunnah', color: colors.gold500, bg: colors.goldTint12 },
  virtue: { labelKey: 'content.catVirtue', color: colors.success, bg: 'rgba(91,138,114,0.12)' },
  ruling: { labelKey: 'content.catRuling', color: colors.goldDark, bg: 'rgba(138,116,64,0.12)' },
  dhikr: { labelKey: 'content.catDhikr', color: colors.emerald800, bg: colors.fill6 },
});

/**
 * Daily content tab (design 1o) — hadith of the day with explanation,
 * read/save/share actions and the previous-days archive.
 */
export function DailyContentScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const gate = usePaywallGate();
  const scrollRef = useRef<ScrollView>(null);

  const now = useNow(60000);
  const hijri = toHijri(now);
  const todayKey = dateKey(now);

  const readDays = useContentStore((s) => s.readDays);
  const markDayRead = useContentStore((s) => s.markDayRead);
  const savedItemIds = useContentStore((s) => s.savedItemIds);
  const toggleSaved = useContentStore((s) => s.toggleSaved);

  const [activeItem, setActiveItem] = useState<HadithItem>(() => getDailyHadith(now));

  const isRead = !!readDays[todayKey];
  const isSaved = savedItemIds.includes(activeItem.id);
  const archive = getArchive(3, now);

  const onShare = () => {
    void Share.share({
      message: activeItem.text + '\n' + activeItem.attribution + ' — ' + t('common.appName'),
    });
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.cream, paddingTop: insets.top + 14 }]}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <AppText weight="bold" size={28} color={colors.ink}>
            {t('content.title')}
          </AppText>
          <Pressable onPress={() => gate(() => navigation.navigate('CustomsHolidays' as never))}>
            <AppText size={13} color={colors.muted}>
              {`${weekdayName(now, t)} · ${hijri.day} ${hijriMonthName(hijri.month, t)}`}
            </AppText>
          </Pressable>
        </View>

        {/* Hadith of the day */}
        <Card padded={false} style={[styles.hero, shadows.card]}>
          <View style={styles.decoRow}>
            <View style={[styles.decoDiamond, { borderColor: 'rgba(196,164,95,0.7)' }]} />
            <View style={[styles.decoDiamond, { borderColor: 'rgba(196,164,95,0.4)' }]} />
          </View>
          <AppText weight="bold" size={12} color={colors.gold500} style={{ letterSpacing: 0.4 }}>
            {t('content.hadithOfDay')}
          </AppText>
          <AppText amiri size={23} lineHeight={46} color={colors.ink} style={{ marginTop: 12 }}>
            {activeItem.text}
          </AppText>
          <AppText size={13} color={colors.muted} style={{ marginTop: 10 }}>
            {activeItem.attribution}
          </AppText>
          <View style={[styles.heroHairline, { backgroundColor: colors.fill7 }]} />
          <AppText size={15} lineHeight={28} color={colors.inkBody}>
            {activeItem.explanation}
          </AppText>
          <View style={styles.tagsRow}>
            {[...activeItem.tags.slice(0, 2), t('content.readMinutes')].map((tag) => (
              <View key={tag} style={[styles.tagPill, { backgroundColor: colors.fill6 }]}>
                <AppText weight="medium" size={12} color={colors.inkBody}>
                  {tag}
                </AppText>
              </View>
            ))}
          </View>
        </Card>

        {/* Actions */}
        <View style={styles.actionsRow}>
          <Pressable
            onPress={() => gate(() => markDayRead(todayKey))}
            style={({ pressed }) => [
              styles.readButton,
              { backgroundColor: colors.emerald800 },
              pressed && styles.pressedDim,
            ]}
          >
            <AppText weight="semibold" size={15} color={colors.creamText}>
              {isRead ? t('content.markedRead') : t('content.markRead')}
            </AppText>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('content.saved')}
            onPress={() => gate(() => toggleSaved(activeItem.id))}
            style={({ pressed }) => [
              styles.circleButton,
              { backgroundColor: colors.card, borderColor: colors.hairlineStrong },
              isSaved && { backgroundColor: colors.gold100, borderColor: colors.gold500 },
              pressed && styles.pressedDim,
            ]}
          >
            <View style={[styles.bookmarkIcon, { borderColor: colors.inkBody }]}>
              <View style={[styles.bookmarkNotch, { borderTopColor: colors.inkBody }]} />
            </View>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('content.share')}
            onPress={() => gate(onShare)}
            style={({ pressed }) => [
              styles.circleButton,
              { backgroundColor: colors.card, borderColor: colors.hairlineStrong },
              pressed && styles.pressedDim,
            ]}
          >
            <View style={styles.shareIcon}>
              <View style={[styles.shareDot, { backgroundColor: colors.inkBody }]} />
              <View style={[styles.shareDot, { backgroundColor: colors.inkBody, marginTop: -7 }]} />
              <View style={[styles.shareDot, { backgroundColor: colors.inkBody }]} />
            </View>
          </Pressable>
        </View>

        {/* Previous days */}
        <View style={styles.archiveHeaderRow}>
          <AppText weight="bold" size={15} color={colors.ink}>
            {t('content.fromPreviousDays')}
          </AppText>
          <AppText weight="semibold" size={12.5} color={colors.gold500}>
            {t('common.archive')}
          </AppText>
        </View>
        <ListCard style={{ borderRadius: radii.cardLarge }}>
          {archive.map(({ item, date }, index) => {
            const chip = categoryChips(colors)[item.category];
            return (
              <Pressable
                key={dateKey(date)}
                onPress={() =>
                  gate(() => {
                    setActiveItem(item);
                    scrollRef.current?.scrollTo({ y: 0, animated: true });
                  })
                }
                style={({ pressed }) => [styles.archiveRow, pressed && styles.pressedDim]}
              >
                <View style={[styles.categoryChip, { backgroundColor: chip.bg }]}>
                  <AppText weight="bold" size={11} color={chip.color}>
                    {t(chip.labelKey)}
                  </AppText>
                </View>
                <View style={{ flex: 1 }}>
                  <AppText weight="semibold" size={14.5} color={colors.ink}>
                    {item.tags[0]}
                  </AppText>
                  <AppText size={12} color={colors.faint} style={{ marginTop: 1 }}>
                    {(index === 0 ? t('common.yesterday') + ' · ' : '') + weekdayName(date, t)}
                  </AppText>
                </View>
                <AppText size={15} color={colors.chevron}>
                  ‹
                </AppText>
              </Pressable>
            );
          })}
        </ListCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 22,
    paddingBottom: 120,
  },
  pressedDim: { opacity: 0.7 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
  },
  hero: {
    marginTop: 16,
    borderRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 22,
    overflow: 'hidden',
  },
  decoRow: {
    position: 'absolute',
    top: 18,
    left: 18,
    flexDirection: 'row',
    gap: 5,
  },
  decoDiamond: {
    width: 8,
    height: 8,
    borderWidth: 1,
    transform: [{ rotate: '45deg' }],
  },
  heroHairline: {
    height: 1,
    marginVertical: 18,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
  },
  tagPill: {
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 13,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  readButton: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  circleButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookmarkIcon: {
    width: 12,
    height: 15,
    borderWidth: 1.5,
    borderBottomWidth: 0,
    borderTopStartRadius: 2,
    borderTopEndRadius: 2,
  },
  bookmarkNotch: {
    position: 'absolute',
    bottom: -1,
    left: 1,
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 5,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  shareIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2.5,
  },
  shareDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  archiveHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: 22,
    marginBottom: 10,
  },
  archiveRow: {
    paddingVertical: 15,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryChip: {
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
    flexShrink: 0,
  },
});
