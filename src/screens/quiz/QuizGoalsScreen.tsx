import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { AppText, SelectableCard } from '../../components';
import { colors } from '../../theme';
import { useUserStore, type Goal } from '../../store/useUserStore';
import { QuizLayout } from './QuizLayout';

const OPTIONS: Goal[] = ['prayOnTime', 'dailyQuran', 'learnBasics', 'adhkarHabit', 'ramadanPrep'];

/** Quiz 3/4 — goals (multi-select). */
export function QuizGoalsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const quiz = useUserStore((s) => s.quiz);
  const toggleGoal = useUserStore((s) => s.toggleGoal);

  return (
    <QuizLayout
      step={3}
      title={t('quiz.goals.title')}
      helper={t('quiz.goals.subtitle')}
      ctaDisabled={quiz.goals.length < 1}
      onContinue={() => navigation.navigate('QuizReligiosity')}
    >
      <View style={styles.list}>
        {OPTIONS.map((key) => {
          const selected = quiz.goals.includes(key);
          return (
            <SelectableCard key={key} selected={selected} onPress={() => toggleGoal(key)}>
              <AppText
                weight={selected ? 'bold' : 'semibold'}
                size={16}
                color={colors.ink}
                style={styles.label}
              >
                {t(`quiz.goals.${key}`)}
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
    marginTop: 28,
  },
  label: { flexShrink: 1 },
});
