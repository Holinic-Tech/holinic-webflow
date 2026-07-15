/**
 * Presentational quiz chrome header — the centered HAIRQARE wordmark, an
 * optional back control, and a SEGMENTED progress bar (matching the golden
 * reference: ~6 equal rounded segments, filled in plum up to current progress,
 * the rest light gray).
 *
 * It receives already-derived chrome flags and the current/total question
 * position; it knows NOTHING about the spec, answers, or the store. The parent
 * (`QuizApp`) derives `showBack`/`showProgress` from `deriveChrome` and
 * `current`/`total` from `questionPosition`/`totalQuestions`.
 */
export interface ProgressHeaderProps {
  showBack: boolean
  showProgress: boolean
  current: number
  total: number
  onBack: () => void
}

/** Number of equal segments in the progress bar (matches the golden ~6). */
const SEGMENTS = 6

export function ProgressHeader({ showBack, showProgress, current, total, onBack }: ProgressHeaderProps) {
  // Map the question position onto SEGMENTS equal chunks. We round so the bar
  // fills progressively across the quiz regardless of the exact question count.
  const ratio = total > 0 ? Math.min(1, Math.max(0, current / total)) : 0
  const filled = Math.round(ratio * SEGMENTS)

  return (
    <header className="px-4 pb-2 pt-3.5">
      {/* Row 1: back arrow (left) + centered HAIRQARE logo image. The arrow is
          absolutely positioned so the logo stays optically centered. */}
      <div className="relative flex h-7 items-center justify-center">
        {showBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className="absolute left-0 top-1/2 -translate-y-1/2 text-xl leading-none text-rich-black transition-colors hover:text-plum"
          >
            ←
          </button>
        )}
        <img
          src={`${import.meta.env.BASE_URL}brand/hairqare-logo.webp`}
          alt="Hairqare"
          className="h-[20px] w-auto select-none"
        />
      </div>

      {/* Row 2: segmented progress bar. */}
      {showProgress && (
        <div
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={0}
          aria-valuemax={total}
          className="mt-2.5 flex gap-1.5"
        >
          {Array.from({ length: SEGMENTS }, (_, i) => (
            <span
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i < filled ? 'bg-plum' : 'bg-neutral-200'
              }`}
            />
          ))}
        </div>
      )}
    </header>
  )
}
