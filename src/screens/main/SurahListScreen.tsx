import React, { useMemo, useState } from 'react';
import {
  FlatList,
  I18nManager,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type ListRenderItemInfo,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { AppText } from '../../components';
import { fonts, gradients, radii, shadows, useTheme } from '../../theme';
import { QURAN, getSurah } from '../../content/quran';
import type { Surah } from '../../content/types';
import { useContentStore } from '../../store/useContentStore';
import { usePaywallGate } from '../../hooks/usePaywallGate';

/**
 * Fixed surah-row height (matches the previous auto-sized ListCard rows:
 * 15+15 vertical padding around a 20pt Amiri name + 12.5pt meta line) so the
 * 114-row FlatList can virtualize with an exact getItemLayout.
 */
const ROW_HEIGHT = 86;

/**
 * Surah list — pushed from the Quran reader. Continue-reading hero for the
 * bookmarked surah, search field, and all 114 surahs in a virtualized list
 * (picking one moves the bookmark).
 */
export function SurahListScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const gate = usePaywallGate();
  const { colors } = useTheme();

  const bookmark = useContentStore((s) => s.bookmark);
  const setBookmark = useContentStore((s) => s.setBookmark);

  const current = getSurah(bookmark.surahNumber) ?? QURAN[0];

  const [query, setQuery] = useState('');
  const surahs = useMemo(() => {
    const q = query.trim();
    if (!q) return QURAN;
    return QURAN.filter(
      (surah) => surah.namePlain.includes(q) || surah.nameArabic.includes(q)
    );
  }, [query]);

  const renderRow = ({ item: surah, index }: ListRenderItemInfo<Surah>) => {
    const first = index === 0;
    const last = index === surahs.length - 1;
    return (
      <View
        style={[
          styles.rowWrap,
          { backgroundColor: colors.card, borderColor: colors.hairline },
          first && styles.rowWrapFirst,
          last && styles.rowWrapLast,
        ]}
      >
        <Pressable
          onPress={() =>
            gate(() => {
              setBookmark({ surahNumber: surah.number, verse: 1 });
              navigation.goBack();
            })
          }
          style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.fill4 }]}
        >
          <View style={[styles.diamond, { borderColor: colors.gold500 }]}>
            <View style={styles.diamondInner}>
              <AppText weight="bold" size={12} color={colors.goldDark}>
                {surah.number}
              </AppText>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <AppText amiri size={20} color={colors.ink}>
              {surah.namePlain}
            </AppText>
            <AppText size={12.5} color={colors.muted} style={{ marginTop: 2 }}>
              {t('quran.versesCount', { count: surah.versesCount }) +
                ' · ' +
                (surah.revelation === 'meccan' ? t('quran.meccan') : t('quran.medinan'))}
            </AppText>
          </View>
          <AppText size={18} color={colors.chevron}>
            ‹
          </AppText>
        </Pressable>
        {!last && (
          <View
            style={[styles.rowSeparator, { backgroundColor: colors.separator }]}
            pointerEvents="none"
          />
        )}
      </View>
    );
  };

  return (
    <View
      style={[styles.screen, { backgroundColor: colors.cream, paddingTop: insets.top + 14 }]}
    >
      <Pressable
        onPress={() => navigation.goBack()}
        hitSlop={6}
        style={({ pressed }) => [
          styles.circleBtn,
          { backgroundColor: colors.card, borderColor: colors.hairlineStrong },
          pressed && { opacity: 0.7 },
        ]}
      >
        <AppText weight="bold" size={17} color={colors.emerald800}>
          ›
        </AppText>
      </Pressable>

      <AppText weight="bold" size={28} color={colors.ink} style={{ marginTop: 14 }}>
        {t('quran.surahList')}
      </AppText>

      {/* Continue-reading hero */}
      <LinearGradient
        colors={gradients.heroCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.35, y: 1 }}
        style={[styles.hero, shadows.heroCard]}
      >
        <AppText amiri size={22} color={colors.creamText} style={{ flex: 1 }}>
          {current.nameArabic}
        </AppText>
        <Pressable
          onPress={() => gate(() => navigation.goBack())}
          style={({ pressed }) => pressed && { opacity: 0.9 }}
        >
          <LinearGradient
            colors={gradients.goldCta}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.goldPill}
          >
            <AppText weight="bold" size={13} color={colors.emerald800}>
              {t('quran.continueReading')}
            </AppText>
          </LinearGradient>
        </Pressable>
      </LinearGradient>

      {/* Search field */}
      <View style={[styles.searchCard, { backgroundColor: colors.card, borderColor: colors.fill8 }]}>
        <View style={[styles.searchIcon, { borderColor: colors.faint }]}>
          <View style={[styles.searchHandle, { backgroundColor: colors.faint }]} />
        </View>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={t('quran.searchPlaceholder')}
          placeholderTextColor={colors.faint}
          style={[styles.searchInput, { color: colors.ink }]}
        />
      </View>

      <FlatList
        data={surahs}
        renderItem={renderRow}
        keyExtractor={(surah) => String(surah.number)}
        extraData={colors}
        getItemLayout={(_, index) => ({
          length: ROW_HEIGHT,
          offset: ROW_HEIGHT * index,
          index,
        })}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 60 }}
      />
    </View>
  );
}

// Scheme-dependent colors are applied inline via useTheme(); the rows carry
// the grouped-ListCard chrome (card bg, hairline frame, inset separators)
// themselves so the list can virtualize.
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 22,
  },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  hero: {
    marginTop: 16,
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  goldPill: {
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  searchCard: {
    marginTop: 16,
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchIcon: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    borderWidth: 2,
    flexShrink: 0,
  },
  searchHandle: {
    position: 'absolute',
    bottom: -5,
    left: -4,
    width: 7,
    height: 2,
    borderRadius: 2,
    transform: [{ rotate: '45deg' }],
  },
  searchInput: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 15.5,
    paddingVertical: 0,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  rowWrap: {
    height: ROW_HEIGHT,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    overflow: 'hidden',
  },
  rowWrapFirst: {
    borderTopWidth: 1,
    borderTopLeftRadius: radii.card,
    borderTopRightRadius: radii.card,
  },
  rowWrapLast: {
    borderBottomWidth: 1,
    borderBottomLeftRadius: radii.card,
    borderBottomRightRadius: radii.card,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 18,
  },
  rowSeparator: {
    position: 'absolute',
    bottom: 0,
    left: 18,
    right: 18,
    height: 1,
  },
  diamond: {
    width: 34,
    height: 34,
    borderWidth: 1.2,
    transform: [{ rotate: '45deg' }],
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  diamondInner: {
    transform: [{ rotate: '-45deg' }],
  },
});
