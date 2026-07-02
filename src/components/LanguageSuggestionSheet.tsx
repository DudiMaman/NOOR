import React, { useEffect, useState } from 'react';
import { Alert, Modal, Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from './AppText';
import { PrimaryButton } from './buttons';
import { StarLogo } from './StarLogo';
import { colors, radii, shadows } from '../theme';
import { changeAppLanguage, getDeviceLanguage } from '../i18n';
import { DEFAULT_LANGUAGE, getLanguageMeta } from '../i18n/languages';
import { useSettingsStore } from '../store/useSettingsStore';

/**
 * Device-language detection drawer (product rule):
 * on launch, if the device language differs from the app default (Arabic)
 * and the user hasn't decided before, offer to switch or stay in Arabic.
 */
export function LanguageSuggestionSheet() {
  const { t, i18n } = useTranslation();
  const dismissed = useSettingsStore((s) => s.languagePromptDismissed);
  const dismiss = useSettingsStore((s) => s.dismissLanguagePrompt);
  const setLanguage = useSettingsStore((s) => s.setLanguage);
  const currentLanguage = useSettingsStore((s) => s.language);
  const [visible, setVisible] = useState(false);
  const [deviceLang, setDeviceLang] = useState<string | null>(null);

  useEffect(() => {
    if (dismissed || currentLanguage !== DEFAULT_LANGUAGE) return;
    const detected = getDeviceLanguage();
    if (detected && detected !== DEFAULT_LANGUAGE) {
      setDeviceLang(detected);
      const timer = setTimeout(() => setVisible(true), 900);
      return () => clearTimeout(timer);
    }
  }, [dismissed, currentLanguage]);

  if (!deviceLang) return null;

  const meta = getLanguageMeta(deviceLang);
  // Show the device language's name in Arabic (app language) + native form
  const languageLabel = `${meta.arabicName} (${meta.nativeName})`;

  const stay = () => {
    dismiss();
    setVisible(false);
  };

  const switchLanguage = async () => {
    dismiss();
    setLanguage(deviceLang);
    setVisible(false);
    const directionChanged = await changeAppLanguage(deviceLang);
    if (directionChanged) {
      Alert.alert(i18n.getFixedT(deviceLang)('language.restartNote'));
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={stay}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={stay} />
        <View style={[styles.sheet, shadows.sheet]}>
          <View style={styles.grabber} />
          <StarLogo size={34} dotSize={7} style={{ alignSelf: 'center' }} />
          <AppText weight="bold" size={20} center style={{ marginTop: 12 }}>
            {t('languagePrompt.title', { language: languageLabel })}
          </AppText>
          <AppText size={14.5} color={colors.muted} center lineHeight={25} style={{ marginTop: 8 }}>
            {t('languagePrompt.body', { language: meta.nativeName })}
          </AppText>
          <View style={styles.buttonsRow}>
            <PrimaryButton
              label={t('languagePrompt.switchTo', { language: meta.nativeName })}
              onPress={switchLanguage}
              height={50}
              style={{ flex: 1 }}
            />
            <Pressable onPress={stay} style={({ pressed }) => [styles.stayButton, pressed && { opacity: 0.8 }]}>
              <AppText weight="semibold" size={15} color={colors.emerald800}>
                {i18n.getFixedT(DEFAULT_LANGUAGE)('languagePrompt.stay')}
              </AppText>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(6,30,22,0.55)',
  },
  sheet: {
    backgroundColor: colors.cream,
    borderTopStartRadius: radii.sheet,
    borderTopEndRadius: radii.sheet,
    paddingHorizontal: 26,
    paddingTop: 14,
    paddingBottom: 48,
  },
  grabber: {
    alignSelf: 'center',
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.trackOff,
    marginBottom: 18,
  },
  buttonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 22,
  },
  stayButton: {
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(13,53,40,0.25)',
  },
});
