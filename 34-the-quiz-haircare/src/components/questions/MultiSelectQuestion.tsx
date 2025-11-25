import type { CheckboxAnswer } from '../../types';

interface MultiSelectQuestionProps {
  questionText: string;
  subtitle?: string;
  options: CheckboxAnswer[];
  selectedAnswers: string[];
  onToggle: (answerId: string) => void;
  onNoneOfAbove: (noneOptionId: string) => void;
}

// Matches Flutter MultiChoiceQuestionCheckBoxWidget exactly
export function MultiSelectQuestion({
  questionText,
  subtitle,
  options,
  selectedAnswers,
  onToggle,
  onNoneOfAbove,
}: MultiSelectQuestionProps) {
  // Separate "none of the above" option from regular options
  const noneOption = options.find(opt =>
    opt.id.includes('_none') ||
    opt.title.toLowerCase().includes('none of')
  );
  const regularOptions = options.filter(opt => opt !== noneOption);

  const handleNoneClick = () => {
    if (noneOption) {
      // Call the handler which stores the answer, tracks, and advances
      onNoneOfAbove(noneOption.id);
    }
  };

  return (
    <div className="max-w-[500px] mx-auto bg-white px-5 pt-[10px] h-[calc(100dvh-170px)] flex flex-col overflow-hidden">
      {/* Question text - smaller on mobile when many options */}
      <div className="px-[10px] flex-shrink-0">
        <h2 className="text-[17px] md:text-[20px] font-medium text-[#3A2D32] text-center font-inter">
          {questionText}
        </h2>
      </div>

      {/* Subtitle - Flutter: font 12px, margin-top 20px */}
      {subtitle && (
        <p className="text-[#3A2D32] text-xs mt-1 text-center font-inter font-normal flex-shrink-0">
          {subtitle}
        </p>
      )}

      {/* Options list - flex container to distribute space */}
      <div className="mt-3 flex flex-col gap-[6px] flex-1 min-h-0" role="group" aria-label={questionText}>
        {regularOptions.map((option, index) => {
          const isSelected = selectedAnswers.includes(option.id);
          const hasImage = 'image' in option && option.image;

          // For image-based multi-select (different layout)
          if (hasImage) {
            return (
              <button
                key={option.id}
                onClick={() => onToggle(option.id)}
                className="w-full relative flex items-center rounded-[10px] overflow-hidden transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] flex-1 min-h-0"
                style={{
                  backgroundColor: isSelected ? '#E8EBFC' : '#FFFFFF',
                  boxShadow: '0 3px 14px rgba(218, 225, 254, 0.7)',
                  border: isSelected ? '1px solid #7375A6' : '1px solid transparent',
                }}
                role="checkbox"
                aria-checked={isSelected}
                data-option-index={index}
              >
                {/* Image on left - square aspect ratio */}
                <div className="h-full aspect-square flex-shrink-0 bg-gray-100 overflow-hidden">
                  <img
                    src={(option as CheckboxAnswer & { image: string }).image}
                    alt={option.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Title in center */}
                <span className="flex-1 px-2 text-[13px] font-medium text-[#3A2D32] text-left font-inter leading-tight">
                  {option.title}
                </span>

                {/* Checkbox on right */}
                <div
                  className="mr-3 w-5 h-5 rounded-[3px] flex items-center justify-center flex-shrink-0 transition-colors"
                  style={{
                    backgroundColor: isSelected ? '#7375A6' : '#FFFFFF',
                    border: isSelected ? '1.5px solid transparent' : '1.5px solid #7375A6',
                  }}
                >
                  <svg
                    className="w-[14px] h-[14px]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="white"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </button>
            );
          }

          // Text-only multi-select
          return (
            <button
              key={option.id}
              onClick={() => onToggle(option.id)}
              className="w-full flex items-center justify-between px-4 py-2 rounded-[10px] transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] flex-1 min-h-0"
              style={{
                backgroundColor: isSelected ? '#E8EBFC' : '#FFFFFF',
                boxShadow: '0 3px 14px rgba(218, 225, 254, 0.7)',
                border: isSelected ? '1px solid #7375A6' : '1px solid transparent',
              }}
              role="checkbox"
              aria-checked={isSelected}
              data-option-index={index}
            >
              {/* Title on left */}
              <span className="text-[13px] font-medium text-[#3A2D32] text-left font-inter leading-tight pr-2">
                {option.title}
              </span>

              {/* Checkbox on right */}
              <div
                className="w-5 h-5 rounded-[3px] flex items-center justify-center flex-shrink-0 transition-colors"
                style={{
                  backgroundColor: isSelected ? '#7375A6' : '#FFFFFF',
                  border: isSelected ? '1.5px solid transparent' : '1.5px solid #7375A6',
                }}
              >
                <svg
                  className="w-[14px] h-[14px]"
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

      {/* "None of the above" button - centered, acts as skip */}
      {noneOption && (
        <div className="flex justify-center pt-2 pb-3 flex-shrink-0">
          <button
            onClick={handleNoneClick}
            className="px-6 py-2 rounded-[10px] transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
            style={{
              backgroundColor: '#FFFFFF',
              boxShadow: '0 3px 14px rgba(218, 225, 254, 0.7)',
              border: '1px solid transparent',
            }}
          >
            <span className="text-[13px] font-medium text-[#3A2D32] font-inter">
              {noneOption.title}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
