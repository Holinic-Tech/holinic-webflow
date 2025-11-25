import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { QuestionId } from '../types';

interface QuizState {
  // State - currentScreenIndex is the index in screenFlow array (0-20)
  currentScreenIndex: number;
  answers: Record<string, string | string[] | number>;
  isComplete: boolean;
  showSkipDialog: boolean;
  startedAt: number | null;
  completedAt: number | null;

  // Actions
  startQuiz: () => void;
  setAnswer: (questionId: QuestionId, answer: string | string[] | number) => void;
  toggleMultiAnswer: (questionId: QuestionId, answerId: string) => void;
  nextScreen: () => void;
  previousScreen: () => void;
  goToScreen: (index: number) => void;
  completeQuiz: () => void;
  resetQuiz: () => void;
  setShowSkipDialog: (show: boolean) => void;
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set) => ({
      // Initial state
      currentScreenIndex: 0,
      answers: {},
      isComplete: false,
      showSkipDialog: false,
      startedAt: null,
      completedAt: null,

      // Actions
      startQuiz: () => {
        set({
          startedAt: Date.now(),
          currentScreenIndex: 0,
          answers: {},
          isComplete: false,
        });
      },

      setAnswer: (questionId, answer) => {
        set((state) => ({
          answers: { ...state.answers, [questionId]: answer },
        }));
      },

      toggleMultiAnswer: (questionId, answerId) => {
        set((state) => {
          const current = (state.answers[questionId] as string[]) || [];
          const index = current.indexOf(answerId);
          let newAnswers: string[];

          if (index > -1) {
            // Remove if already selected
            newAnswers = current.filter((id) => id !== answerId);
          } else {
            // Add if not selected
            newAnswers = [...current, answerId];
          }

          return {
            answers: { ...state.answers, [questionId]: newAnswers },
          };
        });
      },

      nextScreen: () => {
        set((state) => ({
          currentScreenIndex: state.currentScreenIndex + 1,
        }));
      },

      previousScreen: () => {
        set((state) => ({
          currentScreenIndex: Math.max(0, state.currentScreenIndex - 1),
        }));
      },

      goToScreen: (index) => {
        set({ currentScreenIndex: index });
      },

      completeQuiz: () => {
        set({
          isComplete: true,
          completedAt: Date.now(),
        });
      },

      resetQuiz: () => {
        set({
          currentScreenIndex: 0,
          answers: {},
          isComplete: false,
          showSkipDialog: false,
          startedAt: null,
          completedAt: null,
        });
      },

      setShowSkipDialog: (show) => {
        set({ showSkipDialog: show });
      },
    }),
    {
      name: 'haircare-quiz-storage',
      partialize: (state) => ({
        answers: state.answers,
        currentScreenIndex: state.currentScreenIndex,
        startedAt: state.startedAt,
      }),
    }
  )
);
