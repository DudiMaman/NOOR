import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { AppText, SelectableCard } from '../../components';
import { colors } from '../../theme';
import { useUserStore, type AgeRange } from '../../store/useUserStore';
import { QuizLayout } from './QuizLayout';

const OPTIONS: AgeRange[] = ['under18', 'a18_24', 'a25_34', 'a35_44', 'a45_54', 'a55plus'];

/** Quiz 2/4 — age range. */
export function QuizAgeScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const quiz = useUserStore((s) => s.quiz);
  const setQuiz = useUserStore((s) => s.setQuiz);

  return (
    <QuizLayout
      step={2}
      title={t('quiz.age.title')}
      helper={t('quiz.age.subtitle')}
      ctaDisabled={!quiz.ageRange}
      onContinue={() => navigation.navigate('QuizGoals')}
    >
      <View style={styles.list}>
        {OPTIONS.map((key) => {
          const selected = quiz.ageRange === key;
          return (
            <SelectableCard
              key={key}
              selected={selected}
              onPress={() => setQuiz({ ageRange: key })}
              showCheck={selected}
              style={styles.card}
            >
              <AppText
                weight={selected ? 'bold' : 'semibold'}
                size={16.5}
                color={colors.ink}
                style={styles.label}
              >
                {t(`quiz.age.${key}`)}
              </AppText>
            </SelectableCard>
          );
        })}
      </View>
    </QuizLayout>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 12,
    marginTop: 32,
  },
  card: { paddingVertical: 17 },
  label: { flexShrink: 1 },
});
