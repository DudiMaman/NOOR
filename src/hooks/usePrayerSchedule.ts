import { useMemo } from 'react';

import { useNow } from './useNow';
import { useSettingsStore } from '../store/useSettingsStore';
import { DEFAULT_CITY } from '../content/cities';
import {
  getDayPrayerTimes,
  getNextPrayer,
  type DayPrayerTimes,
  type NextPrayerInfo,
} from '../services/prayerTimes';

export interface PrayerSchedule {
  now: Date;
  today: DayPrayerTimes;
  next: NextPrayerInfo;
  locationLabel: string;
  dayFor: (offsetDays: number) => DayPrayerTimes;
}

/** Live prayer schedule for the configured location (falls back to Jerusalem). */
export function usePrayerSchedule(tickMs = 30000): PrayerSchedule {
  const now = useNow(tickMs);
  const location = useSettingsStore((s) => s.location);
  const calcMethod = useSettingsStore((s) => s.calcMethod);
  const madhhab = useSettingsStore((s) => s.madhhab);

  const lat = location?.latitude ?? DEFAULT_CITY.latitude;
  const lng = location?.longitude ?? DEFAULT_CITY.longitude;
  const label = location?.label ?? DEFAULT_CITY.name;

  const dayKeyStr = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;

  const today = useMemo(
    () => getDayPrayerTimes(now, lat, lng, calcMethod, madhhab),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dayKeyStr, lat, lng, calcMethod, madhhab]
  );

  const next = useMemo(
    () => getNextPrayer(now, lat, lng, calcMethod, madhhab),
    [now, lat, lng, calcMethod, madhhab]
  );

  return {
    now,
    today,
    next,
    locationLabel: label,
    dayFor: (offsetDays: number) =>
      getDayPrayerTimes(
        new Date(now.getFullYear(), now.getMonth(), now.getDate() + offsetDays),
        lat,
        lng,
        calcMethod,
        madhhab
      ),
  };
}
