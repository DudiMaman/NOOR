import React from 'react';
import { I18nManager, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { AppText, ListCard, PrimaryButton, SectionLabel } from '../../components';
import { formatShortDate } from '../../services/dates';
import { useIsPremium, useSubscriptionStore } from '../../store/useSubscriptionStore';
import { useUserStore } from '../../store/useUserStore';
import { colors, fonts, radii, shadows } from '../../theme';

/** Read-only label/value row inside a ListCard. */
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <AppText weight="semibold" size={15} color={colors.ink} style={styles.rowLabel}>
        {label}
      </AppText>
      <AppText size={14} color={colors.muted}>
        {value}
      </AppText>
    </View>
  );
}

export function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const entitled = useIsPremium();

  const profile = useUserStore((s) => s.profile);
  const quiz = useUserStore((s) => s.quiz);
  const updateName = useUserStore((s) => s.updateName);
  const setFlowStage = useUserStore((s) => s.setFlowStage);

  const status = useSubscriptionStore((s) => s.status);
  const plan = useSubscriptionStore((s) => s.plan);

  const planLabel =
    status === 'trial'
      ? t('settings.trialPlan')
      : plan === 'yearly'
        ? t('settings.yearlyPlan')
        : t('settings.monthlyPlan');

  const retakeQuiz = () => {
    setFlowStage('quiz');
    navigation.reset({ index: 0, routes: [{ name: 'QuizGender' as never }] });
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 14 }]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Pressable
        onPress={() => navigation.goBack()}
        hitSlop={8}
        style={({ pressed }) => [styles.backCircle, pressed && styles.pressed]}
      >
        <AppText weight="bold" size={17} color={colors.emerald800}>
          ›
        </AppText>
      </Pressable>

      <AppText weight="bold" size={28} color={colors.ink} style={styles.title}>
        {t('profile.title')}
      </AppText>

      {/* Emerald identity card */}
      <View style={[styles.heroCard, shadows.heroCard]}>
        <View style={styles.avatar}>
          <AppText amiri size={30} color={colors.gold300}>
            {(profile?.name || 'ض')[0]}
          </AppText>
        </View>
        <View style={styles.heroInfo}>
          <AppText weight="bold" size={18} color={colors.creamText}>
            {profile?.name || t('home.guest')}
          </AppText>
          <View style={styles.badgeRow}>
            {entitled ? (
              <>
                <View style={styles.premiumChip}>
                  <AppText weight="bold" size={11} color={colors.gold300}>
                    {t('common.premium') + ' ✦'}
                  </AppText>
                </View>
                <AppText size={12} color={colors.onDarkFaint}>
                  {planLabel}
                </AppText>
              </>
            ) : (
              <AppText size={12} color={colors.onDarkFaint}>
                {t('settings.freePlan')}
              </AppText>
            )}
          </View>
        </View>
      </View>

      {/* Account card — editable name + email */}
      <ListCard style={styles.accountCard}>
        <View style={styles.fieldBlock}>
          <AppText weight="semibold" size={13} color={colors.muted}>
            {t('profile.editName')}
          </AppText>
          <TextInput
            defaultValue={profile?.name}
            onEndEditing={(e) => updateName(e.nativeEvent.text)}
            style={styles.nameInput}
            placeholderTextColor={colors.faint}
          />
        </View>
        <View style={styles.fieldBlock}>
          <AppText weight="semibold" size={13} color={colors.muted}>
            {t('profile.email')}
          </AppText>
          <AppText size={14} color={colors.muted} style={styles.fieldValue}>
            {profile?.email || t('profile.signedAsGuest')}
          </AppText>
        </View>
      </ListCard>

      {/* Personalization */}
      <SectionLabel>{t('profile.personalization')}</SectionLabel>
      <ListCard>
        <InfoRow
          label={t('profile.gender')}
          value={quiz.gender ? t(`quiz.gender.${quiz.gender}`) : '—'}
        />
        <InfoRow
          label={t('profile.age')}
          value={quiz.ageRange ? t(`quiz.age.${quiz.ageRange}`) : '—'}
        />
        <InfoRow label={t('profile.goals')} value={String(quiz.goals.length)} />
        <Pressable onPress={retakeQuiz} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
          <AppText weight="semibold" size={15} color={colors.gold500}>
            {t('profile.retakeQuiz')}
          </AppText>
        </Pressable>
      </ListCard>

      {profile?.isGuest && (
        <PrimaryButton
          label={t('profile.createAccount')}
          onPress={() => navigation.reset({ index: 0, routes: [{ name: 'AuthSignUp' as never }] })}
          style={styles.createAccount}
        />
      )}

      <AppText size={12.5} color={colors.faint} center style={styles.footer}>
        {t('profile.memberSince', { date: formatShortDate(profile?.createdAt ?? Date.now()) })}
      </AppText>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  content: { paddingHorizontal: 22, paddingBottom: 48 },
  pressed: { opacity: 0.8 },
  backCircle: {
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
  title: { marginTop: 14 },
  heroCard: {
    marginTop: 16,
    backgroundColor: colors.emerald800,
    borderRadius: radii.cardLarge,
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.goldTint20,
    borderWidth: 1.5,
    borderColor: colors.goldBorder50,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  heroInfo: { flex: 1 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  premiumChip: {
    backgroundColor: colors.goldTint20,
    borderWidth: 1,
    borderColor: colors.goldBorder50,
    borderRadius: radii.pill,
    paddingVertical: 2,
    paddingHorizontal: 9,
  },
  accountCard: { marginTop: 16 },
  fieldBlock: { paddingVertical: 14, paddingHorizontal: 18 },
  nameInput: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.ink,
    paddingVertical: 0,
    marginTop: 6,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  fieldValue: { marginTop: 6 },
  row: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowLabel: { flex: 1 },
  createAccount: { marginTop: 20 },
  footer: { marginTop: 20 },
});
