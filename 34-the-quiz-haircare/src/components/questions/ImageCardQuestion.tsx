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
  variant = 'large',
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
  // Flutter: 85px height if >6 options, 150px otherwise (mobile)
  const imageHeight = variant === 'large'
    ? (gridOptions.length > 6 ? 'h-[85px]' : 'h-[150px]')
    : 'h-[80px]';

  const renderOption = (option: ImageAnswer, index: number, isCentered = false) => {
    const isSelected = selectedAnswers.includes(option.id);
    const hasImage = option.image && option.image !== '';

    // Reduce font size for long text (25+ characters like "Custom nutrition protocol")
    const isLongText = option.answer.length >= 20;
    const textSizeClass = isLongText ? 'text-xs' : 'text-sm';

    return (
      <button
        key={option.id}
        onClick={() => onSelect(option.id)}
        className={`
          relative flex flex-col overflow-hidden
          transition-all duration-200 ease-out
          hover:scale-[1.02] active:scale-[0.98]
          ${hasImage ? 'rounded-[20px]' : 'rounded-[10px]'}
          ${isCentered ? 'w-[48%]' : ''}
        `}
        style={{
          // Flutter: boxShadow blur 14, color #DAE1FE at 0.7 opacity, offset 0,3
          boxShadow: '0 3px 14px rgba(218, 225, 254, 0.7)',
          // Flutter: selected = secondaryViolet, else white
          backgroundColor: isSelected ? '#E8EBFC' : '#FFFFFF',
        }}
        role="radio"
        aria-checked={isSelected}
        data-option-index={index}
      >
        {/* Image section - Flutter: rounded top corners 10px */}
        {hasImage && (
          <div
            className={`w-full ${imageHeight} bg-white rounded-t-[10px] overflow-hidden`}
            style={{
              backgroundImage: `url(${option.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        )}

        {/* Answer text section - taller height for long text to allow wrapping */}
        {/* Flutter: selected = accent2 (#DAE1FE lighter), else secondary (#7375A6 plum) */}
        <div
          className={`w-full ${isLongText ? 'min-h-[38px] py-1' : 'h-[30px] md:h-[40px]'} flex items-center justify-center px-[5px] rounded-b-[10px]`}
          style={{
            backgroundColor: isSelected ? '#B1BAE3' : '#7375A6',
          }}
        >
          {/* Flutter: selected = primaryText (#3A2D32), else primary (white) */}
          <span
            className={`${textSizeClass} font-medium text-center leading-tight font-inter`}
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
    <div className="max-w-[500px] mx-auto bg-white px-5 pt-[10px]">
      {/* Question text - Flutter: font 20px mobile, 24px tablet, 27px desktop */}
      <h2 className="text-xl md:text-2xl font-medium text-[#3A2D32] text-center font-inter">
        {questionText}
      </h2>

      {/* Subtitle - Flutter: font 16px, margin-top 10px */}
      {subtitle && (
        <p className="text-[#3A2D32] text-base mt-[10px] text-center font-inter font-normal">
          {subtitle}
        </p>
      )}

      {/* Options grid - Flutter: MasonryGridView, gap 10px, margin-top 32px */}
      <div
        className={`grid ${gridCols} gap-[10px] mt-8`}
        role="radiogroup"
        aria-label={questionText}
      >
        {gridOptions.map((option, index) => renderOption(option, index))}
      </div>

      {/* Centered last option for special questions */}
      {lastOption && (
        <div className="flex justify-center mt-[10px]">
          {renderOption(lastOption, gridOptions.length, true)}
        </div>
      )}
    </div>
  );
}
