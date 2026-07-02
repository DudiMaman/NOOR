import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { AppText, CheckCircle } from '../../components';
import { colors, shadows } from '../../theme';
import { useUserStore, type Gender } from '../../store/useUserStore';
import { QuizLayout } from './QuizLayout';

const OPTIONS: { key: Gender; labelKey: string; medallionFontSize: number }[] = [
  { key: 'male', labelKey: 'quiz.gender.male', medallionFontSize: 30 },
  { key: 'female', labelKey: 'quiz.gender.female', medallionFontSize: 26 },
];

/** Quiz 1/4 — gender. */
export function QuizGenderScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const quiz = useUserStore((s) => s.quiz);
  const setQuiz = useUserStore((s) => s.setQuiz);

  return (
    <QuizLayout
      step={1}
      title={t('quiz.gender.title')}
      helper={t('quiz.gender.subtitle')}
      ctaDisabled={!quiz.gender}
      onContinue={() => navigation.navigate('QuizAge')}
    >
      <View style={styles.grid}>
        {OPTIONS.map((option) => {
          const selected = quiz.gender === option.key;
          return (
            <Pressable
              key={option.key}
              onPress={() => setQuiz({ gender: option.key })}
              style={({ pressed }) => [
                styles.card,
                selected ? styles.cardSelected : styles.cardIdle,
                selected && shadows.selectedCard,
                pressed && { opacity: 0.9 },
              ]}
            >
              {selected && (
                <View style={styles.cornerCheck}>
                  <CheckCircle checked size={22} />
                </View>
              )}
              <View
                style={[
                  styles.medallion,
                  { backgroundColor: selected ? colors.emerald800 : colors.gold100 },
                ]}
              >
                <AppText
                  amiri
                  size={option.medallionFontSize}
                  color={selected ? colors.gold300 : colors.goldDark}
                >
                  {t(option.labelKey)}
                </AppText>
              </View>
              <AppText weight="bold" size={17} color={colors.ink}>
                {t(option.labelKey)}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </QuizLayout>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 32,
  },
  card: {
    flex: 1,
    borderRadius: 22,
    paddingVertical: 28,
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 14,
  },
  cardIdle: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.fill8,
  },
  cardSelected: {
    backgroundColor: colors.creamTint,
    borderWidth: 1.5,
    borderColor: colors.gold500,
  },
  cornerCheck: { position: 'absolute', top: 12, left: 12, zIndex: 2 },
  medallion: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
