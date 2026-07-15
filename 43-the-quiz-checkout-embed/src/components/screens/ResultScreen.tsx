import type { ReactNode } from 'react'

/**
 * Presentational result/dashboard shell. UNLIKE every other screen, the result
 * screen is the ONE scrollable screen — it is NOT wrapped in FitViewport and is
 * not fit-scaled. It renders its `children` (the Phase-3 dashboard: percentage,
 * plan details, testimonials, plan dialog) inside a scrollable container
 * (`min-h-[100dvh] overflow-y-auto`), plus an optional sticky `timer` slot pinned
 * to the BOTTOM of the column as a DARK bar (matching the live capture's black
 * "85% OFF valid for…" countdown). It knows NOTHING about the spec, answers, or
 * progression — the dashboard's own in-flow CTAs (and the timer's JOIN) are wired
 * by the parent to checkout/continue.
 */
export interface ResultScreenProps {
  children?: ReactNode
  /** Sticky bottom DARK countdown bar (the 85%-OFF timer + JOIN). */
  timer?: ReactNode
  /** Inline embedded-checkout section, rendered after the dashboard content, above the sticky timer. */
  embedSlot?: ReactNode
}

export function ResultScreen({ children, timer, embedSlot }: ResultScreenProps) {
  // NOTE: this component intentionally does NOT own its own scroll container.
  // The single scroll ancestor is the result wrapper in `QuizApp` (mobile: the
  // page; desktop: the capped column). Nesting a second `overflow-y-auto` here
  // broke `position: sticky` on the timer — the timer's containing block was the
  // inner box, so it scrolled away with the OUTER scroller. As a plain flow child
  // of the single scroller, `sticky bottom-0` now pins to the bottom of the
  // visible result area during scroll. `min-h-full` makes the content fill the
  // scroller so the sticky bar sits at the true bottom even with short content.
  return (
    <div className="relative flex min-h-full flex-col bg-white">
      {/* Pad the bottom so the final in-flow content clears the sticky timer bar. */}
      <div className="flex flex-1 flex-col gap-6 px-5 py-8 pb-28">
        {children}
        {embedSlot && <div data-testid="checkout-embed-inline">{embedSlot}</div>}
      </div>
      {timer && (
        <div className="sticky bottom-0 z-10 bg-rich-black px-5 py-4 text-white shadow-[0_-6px_20px_rgba(0,0,0,0.18)]">
          {timer}
        </div>
      )}
    </div>
  )
}
