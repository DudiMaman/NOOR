import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';

import { useIsPremium } from '../store/useSubscriptionStore';

/**
 * The paywall gate — the app's core monetization rule.
 *
 * Everything in Noor requires an active subscription (or trial). The trial
 * paywall can be dismissed with ✕, but any tab, button or feature the user
 * touches afterwards re-opens it until a trial/subscription starts.
 *
 * Usage:
 *   const gate = usePaywallGate();
 *   <Pressable onPress={() => gate(() => navigation.navigate('AdhkarReader', ...))} />
 *
 * `gate()` runs the action when entitled; otherwise it presents the trial
 * paywall and returns false.
 */
export function usePaywallGate() {
  const isPremium = useIsPremium();
  const navigation = useNavigation();

  return useCallback(
    (action?: () => void): boolean => {
      if (isPremium) {
        action?.();
        return true;
      }
      navigation.navigate('TrialPaywall', { source: 'gate' });
      return false;
    },
    [isPremium, navigation]
  );
}
