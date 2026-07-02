import {
  CalculationMethod,
  CalculationParameters,
  Coordinates,
  Madhab,
  PrayerTimes,
  SunnahTimes,
} from 'adhan';

import type { CalcMethodKey, MadhhabKey } from '../store/useSettingsStore';

export type PrayerKey = 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export const PRAYER_ORDER: PrayerKey[] = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];

export interface DayPrayerTimes {
  date: Date;
  times: Record<PrayerKey, Date>;
  /** extra (non-obligatory) times strip */
  midnight: Date;
  lastThird: Date;
  duha: Date;
}

export interface NextPrayerInfo {
  prayer: Exclude<PrayerKey, 'sunrise'>;
  time: Date;
  /** milliseconds until the prayer */
  remainingMs: number;
}

function calcParams(method: CalcMethodKey, madhhab: MadhhabKey): CalculationParameters {
  const params = {
    UmmAlQura: CalculationMethod.UmmAlQura,
    MWL: CalculationMethod.MuslimWorldLeague,
    Egyptian: CalculationMethod.Egyptian,
    Karachi: CalculationMethod.Karachi,
    ISNA: CalculationMethod.NorthAmerica,
    Dubai: CalculationMethod.Dubai,
    Turkey: CalculationMethod.Turkey,
  }[method]();
  params.madhab = madhhab === 'hanafi' ? Madhab.Hanafi : Madhab.Shafi;
  return params;
}

export function getDayPrayerTimes(
  date: Date,
  latitude: number,
  longitude: number,
  method: CalcMethodKey,
  madhhab: MadhhabKey
): DayPrayerTimes {
  const coordinates = new Coordinates(latitude, longitude);
  const pt = new PrayerTimes(coordinates, date, calcParams(method, madhhab));
  const sunnah = new SunnahTimes(pt);
  return {
    date,
    times: {
      fajr: pt.fajr,
      sunrise: pt.sunrise,
      dhuhr: pt.dhuhr,
      asr: pt.asr,
      maghrib: pt.maghrib,
      isha: pt.isha,
    },
    midnight: sunnah.middleOfTheNight,
    lastThird: sunnah.lastThirdOfTheNight,
    // Duha begins ~20 minutes after sunrise (common convention)
    duha: new Date(pt.sunrise.getTime() + 20 * 60 * 1000),
  };
}

/** Next obligatory prayer relative to `now` (rolls over to tomorrow's Fajr). */
export function getNextPrayer(
  now: Date,
  latitude: number,
  longitude: number,
  method: CalcMethodKey,
  madhhab: MadhhabKey
): NextPrayerInfo {
  const order: Exclude<PrayerKey, 'sunrise'>[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
  const today = getDayPrayerTimes(now, latitude, longitude, method, madhhab);
  for (const prayer of order) {
    const time = today.times[prayer];
    if (time.getTime() > now.getTime()) {
      return { prayer, time, remainingMs: time.getTime() - now.getTime() };
    }
  }
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const next = getDayPrayerTimes(tomorrow, latitude, longitude, method, madhhab);
  return {
    prayer: 'fajr',
    time: next.times.fajr,
    remainingMs: next.times.fajr.getTime() - now.getTime(),
  };
}

/** "16:24" — Western digits, 24h, per the design. */
export function formatTime(date: Date): string {
  const h = date.getHours();
  const m = date.getMinutes();
  return `${h}:${m.toString().padStart(2, '0')}`;
}

/** Position of the sun along the day arc, 0 (fajr) → 1 (isha), for arc widgets. */
export function dayProgress(now: Date, day: DayPrayerTimes): number {
  const start = day.times.sunrise.getTime();
  const end = day.times.maghrib.getTime();
  const t = (now.getTime() - start) / (end - start);
  return Math.min(1, Math.max(0, t));
}
