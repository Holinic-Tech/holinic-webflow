import { useEffect, useState } from 'react'
import { prefersReducedMotion } from './layout/motion'

/**
 * INTRO OVERLAY shown BEFORE the quiz (reproduces the original `preloader4.js`).
 *
 * A full-screen, light-background preloader that fades + slides in four white
 * value cards one after another (staggered ~1.25s apart) while a progress bar
 * fills, then calls `onDone()` to unmount itself and reveal the quiz cover.
 *
 * This is NOT a spec screen and fires NO tracking — it is a pure presentational
 * overlay mounted by `main`/`QuizApp` ahead of the quiz, exactly as the original
 * Flutter preloader sat in front of the first "See if the Challenge is a fit"
 * cover. Under `prefers-reduced-motion: reduce` (which the Playwright config and
 * every e2e spec emulate) it auto-finishes INSTANTLY so the golden walk goes
 * straight to the quiz and is never slowed or blocked.
 */
export interface IntroLoaderProps {
  onDone: () => void
}

/** The four value cards, in reveal order — verbatim from the original preloader. */
const CARDS = [
  '🚫 No more hidden harmful ingredients.',
  '🌱 Reduced hair loss and new baby hair growth.',
  "🔬 Split ends that don't come back.",
  '💛 The best of science, made easy at home.',
] as const

/** Milliseconds between each card reveal (snappier than the original 1.25s;
 *  4 cards ≈ 3.2s total). */
const STEP_MS = 800

/**
 * Per-step delay. `?slowintro` (dev/QA only) multiplies the pace so the animation
 * can be screenshotted mid-flight; it has NO effect on the shipped quiz (the param
 * is never present in production) and is ignored under reduced motion.
 */
function stepMs(): number {
  if (typeof location !== 'undefined' && location.search.includes('slowintro')) {
    return STEP_MS * 4
  }
  return STEP_MS
}

export function IntroLoader({ onDone }: IntroLoaderProps) {
  const reduced = prefersReducedMotion()

  // `revealed` = how many cards have appeared (drives the fade/slide + the bar).
  // Under reduced motion we start fully revealed and finish on mount (below).
  const [revealed, setRevealed] = useState(reduced ? CARDS.length : 0)

  useEffect(() => {
    // Reduced motion (incl. the e2e harness): skip the animation entirely and
    // hand off to the quiz on the next tick so the walk isn't slowed.
    if (reduced) {
      onDone()
      return
    }

    // Reveal each card on its own timer, then finish ~one step after the last.
    const step = stepMs()
    const timers: ReturnType<typeof setTimeout>[] = []
    for (let i = 1; i <= CARDS.length; i++) {
      timers.push(setTimeout(() => setRevealed(i), step * i))
    }
    timers.push(setTimeout(() => onDone(), step * CARDS.length))
    return () => timers.forEach(clearTimeout)
    // `onDone`/`reduced` are stable for this mount; listed so the timers correctly
    // reset if `onDone` ever changes.
  }, [onDone, reduced])

  const progress = (revealed / CARDS.length) * 100

  return (
    <output
      className="fixed inset-0 z-50 flex items-center justify-center bg-dove px-5"
      data-intro-loader
      aria-live="polite"
    >
      <div className="flex w-full max-w-[300px] flex-col items-center">
        <h1 className="mb-6 text-center text-xl font-medium leading-snug text-rich-black">
          Find out if the Haircare Challenge is right for you ✨
        </h1>

        <div className="flex w-full flex-col gap-3">
          {CARDS.map((card, i) => (
            <div
              key={card}
              data-intro-card={i < revealed ? 'shown' : 'hidden'}
              className="rounded-[10px] bg-white px-4 py-3 text-sm font-medium text-rich-black shadow-soft transition-all duration-500 ease-out"
              style={{
                opacity: i < revealed ? 1 : 0,
                transform: i < revealed ? 'translateY(0)' : 'translateY(20px)',
              }}
            >
              {card}
            </div>
          ))}
        </div>

        <p className="mt-6 mb-2 text-center text-sm font-medium text-shadow">
          Personal space loading
        </p>
        <div className="h-2 w-full overflow-hidden rounded-full bg-[#e0e0f0]">
          <div
            data-intro-bar
            className="h-full rounded-full bg-plum transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </output>
  )
}
