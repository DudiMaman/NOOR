import type { Dhikr, Reciter, Surah } from './types';

/**
 * The complete Quran — 114 surahs, 6236 ayahs, Uthmani script (Hafs).
 * Bundled from the Tanzil quran-uthmani text (via alquran.cloud). The
 * basmalah is stripped from the first ayah of every surah except Al-Fatiha
 * (and none for At-Tawbah) — the reader renders it in the ornament header.
 */
import quranData from './quran-uthmani.json';

interface RawVerse {
  n: number;
  t: string;
}

interface RawSurah {
  number: number;
  nameArabic: string;
  namePlain: string;
  revelation: string;
  versesCount: number;
  juz: number;
  page: number;
  verses: RawVerse[];
}

export const QURAN: Surah[] = (quranData as RawSurah[]).map((s) => ({
  number: s.number,
  nameArabic: s.nameArabic,
  namePlain: s.namePlain,
  revelation: s.revelation === 'meccan' ? 'meccan' : 'medinan',
  versesCount: s.versesCount,
  juz: s.juz,
  page: s.page,
  verses: s.verses.map((v) => ({ number: v.n, text: v.t })),
}));

export function getSurah(number: number): Surah | undefined {
  return QURAN.find((s) => s.number === number);
}

/**
 * Reciters with streamable recitations on the alquran.cloud CDN
 * (https://cdn.islamic.network/quran/audio-surah/...). `edition` is the CDN
 * edition identifier used by services/audio.ts.
 */
export const RECITERS: (Reciter & { edition: string })[] = [
  { id: 'afasy', name: 'مشاري راشد العفاسي', edition: 'ar.alafasy' },
  { id: 'abdulbasit', name: 'عبد الباسط عبد الصمد', edition: 'ar.abdulbasitmurattal' },
  { id: 'muaiqly', name: 'ماهر المعيقلي', edition: 'ar.mahermuaiqly' },
  { id: 'husary', name: 'محمود خليل الحصري', edition: 'ar.husary' },
];

export const AYAT_ALKURSI: Dhikr = {
  id: 'ayat-alkursi',
  text:
    'اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ، لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ، لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ، مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ، يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ، وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ، وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ، وَلَا يَئُودُهُ حِفْظُهُمَا، وَهُوَ الْعَلِيُّ الْعَظِيمُ',
  source: 'سورة البقرة ٢٥٥',
  repeat: 1,
  virtue: 'من قرأها دبر كل صلاة لم يمنعه من دخول الجنة إلا أن يموت',
};
