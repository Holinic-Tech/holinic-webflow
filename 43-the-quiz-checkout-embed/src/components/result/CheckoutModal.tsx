import { useEffect, type ReactNode } from 'react'

/**
 * Presentational full-screen checkout sheet. Renders nothing when `!open`.
 * The children (the CheckoutEmbedFrame) fill everything below a slim header
 * bar; the iframe document is the ONLY scroller, so there is no nested-scroll
 * trap on mobile. Escape and the ✕ both close via `onClose` — the parent
 * decides what closing means. Body scroll is locked while open so the result
 * page underneath doesn't scroll on overscroll.
 *
 * `contained` switches `fixed` → `absolute` for the Studio phone frame,
 * matching SkipModal.
 */
export interface CheckoutModalProps {
  open: boolean
  onClose: () => void
  children?: ReactNode
  contained?: boolean
}

export function CheckoutModal({ open, onClose, children, contained = false }: CheckoutModalProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose])

  // Closed = `display: none`, NOT unmounted: the checkout iframe inside must
  // keep its loaded document between preload and open (remounting an iframe
  // reloads it and would throw the preload head start away).
  return (
    <div
      className={`${open ? 'flex' : 'hidden'} ${contained ? 'absolute' : 'fixed'} inset-0 z-[90] flex-col bg-white md:items-center md:justify-center md:bg-black/50 md:p-6`}
      role="dialog"
      aria-modal="true"
      aria-label="Secure checkout"
      aria-hidden={!open}
      data-testid="checkout-modal"
    >
      {/* Mobile: full-bleed sheet. Desktop: tall centered panel on a dim field. */}
      <div className="flex h-full w-full flex-col overflow-hidden bg-white md:h-[92dvh] md:w-[520px] md:rounded-3xl md:shadow-soft">
        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-2.5">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-rich-black">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 text-cta-orange" fill="currentColor">
              <path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5Zm-3 8V7a3 3 0 1 1 6 0v3H9Z" />
            </svg>
            Secure checkout
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close checkout"
            className="flex h-9 w-9 items-center justify-center rounded-full text-xl leading-none text-shadow transition-colors hover:bg-neutral-100 hover:text-rich-black"
          >
            ×
          </button>
        </div>
        <div className="min-h-0 flex-1">{children}</div>
      </div>
    </div>
  )
}
