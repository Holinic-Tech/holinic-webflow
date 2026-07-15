/**
 * Presentational skip-confirmation modal. Renders nothing when `!open`. When
 * `open`, renders a backdrop + dialog with a confirm button (→ `onConfirm`) and
 * a dismiss button (→ `onDismiss`); clicking the backdrop also dismisses. It
 * knows NOTHING about the spec, answers, or progression — the parent decides
 * what confirming/dismissing does.
 *
 * `contained` switches from `fixed` (default, real quiz) to `absolute` so the
 * modal is clipped inside the Studio phone frame instead of the browser viewport.
 */
export interface SkipModalProps {
  open: boolean
  onConfirm: () => void
  onDismiss: () => void
  contained?: boolean
}

export function SkipModal({ open, onConfirm, onDismiss, contained = false }: SkipModalProps) {
  if (!open) return null

  return (
    <div
      className={`${contained ? 'absolute' : 'fixed'} inset-0 z-50 flex items-center justify-center p-5`}
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        aria-label="Dismiss"
        onClick={onDismiss}
        className="absolute inset-0 bg-black/50"
      />
      <div className="relative z-10 flex w-full max-w-sm flex-col gap-3 rounded-3xl bg-white p-5 text-center shadow-soft">
        <h2 className="text-base font-semibold text-rich-black">Are you sure you want to skip?</h2>
        <p className="text-sm leading-relaxed text-shadow">
          Skip if you have previously completed it, as it's required to create a
          personalized routine based on your hair condition, lifestyle, and other
          key factors.
        </p>
        <div className="flex flex-col gap-2 pt-1">
          <button
            type="button"
            onClick={onDismiss}
            className="w-full rounded-2xl bg-cta-orange px-4 py-2.5 text-center text-sm font-semibold uppercase tracking-[0.7px] text-white transition-colors active:scale-[0.99] hover:bg-cta-orange-deep"
          >
            BACK TO QUIZ
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="w-full rounded-2xl border-2 border-cta-orange bg-white px-4 py-2.5 text-center text-sm font-semibold uppercase tracking-[0.7px] text-cta-orange transition-colors active:scale-[0.99] hover:bg-cta-orange/10"
          >
            SKIP QUIZ
          </button>
        </div>
      </div>
    </div>
  )
}
