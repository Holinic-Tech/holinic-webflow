import { useState, useEffect } from 'react';

interface FloatingTimerBarProps {
  onCTAClick: () => void;
  initialMinutes?: number;
}

// Matches Flutter FloatingTimerDialogBox component
export function FloatingTimerBar({ onCTAClick, initialMinutes = 10 }: FloatingTimerBarProps) {
  const [timeRemaining, setTimeRemaining] = useState(initialMinutes * 60); // seconds

  useEffect(() => {
    if (timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining]);

  // Format time as MM:SS
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-5 px-4">
      <div
        className="flex w-full max-w-[500px] rounded-[12px] px-4 py-2"
        style={{
          backgroundColor: '#000000',
          boxShadow: '5px 5px 15px rgba(65, 65, 65, 0.3)',
        }}
      >
        {/* Left side: Pill + Timer */}
        <div className="flex flex-col flex-1">
          {/* Top: Black Friday pill tag */}
          <div className="flex justify-start mb-1">
            <span
              className="text-xs font-medium px-3 py-0.5 rounded-full font-inter"
              style={{
                backgroundColor: '#FFFFFF',
                color: '#000000',
              }}
            >
              🎉 Black Friday Special
            </span>
          </div>

          {/* Bottom: Discount text + Timer */}
          <div className="flex items-center gap-2">
            <span className="text-white text-sm font-inter">
              85% OFF valid for:
            </span>
            <span className="text-white text-xl font-normal font-inter">
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>

        {/* Right side: CTA Button - vertically centered */}
        <div className="flex items-center">
          <button
            onClick={onCTAClick}
            className="h-[40px] px-6 rounded-[10px] font-medium text-white font-inter transition-all hover:brightness-110 active:scale-[0.98]"
            style={{
              backgroundColor: '#FF6E00',
              boxShadow: '0 3px 6px rgba(0, 0, 0, 0.2)',
            }}
          >
            Start Now
          </button>
        </div>
      </div>
    </div>
  );
}
