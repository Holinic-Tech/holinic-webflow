import { useState, useEffect } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

// Loading screen carousel images
const carouselImages = [
  'https://assets.hairqare.co/Hair-Routine_TP-Updated.webp',
  'https://assets.hairqare.co/Hair%20Routine%20(1)-03%20copy.webp',
  'https://assets.hairqare.co/Hair%20Routine-04.webp',
  'https://assets.hairqare.co/Hair%20Routine-05.webp',
];

// Loading checkpoints
const checkpoints = [
  'Checking your hair condition',
  'Analysing your routine',
  'Checking your challenge-fit',
];

// Matches Flutter LoadingScreenBeforeResultWidget exactly
export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [visibleCheckpoints, setVisibleCheckpoints] = useState<number[]>([]);

  // Image carousel rotation - 1200ms interval
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  // Progress bar animation - fills over 3 seconds (1 second per segment)
  useEffect(() => {
    const segmentDuration = 1000; // 1 second per segment
    const totalSegments = 3;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + (100 / totalSegments);
        if (newProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        return newProgress;
      });
    }, segmentDuration);

    return () => clearInterval(timer);
  }, []);

  // Checkpoint reveal animation - staggered by 700ms
  useEffect(() => {
    checkpoints.forEach((_, index) => {
      setTimeout(() => {
        setVisibleCheckpoints((prev) => [...prev, index]);
      }, index * 700);
    });
  }, []);

  // Auto-advance after progress completes + 1 second delay
  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => {
        onComplete();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [progress, onComplete]);

  return (
    <div className="min-h-[calc(100vh-60px)] flex flex-col bg-white">
      <div className="flex-1 max-w-[500px] mx-auto w-full px-4 py-6">
        {/* Title - Flutter: 28px, Inter, weight 500 */}
        <h2 className="text-[28px] font-medium text-[#3A2D32] text-center font-inter mb-6">
          Creating your personalized haircare program
        </h2>

        {/* Image Carousel - Flutter: 250px mobile, 317px desktop */}
        <div className="relative w-full h-[250px] md:h-[317px] overflow-hidden my-5 md:my-10">
          <div
            className="flex transition-transform duration-[800ms] ease-in-out h-full"
            style={{
              transform: `translateX(-${currentImageIndex * 100}%)`,
            }}
          >
            {carouselImages.map((image, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-full h-full flex items-center justify-center px-4"
              >
                <img
                  src={image}
                  alt={`Haircare routine ${index + 1}`}
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Progress Bar - Flutter: 30px height, 20px radius */}
        <div className="w-full max-w-[470px] mx-auto my-5">
          <div
            className="w-full h-[30px] rounded-[20px] overflow-hidden"
            style={{ backgroundColor: '#D9D9D9' }}
          >
            <div
              className="h-full rounded-[20px] transition-all duration-[350ms] ease-out"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #7375A6 0%, #B1BAE3 50%, #F2DAC6 100%)',
              }}
            />
          </div>
        </div>

        {/* Checkpoint List - Flutter: staggered slide-in animation */}
        <div className="mt-5 space-y-3">
          {checkpoints.map((checkpoint, index) => (
            <div
              key={index}
              className={`
                flex items-center gap-3 px-4 py-2
                transition-all duration-[610ms] ease-out
                ${visibleCheckpoints.includes(index)
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 translate-x-[15px]'
                }
              `}
            >
              {/* Checkmark icon - green rounded square */}
              <div className="w-[22px] h-[22px] rounded-[4px] bg-green-500 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              {/* Checkpoint text */}
              <span className="text-[#3A2D32] font-inter font-medium">
                {checkpoint}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
