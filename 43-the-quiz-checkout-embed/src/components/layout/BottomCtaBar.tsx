/**
 * Presentational STICKY bottom CTA bar — the orange CONTINUE pill pinned to the
 * very bottom of the viewport on every non-result screen that needs one.
 *
 * It lives in the chrome (owned by QuizApp), OUTSIDE the `FitViewport` scaled
 * content, so it is never shrunk by the scale-to-fit transform and always sits
 * full-width (with side margins) at the viewport bottom — matching the golden.
 *
 * Purely presentational: it knows NOTHING about the spec, answers, or the store.
 * QuizApp derives the label/enabled/onClick from the current screen + answers.
 */
export interface BottomCtaBarProps {
  label: string
  enabled: boolean
  onClick: () => void
}

export function BottomCtaBar({ label, enabled, onClick }: BottomCtaBarProps) {
  return (
    <div className="shrink-0 px-4 pb-5 pt-2">
      <button
        type="button"
        disabled={!enabled}
        onClick={onClick}
        className="btn-cta disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-cta-orange"
      >
        {label}
      </button>
    </div>
  )
}
