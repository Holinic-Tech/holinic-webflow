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
    <div className="max-w-[500px] mx-auto bg-white px-5 pt-[10px]">
      {/* Question text - Flutter: font 27px, centered, horizontal padding 15px */}
      <div className="px-[15px]">
        <h2 className="text-[20px] md:text-[27px] font-medium text-[#3A2D32] text-center font-inter">
          {questionText}
        </h2>
      </div>

      {/* Subtitle - Flutter: font 12px, margin-top 20px */}
      {subtitle && (
        <p className="text-[#3A2D32] text-xs mt-5 text-center font-inter font-normal">
          {subtitle}
        </p>
      )}

      {/* Options list - Flutter: ListView with 15px separator, margin-top 32px */}
      <div className="mt-8 space-y-[15px]" role="group" aria-label={questionText}>
        {regularOptions.map((option, index) => {
          const isSelected = selectedAnswers.includes(option.id);
          const hasImage = 'image' in option && option.image;

          // For image-based multi-select (different layout)
          if (hasImage) {
            return (
              <button
                key={option.id}
                onClick={() => onToggle(option.id)}
                className="w-full relative flex items-center rounded-[11px] overflow-hidden transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] min-h-[70px]"
                style={{
                  backgroundColor: isSelected ? '#E8EBFC' : '#FFFFFF',
                  boxShadow: '0 3px 14px rgba(218, 225, 254, 0.7)',
                  border: isSelected ? '1px solid #7375A6' : '1px solid transparent',
                }}
                role="checkbox"
                aria-checked={isSelected}
                data-option-index={index}
              >
                {/* Image on left */}
                <div className="w-[70px] h-[70px] flex-shrink-0 bg-gray-100 overflow-hidden">
                  <img
                    src={(option as CheckboxAnswer & { image: string }).image}
                    alt={option.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Title in center - increased text size for readability */}
                <span className="flex-1 px-3 py-2 text-[15px] font-medium text-[#3A2D32] text-left font-inter leading-snug">
                  {option.title}
                </span>

                {/* Checkbox on right - Flutter: rounded 3px, 18px icon */}
                <div
                  className="mr-4 w-6 h-6 rounded-[3px] flex items-center justify-center flex-shrink-0 transition-colors"
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
          }

          // Text-only multi-select - Flutter: padding 20,17,20,17, row layout
          return (
            <button
              key={option.id}
              onClick={() => onToggle(option.id)}
              className="w-full flex items-center justify-between px-5 py-4 rounded-[11px] transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] min-h-[56px]"
              style={{
                backgroundColor: isSelected ? '#E8EBFC' : '#FFFFFF',
                boxShadow: '0 3px 14px rgba(218, 225, 254, 0.7)',
                border: isSelected ? '1px solid #7375A6' : '1px solid transparent',
              }}
              role="checkbox"
              aria-checked={isSelected}
              data-option-index={index}
            >
              {/* Title on left - increased for readability */}
              <span className="text-[15px] font-medium text-[#3A2D32] text-left font-inter leading-snug pr-3">
                {option.title}
              </span>

              {/* Checkbox on right - Flutter: rounded 3px, border 1.5px */}
              <div
                className="w-6 h-6 rounded-[3px] flex items-center justify-center flex-shrink-0 transition-colors"
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

        {/* "None of the above" button - centered, acts as skip */}
        {noneOption && (
          <div className="flex justify-center pt-2">
            <button
              onClick={handleNoneClick}
              className="px-8 py-[17px] rounded-[11px] transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
              style={{
                backgroundColor: '#FFFFFF',
                boxShadow: '0 3px 14px rgba(218, 225, 254, 0.7)',
                border: '1px solid transparent',
              }}
            >
              <span className="text-sm font-medium text-[#3A2D32] font-inter">
                {noneOption.title}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
