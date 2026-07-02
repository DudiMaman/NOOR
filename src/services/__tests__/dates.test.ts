import { dateKey, formatRemainingShort, formatShortDate, remainingParts } from '../dates';

describe('dates', () => {
  it('builds stable date keys', () => {
    expect(dateKey(new Date(2026, 6, 2))).toBe('2026-07-02');
    expect(dateKey(new Date(2026, 11, 31))).toBe('2026-12-31');
  });

  it('formats short remaining time as h:mm', () => {
    expect(formatRemainingShort(84 * 60 * 1000)).toBe('1:24');
    expect(formatRemainingShort(5 * 60 * 1000)).toBe('0:05');
    expect(formatRemainingShort(-1000)).toBe('0:00');
  });

  it('splits remaining ms into hours and minutes', () => {
    expect(remainingParts(84 * 60 * 1000)).toEqual({ hours: 1, minutes: 24 });
    expect(remainingParts(0)).toEqual({ hours: 0, minutes: 0 });
  });

  it('formats renewal dates as d.m.yyyy', () => {
    expect(formatShortDate(new Date(2027, 6, 2).getTime())).toBe('2.7.2027');
  });
});
