interface ProgressBarProps {
  current: number;
  total: number;
  progress: number;
}

// Matches Flutter HeaderLinearProgressionBackButtonWidget
export function ProgressBar({ current, total, progress }: ProgressBarProps) {
  return (
    <div className="w-full mb-6 max-w-[500px] mx-auto px-5">
      {/* Step indicator - Flutter: plum color text */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-inter" style={{ color: '#7375A6' }}>
          Question {Math.min(current + 1, total)} of {total}
        </span>
        <span className="text-sm font-inter" style={{ color: '#7375A6' }}>
          {Math.round(progress)}%
        </span>
      </div>

      {/* Progress bar - Flutter: periwinkle background (#B1BAE3), plum fill (#7375A6) */}
      <div
        className="w-full h-2 rounded-full overflow-hidden"
        style={{ backgroundColor: '#E8EBFC' }}
      >
        <div
          className="h-full rounded-full progress-fill"
          style={{
            width: `${progress}%`,
            backgroundColor: '#7375A6',
          }}
          role="progressbar"
          aria-valuenow={current + 1}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-label={`Question ${current + 1} of ${total}`}
        />
      </div>
    </div>
  );
}
