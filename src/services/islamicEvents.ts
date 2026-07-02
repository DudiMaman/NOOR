import { daysUntil, nextOccurrence, toHijri } from './hijri';

export interface IslamicEvent {
  id: string;
  /** i18n key under `occasions.` */
  nameKey: string;
  hijriMonth: number;
  hijriDay: number;
}

export const ISLAMIC_EVENTS: IslamicEvent[] = [
  { id: 'newYear', nameKey: 'occasions.newYear', hijriMonth: 1, hijriDay: 1 },
  { id: 'ashura', nameKey: 'occasions.ashura', hijriMonth: 1, hijriDay: 10 },
  { id: 'mawlid', nameKey: 'occasions.mawlid', hijriMonth: 3, hijriDay: 12 },
  { id: 'israMiraj', nameKey: 'occasions.israMiraj', hijriMonth: 7, hijriDay: 27 },
  { id: 'nisfShaban', nameKey: 'occasions.nisfShaban', hijriMonth: 8, hijriDay: 15 },
  { id: 'ramadanStart', nameKey: 'occasions.ramadanStart', hijriMonth: 9, hijriDay: 1 },
  { id: 'laylatQadr', nameKey: 'occasions.laylatQadr', hijriMonth: 9, hijriDay: 27 },
  { id: 'eidFitr', nameKey: 'occasions.eidFitr', hijriMonth: 10, hijriDay: 1 },
  { id: 'arafah', nameKey: 'occasions.arafah', hijriMonth: 12, hijriDay: 9 },
  { id: 'eidAdha', nameKey: 'occasions.eidAdha', hijriMonth: 12, hijriDay: 10 },
];

export interface UpcomingEvent extends IslamicEvent {
  date: Date;
  daysAway: number;
  hijriYear: number;
}

/** All events within the next hijri year, sorted by proximity. */
export function getUpcomingEvents(from = new Date()): UpcomingEvent[] {
  return ISLAMIC_EVENTS.map((event) => {
    const date = nextOccurrence(event.hijriMonth, event.hijriDay, from);
    return {
      ...event,
      date,
      daysAway: daysUntil(date, from),
      hijriYear: toHijri(date).year,
    };
  }).sort((a, b) => a.daysAway - b.daysAway);
}

export function getNextEvent(from = new Date()): UpcomingEvent {
  return getUpcomingEvents(from)[0];
}
