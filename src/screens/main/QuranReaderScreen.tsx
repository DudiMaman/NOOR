import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  I18nManager,
  Pressable,
  StyleSheet,
  View,
  type GestureResponderEvent,
  type ListRenderItemInfo,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { AppText, ProgressBar, RadialGlow } from '../../components';
import { gradients, lightColors, shadows, useTheme } from '../../theme';
import { QURAN, getSurah } from '../../content/quran';
import type { Verse } from '../../content/types';
import { useContentStore } from '../../store/useContentStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { usePaywallGate } from '../../hooks/usePaywallGate';
import { dateKey } from '../../services/dates';
import {
  ensureAudioMode,
  formatClock,
  nextReciterId,
  recitationUrl,
  reciterName,
} from '../../services/audio';

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
 * Verses are rendered in chunks of ~12 so the full mushaf (Al-Baqarah: 286
 * ayahs) stays scrollable without laying out one gigantic nested <Text>.
 */
const VERSES_PER_CHUNK = 12;

/**
 * Quran reader tab (design ref 1s) — ornament surah header, justified
 * Amiri reading card with tappable verses + daily-ward chip, audio bar
 * streaming the selected reciter via expo-audio.
 */
export function QuranReaderScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const gate = usePaywallGate();
  const { colors } = useTheme();

  const bookmark = useContentStore((s) => s.bookmark);
  const setBookmark = useContentStore((s) => s.setBookmark);
  const addWardProgress = useContentStore((s) => s.addWardProgress);
  const wardVersesRead = useContentStore((s) => s.wardVersesRead);
  const wardDateKey = useContentStore((s) => s.wardDateKey);
  const quranFontScale = useSettingsStore((s) => s.quranFontScale);
  const cycleQuranFontScale = useSettingsStore((s) => s.cycleQuranFontScale);
  const reciterId = useSettingsStore((s) => s.reciterId);
  const setReciterId = useSettingsStore((s) => s.setReciterId);

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

  // --- Recitation audio (expo-audio) ------------------------------------
  const audioUrl = recitationUrl(surah.number, reciterId);
  // Keep the hook's source stable — surah/reciter changes go through replace().
  const initialUrlRef = useRef(audioUrl);
  const player = useAudioPlayer({ uri: initialUrlRef.current });
  const status = useAudioPlayerStatus(player);

  useEffect(() => {
    void ensureAudioMode();
  }, []);

  const loadedUrlRef = useRef(initialUrlRef.current);
  useEffect(() => {
    if (loadedUrlRef.current === audioUrl) return;
    loadedUrlRef.current = audioUrl;
    try {
      // Pause first so the new stream loads in a reset, paused state.
      player.pause();
      player.replace({ uri: audioUrl });
    } catch {
      // Stream swap failed (e.g. offline) — keep the UI rendered.
    }
  }, [audioUrl, player]);

  const currentTime = Number.isFinite(status.currentTime) ? status.currentTime : 0;
  const duration =
    status.isLoaded && Number.isFinite(status.duration) && status.duration > 0
      ? status.duration
      : 0;
  const audioProgress = duration > 0 ? Math.min(1, currentTime / duration) : 0;
  const currentLabel = status.isLoaded ? formatClock(currentTime) : '0:00';
  const durationLabel = duration > 0 ? formatClock(duration) : '--:--';

  const onTogglePlay = () =>
    gate(() => {
      try {
        if (status.playing) player.pause();
        else player.play();
      } catch {
        // Player not ready (e.g. stream error) — no-op.
      }
    });

  const [barWidth, setBarWidth] = useState(0);
  const onSeekPress = (event: GestureResponderEvent) => {
    const x = event.nativeEvent.locationX;
    gate(() => {
      if (duration <= 0 || barWidth <= 0) return;
      const raw = Math.min(1, Math.max(0, x / barWidth));
      const fraction = I18nManager.isRTL ? 1 - raw : raw;
      player.seekTo(fraction * duration).catch(() => {
        // Seek on an unloaded stream — ignore.
      });
    });
  };

  const onCycleReciter = () => gate(() => setReciterId(nextReciterId(reciterId)));

  // --- Reading card ------------------------------------------------------
  const wardRead = wardDateKey === dateKey() ? wardVersesRead : 0;
  const showBismillah = surah.number !== 1 && surah.number !== 9;

  const onVersePress = (n: number) =>
    gate(() => {
      setCurrentVerse(n);
      setBookmark({ surahNumber: surah.number, verse: n });
      addWardProgress(dateKey(), 1);
    });

  const chunks = useMemo(() => {
    const out: Verse[][] = [];
    for (let i = 0; i < surah.verses.length; i += VERSES_PER_CHUNK) {
      out.push(surah.verses.slice(i, i + VERSES_PER_CHUNK));
    }
    return out;
  }, [surah]);

  const listRef = useRef<FlatList<Verse[]>>(null);
  useEffect(() => {
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
  }, [surah.number]);

  const renderChunk = ({ item }: ListRenderItemInfo<Verse[]>) => (
    <AppText style={styles.quranText}>
      {item.map((verse) => (
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
          <View
            style={[
              styles.verseMarker,
              {
                borderColor: colors.gold500,
                width: 27 * quranFontScale,
                height: 27 * quranFontScale,
                borderRadius: 13.5 * quranFontScale,
              },
            ]}
          >
            <AppText amiri size={13 * quranFontScale} color={colors.goldDark}>
              {toArabicDigits(verse.number)}
            </AppText>
          </View>
        </React.Fragment>
      ))}
    </AppText>
  );

  return (
    <View style={[styles.screen, { backgroundColor: colors.cream, paddingTop: insets.top }]}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable
          onPress={() => gate(() => navigation.navigate('SurahList' as never))}
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
        <View style={styles.topCenter}>
          <AppText weight="bold" size={16.5} color={colors.ink}>
            {t('quran.surahTitle', { name: surah.namePlain })}
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
            { backgroundColor: colors.card, borderColor: colors.hairlineStrong },
            bookmarkedHere && { backgroundColor: colors.gold100, borderColor: colors.gold500 },
            pressed && { opacity: 0.7 },
          ]}
        >
          <View style={[styles.bookmarkShape, { borderColor: colors.emerald800 }]}>
            <View style={[styles.bookmarkNotch, { borderTopColor: colors.emerald800 }]} />
          </View>
        </Pressable>
        <Pressable
          onPress={() => gate(() => cycleQuranFontScale())}
          hitSlop={6}
          style={({ pressed }) => [
            styles.circleBtn,
            { backgroundColor: colors.card, borderColor: colors.hairlineStrong },
            pressed && { opacity: 0.7 },
          ]}
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
      <View
        style={[
          styles.readingCard,
          { backgroundColor: colors.card, borderColor: colors.hairline },
        ]}
      >
        <FlatList
          ref={listRef}
          data={chunks}
          renderItem={renderChunk}
          keyExtractor={(chunk) => String(chunk[0]?.number ?? 0)}
          extraData={[currentVerse, quranFontScale, colors]}
          initialNumToRender={4}
          windowSize={7}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.readingContent}
        />
        <LinearGradient
          colors={[colors.card + '00', colors.card] as const}
          locations={[0, 0.85] as const}
          style={styles.fadeOverlay}
          pointerEvents="none"
        />
        <View style={styles.wardChipWrap} pointerEvents="none">
          <View style={[styles.wardChip, { backgroundColor: colors.fill5 }]}>
            <AppText size={11.5} color={colors.faint}>
              {t('quran.dailyWard', { read: wardRead, total: surah.versesCount })}
            </AppText>
          </View>
        </View>
      </View>

      {/* Audio bar */}
      <View style={[styles.audioBar, shadows.heroCard]}>
        <Pressable onPress={onTogglePlay} style={({ pressed }) => pressed && { opacity: 0.85 }}>
          <LinearGradient
            colors={gradients.goldCta}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.playCircle, shadows.goldCta]}
          >
            {status.playing ? (
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
          <Pressable onPress={onCycleReciter} hitSlop={4}>
            {({ pressed }) => (
              <AppText
                weight="bold"
                size={14.5}
                color={colors.creamText}
                style={pressed && { opacity: 0.7 }}
              >
                {t('quran.recitation', { reciter: reciterName(reciterId) })}
              </AppText>
            )}
          </Pressable>
          <View style={styles.progressRow}>
            <AppText size={10.5} color={colors.onDarkFaint} tabular>
              {currentLabel}
            </AppText>
            <Pressable
              style={{ flex: 1 }}
              hitSlop={10}
              onLayout={(e) => setBarWidth(e.nativeEvent.layout.width)}
              onPress={onSeekPress}
            >
              <ProgressBar
                progress={audioProgress}
                height={4}
                trackColor="rgba(245,238,220,0.15)"
                fillColor={colors.gold500}
              />
            </Pressable>
            <AppText size={10.5} color={colors.onDarkFaint} tabular>
              {durationLabel}
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

// Colors that adapt to the scheme are applied inline via useTheme().
// The audio bar is a design-dark surface — it keeps its literal emerald/gold
// values (lightColors) in both schemes, exactly like the ornament gradients.
const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  verseMarker: {
    borderWidth: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 7,
    transform: [{ translateY: 6 }],
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
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  topCenter: {
    flex: 1,
    alignItems: 'center',
  },
  bookmarkShape: {
    width: 11,
    height: 15,
    borderWidth: 1.5,
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
    borderWidth: 1,
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
    paddingVertical: 4,
    paddingHorizontal: 14,
    borderRadius: 999,
  },
  audioBar: {
    marginTop: 12,
    marginHorizontal: 20,
    backgroundColor: lightColors.emerald800,
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
    borderEndColor: lightColors.emerald800,
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
    backgroundColor: lightColors.emerald800,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  verseChip: {
    borderWidth: 1,
    borderColor: lightColors.goldBorder50,
    borderRadius: 999,
    paddingVertical: 3,
    paddingHorizontal: 10,
    flexShrink: 0,
  },
});
