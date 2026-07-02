import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type PlanId = 'monthly' | 'yearly';
export type SubscriptionStatus = 'none' | 'trial' | 'active' | 'expired';

export const TRIAL_DAYS = 3;
const DAY_MS = 24 * 60 * 60 * 1000;

interface SubscriptionState {
  status: SubscriptionStatus;
  plan: PlanId | null;
  trialEndsAt: number | null;
  renewsAt: number | null;
  /** Plan pre-selected on paywalls */
  selectedPlan: PlanId;

  selectPlan: (plan: PlanId) => void;
  /**
   * Start the 3-day free trial (mock purchase — replace with StoreKit /
   * Google Play Billing / RevenueCat in production).
   */
  startTrial: (plan: PlanId) => void;
  restorePurchase: () => boolean;
  cancel: () => void;
  /** Re-evaluate trial expiry; call on app foreground. */
  refresh: () => void;
  /** True while the user has an entitlement (trial still running or paid). */
  isEntitled: () => boolean;
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      status: 'none',
      plan: null,
      trialEndsAt: null,
      renewsAt: null,
      selectedPlan: 'yearly',

      selectPlan: (selectedPlan) => set({ selectedPlan }),
      startTrial: (plan) => {
        const trialEndsAt = Date.now() + TRIAL_DAYS * DAY_MS;
        const renewsAt = trialEndsAt + (plan === 'yearly' ? 365 : 30) * DAY_MS;
        set({ status: 'trial', plan, trialEndsAt, renewsAt, selectedPlan: plan });
      },
      restorePurchase: () => {
        // Mock: nothing to restore without a payment backend.
        const { status } = get();
        return status === 'active' || status === 'trial';
      },
      cancel: () => set({ status: 'expired', renewsAt: null }),
      refresh: () => {
        const { status, trialEndsAt } = get();
        if (status === 'trial' && trialEndsAt && Date.now() > trialEndsAt) {
          // Trial elapsed: in production the store would convert it to a paid
          // subscription; the mock keeps the entitlement (active) so the demo
          // flow stays usable end-to-end.
          set({ status: 'active' });
        }
      },
      isEntitled: () => {
        const { status, trialEndsAt } = get();
        if (status === 'active') return true;
        if (status === 'trial') return trialEndsAt !== null && Date.now() < trialEndsAt;
        return false;
      },
    }),
    { name: 'noor-subscription', storage: createJSONStorage(() => AsyncStorage) }
  )
);

/** Reactive entitlement selector for components. */
export const useIsPremium = () =>
  useSubscriptionStore(
    (s) => s.status === 'active' || (s.status === 'trial' && !!s.trialEndsAt && Date.now() < s.trialEndsAt)
  );
