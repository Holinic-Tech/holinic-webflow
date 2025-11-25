import { useEffect } from 'react';
import { useQuiz } from '../../hooks';
import { ProgressBar } from './ProgressBar';
import { QuestionRenderer } from './QuestionRenderer';
import { NavigationButtons } from './NavigationButtons';
import { SkipDialog } from './SkipDialog';
import { PitchScreen } from './PitchScreen';
import { LoadingScreen } from './LoadingScreen';
import { LeadCaptureForm } from '../form';
import { ResultPage } from '../result';
import type { PitchType } from '../../data/screenFlow';

export function QuizContainer() {
  const {
    currentScreenIndex,
    currentScreen,
    currentQuestion,
    selectedAnswers,
    progress,
    questionProgress,
    isComplete,
    showSkipDialog,
    totalQuestions,
    canGoNext,
    showProgress,
    answers,
    isQuestionScreen,
    isPitchScreen,
    isLoadingScreen,
    isEmailCaptureScreen,
    isDashboardScreen,
    isFinalPitchScreen,
    handleSelectAnswer,
    handleToggleAnswer,
    handleSliderChange,
    handleNoneOfAbove,
    handleNext,
    openSkipDialog,
    closeSkipDialog,
    handleSkipQuiz,
    initializeQuiz,
  } = useQuiz();

  // Initialize quiz on mount
  useEffect(() => {
    initializeQuiz();
  }, [initializeQuiz]);

  // Show result page if quiz is complete
  if (isComplete) {
    return (
      <div className="container-quiz-scrollable">
        <ResultPage />
      </div>
    );
  }

  // Loading screen (index 17)
  if (isLoadingScreen) {
    return (
      <div className="container-quiz">
        <LoadingScreen onComplete={handleNext} />
      </div>
    );
  }

  // Email capture screen (index 18)
  if (isEmailCaptureScreen) {
    return (
      <div className="container-quiz">
        <LeadCaptureForm onSubmit={handleNext} />
      </div>
    );
  }

  // Dashboard screen (index 19)
  if (isDashboardScreen) {
    return (
      <div className="container-quiz-scrollable">
        <ResultPage />
      </div>
    );
  }

  // Final pitch screen (index 20)
  if (isFinalPitchScreen) {
    return (
      <div className="container-quiz-scrollable">
        <ResultPage />
      </div>
    );
  }

  // Pitch screens (indices 6, 8, 13)
  if (isPitchScreen && currentScreen?.pitchType) {
    return (
      <div className="container-quiz">
        {showProgress && (
          <ProgressBar
            current={questionProgress.current}
            total={totalQuestions}
            progress={progress}
          />
        )}
        <PitchScreen
          pitchType={currentScreen.pitchType as PitchType}
          answers={answers}
          onContinue={handleNext}
          screenIndex={currentScreenIndex}
        />
      </div>
    );
  }

  // Question screens
  if (isQuestionScreen && currentQuestion) {
    // Get slider value if it's a slider question - NO DEFAULT VALUE (was 3)
    const sliderValue = currentQuestion.format === 'slider'
      ? (answers[currentQuestion.id] as number) ?? undefined
      : undefined;

    // Check if this is the hero start screen (index 0)
    const isHeroScreen = currentScreenIndex === 0;

    // Determine if we should show navigation buttons
    // Multi-select: only show continue when at least one answer is selected
    // Slider: no continue button (auto-advances)
    // Feedback: handled internally by the component
    const showMultiSelectNav = currentQuestion.format === 'multiSelect' && selectedAnswers.length > 0;

    // Hero screen gets no padding container for full background coverage
    if (isHeroScreen) {
      return (
        <div className="min-h-screen">
          <QuestionRenderer
            question={currentQuestion}
            selectedAnswers={selectedAnswers.map(String)}
            sliderValue={sliderValue}
            isFirstQuestion={isHeroScreen}
            onSelectAnswer={handleSelectAnswer}
            onToggleAnswer={handleToggleAnswer}
            onSliderChange={handleSliderChange}
            onNoneOfAbove={handleNoneOfAbove}
            onNext={handleNext}
            onSkip={openSkipDialog}
          />
          <SkipDialog
            isOpen={showSkipDialog}
            onClose={closeSkipDialog}
            onSkip={handleSkipQuiz}
            screenIndex={currentScreenIndex}
          />
        </div>
      );
    }

    return (
      <div className="container-quiz">
        {/* Progress bar - hidden on start screen */}
        {showProgress && (
          <ProgressBar
            current={questionProgress.current}
            total={totalQuestions}
            progress={progress}
          />
        )}

        {/* Question content */}
        <div className="flex-1">
          <QuestionRenderer
            question={currentQuestion}
            selectedAnswers={selectedAnswers.map(String)}
            sliderValue={sliderValue}
            isFirstQuestion={isHeroScreen}
            onSelectAnswer={handleSelectAnswer}
            onToggleAnswer={handleToggleAnswer}
            onSliderChange={handleSliderChange}
            onNoneOfAbove={handleNoneOfAbove}
            onNext={handleNext}
            onSkip={undefined}
          />
        </div>

        {/* Navigation - only for multi-select when at least one answer is selected */}
        {showMultiSelectNav && (
          <>
            {/* Spacer to prevent content from being hidden behind fixed button */}
            <div className="h-[80px]" />
            <NavigationButtons
              onNext={handleNext}
              onSkip={openSkipDialog}
              canGoNext={canGoNext}
              isLastQuestion={false}
              showBackButton={false}
            />
          </>
        )}

        {/* Skip dialog */}
        <SkipDialog
          isOpen={showSkipDialog}
          onClose={closeSkipDialog}
          onSkip={handleSkipQuiz}
          screenIndex={currentScreenIndex}
        />
      </div>
    );
  }

  // Fallback loading state
  return (
    <div className="container-quiz">
      <p className="text-center text-gray-500">Loading...</p>
    </div>
  );
}
