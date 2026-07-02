import React, { useState } from 'react';
import {
  I18nManager,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { AppText, PrimaryButton, StarLogo } from '../../components';
import { colors, fonts } from '../../theme';
import { useUserStore } from '../../store/useUserStore';
import type { RootStackParamList } from '../../navigation/types';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FieldProps extends TextInputProps {
  label: string;
  error?: string;
}

/** Labeled white input card — hairline border, gold when focused. */
function Field({ label, error, ...inputProps }: FieldProps) {
  const [focused, setFocused] = useState(false);
  return (
    <View>
      <AppText weight="semibold" size={13} color={colors.muted} style={styles.fieldLabel}>
        {label}
      </AppText>
      <View style={[styles.inputCard, focused && styles.inputCardFocused]}>
        <TextInput
          style={styles.input}
          placeholderTextColor={colors.faint}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...inputProps}
        />
      </View>
      {error ? (
        <AppText size={13} color={colors.destructive} style={styles.fieldError}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

export function SignInScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const signIn = useUserStore((s) => s.signIn);
  const setFlowStage = useUserStore((s) => s.setFlowStage);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);

  const handleSignIn = () => {
    if (!email.trim() || !password || !EMAIL_RE.test(email.trim())) {
      setError(t('auth.errorCredentials'));
      return;
    }
    setError(undefined);
    signIn(email.trim());
    setFlowStage('paywall');
    navigation.replace('TrialPaywall', { source: 'setup' });
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.root}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 14 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [styles.backCircle, pressed && styles.pressed]}
          hitSlop={8}
        >
          <AppText weight="bold" size={17} color={colors.emerald800}>
            ›
          </AppText>
        </Pressable>

        <StarLogo size={34} dotSize={7} style={styles.logo} />

        <AppText weight="bold" size={25} color={colors.ink} center lineHeight={36} style={styles.title}>
          {t('auth.signInTitle')}
        </AppText>
        <AppText size={15} color={colors.muted} center lineHeight={26} style={styles.subtitle}>
          {t('auth.signInSubtitle')}
        </AppText>

        <View style={styles.fields}>
          <Field
            label={t('auth.email')}
            value={email}
            onChangeText={setEmail}
            placeholder={t('auth.emailPlaceholder')}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Field
            label={t('auth.password')}
            error={error}
            value={password}
            onChangeText={setPassword}
            placeholder={t('auth.passwordPlaceholder')}
            secureTextEntry
          />
        </View>

        <PrimaryButton label={t('auth.signIn')} onPress={handleSignIn} style={styles.submit} />

        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [styles.link, pressed && styles.pressed]}
          hitSlop={8}
        >
          <AppText weight="semibold" size={14} color={colors.gold500} center>
            {t('auth.noAccount')}
          </AppText>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.cream },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  backCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.hairline,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  logo: { alignSelf: 'center', marginTop: 8 },
  title: { marginTop: 18 },
  subtitle: { marginTop: 8 },
  fields: { marginTop: 28, gap: 14 },
  fieldLabel: { marginBottom: 6 },
  inputCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.hairline,
    paddingHorizontal: 18,
    height: 54,
    justifyContent: 'center',
  },
  inputCardFocused: {
    borderWidth: 1.5,
    borderColor: colors.gold500,
  },
  input: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.ink,
    paddingVertical: 0,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  fieldError: { marginTop: 6 },
  submit: { marginTop: 24 },
  link: { marginTop: 16, alignSelf: 'center' },
  pressed: { opacity: 0.7 },
});
