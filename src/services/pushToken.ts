import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

import { ensurePermissions } from './notifications';

/**
 * Remote push infrastructure: registers the device with the Expo push
 * service and returns the Expo push token. The token is persisted by the
 * caller (settings store) — sending pushes requires a backend that stores
 * these tokens and calls the Expo push API; local notifications work today.
 */
export async function registerForPushToken(): Promise<string | null> {
  try {
    // Push tokens only exist on physical devices.
    if (!Device.isDevice) return null;
    const granted = await ensurePermissions();
    if (!granted) return null;

    const projectId: string | undefined =
      Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
    const token = await Notifications.getExpoPushTokenAsync(
      projectId ? { projectId } : undefined
    );
    return token.data;
  } catch {
    // No EAS project configured / emulator / network issue — push stays off.
    return null;
  }
}
