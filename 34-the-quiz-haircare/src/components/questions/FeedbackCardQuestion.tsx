import { useState, useEffect } from 'react';
import type { FeedbackAnswer } from '../../types';

interface FeedbackCardQuestionProps {
  questionText: string;
  subtitle?: string;
  options: FeedbackAnswer[];
  selectedAnswers?: string[];
  onSelect: (answerId: string) => void;
  onContinue?: () => void;
}

export function FeedbackCardQuestion({
  questionText,
  subtitle,
  options,
  onSelect,
  onContinue,
}: FeedbackCardQuestionProps) {
  const [selectedOption, setSelectedOption] = useState<FeedbackAnswer | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // Reset state when question changes
  useEffect(() => {
    setSelectedOption(null);
    setShowFeedback(false);
  }, [questionText]);

  const handleSelect = (option: FeedbackAnswer) => {
    setSelectedOption(option);
    setShowFeedback(true);
    onSelect(option.id);
  };

  const handleContinue = () => {
    if (onContinue) {
      onContinue();
    }
  };

  return (
    <div className="question-enter-active flex flex-col min-h-[60vh]">
      {/* Question text */}
      <h2 className="text-xl md:text-[22px] font-medium text-[#3A2D32] mb-2 text-center font-inter">
        {questionText}
      </h2>
      {subtitle && (
        <p className="text-[#696969] mb-5 text-center text-sm font-inter">{subtitle}</p>
      )}

      {/* Options - single column layout */}
      <div
        className="flex flex-col gap-3 mb-4"
        role="radiogroup"
        aria-label={questionText}
      >
        {options.map((option, index) => {
          const isSelected = selectedOption?.id === option.id;

          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option)}
              className={`
                relative flex items-center gap-3 p-3 rounded-[11px] min-h-[70px]
                transition-all duration-200 ease-out
                hover:scale-[1.01] active:scale-[0.99]
                ${isSelected
                  ? 'bg-[#E7E2F4] border-[1.5px] border-[#9B6FB0]'
                  : 'bg-white border border-gray-200 shadow-sm'
                }
              `}
              style={{
                boxShadow: isSelected ? 'none' : '0 3px 14px rgba(218, 225, 254, 0.7)',
              }}
              role="radio"
              aria-checked={isSelected}
              data-option-index={index}
            >
              {/* Image thumbnail */}
              <div className="w-[65px] h-[65px] flex-shrink-0 rounded-l-[11px] overflow-hidden bg-gray-100">
                <img
                  src={option.image}
                  alt={option.answer}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Answer text - increased for readability */}
              <span className="flex-1 text-[15px] font-medium text-[#3A2D32] text-left font-inter leading-snug py-1">
                {option.answer}
              </span>

              {/* Selection indicator - circle checkbox */}
              <div
                className={`
                  w-6 h-6 rounded-[3px] flex-shrink-0 flex items-center justify-center
                  transition-colors duration-200 mr-1
                  ${isSelected
                    ? 'bg-[#7375A6]'
                    : 'bg-white border-[1.5px] border-[#7375A6]'
                  }
                `}
              >
                {isSelected && (
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Inline Feedback Section - appears below answers when selected */}
      {showFeedback && selectedOption && (
        <div
          className="mt-3 p-5 rounded-[11px] animate-in fade-in slide-in-from-bottom-2 duration-300"
          style={{
            backgroundColor: '#E7E2F4',
            border: '1.5px solid #9B6FB0',
          }}
        >
          {/* Feedback title */}
          <h3 className="text-[16px] font-semibold text-[#2E2023] mb-2 font-inter">
            {selectedOption.feedbackTitle}
          </h3>

          {/* Feedback description */}
          <p className="text-[14px] text-[#2E2023] leading-relaxed font-inter">
            {selectedOption.feedbackDescription}
          </p>
        </div>
      )}

      {/* Continue button - only shows after selection */}
      {showFeedback && selectedOption && (
        <div className="mt-auto pt-6">
          <button
            onClick={handleContinue}
            className="w-full py-4 px-6 rounded-[10px] font-medium text-base text-white transition-all hover:brightness-110 active:scale-[0.98] font-inter"
            style={{ backgroundColor: '#FE6903' }}
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
}
