/**
 * Content model contracts. Sacred texts are stored in Arabic only —
 * UI chrome is localized, religious content is not.
 */

export interface Verse {
  /** 1-based verse number within the surah */
  number: number;
  text: string;
}

export interface Surah {
  number: number;
  /** Ornamental Arabic name, e.g. "سُورَةُ الكَهْف" */
  nameArabic: string;
  /** Plain Arabic name for lists, e.g. "الكهف" */
  namePlain: string;
  revelation: 'meccan' | 'medinan';
  versesCount: number;
  juz: number;
  page: number;
  /**
   * Included verse texts (may be a leading subset for long surahs in the
   * demo data set; versesCount always reflects the true total).
   */
  verses: Verse[];
}

export interface Dhikr {
  id: string;
  /** Full Arabic text of the dhikr/du'a */
  text: string;
  /** e.g. "رواه مسلم", "سورة الإخلاص" */
  source?: string;
  /** times to repeat (1, 3, 33, 100...) */
  repeat: number;
  /** short Arabic note on its virtue */
  virtue?: string;
}

export type AdhkarKind = 'morning' | 'evening' | 'afterPrayer';

export interface HadithItem {
  id: string;
  category: 'sunnah' | 'virtue' | 'ruling' | 'dhikr';
  /** The hadith text in Arabic (guillemets « » per the design) */
  text: string;
  /** e.g. "متفق عليه", "رواه مسلم" */
  attribution: string;
  /** Accessible Arabic explanation (2-minute read) */
  explanation: string;
  /** Arabic topic tags, e.g. ["طلب العلم"] */
  tags: string[];
}

export interface PrayerGuideStep {
  /** Arabic step title, e.g. "تكبيرة الإحرام" */
  title: string;
  /** Arabic how-to description */
  body: string;
  /** Arabic text recited at this step, if any */
  recitation?: string;
}

export interface PrayerGuide {
  prayer: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
  /** obligatory rak'ahs */
  rakaat: number;
  sunnahBefore?: number;
  sunnahAfter?: number;
  /** Arabic description of the prayer's special virtue/notes */
  note?: string;
  steps: PrayerGuideStep[];
}

export interface Reciter {
  id: string;
  /** Arabic name, e.g. "مشاري راشد العفاسي" */
  name: string;
}
