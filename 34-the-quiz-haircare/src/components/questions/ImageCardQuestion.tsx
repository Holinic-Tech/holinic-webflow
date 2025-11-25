import type { ImageAnswer } from '../../types';

interface ImageCardQuestionProps {
  questionText: string;
  subtitle?: string;
  options: ImageAnswer[];
  selectedAnswers: string[];
  onSelect: (answerId: string) => void;
  variant?: 'large' | 'small';
  questionId?: string; // To identify specific questions for special layouts
}

// Matches Flutter SingleChoiceQuestionLargeImageWidget exactly
export function ImageCardQuestion({
  questionText,
  subtitle,
  options,
  selectedAnswers,
  onSelect,
  questionId,
}: ImageCardQuestionProps) {
  // Check if this is a question with a special "last item centered" layout
  // Q2 (hairType) has "I don't know" as 5th option - should be 2x2 grid + centered last
  // Q7 (diet) has "Something else" as 5th option - should be 2x2 grid + centered last
  const hasSpecialLastOption = questionId === 'hairType' || questionId === 'diet';

  // Split options for special layout
  const gridOptions = hasSpecialLastOption ? options.slice(0, -1) : options;
  const lastOption = hasSpecialLastOption ? options[options.length - 1] : null;

  // Flutter: 3 cols if > 6 options, else 2 cols
  const gridCols = gridOptions.length > 6 ? 'grid-cols-3' : 'grid-cols-2';

  const renderOption = (option: ImageAnswer, index: number, isCentered = false) => {
    const isSelected = selectedAnswers.includes(option.id);
    const hasImage = option.image && option.image !== '';

    return (
      <button
        key={option.id}
        onClick={() => onSelect(option.id)}
        className={`
          relative flex flex-col overflow-hidden h-full
          transition-all duration-200 ease-out
          hover:scale-[1.02] active:scale-[0.98]
          ${hasImage ? 'rounded-[15px]' : 'rounded-[10px]'}
          ${isCentered ? 'w-[48%] h-auto' : ''}
        `}
        style={{
          boxShadow: '0 3px 14px rgba(218, 225, 254, 0.7)',
          backgroundColor: isSelected ? '#E8EBFC' : '#FFFFFF',
        }}
        role="radio"
        aria-checked={isSelected}
        data-option-index={index}
      >
        {/* Image section - flexes to fill available space */}
        {hasImage && (
          <div
            className="w-full flex-1 min-h-0 bg-white rounded-t-[10px] overflow-hidden"
            style={{
              backgroundImage: `url(${option.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        )}

        {/* Answer text section - fixed height label for uniform appearance */}
        <div
          className="w-full h-[36px] px-1 flex items-center justify-center rounded-b-[10px] flex-shrink-0"
          style={{
            backgroundColor: isSelected ? '#B1BAE3' : '#7375A6',
          }}
        >
          <span
            className="text-[11px] font-medium text-center leading-tight font-inter"
            style={{
              color: isSelected ? '#3A2D32' : '#FFFFFF',
            }}
          >
            {option.answer}
          </span>
        </div>
      </button>
    );
  };

  return (
    <div className="max-w-[500px] mx-auto bg-white px-5 pt-[10px] h-[calc(100dvh-90px)] flex flex-col overflow-hidden">
      {/* Question text - Flutter: font 20px mobile, 24px tablet, 27px desktop */}
      <h2 className="text-lg md:text-xl font-medium text-[#3A2D32] text-center font-inter flex-shrink-0">
        {questionText}
      </h2>

      {/* Subtitle - Flutter: font 16px, margin-top 10px */}
      {subtitle && (
        <p className="text-[#3A2D32] text-sm mt-1 text-center font-inter font-normal flex-shrink-0">
          {subtitle}
        </p>
      )}

      {/* Options grid - Flutter: MasonryGridView, gap 10px, margin-top 32px */}
      <div
        className={`grid ${gridCols} gap-[8px] mt-4 flex-1 min-h-0 auto-rows-fr`}
        role="radiogroup"
        aria-label={questionText}
        style={{ gridAutoRows: '1fr' }}
      >
        {gridOptions.map((option, index) => renderOption(option, index))}
      </div>

      {/* Centered last option for special questions */}
      {lastOption && (
        <div className="flex justify-center mt-[8px] flex-shrink-0">
          {renderOption(lastOption, gridOptions.length, true)}
        </div>
      )}
    </div>
  );
}
