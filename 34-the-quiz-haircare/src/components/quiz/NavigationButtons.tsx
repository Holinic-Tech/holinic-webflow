interface NavigationButtonsProps {
  onBack?: () => void;
  onNext: () => void;
  onSkip?: () => void;
  canGoBack?: boolean;
  canGoNext: boolean;
  isLastQuestion: boolean;
  showSkipButton?: boolean;
  showBackButton?: boolean;
}

// Matches Flutter FooterButtonWidget - orange Continue button
export function NavigationButtons({
  onBack,
  onNext,
  canGoBack = false,
  canGoNext,
  isLastQuestion,
  showSkipButton = false,
  showBackButton = true,
}: NavigationButtonsProps) {
  return (
    <div className="max-w-[500px] mx-auto w-full px-5 pb-5 mt-6">
      {/* Main navigation row */}
      <div className="flex gap-3">
        {/* Back button - only show if can go back and showBackButton is true */}
        {showBackButton && canGoBack && onBack && (
          <button
            onClick={onBack}
            className="py-3 px-6 rounded-[10px] font-medium transition-all duration-200 bg-white text-[#3A2D32] border border-gray-200 hover:bg-gray-50 active:scale-[0.98] font-inter"
            style={{
              boxShadow: '0 3px 14px rgba(218, 225, 254, 0.7)',
            }}
          >
            Back
          </button>
        )}

        {/* Continue button - Flutter: orange #FE6903, radius 10, full width */}
        <button
          onClick={onNext}
          disabled={!canGoNext}
          className={`
            flex-1 py-4 px-6 rounded-[10px] font-medium transition-all duration-200 font-inter text-white
            ${canGoNext
              ? 'hover:brightness-110 active:scale-[0.98] shadow-md hover:shadow-lg'
              : 'opacity-50 cursor-not-allowed'
            }
          `}
          style={{
            backgroundColor: '#FE6903',
          }}
          aria-disabled={!canGoNext}
        >
          {isLastQuestion ? 'See Results' : 'Continue'}
        </button>
      </div>

      {/* Skip button - hidden by default in Flutter footer */}
      {showSkipButton && (
        <button
          onClick={() => {}}
          className="w-full text-[#696969] text-sm hover:text-[#3A2D32] transition-colors py-3 mt-2 font-inter underline"
        >
          Skip the quiz
        </button>
      )}
    </div>
  );
}
