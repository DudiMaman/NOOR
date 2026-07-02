import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { AppText, ProgressBar, RadialGlow } from '../../components';
import { colors, gradients, shadows } from '../../theme';
import { QURAN, RECITERS, getSurah } from '../../content/quran';
import { useContentStore } from '../../store/useContentStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { usePaywallGate } from '../../hooks/usePaywallGate';
import { dateKey } from '../../services/dates';

const ARABIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

/** Western → Arabic-Indic digits, for Quran verse markers only. */
function toArabicDigits(n: number): string {
  return String(n)
    .split('')
    .map((d) => ARABIC_DIGITS[Number(d)] ?? d)
    .join('');
}

const BISMILLAH = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ';

/**
 * Quran reader tab (design ref 1s) — ornament surah header, justified
 * Amiri reading card with tappable verses + daily-ward chip, audio bar.
 */
export function QuranReaderScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const gate = usePaywallGate();

  const bookmark = useContentStore((s) => s.bookmark);
  const setBookmark = useContentStore((s) => s.setBookmark);
  const addWardProgress = useContentStore((s) => s.addWardProgress);
  const wardVersesRead = useContentStore((s) => s.wardVersesRead);
  const wardDateKey = useContentStore((s) => s.wardDateKey);
  const quranFontScale = useSettingsStore((s) => s.quranFontScale);
  const cycleQuranFontScale = useSettingsStore((s) => s.cycleQuranFontScale);

  const surah = getSurah(bookmark.surahNumber) ?? QURAN[0];
  const bookmarkedHere = bookmark.surahNumber === surah.number;

  const [currentVerse, setCurrentVerse] = useState(() =>
    bookmarkedHere ? bookmark.verse : 1
  );
  // Reset the highlighted verse when a different surah is picked from the list.
  const [trackedSurah, setTrackedSurah] = useState(surah.number);
  if (trackedSurah !== surah.number) {
    setTrackedSurah(surah.number);
    setCurrentVerse(bookmark.surahNumber === surah.number ? bookmark.verse : 1);
  }

  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0.44);
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setProgress((p) => Math.min(1, p + 0.004));
    }, 250);
    return () => clearInterval(id);
  }, [playing]);

  const wardRead = wardDateKey === dateKey() ? wardVersesRead : 0;
  const showBismillah = surah.number !== 1 && surah.number !== 9;

  const onVersePress = (n: number) =>
    gate(() => {
      setCurrentVerse(n);
      setBookmark({ surahNumber: surah.number, verse: n });
      addWardProgress(dateKey(), 1);
    });

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable
          onPress={() => gate(() => navigation.navigate('SurahList' as never))}
          hitSlop={6}
          style={({ pressed }) => [styles.circleBtn, pressed && { opacity: 0.7 }]}
        >
          <AppText weight="bold" size={17} color={colors.emerald800}>
            ›
          </AppText>
        </Pressable>
        <View style={styles.topCenter}>
          <AppText weight="bold" size={16.5} color={colors.ink}>
            {'سورة ' + surah.namePlain}
          </AppText>
          <AppText size={11.5} color={colors.faint} style={{ marginTop: 1 }}>
            {t('quran.juzPage', { juz: surah.juz, page: surah.page })}
          </AppText>
        </View>
        <Pressable
          onPress={() =>
            gate(() => setBookmark({ surahNumber: surah.number, verse: currentVerse }))
          }
          hitSlop={6}
          style={({ pressed }) => [
            styles.circleBtn,
            bookmarkedHere && styles.circleBtnBookmarked,
            pressed && { opacity: 0.7 },
          ]}
        >
          <View style={styles.bookmarkShape}>
            <View style={styles.bookmarkNotch} />
          </View>
        </Pressable>
        <Pressable
          onPress={() => gate(() => cycleQuranFontScale())}
          hitSlop={6}
          style={({ pressed }) => [styles.circleBtn, pressed && { opacity: 0.7 }]}
        >
          <AppText weight="bold" size={12} color={colors.emerald800}>
            Aا
          </AppText>
        </Pressable>
      </View>

      {/* Surah ornament header */}
      <LinearGradient
        colors={gradients.heroCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.35, y: 1 }}
        style={[styles.ornament, shadows.heroCard]}
      >
        <RadialGlow size={240} opacity={0.22} style={{ top: -50, left: '50%', marginLeft: -120 }} />
        <View style={[styles.ornamentDiamond, { left: 16 }]} />
        <View style={[styles.ornamentDiamond, { right: 16 }]} />
        <AppText amiri size={27} color={colors.creamText}>
          {surah.nameArabic}
        </AppText>
        <AppText size={11.5} color="rgba(245,238,220,0.6)" style={{ marginTop: 3 }}>
          {(surah.revelation === 'meccan' ? t('quran.meccan') : t('quran.medinan')) +
            ' · ' +
            t('quran.versesCount', { count: surah.versesCount })}
        </AppText>
        {showBismillah && (
          <View style={styles.bismillahRow}>
            <LinearGradient
              colors={['rgba(196,164,95,0)', 'rgba(196,164,95,0.5)'] as const}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.bismillahLine}
            />
            <AppText amiri size={17} color={colors.gold300}>
              {BISMILLAH}
            </AppText>
            <LinearGradient
              colors={['rgba(196,164,95,0.5)', 'rgba(196,164,95,0)'] as const}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.bismillahLine}
            />
          </View>
        )}
      </LinearGradient>

      {/* Reading card */}
      <View style={styles.readingCard}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.readingContent}
        >
          <AppText style={styles.quranText}>
            {surah.verses.map((verse) => (
              <React.Fragment key={verse.number}>
                <AppText
                  amiri
                  size={23 * quranFontScale}
                  lineHeight={54 * quranFontScale}
                  color={colors.inkQuran}
                  suppressHighlighting
                  onPress={() => onVersePress(verse.number)}
                  style={
                    verse.number === currentVerse
                      ? { backgroundColor: colors.goldTint16 }
                      : undefined
                  }
                >
                  {verse.text}
                </AppText>
                <AppText
                  amiri
                  size={19 * quranFontScale}
                  lineHeight={54 * quranFontScale}
                  color={colors.gold500}
                >
                  {' ﴿' + toArabicDigits(verse.number) + '﴾ '}
                </AppText>
              </React.Fragment>
            ))}
          </AppText>
        </ScrollView>
        <LinearGradient
          colors={['rgba(255,255,255,0)', '#FFFFFF'] as const}
          locations={[0, 0.85] as const}
          style={styles.fadeOverlay}
          pointerEvents="none"
        />
        <View style={styles.wardChipWrap} pointerEvents="none">
          <View style={styles.wardChip}>
            <AppText size={11.5} color={colors.faint}>
              {t('quran.dailyWard', { read: wardRead, total: surah.versesCount })}
            </AppText>
          </View>
        </View>
      </View>

      {/* Audio bar */}
      <View style={[styles.audioBar, shadows.heroCard]}>
        <Pressable
          onPress={() => gate(() => setPlaying((p) => !p))}
          style={({ pressed }) => pressed && { opacity: 0.85 }}
        >
          <LinearGradient
            colors={gradients.goldCta}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.playCircle, shadows.goldCta]}
          >
            {playing ? (
              <View style={styles.pauseRow}>
                <View style={styles.pauseBar} />
                <View style={styles.pauseBar} />
              </View>
            ) : (
              <View style={styles.playTriangle} />
            )}
          </LinearGradient>
        </Pressable>
        <View style={{ flex: 1 }}>
          <AppText weight="bold" size={14.5} color={colors.creamText}>
            {t('quran.recitation', { reciter: RECITERS[0].name })}
          </AppText>
          <View style={styles.progressRow}>
            <AppText size={10.5} color={colors.onDarkFaint} tabular>
              2:41
            </AppText>
            <ProgressBar
              progress={progress}
              height={4}
              trackColor="rgba(245,238,220,0.15)"
              fillColor={colors.gold500}
              style={{ flex: 1 }}
            />
            <AppText size={10.5} color={colors.onDarkFaint} tabular>
              6:03
            </AppText>
          </View>
        </View>
        <View style={styles.verseChip}>
          <AppText weight="bold" size={11} color={colors.gold300}>
            {t('quran.verseN', { n: toArabicDigits(currentVerse) })}
          </AppText>
        </View>
      </View>

      {/* Clears the absolute blur tab bar */}
      <View style={{ height: 110 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 10,
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
    flexShrink: 0,
  },
  circleBtnBookmarked: {
    backgroundColor: colors.gold100,
    borderColor: colors.gold500,
  },
  topCenter: {
    flex: 1,
    alignItems: 'center',
  },
  bookmarkShape: {
    width: 11,
    height: 15,
    borderWidth: 1.5,
    borderColor: colors.emerald800,
    borderBottomWidth: 0,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  bookmarkNotch: {
    position: 'absolute',
    bottom: -1,
    left: 0.5,
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopWidth: 5,
    borderTopColor: colors.emerald800,
  },
  ornament: {
    marginTop: 8,
    marginHorizontal: 20,
    borderRadius: 22,
    paddingTop: 18,
    paddingHorizontal: 20,
    paddingBottom: 16,
    alignItems: 'center',
    overflow: 'hidden',
  },
  ornamentDiamond: {
    position: 'absolute',
    top: 14,
    width: 9,
    height: 9,
    borderWidth: 1,
    borderColor: 'rgba(196,164,95,0.6)',
    transform: [{ rotate: '45deg' }],
  },
  bismillahRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
    alignSelf: 'stretch',
  },
  bismillahLine: {
    flex: 1,
    height: 1,
  },
  readingCard: {
    flex: 1,
    marginTop: 14,
    marginHorizontal: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: 22,
    overflow: 'hidden',
  },
  readingContent: {
    paddingTop: 20,
    paddingHorizontal: 22,
    paddingBottom: 72,
  },
  quranText: {
    textAlign: 'justify',
    writingDirection: 'rtl',
  },
  fadeOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 56,
  },
  wardChipWrap: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  wardChip: {
    backgroundColor: colors.fill5,
    paddingVertical: 4,
    paddingHorizontal: 14,
    borderRadius: 999,
  },
  audioBar: {
    marginTop: 12,
    marginHorizontal: 20,
    backgroundColor: colors.emerald800,
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },
  playCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  playTriangle: {
    width: 0,
    height: 0,
    borderTopWidth: 8,
    borderBottomWidth: 8,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderEndWidth: 13,
    borderEndColor: colors.emerald800,
    marginStart: -3,
  },
  pauseRow: {
    flexDirection: 'row',
    gap: 3,
  },
  pauseBar: {
    width: 4,
    height: 16,
    borderRadius: 2,
    backgroundColor: colors.emerald800,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  verseChip: {
    borderWidth: 1,
    borderColor: colors.goldBorder50,
    borderRadius: 999,
    paddingVertical: 3,
    paddingHorizontal: 10,
    flexShrink: 0,
  },
});
