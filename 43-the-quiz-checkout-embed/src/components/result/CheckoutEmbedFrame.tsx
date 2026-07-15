/**
 * Presentational iframe for the embedded checkout. Knows nothing about the
 * spec/store — receives a ready-built src and the protocol-derived state.
 *
 * - `allow="payment"` enables the Payment Request API (Apple/Google Pay)
 *   inside the frame. NO `sandbox` attribute: it breaks Stripe/PayPal SDKs.
 * - modal mode: the frame fills its container and the iframe DOCUMENT is the
 *   scroller (no nested-scroll trap).
 * - inline mode: the frame is pinned to the child-reported pixel height
 *   (resize messages) with overflow hidden, so the page keeps ONE scroller.
 */
export interface CheckoutEmbedFrameProps {
  src: string
  mode: 'modal' | 'inline'
  /** Child signalled `ready` — swap the skeleton for the frame. */
  ready: boolean
  /** Inline mode: latest child-reported document height (px). */
  height?: number
  title?: string
}

export function CheckoutEmbedFrame({ src, mode, ready, height, title = 'Secure checkout' }: CheckoutEmbedFrameProps) {
  const inline = mode === 'inline'
  return (
    <div
      className={inline ? 'relative w-full overflow-hidden' : 'relative h-full w-full'}
      style={inline ? { height: Math.max(height ?? 0, 560) } : undefined}
    >
      {!ready && (
        <output
          aria-live="polite"
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-white"
        >
          <span
            aria-hidden="true"
            className="h-10 w-10 animate-spin rounded-full border-[3px] border-cta-orange/25 border-t-cta-orange"
          />
          <p className="text-sm font-medium text-rich-black">Loading secure checkout…</p>
        </output>
      )}
      <iframe
        src={src}
        title={title}
        allow="payment"
        referrerPolicy="strict-origin-when-cross-origin"
        className={`h-full w-full border-0 ${ready ? 'opacity-100' : 'opacity-0'}`}
        data-testid="checkout-embed-frame"
      />
    </div>
  )
}
