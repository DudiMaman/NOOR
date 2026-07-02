/**
 * Hijri (Islamic) calendar conversion — tabular calendar (astronomical
 * epoch, "Kuwaiti algorithm"). Accurate within ±1 day of Umm al-Qura;
 * good enough for display and occasion countdowns. Swap for an Umm al-Qura
 * table if day-exact official dates are required.
 */
export interface HijriDate {
  year: number;
  /** 1..12 */
  month: number;
  /** 1..30 */
  day: number;
}

const ISLAMIC_EPOCH = 1948439.5; // julian day of 1 Muharram 1 AH (astronomical)

function gregorianToJulianDay(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  ) - 0.5;
}

function julianDayToGregorian(jd: number): { year: number; month: number; day: number } {
  const j = Math.floor(jd + 0.5) + 32044;
  const g = Math.floor(j / 146097);
  const dg = j % 146097;
  const c = Math.floor((Math.floor(dg / 36524) + 1) * 3 / 4);
  const dc = dg - c * 36524;
  const b = Math.floor(dc / 1461);
  const db = dc % 1461;
  const a = Math.floor((Math.floor(db / 365) + 1) * 3 / 4);
  const da = db - a * 365;
  const y = g * 400 + c * 100 + b * 4 + a;
  const m = Math.floor((da * 5 + 308) / 153) - 2;
  const d = da - Math.floor(((m + 4) * 153) / 5) + 122;
  return { year: y - 4800 + Math.floor((m + 2) / 12), month: ((m + 2) % 12) + 1, day: d + 1 };
}

export function toHijri(date: Date): HijriDate {
  const jd = gregorianToJulianDay(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const days = Math.floor(jd - ISLAMIC_EPOCH);
  const year = Math.floor((30 * days + 10646) / 10631);
  const startOfYear = Math.ceil(29.5 * 0) + (year - 1) * 354 + Math.floor((3 + 11 * year) / 30);
  let dayOfYear = days - startOfYear + 1;
  if (dayOfYear <= 0) {
    // clamp across year boundary rounding
    return { year: year - 1, month: 12, day: 29 };
  }
  let month = Math.min(12, Math.ceil(dayOfYear / 29.5));
  // month start day-of-year (alternating 30/29)
  const monthStart = Math.ceil(29.5 * (month - 1));
  let day = dayOfYear - monthStart;
  if (day <= 0) {
    month -= 1;
    day = dayOfYear - Math.ceil(29.5 * (month - 1));
  }
  return { year, month, day };
}

export function hijriToGregorian(hijri: HijriDate): Date {
  const days =
    Math.ceil(29.5 * (hijri.month - 1)) +
    (hijri.year - 1) * 354 +
    Math.floor((3 + 11 * hijri.year) / 30) +
    hijri.day -
    1;
  const jd = days + ISLAMIC_EPOCH;
  const g = julianDayToGregorian(jd);
  return new Date(g.year, g.month - 1, g.day);
}

/** Next Gregorian occurrence (>= today) of a fixed hijri month/day. */
export function nextOccurrence(month: number, day: number, from = new Date()): Date {
  const today = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const h = toHijri(today);
  for (let y = h.year; y <= h.year + 2; y++) {
    const g = hijriToGregorian({ year: y, month, day });
    if (g.getTime() >= today.getTime()) return g;
  }
  return hijriToGregorian({ year: h.year + 1, month, day });
}

export function daysUntil(date: Date, from = new Date()): number {
  const a = new Date(from.getFullYear(), from.getMonth(), from.getDate()).getTime();
  const b = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  return Math.round((b - a) / 86400000);
}
