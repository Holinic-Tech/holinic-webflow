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
    <div className="question-enter-active flex flex-col max-w-[500px] mx-auto px-5 pt-[10px] pb-6">
      {/* Question text */}
      <h2 className="text-lg md:text-xl font-medium text-[#3A2D32] mb-1 text-center font-inter flex-shrink-0">
        {questionText}
      </h2>
      {subtitle && (
        <p className="text-[#696969] mb-3 text-center text-sm font-inter flex-shrink-0">{subtitle}</p>
      )}

      {/* Options - single column layout, natural height before selection */}
      <div
        className="flex flex-col gap-2 mb-2"
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
                relative flex items-center gap-2 p-2 rounded-[11px]
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
              {/* Image thumbnail - smaller to fit */}
              <div className="w-[50px] h-[50px] flex-shrink-0 rounded-[8px] overflow-hidden bg-gray-100">
                <img
                  src={option.image}
                  alt={option.answer}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Answer text */}
              <span className="flex-1 text-[14px] font-medium text-[#3A2D32] text-left font-inter leading-snug pr-2">
                {option.answer}
              </span>
            </button>
          );
        })}
      </div>

      {/* Inline Feedback Section - appears below answers when selected */}
      {showFeedback && selectedOption && (
        <div
          className="mt-1 p-3 rounded-[11px] animate-in fade-in slide-in-from-bottom-2 duration-300 flex-shrink-0"
          style={{
            backgroundColor: '#E7E2F4',
            border: '1.5px solid #9B6FB0',
          }}
        >
          {/* Feedback title */}
          <h3 className="text-[14px] font-semibold text-[#2E2023] mb-1 font-inter">
            {selectedOption.feedbackTitle}
          </h3>

          {/* Feedback description */}
          <p className="text-[13px] text-[#2E2023] leading-snug font-inter">
            {selectedOption.feedbackDescription}
          </p>
        </div>
      )}

      {/* Continue button - only shows after selection */}
      {showFeedback && selectedOption && (
        <div className="mt-2 pt-2 flex-shrink-0 pb-2">
          <button
            onClick={handleContinue}
            className="w-full py-3 px-6 rounded-[10px] font-medium text-base text-white transition-all hover:brightness-110 active:scale-[0.98] font-inter"
            style={{ backgroundColor: '#FE6903' }}
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
}
