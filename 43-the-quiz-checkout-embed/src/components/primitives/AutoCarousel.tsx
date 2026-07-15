import { useEffect, useState } from 'react'
import { useInViewport } from '../../lib/useInViewport'

/**
 * Reusable auto-playing image carousel with a smooth cross-fade between slides.
 *
 * Two sizing modes:
 *  - DEFAULT (fixed frame): slides are stacked absolutely and cross-faded via
 *    opacity inside a fixed-aspect frame (`className`, default `aspect-square`).
 *    The active slide is gently enlarged (center-emphasis). Used on the pitch
 *    screens where every slide shares a frame.
 *  - NATURAL (`natural`): the active slide drives the container height — each
 *    image renders at its REAL aspect ratio (`w-full h-auto object-contain`, no
 *    crop / no squeeze) so before/after photos of DIFFERENT dimensions are never
 *    stretched into one box. The previous slide cross-fades out behind it.
 *
 * Autoplay advances every `intervalMs` (default 3s) and cleans up on unmount.
 * It auto-plays ALWAYS (independent of prefers-reduced-motion) — slide rotation
 * is content (testimonials / before-afters), not gratuitous motion, and the
 * original quiz rotated regardless. e2e snapshots stay deterministic because the
 * only snapshotted carousels (the pitch screens) are masked in `visual.spec.ts`.
 * Purely presentational: it takes resolved image URLs only.
 */
export interface AutoCarouselProps {
  images: string[]
  intervalMs?: number
  /** Tailwind aspect / sizing classes for the FIXED-frame mode. */
  className?: string
  /** Optional testid passthrough (kept for the existing e2e DOM assertions). */
  testId?: string
  /**
   * Preserve each image's NATURAL aspect ratio — the active slide sizes the
   * container (no fixed frame, no crop). Use for mixed-dimension photo sets.
   */
  natural?: boolean
}

export function AutoCarousel({
  images,
  intervalMs = 3000,
  className = 'aspect-square w-full',
  testId,
  natural = false,
}: AutoCarouselProps) {
  const [active, setActive] = useState(0)
  // Only auto-advance while the carousel is on screen — otherwise it rotates
  // invisibly and, in NATURAL mode, resizes the container, making the text
  // AROUND it jump while the user is reading elsewhere on the result page.
  const [containerRef, inView] = useInViewport<HTMLDivElement>(0.1)

  useEffect(() => {
    // Auto-play for real users while visible. e2e sets `window.__quizPauseCarousels__`
    // (via addInitScript) to keep visual snapshots deterministic without coupling
    // to prefers-reduced-motion.
    const paused =
      typeof window !== 'undefined' &&
      (window as unknown as { __quizPauseCarousels__?: boolean }).__quizPauseCarousels__ === true
    if (paused || !inView || images.length <= 1) return
    const id = setInterval(() => setActive((s) => (s + 1) % images.length), intervalMs)
    return () => clearInterval(id)
  }, [images.length, intervalMs, inView])

  if (images.length === 0) return null

  if (natural) {
    // The ACTIVE slide is in normal flow (drives the height at its real aspect
    // ratio); the others are absolutely stacked behind it and faded out. This
    // keeps each image's natural dimensions while still cross-fading.
    return (
      <div ref={containerRef} className="relative w-full overflow-hidden rounded-xl" data-testid={testId}>
        {images.map((src, i) => {
          const isActive = i === active
          return (
            <img
              key={src + i}
              src={src}
              alt=""
              loading="lazy"
              decoding="async"
              className={
                isActive
                  ? 'block h-auto w-full object-contain transition-opacity duration-700 ease-out'
                  : 'pointer-events-none absolute inset-0 h-full w-full object-contain opacity-0 transition-opacity duration-700 ease-out'
              }
            />
          )
        })}
        <Dots count={images.length} active={active} />
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-xl bg-violet/40 ${className}`}
      data-testid={testId}
    >
      {images.map((src, i) => {
        const isActive = i === active
        return (
          <img
            key={src + i}
            src={src}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-contain transition-[opacity,transform] duration-700 ease-out"
            style={{
              opacity: isActive ? 1 : 0,
              transform: isActive ? 'scale(1)' : 'scale(0.92)',
            }}
          />
        )
      })}
      <Dots count={images.length} active={active} />
    </div>
  )
}

function Dots({ count, active }: { count: number; active: number }) {
  if (count <= 1) return null
  return (
    <div className="absolute inset-x-0 bottom-2 flex justify-center gap-1.5">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i === active ? 'w-4 bg-plum' : 'w-1.5 bg-plum/40'
          }`}
        />
      ))}
    </div>
  )
}
