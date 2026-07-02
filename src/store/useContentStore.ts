import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface QuranPosition {
  surahNumber: number;
  /** 1-based verse index within the surah */
  verse: number;
}

interface ContentState {
  /** date keys (YYYY-MM-DD) of daily items marked as read */
  readDays: Record<string, true>;
  savedItemIds: string[];
  bookmark: QuranPosition;
  /** verses read today toward the daily wird */
  wardVersesRead: number;
  wardDateKey: string;
  adhkarCompletedDays: Record<string, true>;

  markDayRead: (dateKey: string) => void;
  toggleSaved: (id: string) => void;
  setBookmark: (position: QuranPosition) => void;
  addWardProgress: (dateKey: string, verses: number) => void;
  markAdhkarCompleted: (dateKey: string) => void;
}

export const useContentStore = create<ContentState>()(
  persist(
    (set) => ({
      readDays: {},
      savedItemIds: [],
      bookmark: { surahNumber: 18, verse: 1 },
      wardVersesRead: 0,
      wardDateKey: '',
      adhkarCompletedDays: {},

      markDayRead: (dateKey) =>
        set((state) => ({ readDays: { ...state.readDays, [dateKey]: true } })),
      toggleSaved: (id) =>
        set((state) => ({
          savedItemIds: state.savedItemIds.includes(id)
            ? state.savedItemIds.filter((s) => s !== id)
            : [...state.savedItemIds, id],
        })),
      setBookmark: (bookmark) => set({ bookmark }),
      addWardProgress: (dateKey, verses) =>
        set((state) => ({
          wardDateKey: dateKey,
          wardVersesRead: state.wardDateKey === dateKey ? state.wardVersesRead + verses : verses,
        })),
      markAdhkarCompleted: (dateKey) =>
        set((state) => ({
          adhkarCompletedDays: { ...state.adhkarCompletedDays, [dateKey]: true },
        })),
    }),
    { name: 'noor-content', storage: createJSONStorage(() => AsyncStorage) }
  )
);
