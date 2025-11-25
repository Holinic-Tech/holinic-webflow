import { useCallback, useMemo } from 'react';
import { useQuizStore } from '../store';
import {
  TOTAL_SCREENS,
  TOTAL_QUESTIONS,
  getScreenByIndex,
  getQuestionProgress,
  shouldShowBackButton,
  shouldShowProgressBar,
} from '../data/screenFlow';
import { questions } from '../data/questions';
import { trackQuestionAnswered, trackQuizStarted } from '../services';
import { redirectToCheckout } from '../utils';
import type { QuestionId } from '../types';

export function useQuiz() {
  const {
    currentScreenIndex,
    answers,
    isComplete,
    showSkipDialog,
    startedAt,
    setAnswer,
    toggleMultiAnswer,
    nextScreen,
    previousScreen,
    completeQuiz,
    resetQuiz,
    setShowSkipDialog,
    startQuiz,
  } = useQuizStore();

  // Current screen configuration from screenFlow
  const currentScreen = useMemo(() => {
    return getScreenByIndex(currentScreenIndex);
  }, [currentScreenIndex]);

  // Current question data (if this is a question screen)
  const currentQuestion = useMemo(() => {
    if (currentScreen?.type === 'question' && currentScreen.questionId) {
      return questions[currentScreen.questionId as QuestionId] || null;
    }
    return null;
  }, [currentScreen]);

  const currentQuestionId = currentScreen?.questionId as QuestionId | undefined;

  // Progress calculation (only counts questions, not pitch screens)
  const questionProgress = useMemo(() => {
    return getQuestionProgress(currentScreenIndex);
  }, [currentScreenIndex]);

  const progress = useMemo(() => {
    return (questionProgress.current / TOTAL_QUESTIONS) * 100;
  }, [questionProgress]);

  // Selected answers for current question
  const selectedAnswers = useMemo(() => {
    if (!currentQuestionId) return [];
    const answer = answers[currentQuestionId];
    if (!answer) return [];
    return Array.isArray(answer) ? answer : [answer];
  }, [answers, currentQuestionId]);

  // Navigation state
  const showBack = shouldShowBackButton(currentScreenIndex);
  const showProgress = shouldShowProgressBar(currentScreenIndex);
  const canGoBack = showBack && currentScreenIndex > 0;

  // Check if user can proceed (for question screens)
  const canGoNext = useMemo(() => {
    if (!currentScreen) return false;

    // Non-question screens can always proceed
    if (currentScreen.type !== 'question') return true;

    // Question screens need an answer
    if (!currentQuestionId) return true;
    const answer = answers[currentQuestionId];
    if (!answer) return false;
    if (Array.isArray(answer)) return answer.length > 0;
    return true;
  }, [currentScreen, answers, currentQuestionId]);

  // Handle single answer selection with auto-advance
  const handleSelectAnswer = useCallback(
    (answerId: string) => {
      if (!currentQuestionId) return;

      setAnswer(currentQuestionId, answerId);
      trackQuestionAnswered(currentQuestionId, answerId, currentScreenIndex);

      // Auto-advance for single-select questions (not multi-select, not slider, not feedback)
      if (currentQuestion && currentQuestion.format !== 'multiSelect' && currentQuestion.format !== 'slider' && currentQuestion.format !== 'feedbackCard') {
        // Small delay for visual feedback before advancing
        setTimeout(() => {
          nextScreen();
        }, 300);
      }
    },
    [currentQuestionId, currentScreenIndex, currentQuestion, setAnswer, nextScreen]
  );

  // Handle multi-select toggle
  const handleToggleAnswer = useCallback(
    (answerId: string) => {
      if (!currentQuestionId) return;

      toggleMultiAnswer(currentQuestionId, answerId);

      // Get updated answers for tracking
      const currentAnswers = (answers[currentQuestionId] as string[]) || [];
      const newAnswers = currentAnswers.includes(answerId)
        ? currentAnswers.filter((id) => id !== answerId)
        : [...currentAnswers, answerId];

      trackQuestionAnswered(currentQuestionId, newAnswers, currentScreenIndex);
    },
    [currentQuestionId, currentScreenIndex, toggleMultiAnswer, answers]
  );

  // Handle slider value change with auto-advance (same pattern as single-select)
  const handleSliderChange = useCallback(
    (value: number) => {
      if (!currentQuestionId) return;
      setAnswer(currentQuestionId, value);
      trackQuestionAnswered(currentQuestionId, String(value), currentScreenIndex);

      // Auto-advance after selection (same as single-select)
      setTimeout(() => {
        nextScreen();
      }, 300);
    },
    [currentQuestionId, currentScreenIndex, setAnswer, nextScreen]
  );

  // Handle "none of the above" selection for multi-select questions
  const handleNoneOfAbove = useCallback(
    (noneOptionId: string) => {
      if (!currentQuestionId) return;

      // Store the "none" answer
      setAnswer(currentQuestionId, [noneOptionId]);
      trackQuestionAnswered(currentQuestionId, noneOptionId, currentScreenIndex);

      // Advance to next screen
      setTimeout(() => {
        nextScreen();
      }, 100);
    },
    [currentQuestionId, currentScreenIndex, setAnswer, nextScreen]
  );

  // Handle next/continue button click
  const handleNext = useCallback(() => {
    if (!canGoNext) return;
    nextScreen();
  }, [canGoNext, nextScreen]);

  // Handle back button click
  const handleBack = useCallback(() => {
    if (!canGoBack) return;
    previousScreen();
  }, [canGoBack, previousScreen]);

  // Handle skip dialog
  const openSkipDialog = useCallback(() => {
    setShowSkipDialog(true);
  }, [setShowSkipDialog]);

  const closeSkipDialog = useCallback(() => {
    setShowSkipDialog(false);
  }, [setShowSkipDialog]);

  // Handle skip quiz - redirect directly to checkout
  const handleSkipQuiz = useCallback(() => {
    setShowSkipDialog(false);
    redirectToCheckout(); // Goes to checkout with CVG cookies attached
  }, [setShowSkipDialog]);

  // Initialize quiz
  const initializeQuiz = useCallback(() => {
    if (!startedAt) {
      startQuiz();
      trackQuizStarted();
    }
  }, [startedAt, startQuiz]);

  return {
    // Screen state
    currentScreenIndex,
    currentScreen,
    currentQuestion,
    currentQuestionId,
    answers,
    selectedAnswers,
    progress,
    questionProgress,
    isComplete,
    showSkipDialog,
    totalScreens: TOTAL_SCREENS,
    totalQuestions: TOTAL_QUESTIONS,

    // Navigation state
    canGoNext,
    canGoBack,
    showBack,
    showProgress,

    // Special screen checks
    isQuestionScreen: currentScreen?.type === 'question',
    isPitchScreen: currentScreen?.type === 'pitch',
    isLoadingScreen: currentScreen?.type === 'loading',
    isEmailCaptureScreen: currentScreen?.type === 'emailCapture',
    isDashboardScreen: currentScreen?.type === 'dashboard',
    isFinalPitchScreen: currentScreen?.type === 'finalPitch',

    // Actions
    handleSelectAnswer,
    handleToggleAnswer,
    handleSliderChange,
    handleNoneOfAbove,
    handleNext,
    handleBack,
    openSkipDialog,
    closeSkipDialog,
    handleSkipQuiz,
    completeQuiz,
    resetQuiz,
    initializeQuiz,
  };
}
