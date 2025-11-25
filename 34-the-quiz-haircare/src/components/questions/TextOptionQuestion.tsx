import type { TextOptionAnswer } from '../../types';

interface TextOptionQuestionProps {
  questionText: string;
  subtitle?: string;
  options: (TextOptionAnswer & { image?: string })[];
  selectedAnswers: string[];
  onSelect: (answerId: string) => void;
  showImages?: boolean;
}

// Matches Flutter SingleChoiceQuestionTitleDescriptionWidget
export function TextOptionQuestion({
  questionText,
  subtitle,
  options,
  selectedAnswers,
  onSelect,
  showImages = false,
}: TextOptionQuestionProps) {
  return (
    <div className="max-w-[500px] mx-auto bg-white px-5 pt-[10px]">
      {/* Question text - Flutter: font 20px mobile, 24px tablet, 27px desktop */}
      <h2 className="text-xl md:text-2xl font-medium text-[#3A2D32] text-center font-inter">
        {questionText}
      </h2>
      {subtitle && (
        <p className="text-[#3A2D32] text-base mt-[10px] text-center font-inter font-normal">
          {subtitle}
        </p>
      )}

      {/* Options list - Flutter: ListView with 15px separator, margin-top 32px */}
      <div
        className="flex flex-col gap-[15px] mt-8"
        role="radiogroup"
        aria-label={questionText}
      >
        {options.map((option, index) => {
          const isSelected = selectedAnswers.includes(option.id);
          const hasImage = showImages && option.image;

          return (
            <button
              key={option.id}
              onClick={() => onSelect(option.id)}
              className="relative flex items-center gap-3 rounded-[11px] text-left transition-all duration-200 ease-out hover:scale-[1.01] active:scale-[0.99] overflow-hidden min-h-[60px]"
              style={{
                backgroundColor: isSelected ? '#E8EBFC' : '#FFFFFF',
                boxShadow: '0 3px 14px rgba(218, 225, 254, 0.7)',
                border: isSelected ? '1px solid #7375A6' : '1px solid transparent',
                padding: hasImage ? '0' : '16px 16px',
              }}
              role="radio"
              aria-checked={isSelected}
              data-option-index={index}
            >
              {/* Image (if present and showImages is true) */}
              {hasImage && (
                <div className="w-[65px] h-[65px] flex-shrink-0 overflow-hidden rounded-l-[11px]">
                  <img
                    src={option.image}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}

              {/* Emoji (if present and no image) */}
              {!hasImage && option.emoji && (
                <span className="text-2xl flex-shrink-0">{option.emoji}</span>
              )}

              {/* Text content */}
              <div className={`flex-1 min-w-0 ${hasImage ? 'py-3 pr-3' : ''}`}>
                <span className="font-medium text-[#3A2D32] block font-inter text-[15px] leading-snug">
                  {option.title}
                </span>
                {option.description && (
                  <span className="text-sm text-[#696969] block mt-1 font-inter leading-snug">
                    {option.description}
                  </span>
                )}
              </div>

              {/* Selection indicator - Flutter: rounded 3px checkbox */}
              <div
                className={`w-6 h-6 rounded-[3px] flex-shrink-0 flex items-center justify-center transition-colors ${hasImage ? 'mr-4' : ''}`}
                style={{
                  backgroundColor: isSelected ? '#7375A6' : '#FFFFFF',
                  border: isSelected ? '1.5px solid transparent' : '1.5px solid #7375A6',
                }}
              >
                <svg
                  className="w-[18px] h-[18px]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="white"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
