import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import type { TFunction } from 'i18next';

import { getDayPrayerTimes, PRAYER_ORDER, type PrayerKey } from './prayerTimes';
import type { AppLocation, CalcMethodKey, MadhhabKey, ReminderSettings } from '../store/useSettingsStore';

/**
 * Local notifications infrastructure: prayer adhan + pre-alerts for the next
 * few days, daily adhkar/wird reminders, and the trial-ending reminder.
 * Push (remote) notifications can reuse the same channel/permission setup.
 */

const PRAYER_DAYS_AHEAD = 3;
export const CHANNEL_ID = 'noor-reminders';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function ensurePermissions(): Promise<boolean> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Noor reminders',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
    });
  }
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const req = await Notifications.requestPermissionsAsync();
  return req.granted;
}

async function cancelAllScheduled() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

function at(date: Date): Notifications.DateTriggerInput {
  return { type: Notifications.SchedulableTriggerInputTypes.DATE, date };
}

function dailyAt(hour: number, minute: number): Notifications.DailyTriggerInput {
  return { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour, minute };
}

/**
 * Rebuild the full local-notification schedule from current settings.
 * Call after any reminder/location/method change and on app start.
 */
export async function rescheduleAll(options: {
  t: TFunction;
  location: AppLocation | null;
  calcMethod: CalcMethodKey;
  madhhab: MadhhabKey;
  reminders: ReminderSettings;
  trialEndsAt?: number | null;
}): Promise<void> {
  const { t, location, calcMethod, madhhab, reminders, trialEndsAt } = options;
  const granted = await ensurePermissions().catch(() => false);
  await cancelAllScheduled();
  if (!granted) return;

  const now = new Date();

  // Prayer adhan + pre-alerts
  if (location && reminders.adhanEnabled) {
    for (let d = 0; d < PRAYER_DAYS_AHEAD; d++) {
      const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() + d);
      const dayTimes = getDayPrayerTimes(day, location.latitude, location.longitude, calcMethod, madhhab);
      for (const prayer of PRAYER_ORDER) {
        if (prayer === 'sunrise' || !reminders.prayers[prayer as PrayerKey]) continue;
        const time = dayTimes.times[prayer];
        if (time.getTime() <= now.getTime()) continue;
        const prayerName = t(`prayers.${prayer}`);
        await Notifications.scheduleNotificationAsync({
          content: {
            title: t('prayers.timeForPrayer', { prayer: prayerName }),
            body: `${location.label} · ${time.getHours()}:${time.getMinutes().toString().padStart(2, '0')}`,
            sound: 'default',
          },
          trigger: at(time),
        });
        if (reminders.preAlertEnabled) {
          const pre = new Date(time.getTime() - reminders.preAlertMinutes * 60000);
          if (pre.getTime() > now.getTime()) {
            await Notifications.scheduleNotificationAsync({
              content: {
                title: prayerName,
                body: t('prayers.preAlertBody', {
                  prayer: prayerName,
                  minutes: reminders.preAlertMinutes,
                }),
              },
              trigger: at(pre),
            });
          }
        }
      }
    }
  }

  // Daily adhkar & wird
  if (reminders.morningAdhkar) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: t('notificationsContent.adhkarMorningTitle'),
        body: t('notificationsContent.adhkarMorningBody'),
      },
      trigger: dailyAt(7, 0),
    });
  }
  if (reminders.eveningAdhkar) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: t('notificationsContent.adhkarEveningTitle'),
        body: t('notificationsContent.adhkarEveningBody'),
      },
      trigger: dailyAt(17, 30),
    });
  }
  if (reminders.dailyWard) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: t('notificationsContent.wardTitle'),
        body: t('notificationsContent.wardBody'),
      },
      trigger: dailyAt(21, 0),
    });
  }

  // Friday reminder (Thursday evening + Friday morning)
  if (reminders.friday) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: t('notificationsContent.fridayTitle'),
        body: t('notificationsContent.fridayBody'),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday: 6, // Friday (1 = Sunday)
        hour: 8,
        minute: 30,
      },
    });
  }

  // Monday/Thursday fasting reminder — evening before (Sunday & Wednesday)
  if (reminders.fasting) {
    for (const weekday of [1, 4] as const) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: t('notificationsContent.fastingTitle'),
          body: t('notificationsContent.fastingBody'),
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
          weekday,
          hour: 20,
          minute: 0,
        },
      });
    }
  }

  // Trial ending reminder — 24h before the trial expires
  if (trialEndsAt) {
    const remindAt = new Date(trialEndsAt - 24 * 60 * 60 * 1000);
    if (remindAt.getTime() > now.getTime()) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: t('notificationsContent.trialEndingTitle'),
          body: t('notificationsContent.trialEndingBody'),
        },
        trigger: at(remindAt),
      });
    }
  }
}
