import { render, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { AutoCarousel } from './AutoCarousel'

// In jsdom, matchMedia is unavailable / returns false for the reduced-motion
// query, so `prefersReducedMotion()` is false here and autoplay runs — exactly
// the NON-reduced-motion path we want to assert.

const IMAGES = ['https://cdn/a.webp', 'https://cdn/b.webp', 'https://cdn/c.webp']

/** The active slide is the <img> currently at full opacity. */
function activeIndex(container: HTMLElement): number {
  const imgs = Array.from(container.querySelectorAll('img'))
  return imgs.findIndex((i) => (i as HTMLImageElement).style.opacity === '1')
}

describe('AutoCarousel autoplay', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('auto-advances to the next slide every intervalMs (fixed-frame mode)', () => {
    const { container } = render(<AutoCarousel images={IMAGES} intervalMs={3000} />)
    expect(activeIndex(container)).toBe(0)

    act(() => {
      vi.advanceTimersByTime(3000)
    })
    expect(activeIndex(container)).toBe(1)

    act(() => {
      vi.advanceTimersByTime(3000)
    })
    expect(activeIndex(container)).toBe(2)

    // wraps back around to the first slide
    act(() => {
      vi.advanceTimersByTime(3000)
    })
    expect(activeIndex(container)).toBe(0)
  })

  it('clears its interval on unmount (no leaked timer firing after unmount)', () => {
    const { container, unmount } = render(<AutoCarousel images={IMAGES} intervalMs={3000} />)
    expect(activeIndex(container)).toBe(0)
    unmount()
    // After unmount the interval must be cleared — advancing time triggers no
    // further setActive() (which would warn about updating an unmounted tree).
    const warn = vi.spyOn(console, 'error').mockImplementation(() => {})
    act(() => {
      vi.advanceTimersByTime(9000)
    })
    expect(warn).not.toHaveBeenCalled()
    warn.mockRestore()
  })

  it('does not auto-advance a single-image set', () => {
    const { container } = render(<AutoCarousel images={['https://cdn/only.webp']} />)
    act(() => {
      vi.advanceTimersByTime(9000)
    })
    // single image: it is the only slide and stays put
    expect(container.querySelectorAll('img')).toHaveLength(1)
  })

  it('natural mode keeps the active slide in normal flow (real aspect ratio, no fixed frame)', () => {
    const { container } = render(<AutoCarousel images={IMAGES} natural />)
    const imgs = Array.from(container.querySelectorAll('img')) as HTMLImageElement[]
    // The active (first) slide is in-flow (no absolute positioning, object-contain),
    // so the container height follows the image's natural dimensions.
    expect(imgs[0].className).toContain('object-contain')
    expect(imgs[0].className).not.toContain('absolute')
    // Non-active slides are absolutely stacked behind it.
    expect(imgs[1].className).toContain('absolute')

    // Still auto-advances in natural mode.
    act(() => {
      vi.advanceTimersByTime(3000)
    })
    const after = Array.from(container.querySelectorAll('img')) as HTMLImageElement[]
    expect(after[1].className).toContain('object-contain')
    expect(after[1].className).not.toContain('absolute')
  })
})
