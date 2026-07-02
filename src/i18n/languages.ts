/**
 * Supported interface languages. Arabic is the app default;
 * sacred texts (Quran, adhkar, hadith) are always shown in Arabic.
 */
export interface LanguageMeta {
  code: string;
  /** Language name in the language itself */
  nativeName: string;
  /** Language name in Arabic (for the language screen) */
  arabicName: string;
  rtl: boolean;
}

export const DEFAULT_LANGUAGE = 'ar';

export const LANGUAGES: LanguageMeta[] = [
  { code: 'ar', nativeName: 'العربية', arabicName: 'العربية', rtl: true },
  { code: 'en', nativeName: 'English', arabicName: 'الإنجليزية', rtl: false },
  { code: 'fr', nativeName: 'Français', arabicName: 'الفرنسية', rtl: false },
  { code: 'es', nativeName: 'Español', arabicName: 'الإسبانية', rtl: false },
  { code: 'de', nativeName: 'Deutsch', arabicName: 'الألمانية', rtl: false },
  { code: 'tr', nativeName: 'Türkçe', arabicName: 'التركية', rtl: false },
  { code: 'ur', nativeName: 'اردو', arabicName: 'الأردية', rtl: true },
  { code: 'id', nativeName: 'Bahasa Indonesia', arabicName: 'الإندونيسية', rtl: false },
  { code: 'ms', nativeName: 'Bahasa Melayu', arabicName: 'الملايوية', rtl: false },
  { code: 'fa', nativeName: 'فارسی', arabicName: 'الفارسية', rtl: true },
  { code: 'ru', nativeName: 'Русский', arabicName: 'الروسية', rtl: false },
  { code: 'hi', nativeName: 'हिन्दी', arabicName: 'الهندية', rtl: false },
  { code: 'bn', nativeName: 'বাংলা', arabicName: 'البنغالية', rtl: false },
  { code: 'pt', nativeName: 'Português', arabicName: 'البرتغالية', rtl: false },
  { code: 'it', nativeName: 'Italiano', arabicName: 'الإيطالية', rtl: false },
  { code: 'nl', nativeName: 'Nederlands', arabicName: 'الهولندية', rtl: false },
  { code: 'zh', nativeName: '中文', arabicName: 'الصينية', rtl: false },
  { code: 'ja', nativeName: '日本語', arabicName: 'اليابانية', rtl: false },
  { code: 'ko', nativeName: '한국어', arabicName: 'الكورية', rtl: false },
  { code: 'sw', nativeName: 'Kiswahili', arabicName: 'السواحلية', rtl: false },
  { code: 'he', nativeName: 'עברית', arabicName: 'العبرية', rtl: true },
];

export const SUPPORTED_CODES = LANGUAGES.map((l) => l.code);

export function getLanguageMeta(code: string): LanguageMeta {
  return LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0];
}

export function isRTLLanguage(code: string): boolean {
  return getLanguageMeta(code).rtl;
}
