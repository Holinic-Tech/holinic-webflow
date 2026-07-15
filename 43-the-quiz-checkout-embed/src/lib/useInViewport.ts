import { useEffect, useRef, useState } from 'react'

/**
 * Tracks whether the referenced element is currently in (or near) the viewport,
 * via IntersectionObserver. Unlike a one-shot reveal (cf. `FadeSection`), this
 * keeps TOGGLING as the element scrolls in and out — use it to pause off-screen
 * work (e.g. a carousel's auto-advance) so it only runs while the user can see it.
 *
 * Returns `[ref, inView]`: attach `ref` to the element; `inView` flips to `true`
 * once the observer reports intersection and back to `false` when it leaves.
 *
 * Where IntersectionObserver is unavailable (jsdom unit tests, very old engines)
 * it reports `inView: true` so behaviour is unchanged from before this hook.
 */
export function useInViewport<T extends Element>(threshold = 0.1) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold,
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])
  return [ref, inView] as const
}
