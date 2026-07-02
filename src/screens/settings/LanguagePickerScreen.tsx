import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { AppText, CheckCircle, ListCard } from '../../components';
import { changeAppLanguage } from '../../i18n';
import { LANGUAGES } from '../../i18n/languages';
import { useSettingsStore } from '../../store/useSettingsStore';
import { colors } from '../../theme';

export function LanguagePickerScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const navigation = useNavigation();

  const language = useSettingsStore((s) => s.language);
  const setLanguage = useSettingsStore((s) => s.setLanguage);

  const selectLanguage = (code: string) => {
    setLanguage(code);
    changeAppLanguage(code).then((changed) => {
      if (changed) Alert.alert(t('language.restartNote'));
    });
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 14 }]}>
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
        {t('language.title')}
      </AppText>
      <AppText size={14} color={colors.muted} style={styles.subtitle}>
        {t('language.subtitle')}
      </AppText>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ListCard style={styles.listCard}>
          {LANGUAGES.map((lang) => (
            <Pressable
              key={lang.code}
              onPress={() => selectLanguage(lang.code)}
              style={({ pressed }) => [styles.row, pressed && styles.pressed]}
            >
              <View>
                <AppText weight="semibold" size={15.5} color={colors.ink}>
                  {lang.nativeName}
                </AppText>
                <AppText size={12.5} color={colors.muted} style={styles.arabicName}>
                  {lang.arabicName}
                </AppText>
              </View>
              {lang.code === language && <CheckCircle size={22} />}
            </Pressable>
          ))}
        </ListCard>

        <AppText size={12.5} color={colors.faint} center style={styles.footer}>
          {t('language.restartNote')}
        </AppText>
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
  subtitle: { marginTop: 6 },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 60 },
  listCard: { marginTop: 16 },
  row: {
    paddingVertical: 15,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  arabicName: { marginTop: 1 },
  footer: { marginTop: 14 },
});
