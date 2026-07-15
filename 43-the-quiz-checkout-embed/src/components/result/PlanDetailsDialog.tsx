import type { planData, personalPlan } from '../../quiz/content/plans'

/**
 * Presentational plan-details dialog (dashboard-spec.md §4 — the
 * FlutterFlow `PitchPlanDialogWidget`). Renders nothing when `!open`. When open,
 * it shows the plan summary + the `personalPlan` bonus line-items, a Close
 * control (→ `onClose`) and a `START NOW →` checkout button (→ `onCheckout`).
 *
 * It knows NOTHING about the spec, store, or tracking — the parent wires
 * `onClose` to `closePlanDetails` and `onCheckout` to `checkoutFromPlanDialog`
 * (both store actions that fire the correct GA events).
 */
export interface PlanDetailsDialogProps {
  open: boolean
  plan: typeof planData
  personalPlan: typeof personalPlan
  onClose: () => void
  onCheckout: () => void
}

export function PlanDetailsDialog({
  open,
  plan,
  personalPlan,
  onClose,
  onCheckout,
}: PlanDetailsDialogProps) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="Plan details"
    >
      <button
        type="button"
        aria-label="Dismiss"
        onClick={onClose}
        className="absolute inset-0 bg-black/50"
      />
      <div className="relative z-10 flex max-h-[90dvh] w-full max-w-md flex-col gap-4 overflow-y-auto rounded-t-3xl bg-white p-6 shadow-soft sm:rounded-3xl">
        <div className="flex items-start justify-between">
          <h2 className="text-xl font-medium text-rich-black">Your personal plan</h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="-mr-1 -mt-1 rounded-full p-1 text-2xl leading-none text-neutral-400 transition-colors hover:text-plum"
          >
            &times;
          </button>
        </div>

        {/* Plan summary (dashboard-spec.md §4) */}
        <div className="rounded-2xl bg-violet p-4 text-center">
          <p className="text-lg font-semibold text-rich-black">{plan.title}</p>
          <div className="mt-1 flex items-baseline justify-center gap-2">
            <span className="text-sm text-neutral-400 line-through">${plan.perDayActualPrice}</span>
            <span className="text-3xl font-bold text-rich-black">${plan.discountedPrice}</span>
          </div>
          <p className="mt-1 text-sm font-semibold text-tangerine-deep">{plan.discountedPerDayPrice}% OFF</p>
        </div>

        {/* Bonus line-items (dashboard-spec.md §4 — the 9 personalPlan structs) */}
        <ul className="flex flex-col divide-y divide-neutral-100">
          {personalPlan.map((item, i) => (
            <li key={item.title + i} className="flex items-center justify-between gap-3 py-2">
              <span className="text-sm text-rich-black">{item.title}</span>
              <span className="flex-shrink-0 text-sm font-semibold text-shadow">
                {item.price !== undefined ? (
                  <>
                    <span className="text-neutral-400 line-through">${item.price}</span>{' '}
                    <span className="text-plum">FREE</span>
                  </>
                ) : (
                  <span className="text-plum">Included</span>
                )}
              </span>
            </li>
          ))}
        </ul>

        <button type="button" onClick={onCheckout} className="btn-primary">
          START NOW →
        </button>
      </div>
    </div>
  )
}
