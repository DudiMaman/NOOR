import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { AppText, ListCard } from '../../components';
import { colors, gradients, shadows } from '../../theme';
import { QURAN, getSurah } from '../../content/quran';
import { useContentStore } from '../../store/useContentStore';
import { usePaywallGate } from '../../hooks/usePaywallGate';

/**
 * Surah list — pushed from the Quran reader. Continue-reading hero for the
 * bookmarked surah + selectable surah rows (picking one moves the bookmark).
 */
export function SurahListScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const gate = usePaywallGate();

  const bookmark = useContentStore((s) => s.bookmark);
  const setBookmark = useContentStore((s) => s.setBookmark);

  const current = getSurah(bookmark.surahNumber) ?? QURAN[0];

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 14 }]}>
      <Pressable
        onPress={() => navigation.goBack()}
        hitSlop={6}
        style={({ pressed }) => [styles.circleBtn, pressed && { opacity: 0.7 }]}
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

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        <ListCard style={{ marginTop: 16 }}>
          {QURAN.map((surah) => (
            <Pressable
              key={surah.number}
              onPress={() =>
                gate(() => {
                  setBookmark({ surahNumber: surah.number, verse: 1 });
                  navigation.goBack();
                })
              }
              style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.fill4 }]}
            >
              <View style={styles.diamond}>
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
          ))}
        </ListCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.cream,
    paddingHorizontal: 22,
  },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.hairlineStrong,
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 15,
    paddingHorizontal: 18,
  },
  diamond: {
    width: 34,
    height: 34,
    borderWidth: 1.2,
    borderColor: colors.gold500,
    transform: [{ rotate: '45deg' }],
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  diamondInner: {
    transform: [{ rotate: '-45deg' }],
  },
});
