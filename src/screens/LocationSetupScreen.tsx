import React, { useMemo, useState } from 'react';
import { I18nManager, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import * as Location from 'expo-location';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppText, CheckCircle, ListCard, PrimaryButton } from '../components';
import { CITIES } from '../content/cities';
import { useSettingsStore } from '../store/useSettingsStore';
import { useUserStore } from '../store/useUserStore';
import { colors, fonts, radii, shadows } from '../theme';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'LocationSetup'>;

/** Location setup — GPS or curated city list (design ref 1k). */
export function LocationSetupScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const setLocation = useSettingsStore((state) => state.setLocation);
  const setFlowStage = useUserStore((state) => state.setFlowStage);
  const fromSettings = route.params?.fromSettings === true;

  /** 'gps' or a city key from CITIES. */
  const [selection, setSelection] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [busy, setBusy] = useState(false);
  const [gpsError, setGpsError] = useState(false);
  const [gpsLabel, setGpsLabel] = useState<string | null>(null);

  const filteredCities = useMemo(() => {
    const q = query.trim();
    if (!q) return CITIES;
    return CITIES.filter((city) => city.name.includes(q) || city.country.includes(q));
  }, [query]);

  const useCurrentLocation = async () => {
    if (busy) return;
    setBusy(true);
    setGpsError(false);
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== 'granted') {
        setGpsError(true);
        return;
      }
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const { latitude, longitude } = position.coords;
      let label = t('location.myLocation');
      try {
        const [place] = await Location.reverseGeocodeAsync({ latitude, longitude });
        label = place?.city || place?.subregion || place?.region || label;
      } catch {
        // reverse geocoding failed — keep the generic label
      }
      setLocation({ source: 'gps', label, latitude, longitude });
      setGpsLabel(label);
      setSelection('gps');
    } catch {
      setGpsError(true);
    } finally {
      setBusy(false);
    }
  };

  const selectCity = (key: string) => {
    setSelection(key);
    setGpsError(false);
  };

  const confirm = () => {
    if (!selection) return;
    if (selection !== 'gps') {
      const city = CITIES.find((c) => c.key === selection);
      if (!city) return;
      setLocation({
        source: 'city',
        cityKey: city.key,
        label: city.name,
        country: city.country,
        latitude: city.latitude,
        longitude: city.longitude,
      });
    }
    if (fromSettings) {
      navigation.goBack();
    } else {
      setFlowStage('main');
      navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    }
  };

  const gpsSelected = selection === 'gps';
  const gpsSubText = busy
    ? t('location.locating')
    : gpsSelected && gpsLabel
      ? gpsLabel
      : t('location.useCurrentSub');

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 14 }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {fromSettings && (
          <Pressable
            onPress={() => navigation.goBack()}
            hitSlop={8}
            style={({ pressed }) => [styles.backCircle, pressed && { opacity: 0.7 }]}
          >
            <AppText weight="bold" size={17} color={colors.emerald800}>
              ›
            </AppText>
          </Pressable>
        )}

        <AppText weight="bold" size={25} color={colors.ink} style={styles.title}>
          {t('location.title')}
        </AppText>
        <AppText size={15} color={colors.muted} lineHeight={25} style={styles.subtitle}>
          {t('location.subtitle')}
        </AppText>

        {/* GPS card */}
        <Pressable
          onPress={useCurrentLocation}
          style={({ pressed }) => [
            styles.gpsCard,
            shadows.primaryCta,
            gpsSelected && styles.gpsCardSelected,
            pressed && { opacity: 0.92 },
          ]}
        >
          <View style={styles.gpsIconCircle}>
            <View style={styles.gpsRing}>
              <View style={styles.gpsDot} />
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <AppText weight="bold" size={16.5} color={colors.creamText}>
              {t('location.useCurrent')}
            </AppText>
            <AppText size={13} color="rgba(245,238,220,0.6)" style={{ marginTop: 2 }}>
              {gpsSubText}
            </AppText>
          </View>
          {gpsSelected ? (
            <CheckCircle checked size={22} />
          ) : (
            <AppText size={16} color="rgba(245,238,220,0.5)">
              ‹
            </AppText>
          )}
        </Pressable>

        {gpsError && (
          <AppText size={13} color={colors.destructive} style={styles.errorText}>
            {t('location.permissionDenied')}
          </AppText>
        )}

        {/* "or choose a city" divider */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <AppText size={13} color={colors.muted}>
            {t('location.orChooseCity')}
          </AppText>
          <View style={styles.dividerLine} />
        </View>

        {/* Search field */}
        <View style={styles.searchCard}>
          <View style={styles.searchIcon}>
            <View style={styles.searchHandle} />
          </View>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={t('location.searchPlaceholder')}
            placeholderTextColor={colors.faint}
            style={styles.searchInput}
          />
        </View>

        {/* City list */}
        {filteredCities.length > 0 && (
          <ListCard style={styles.cityList}>
            {filteredCities.map((city) => {
              const selected = selection === city.key;
              return (
                <Pressable
                  key={city.key}
                  onPress={() => selectCity(city.key)}
                  style={({ pressed }) => [
                    styles.cityRow,
                    selected && { backgroundColor: colors.creamTint },
                    pressed && !selected && { backgroundColor: colors.fill4 },
                  ]}
                >
                  <View>
                    <AppText weight={selected ? 'bold' : 'semibold'} size={16} color={colors.ink}>
                      {city.name}
                    </AppText>
                    <AppText size={13} color={colors.muted}>
                      {city.country}
                    </AppText>
                  </View>
                  {selected && <CheckCircle checked size={22} />}
                </Pressable>
              );
            })}
          </ListCard>
        )}
      </ScrollView>

      <PrimaryButton
        label={t('location.confirm')}
        onPress={confirm}
        disabled={!selection}
        labelWeight="semibold"
        style={styles.confirmButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.cream,
    paddingHorizontal: 24,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 24 },
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
  title: { marginTop: 24 },
  subtitle: { marginTop: 8 },
  gpsCard: {
    marginTop: 24,
    backgroundColor: colors.emerald800,
    borderRadius: radii.card,
    borderWidth: 1.5,
    borderColor: 'transparent',
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  gpsCardSelected: { borderColor: colors.gold500 },
  gpsIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(196,164,95,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  gpsRing: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: colors.gold300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gpsDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.gold300,
  },
  errorText: { marginTop: 10 },
  dividerRow: {
    marginTop: 24,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.hairlineStrong },
  searchCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.fill8,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchIcon: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    borderWidth: 2,
    borderColor: colors.faint,
    flexShrink: 0,
  },
  searchHandle: {
    position: 'absolute',
    bottom: -5,
    left: -4,
    width: 7,
    height: 2,
    borderRadius: 2,
    backgroundColor: colors.faint,
    transform: [{ rotate: '45deg' }],
  },
  searchInput: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 15.5,
    color: colors.ink,
    paddingVertical: 0,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  cityList: { marginTop: 16 },
  cityRow: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  confirmButton: { marginTop: 12, marginBottom: 48 },
});
