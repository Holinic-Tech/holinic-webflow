import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { computeScale } from './fit'

/**
 * Scale-to-fit-viewport primitive — the make-or-break no-scroll guarantee.
 *
 * The outer container fills its parent (`h-full`) and clips overflow. The inner
 * wrapper (`[data-fit-inner]`) renders its children, and we measure its natural
 * `scrollHeight` against the outer `clientHeight`. If the content is taller than
 * the available space we apply a CSS `transform: scale(s)` (via `computeScale`)
 * to shrink it to fit, flooring at `min` (0.45).
 *
 * WIDTH COMPENSATION: a uniform `scale(s)` shrinks WIDTH as well as height, which
 * left content-dense screens (pitches, multi-selects) visibly narrower than the
 * lighter question screens — they scaled harder, so they ended up ~40px skinnier
 * with side gaps. To keep EVERY screen full-width, when `s < 1` we widen the inner
 * logical box to `100 / s %` and anchor the transform `top left`: at logical width
 * `W/s`, `scale(s)` renders it back to exactly `W` (the full viewport width). The
 * content reflows to the wider logical width (longer lines, never clipped), so the
 * scaled result is guaranteed to fit vertically (reflowing wider only makes it
 * shorter than the height `s` was computed for). Result: consistent full-width
 * screens whatever the scale.
 *
 * Why this can't oscillate: `measure()` first resets the inner width to `100%` to
 * read the TRUE natural height, computes `s` from that, then applies the
 * compensated width. The `ResizeObserver` watches ONLY the OUTER box (available
 * area) — never the inner — so our own width mutation never re-triggers a measure.
 * Re-fits are driven by: outer/window resize, a `children` change (new screen),
 * and any inner <img> finishing load (height shift).
 *
 * The floor is `0.45`: Phase-4 device QA found a short landscape viewport
 * (740×360) needs ~0.48 for the tallest multi-select; portrait phones never
 * approach the floor. Top-anchoring keeps the heading at a consistent vertical
 * position across screens.
 *
 * Presentational — it knows nothing about the spec, answers, or the store.
 */
export interface FitViewportProps {
  children: ReactNode
  min?: number
  /**
   * Max scale. Default `1` = down-only. Pass `>1` to also UPSCALE the content to
   * FILL the available height when it's shorter than the viewport.
   */
  maxScale?: number
}

export function FitViewport({ children, min = 0.45, maxScale = 1 }: FitViewportProps) {
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const outer = outerRef.current
    const inner = innerRef.current
    if (!outer || !inner) return

    const measure = () => {
      // 1. Read the TRUE natural height at full (uncompensated) width.
      inner.style.width = '100%'
      const contentHeight = inner.scrollHeight
      // Reserve an 8px safety margin so a screen that scales to fit EXACTLY still
      // leaves a few px of slack (a bottom element landing on the viewport edge
      // reads as "outside the viewport" / untappable — seen on 740×360 landscape).
      const availableHeight = Math.max(0, outer.clientHeight - 8)
      const scale = computeScale(contentHeight, availableHeight, min, maxScale)
      // 2. Apply the scale, compensating WIDTH so the scaled box still fills the
      //    viewport. (When scale ≥ 1 there's nothing to compensate.)
      if (scale === 1) {
        inner.style.transform = ''
        inner.style.width = '100%'
      } else {
        inner.style.transform = `scale(${scale})`
        inner.style.width = `${100 / scale}%`
      }
    }

    measure()

    // Re-fit as the screen SETTLES. The first measure can run before late/lazy
    // media reaches its real height — the testimonial carousel mounts a beat
    // later, pitch images decode after the enter transition, and a cached image
    // that's `complete` at mount fires no `load` event — any of which leaves the
    // screen at scale 1 and overflows the sticky CTA (the carousel rendering
    // behind the Continue button). These one-shot re-fits over the first ~0.6s
    // recompute the scale once things land. They CANNOT loop (unlike an inner
    // ResizeObserver, which would feed our width compensation back into measure).
    const raf = requestAnimationFrame(measure)
    const settleTimers = [80, 250, 600].map((ms) => window.setTimeout(measure, ms))

    // Observe ONLY the outer box (the available area). Watching the inner would
    // feed our own width mutation straight back into measure() — an infinite loop.
    let ro: ResizeObserver | undefined
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(measure)
      ro.observe(outer)
    }
    window.addEventListener('resize', measure)

    // Late image loads change content height — re-fit when each finishes.
    const imgs = Array.from(inner.querySelectorAll('img'))
    const onLoad = () => measure()
    imgs.forEach((img) => {
      if (!img.complete) img.addEventListener('load', onLoad)
    })

    return () => {
      cancelAnimationFrame(raf)
      settleTimers.forEach((t) => clearTimeout(t))
      ro?.disconnect()
      window.removeEventListener('resize', measure)
      imgs.forEach((img) => img.removeEventListener('load', onLoad))
    }
  }, [min, maxScale, children])

  return (
    <div
      ref={outerRef}
      className="h-full w-full overflow-hidden flex flex-col items-stretch justify-start"
    >
      <div ref={innerRef} data-fit-inner style={{ transformOrigin: 'top left' }}>
        {children}
      </div>
    </div>
  )
}
