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
import { registerUser } from '../../services/auth';
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

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
}

export function SignUpScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const signUp = useUserStore((s) => s.signUp);
  const continueAsGuest = useUserStore((s) => s.continueAsGuest);
  const setFlowStage = useUserStore((s) => s.setFlowStage);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const goToPaywall = () => {
    setFlowStage('paywall');
    navigation.replace('TrialPaywall', { source: 'setup' });
  };

  const handleSignUp = async () => {
    const next: FormErrors = {};
    if (!name.trim()) next.name = t('auth.errorRequired');
    if (!email.trim()) next.email = t('auth.errorRequired');
    else if (!EMAIL_RE.test(email.trim())) next.email = t('auth.errorEmail');
    if (!password) next.password = t('auth.errorRequired');
    else if (password.length < 8) next.password = t('auth.errorPassword');
    setErrors(next);
    if (next.name || next.email || next.password) return;

    const result = await registerUser(name, email, password);
    if (!result.ok) {
      setErrors({ email: t('auth.errorEmailExists') });
      return;
    }
    signUp(result.name, result.email);
    goToPaywall();
  };

  const handleGuest = () => {
    continueAsGuest();
    goToPaywall();
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
        <StarLogo size={34} dotSize={7} style={styles.logo} />

        <AppText weight="bold" size={25} color={colors.ink} center lineHeight={36} style={styles.title}>
          {t('auth.welcomeTitle')}
        </AppText>
        <AppText size={15} color={colors.muted} center lineHeight={26} style={styles.subtitle}>
          {t('auth.welcomeSubtitle')}
        </AppText>

        <View style={styles.fields}>
          <Field
            label={t('auth.name')}
            error={errors.name}
            value={name}
            onChangeText={setName}
            placeholder={t('auth.namePlaceholder')}
          />
          <Field
            label={t('auth.email')}
            error={errors.email}
            value={email}
            onChangeText={setEmail}
            placeholder={t('auth.emailPlaceholder')}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Field
            label={t('auth.password')}
            error={errors.password}
            value={password}
            onChangeText={setPassword}
            placeholder={t('auth.passwordPlaceholder')}
            secureTextEntry
          />
        </View>

        <PrimaryButton label={t('auth.signUp')} onPress={handleSignUp} style={styles.submit} />

        <Pressable
          onPress={() => navigation.navigate('AuthSignIn')}
          style={({ pressed }) => [styles.link, pressed && styles.pressed]}
          hitSlop={8}
        >
          <AppText weight="semibold" size={14} color={colors.gold500} center>
            {t('auth.haveAccount')}
          </AppText>
        </Pressable>

        <Pressable
          onPress={handleGuest}
          style={({ pressed }) => [styles.guestPill, pressed && styles.pressed]}
        >
          <AppText weight="semibold" size={15} color={colors.emerald800}>
            {t('auth.continueAsGuest')}
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
  guestPill: {
    marginTop: 14,
    height: 50,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: 'rgba(13,53,40,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.7 },
});
