import { dayProgress, formatTime, getDayPrayerTimes, getNextPrayer } from '../prayerTimes';

const JERUSALEM = { lat: 31.7683, lng: 35.2137 };

describe('prayerTimes', () => {
  it('computes an ordered day of prayers for Jerusalem', () => {
    const day = getDayPrayerTimes(new Date(2026, 6, 2), JERUSALEM.lat, JERUSALEM.lng, 'UmmAlQura', 'shafi');
    const { fajr, sunrise, dhuhr, asr, maghrib, isha } = day.times;
    expect(fajr.getTime()).toBeLessThan(sunrise.getTime());
    expect(sunrise.getTime()).toBeLessThan(dhuhr.getTime());
    expect(dhuhr.getTime()).toBeLessThan(asr.getTime());
    expect(asr.getTime()).toBeLessThan(maghrib.getTime());
    expect(maghrib.getTime()).toBeLessThan(isha.getTime());
    // duha is shortly after sunrise
    expect(day.duha.getTime() - sunrise.getTime()).toBe(20 * 60 * 1000);
  });

  it('madhhab changes the asr time (hanafi later than shafi)', () => {
    const date = new Date(2026, 6, 2);
    const shafi = getDayPrayerTimes(date, JERUSALEM.lat, JERUSALEM.lng, 'UmmAlQura', 'shafi');
    const hanafi = getDayPrayerTimes(date, JERUSALEM.lat, JERUSALEM.lng, 'UmmAlQura', 'hanafi');
    expect(hanafi.times.asr.getTime()).toBeGreaterThan(shafi.times.asr.getTime());
  });

  it('rolls over to tomorrow fajr after isha', () => {
    const date = new Date(2026, 6, 2);
    const day = getDayPrayerTimes(date, JERUSALEM.lat, JERUSALEM.lng, 'UmmAlQura', 'shafi');
    const lateNight = new Date(day.times.isha.getTime() + 30 * 60 * 1000);
    const next = getNextPrayer(lateNight, JERUSALEM.lat, JERUSALEM.lng, 'UmmAlQura', 'shafi');
    expect(next.prayer).toBe('fajr');
    expect(next.time.getTime()).toBeGreaterThan(lateNight.getTime());
    expect(next.remainingMs).toBeGreaterThan(0);
  });

  it('identifies the next prayer mid-day', () => {
    const date = new Date(2026, 6, 2);
    const day = getDayPrayerTimes(date, JERUSALEM.lat, JERUSALEM.lng, 'UmmAlQura', 'shafi');
    const beforeAsr = new Date(day.times.asr.getTime() - 10 * 60 * 1000);
    const next = getNextPrayer(beforeAsr, JERUSALEM.lat, JERUSALEM.lng, 'UmmAlQura', 'shafi');
    expect(next.prayer).toBe('asr');
  });

  it('formats times with western digits, 24h', () => {
    expect(formatTime(new Date(2026, 6, 2, 16, 24))).toBe('16:24');
    expect(formatTime(new Date(2026, 6, 2, 4, 5))).toBe('4:05');
  });

  it('clamps dayProgress to [0,1]', () => {
    const date = new Date(2026, 6, 2);
    const day = getDayPrayerTimes(date, JERUSALEM.lat, JERUSALEM.lng, 'UmmAlQura', 'shafi');
    expect(dayProgress(new Date(day.times.fajr.getTime() - 3600000), day)).toBe(0);
    expect(dayProgress(new Date(day.times.isha.getTime() + 3600000), day)).toBe(1);
    const noon = dayProgress(day.times.dhuhr, day);
    expect(noon).toBeGreaterThan(0.3);
    expect(noon).toBeLessThan(0.7);
  });
});
