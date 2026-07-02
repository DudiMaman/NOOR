import { daysUntil, hijriToGregorian, nextOccurrence, toHijri } from '../hijri';

describe('hijri (Umm al-Qura)', () => {
  it('matches the design anchor date: 2 July 2026 → 17 Muharram 1448', () => {
    expect(toHijri(new Date(2026, 6, 2))).toEqual({ year: 1448, month: 1, day: 17 });
  });

  it('matches Ramadan 1447 start (18 Feb 2026)', () => {
    expect(toHijri(new Date(2026, 1, 18))).toEqual({ year: 1447, month: 9, day: 1 });
  });

  it('round-trips hijri → gregorian → hijri', () => {
    for (const h of [
      { year: 1448, month: 1, day: 17 },
      { year: 1447, month: 9, day: 1 },
      { year: 1448, month: 10, day: 1 },
      { year: 1450, month: 12, day: 10 },
    ]) {
      expect(toHijri(hijriToGregorian(h))).toEqual(h);
    }
  });

  it('nextOccurrence always lands today or later, within ~1 hijri year', () => {
    const from = new Date(2026, 6, 2);
    for (const [m, d] of [
      [1, 1],
      [3, 12],
      [9, 1],
      [10, 1],
      [12, 10],
    ] as const) {
      const next = nextOccurrence(m, d, from);
      const away = daysUntil(next, from);
      expect(away).toBeGreaterThanOrEqual(0);
      expect(away).toBeLessThanOrEqual(386);
      const h = toHijri(next);
      expect(h.month).toBe(m);
      expect(h.day).toBe(d);
    }
  });

  it('falls back to the tabular calendar outside the Umm al-Qura range', () => {
    const h = toHijri(new Date(2090, 0, 1));
    expect(h.year).toBeGreaterThan(1500);
    expect(h.month).toBeGreaterThanOrEqual(1);
    expect(h.month).toBeLessThanOrEqual(12);
    expect(h.day).toBeGreaterThanOrEqual(1);
    expect(h.day).toBeLessThanOrEqual(30);
  });
});
