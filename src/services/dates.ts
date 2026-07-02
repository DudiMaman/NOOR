import type { TFunction } from 'i18next';

import { toHijri } from './hijri';

export function dateKey(date = new Date()): string {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
    .getDate()
    .toString()
    .padStart(2, '0')}`;
}

const DAY_KEYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;

export function weekdayName(date: Date, t: TFunction): string {
  return t(`days.${DAY_KEYS[date.getDay()]}`);
}

export function gregorianMonthName(date: Date, t: TFunction): string {
  const months = t('gregorianMonths', { returnObjects: true }) as string[];
  return months[date.getMonth()];
}

export function hijriMonthName(month: number, t: TFunction): string {
  const months = t('hijriMonths', { returnObjects: true }) as string[];
  return months[month - 1];
}

/** "الخميس 17 محرّم 1448 هـ · 2 يوليو 2026" */
export function formatDualDate(date: Date, t: TFunction): string {
  const h = toHijri(date);
  const hijri = `${h.day} ${hijriMonthName(h.month, t)} ${h.year} ${t('hijriSuffix')}`;
  const greg = `${date.getDate()} ${gregorianMonthName(date, t)} ${date.getFullYear()}`;
  return `${weekdayName(date, t)} ${hijri} · ${greg}`;
}

/** "12 ربيع الأول 1448 هـ · 25 أغسطس 2026" (no weekday) */
export function formatDualDateShort(date: Date, t: TFunction): string {
  const h = toHijri(date);
  const hijri = `${h.day} ${hijriMonthName(h.month, t)} ${h.year} ${t('hijriSuffix')}`;
  const greg = `${date.getDate()} ${gregorianMonthName(date, t)} ${date.getFullYear()}`;
  return `${hijri} · ${greg}`;
}

/** "1:24" — hours:minutes left */
export function formatRemainingShort(ms: number): string {
  const totalMinutes = Math.max(0, Math.round(ms / 60000));
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h}:${m.toString().padStart(2, '0')}`;
}

export function remainingParts(ms: number): { hours: number; minutes: number } {
  const totalMinutes = Math.max(0, Math.round(ms / 60000));
  return { hours: Math.floor(totalMinutes / 60), minutes: totalMinutes % 60 };
}

/** "2.7.2027" — renewal date format used in settings */
export function formatShortDate(timestamp: number): string {
  const d = new Date(timestamp);
  return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
}
