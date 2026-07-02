import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Gender = 'male' | 'female';
export type AgeRange = 'under18' | 'a18_24' | 'a25_34' | 'a35_44' | 'a45_54' | 'a55plus';
export type Goal = 'prayOnTime' | 'dailyQuran' | 'learnBasics' | 'adhkarHabit' | 'ramadanPrep';
export type Religiosity = 'committed' | 'striving' | 'beginning' | 'exploring';

export interface QuizAnswers {
  gender?: Gender;
  ageRange?: AgeRange;
  goals: Goal[];
  religiosity?: Religiosity;
}

export interface UserProfile {
  name: string;
  email?: string;
  isGuest: boolean;
  createdAt: number;
}

/** Setup flow progress — drives the initial route on cold start. */
export type FlowStage = 'onboarding' | 'quiz' | 'auth' | 'paywall' | 'location' | 'main';

interface UserState {
  flowStage: FlowStage;
  profile: UserProfile | null;
  quiz: QuizAnswers;

  setFlowStage: (stage: FlowStage) => void;
  setQuiz: (patch: Partial<QuizAnswers>) => void;
  toggleGoal: (goal: Goal) => void;
  signUp: (name: string, email: string) => void;
  signIn: (email: string, name?: string) => void;
  continueAsGuest: () => void;
  signOut: () => void;
  updateName: (name: string) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      flowStage: 'onboarding',
      profile: null,
      quiz: { goals: [] },

      setFlowStage: (flowStage) => set({ flowStage }),
      setQuiz: (patch) => set((state) => ({ quiz: { ...state.quiz, ...patch } })),
      toggleGoal: (goal) =>
        set((state) => ({
          quiz: {
            ...state.quiz,
            goals: state.quiz.goals.includes(goal)
              ? state.quiz.goals.filter((g) => g !== goal)
              : [...state.quiz.goals, goal],
          },
        })),
      signUp: (name, email) =>
        set({ profile: { name, email, isGuest: false, createdAt: Date.now() } }),
      signIn: (email, name) =>
        set({
          profile: {
            name: name || email.split('@')[0],
            email,
            isGuest: false,
            createdAt: Date.now(),
          },
        }),
      continueAsGuest: () =>
        set({ profile: { name: '', isGuest: true, createdAt: Date.now() } }),
      signOut: () => set({ profile: null, flowStage: 'onboarding', quiz: { goals: [] } }),
      updateName: (name) =>
        set((state) => (state.profile ? { profile: { ...state.profile, name } } : {})),
    }),
    { name: 'noor-user', storage: createJSONStorage(() => AsyncStorage) }
  )
);
