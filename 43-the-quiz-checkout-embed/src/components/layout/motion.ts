/**
 * Shared motion helpers for the quiz UI.
 *
 * `prefersReducedMotion()` is the single source of truth for "should I animate?".
 * It is true when the user (or the test harness) requests reduced motion via the
 * `prefers-reduced-motion: reduce` media query. The Playwright config sets
 * `reducedMotion: 'reduce'`, so under e2e every animation is short-circuited:
 *  - the single/image "register-then-advance" delay collapses to 0 (instant
 *    advance, preserving the existing deterministic test timing),
 *  - carousels stop auto-playing (deterministic snapshots),
 *  - framer-motion screen/reveal transitions render at their final state.
 *
 * It is SSR/JSDOM-safe (returns false when `matchMedia` is unavailable, e.g. in
 * the Vitest component tests, so those keep exercising the animated paths).
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false
  }
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  } catch {
    return false
  }
}

/** Delay (ms) before an auto-advance single/image tap navigates, so the tapped
 *  option can flash its "registered" state. Collapses to 0 under reduced motion. */
export const REGISTER_ADVANCE_MS = 380
