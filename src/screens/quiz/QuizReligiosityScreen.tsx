import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { AppText, CheckCircle, SelectableCard } from '../../components';
import { colors } from '../../theme';
import { useUserStore, type Religiosity } from '../../store/useUserStore';
import { QuizLayout } from './QuizLayout';

const OPTIONS: Religiosity[] = ['committed', 'striving', 'beginning', 'exploring'];

/** Quiz 4/4 — religiosity level. */
export function QuizReligiosityScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const quiz = useUserStore((s) => s.quiz);
  const setQuiz = useUserStore((s) => s.setQuiz);
  const setFlowStage = useUserStore((s) => s.setFlowStage);

  return (
    <QuizLayout
      step={4}
      title={t('quiz.religiosity.title')}
      helper={t('quiz.religiosity.subtitle')}
      ctaLabel={t('quiz.finish')}
      ctaDisabled={!quiz.religiosity}
      onContinue={() => {
        setFlowStage('auth');
        navigation.navigate('AuthSignUp');
      }}
    >
      <View style={styles.list}>
        {OPTIONS.map((key) => {
          const selected = quiz.religiosity === key;
          return (
            <SelectableCard
              key={key}
              selected={selected}
              onPress={() => setQuiz({ religiosity: key })}
              showCheck={false}
              style={styles.card}
            >
              {selected && (
                <View style={styles.cornerCheck}>
                  <CheckCircle checked size={22} />
                </View>
              )}
              <View style={styles.body}>
                <AppText weight={selected ? 'bold' : 'semibold'} size={16.5} color={colors.ink}>
                  {t(`quiz.religiosity.${key}`)}
                </AppText>
                <AppText size={13.5} color={colors.muted} style={styles.sub}>
                  {t(`quiz.religiosity.${key}Sub`)}
                </AppText>
              </View>
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
  card: { paddingVertical: 18 },
  body: { flex: 1 },
  sub: { marginTop: 3 },
  cornerCheck: { position: 'absolute', top: 18, left: 18, zIndex: 2 },
});
