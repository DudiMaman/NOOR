import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type CalcMethodKey =
  | 'UmmAlQura'
  | 'MWL'
  | 'Egyptian'
  | 'Karachi'
  | 'ISNA'
  | 'Dubai'
  | 'Turkey';

export type MadhhabKey = 'shafi' | 'hanafi';
export type AdhanSoundKey = 'makkah' | 'madinah' | 'aqsa' | 'egypt';
export type AppearanceKey = 'light' | 'dark' | 'auto';
export type PreAlertMinutes = 5 | 10 | 15;

export interface AppLocation {
  /** i18n-independent identifier when picked from the city list */
  cityKey?: string;
  /** Display name (Arabic city name or reverse-geocoded label) */
  label: string;
  country?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
  source: 'gps' | 'city';
}

export interface ReminderSettings {
  adhanEnabled: boolean;
  preAlertEnabled: boolean;
  preAlertMinutes: PreAlertMinutes;
  friday: boolean;
  morningAdhkar: boolean;
  eveningAdhkar: boolean;
  dailyWard: boolean;
  occasions: boolean;
  fasting: boolean;
  /** per-prayer adhan toggles */
  prayers: Record<'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha', boolean>;
}

export const defaultReminders: ReminderSettings = {
  adhanEnabled: true,
  preAlertEnabled: true,
  preAlertMinutes: 10,
  friday: true,
  morningAdhkar: true,
  eveningAdhkar: true,
  dailyWard: false,
  occasions: true,
  fasting: false,
  prayers: { fajr: true, sunrise: false, dhuhr: true, asr: true, maghrib: true, isha: true },
};

interface SettingsState {
  language: string;
  languagePromptDismissed: boolean;
  appearance: AppearanceKey;
  location: AppLocation | null;
  calcMethod: CalcMethodKey;
  madhhab: MadhhabKey;
  adhanSound: AdhanSoundKey;
  reminders: ReminderSettings;
  quranFontScale: number;
  /** Selected reciter for Quran audio */
  reciterId: string;
  /** Expo push token (remote-push infrastructure; sending needs a backend) */
  pushToken: string | null;

  setLanguage: (language: string) => void;
  setReciterId: (reciterId: string) => void;
  setPushToken: (pushToken: string | null) => void;
  dismissLanguagePrompt: () => void;
  setAppearance: (appearance: AppearanceKey) => void;
  setLocation: (location: AppLocation) => void;
  setCalcMethod: (method: CalcMethodKey) => void;
  setMadhhab: (madhhab: MadhhabKey) => void;
  setAdhanSound: (sound: AdhanSoundKey) => void;
  setReminders: (patch: Partial<ReminderSettings>) => void;
  setPrayerReminder: (prayer: keyof ReminderSettings['prayers'], enabled: boolean) => void;
  cycleQuranFontScale: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: 'ar',
      languagePromptDismissed: false,
      appearance: 'light',
      location: null,
      calcMethod: 'UmmAlQura',
      madhhab: 'shafi',
      adhanSound: 'makkah',
      reminders: defaultReminders,
      quranFontScale: 1,
      reciterId: 'afasy',
      pushToken: null,

      setLanguage: (language) => set({ language }),
      setReciterId: (reciterId) => set({ reciterId }),
      setPushToken: (pushToken) => set({ pushToken }),
      dismissLanguagePrompt: () => set({ languagePromptDismissed: true }),
      setAppearance: (appearance) => set({ appearance }),
      setLocation: (location) => set({ location }),
      setCalcMethod: (calcMethod) => set({ calcMethod }),
      setMadhhab: (madhhab) => set({ madhhab }),
      setAdhanSound: (adhanSound) => set({ adhanSound }),
      setReminders: (patch) =>
        set((state) => ({ reminders: { ...state.reminders, ...patch } })),
      setPrayerReminder: (prayer, enabled) =>
        set((state) => ({
          reminders: {
            ...state.reminders,
            prayers: { ...state.reminders.prayers, [prayer]: enabled },
          },
        })),
      cycleQuranFontScale: () =>
        set((state) => ({
          quranFontScale:
            state.quranFontScale >= 1.3 ? 0.85 : Number((state.quranFontScale + 0.15).toFixed(2)),
        })),
    }),
    { name: 'noor-settings', storage: createJSONStorage(() => AsyncStorage) }
  )
);
