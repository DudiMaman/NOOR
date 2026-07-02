import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import { I18nManager } from 'react-native';

import { DEFAULT_LANGUAGE, SUPPORTED_CODES, isRTLLanguage } from './languages';

import ar from './locales/ar.json';
import en from './locales/en.json';
import fr from './locales/fr.json';
import es from './locales/es.json';
import de from './locales/de.json';
import tr from './locales/tr.json';
import ur from './locales/ur.json';
import id from './locales/id.json';
import ms from './locales/ms.json';
import fa from './locales/fa.json';
import ru from './locales/ru.json';
import hi from './locales/hi.json';
import bn from './locales/bn.json';
import pt from './locales/pt.json';
import it from './locales/it.json';
import nl from './locales/nl.json';
import zh from './locales/zh.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';
import sw from './locales/sw.json';
import he from './locales/he.json';

const resources = {
  ar: { translation: ar },
  en: { translation: en },
  fr: { translation: fr },
  es: { translation: es },
  de: { translation: de },
  tr: { translation: tr },
  ur: { translation: ur },
  id: { translation: id },
  ms: { translation: ms },
  fa: { translation: fa },
  ru: { translation: ru },
  hi: { translation: hi },
  bn: { translation: bn },
  pt: { translation: pt },
  it: { translation: it },
  nl: { translation: nl },
  zh: { translation: zh },
  ja: { translation: ja },
  ko: { translation: ko },
  sw: { translation: sw },
  he: { translation: he },
} as const;

/** Language code of the device, normalized to a supported code (or null). */
export function getDeviceLanguage(): string | null {
  const locales = Localization.getLocales();
  for (const locale of locales) {
    const code = locale.languageCode?.toLowerCase();
    if (code && SUPPORTED_CODES.includes(code)) return code;
  }
  return null;
}

export function initI18n(language: string) {
  const lng = SUPPORTED_CODES.includes(language) ? language : DEFAULT_LANGUAGE;
  if (!i18n.isInitialized) {
    i18n.use(initReactI18next).init({
      resources,
      lng,
      fallbackLng: DEFAULT_LANGUAGE,
      interpolation: { escapeValue: false },
      returnObjects: true,
    });
  } else if (i18n.language !== lng) {
    i18n.changeLanguage(lng);
  }
  syncLayoutDirection(lng);
  return i18n;
}

// I18nManager.isRTL is fixed for the session even after forceRTL, so track
// the direction we've asked the OS to apply for correct repeat switches.
let pendingRTL = I18nManager.isRTL;

/**
 * Align the native layout direction with the language.
 * Returns true if the rendered session direction now differs from the
 * requested one (an app reload is then required to re-mirror layouts).
 */
export function syncLayoutDirection(language: string): boolean {
  const rtl = isRTLLanguage(language);
  if (pendingRTL !== rtl) {
    I18nManager.allowRTL(rtl);
    I18nManager.forceRTL(rtl);
    pendingRTL = rtl;
  }
  return I18nManager.isRTL !== rtl;
}

export async function changeAppLanguage(language: string): Promise<boolean> {
  await i18n.changeLanguage(language);
  return syncLayoutDirection(language);
}

export default i18n;
