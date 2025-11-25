import { useState, useEffect, useRef } from 'react';
import type { PitchType } from '../../data/screenFlow';
import {
  simplePitchData,
  detailedPitchData,
  dynamicPitchData,
} from '../../data/pitchScreens';
import { trackContinuedFromPitch } from '../../services';

interface PitchScreenProps {
  pitchType: PitchType;
  answers: Record<string, string | string[] | number>;
  onContinue: () => void;
}

// Checkmark icon component
function CheckmarkIcon() {
  return (
    <img
      src="https://assets.hairqare.co/checkmark-medium.webp"
      alt=""
      className="w-5 h-5"
    />
  );
}

// Image carousel component with touch swipe support
function ImageCarousel({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Minimum swipe distance to trigger navigation
  const minSwipeDistance = 30;

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3800);

    return () => clearInterval(timer);
  }, [images.length, isPaused]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const distance = touchStartX.current - touchEndX.current;

    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) {
        // Swipe left - go to next
        setCurrentIndex((prev) => (prev + 1) % images.length);
      } else {
        // Swipe right - go to previous
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      }
    }

    // Resume auto-play after a delay
    setTimeout(() => setIsPaused(false), 3000);
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-hidden py-2 cursor-grab active:cursor-grabbing flex flex-col"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: 'pan-y pinch-zoom' }}
    >
      <div
        className="flex transition-transform duration-500 ease-out flex-1 min-h-0"
        style={{
          transform: `translateX(calc(-${currentIndex * 85}% + 7.5%))`,
        }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className={`flex-shrink-0 w-[85%] px-2 transition-all duration-300 flex items-center ${
              index === currentIndex ? 'scale-100 opacity-100' : 'scale-95 opacity-60'
            }`}
          >
            <img
              src={image}
              alt=""
              className="w-full max-h-full rounded-lg pointer-events-none select-none object-contain"
              draggable={false}
            />
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-2 flex-shrink-0">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              setIsPaused(true);
              setTimeout(() => setIsPaused(false), 3000);
            }}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-[#7375A6]' : 'bg-gray-300'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// Simple Pitch Screen (index 6) - matches PitchBodySimpleTextImagesBodyWidget
function SimplePitchContent({
  answers,
  onContinue,
}: {
  answers: Record<string, string | string[] | number>;
  onContinue: () => void;
}) {
  const image = simplePitchData.getImage(answers);
  const description = simplePitchData.getDescription(answers);

  return (
    <div className="h-[calc(100dvh-60px)] flex flex-col">
      {/* Content area - fixed height, no scroll */}
      <div className="flex-1 px-4 overflow-hidden min-h-0">
        {/* Image - left aligned, responsive sizing */}
        <div className="pt-6 pb-4">
          <img
            src={image}
            alt=""
            className="w-[150px] h-[150px] md:w-[200px] md:h-[200px] object-cover rounded-lg"
          />
        </div>

        {/* Title */}
        <h2 className="text-lg md:text-[22px] font-medium text-[#3A2D32] mb-2 text-left font-inter">
          {simplePitchData.title}
        </h2>

        {/* Description */}
        <p className="text-[15px] md:text-base text-[#3A2D32] leading-[1.25] text-left font-inter">
          {description}
        </p>
      </div>

      {/* Footer button - not fixed, part of flex layout */}
      <div className="flex-shrink-0 bg-white px-4 pt-4 pb-6 border-t border-gray-100">
        <div className="max-w-[500px] mx-auto">
          <button
            onClick={onContinue}
            className="w-full py-4 px-6 rounded-[10px] font-medium text-lg text-white transition-all hover:brightness-110 active:scale-[0.98] font-inter"
            style={{ backgroundColor: '#FE6903' }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

// Detailed Pitch Screen (index 8) - matches PitchBodyDetailedTextImagesWidget
function DetailedPitchContent({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="h-[calc(100dvh-60px)] flex flex-col">
      {/* Content area - fixed height, no scroll */}
      <div className="flex-1 px-4 overflow-hidden min-h-0 flex flex-col">
        {/* Description */}
        <p className="text-[14px] md:text-base text-[#3A2D32] leading-[1.2] text-left pt-2 pb-1 font-inter flex-shrink-0">
          {detailedPitchData.description}
        </p>

        {/* Claim */}
        <p className="text-[14px] md:text-base font-medium text-[#3A2D32] leading-[1.2] text-left py-1 font-inter flex-shrink-0">
          {detailedPitchData.claim}
        </p>

        {/* Value Prop header - Flutter: plum color */}
        <p className="text-[14px] md:text-base font-medium py-1 flex-shrink-0" style={{ color: '#7375A6' }}>
          {detailedPitchData.valueProp}
        </p>

        {/* Values in 2-column grid */}
        <div className="grid grid-cols-2 gap-x-2 gap-y-1 mb-2 flex-shrink-0">
          {detailedPitchData.values.map((value, index) => (
            <div key={index} className="flex items-center gap-1.5">
              <CheckmarkIcon />
              <span className="text-[13px] md:text-sm font-medium text-[#3A2D32] font-inter">{value}</span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t-2 border-gray-200 my-2 flex-shrink-0" />

        {/* Carousel - constrained to remaining space */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <ImageCarousel images={detailedPitchData.carouselImages} />
        </div>
      </div>

      {/* Footer button - not fixed, part of flex layout */}
      <div className="flex-shrink-0 bg-white px-4 pt-3 pb-6 border-t border-gray-100">
        <div className="max-w-[500px] mx-auto">
          <button
            onClick={onContinue}
            className="w-full py-3 px-6 rounded-[10px] font-medium text-base text-white transition-all hover:brightness-110 active:scale-[0.98] font-inter"
            style={{ backgroundColor: '#FE6903' }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

// Dynamic Pitch Screen (index 13) - matches PitchBodySimpleDetailedTextImagesWidget
function DynamicPitchContent({
  answers,
  onContinue,
}: {
  answers: Record<string, string | string[] | number>;
  onContinue: () => void;
}) {
  const description = dynamicPitchData.getDescription(answers);
  const claim = dynamicPitchData.getClaim(answers);
  const carouselImages = dynamicPitchData.getCarouselImages(answers);

  return (
    <div className="h-[calc(100dvh-60px)] flex flex-col">
      {/* Content area - fixed height, no scroll */}
      <div className="flex-1 px-4 overflow-hidden min-h-0 flex flex-col">
        {/* Description */}
        <p className="text-[14px] md:text-base text-[#3A2D32] leading-[1.2] text-left pt-2 pb-1 font-inter flex-shrink-0">
          {description}
        </p>

        {/* Claim - lighter weight */}
        <p className="text-[14px] md:text-base font-light text-[#3A2D32] leading-[1.2] text-left py-1 font-inter flex-shrink-0">
          {claim}
        </p>

        {/* Conclusion - medium weight */}
        <p className="text-[14px] md:text-base font-medium text-[#3A2D32] leading-[1.2] text-left py-1 font-inter flex-shrink-0">
          {dynamicPitchData.conclusion}
        </p>

        {/* Divider */}
        <div className="border-t-2 border-gray-200 my-2 flex-shrink-0" />

        {/* Value Prop header - Flutter: plum color */}
        <p className="text-[14px] md:text-base py-1 flex-shrink-0" style={{ color: '#7375A6' }}>
          {dynamicPitchData.valueProp}
        </p>

        {/* Carousel - constrained to remaining space */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <ImageCarousel images={carouselImages} />
        </div>
      </div>

      {/* Footer button - not fixed, part of flex layout */}
      <div className="flex-shrink-0 bg-white px-4 pt-3 pb-6 border-t border-gray-100">
        <div className="max-w-[500px] mx-auto">
          <button
            onClick={onContinue}
            className="w-full py-3 px-6 rounded-[10px] font-medium text-base text-white transition-all hover:brightness-110 active:scale-[0.98] font-inter"
            style={{ backgroundColor: '#FE6903' }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

// Main PitchScreen component
export function PitchScreen({ pitchType, answers, onContinue }: PitchScreenProps) {
  const handleContinue = () => {
    trackContinuedFromPitch(pitchType);
    onContinue();
  };

  return (
    <div className="min-h-[calc(100vh-60px)] flex flex-col bg-white max-w-[500px] mx-auto">
      {pitchType === 'simple' && (
        <SimplePitchContent answers={answers} onContinue={handleContinue} />
      )}
      {pitchType === 'detailed' && (
        <DetailedPitchContent onContinue={handleContinue} />
      )}
      {pitchType === 'dynamic' && (
        <DynamicPitchContent answers={answers} onContinue={handleContinue} />
      )}
    </div>
  );
}
