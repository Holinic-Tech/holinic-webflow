import { useState, useEffect } from 'react';

interface SliderQuestionProps {
  questionText: string;
  subtitle?: string;
  minLabel: string;
  maxLabel: string;
  value?: number;
  onChange: (value: number) => void;
}

// Matches Flutter RatingQuestionOptionsWidget exactly - 5 numbered buttons
export function SliderQuestion({
  questionText,
  subtitle,
  minLabel,
  maxLabel,
  onChange,
}: SliderQuestionProps) {
  const [selectedValue, setSelectedValue] = useState<number | null>(null);

  // Reset state when question changes
  useEffect(() => {
    setSelectedValue(null);
  }, [questionText]);

  const handleSelect = (newValue: number) => {
    setSelectedValue(newValue);
    // Navigation is handled in useQuiz.handleSliderChange
    onChange(newValue);
  };

  return (
    <div className="max-w-[500px] mx-auto bg-white px-5 pt-[10px]">
      {/* Subtitle - Flutter: font 15px mobile, padding 20px horizontal, margin-bottom 15px */}
      {subtitle && (
        <p className="text-[#3A2D32] text-[15px] md:text-lg mb-[15px] text-center font-inter font-normal px-5">
          {subtitle}
        </p>
      )}

      {/* Question text - Flutter: font 20px mobile, 24px tablet, 27px desktop, margin-bottom 15px */}
      <h2 className="text-xl md:text-2xl font-medium text-[#3A2D32] mb-[15px] text-center font-inter">
        {questionText}
      </h2>

      {/* Rating buttons container - Flutter: maxWidth 500px, margin-top 32px */}
      <div className="w-full max-w-[500px] mx-auto mt-8">
        {/* 5 rating buttons - Flutter: Row with spaceBetween, gap 5px */}
        <div className="flex justify-between gap-[5px]">
          {[1, 2, 3, 4, 5].map((rating) => {
            const isSelected = selectedValue === rating;

            return (
              <button
                key={rating}
                onClick={() => handleSelect(rating)}
                className="w-[50px] h-[50px] rounded-[8px] flex items-center justify-center transition-all duration-200 font-inter text-base"
                style={{
                  // Flutter: selected = secondaryViolet (#E8EBFC), else white
                  backgroundColor: isSelected ? '#E8EBFC' : '#FFFFFF',
                  // Flutter: boxShadow blur 14, color #DAE1FE at 0.7 opacity, offset 0,3
                  boxShadow: '0 3px 14px rgba(218, 225, 254, 0.7)',
                  // Flutter: selected = plum border, else transparent
                  border: isSelected ? '1px solid #7375A6' : '1px solid transparent',
                  color: '#3A2D32',
                }}
              >
                {rating}
              </button>
            );
          })}
        </div>

        {/* Min/Max labels - Flutter: Row with spaceBetween, margin-top 15px, font 14px, fontWeight 500 */}
        <div className="flex justify-between mt-[15px]">
          <span className="text-sm font-medium text-[#3A2D32] font-inter">
            {minLabel}
          </span>
          <span className="text-sm font-medium text-[#3A2D32] font-inter">
            {maxLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
