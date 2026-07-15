import { useEffect, useState } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import type { Answer, AnswerReveal, Progression } from '../../spec/types'
import { useRegisterThenAdvance } from '../layout/useRegisterThenAdvance'
import { prefersReducedMotion } from '../layout/motion'
import { cdnImg } from '../../lib/img'

/**
 * Per-character typing speed for the reveal body, ported byte-for-byte from the
 * FlutterFlow original (`animated_text.dart` → `TypewriterAnimatedText(speed:
 * Duration(milliseconds: 20))`). 20ms/char reads as a deliberate, legible type-out.
 */
export const TYPEWRITER_MS_PER_CHAR = 20

const DREAM_THEMES = [
  { bg: 'bg-green-50', circle: 'bg-green-100', arrow: 'text-green-700' },
  { bg: 'bg-amber-50', circle: 'bg-amber-100', arrow: 'text-amber-600' },
  { bg: 'bg-violet',   circle: 'bg-periwinkle', arrow: 'text-plum'     },
]

/**
 * Types `text` out one character at a time at {@link TYPEWRITER_MS_PER_CHAR}.
 * Under reduced motion (e2e/snapshots) it renders the FULL text instantly so the
 * DOM is stable. `key`-ing the parent on the selection restarts the type-out on a
 * re-pick. Returns the substring rendered so far.
 */
function useTypewriter(text: string): string {
  const reduced = prefersReducedMotion()
  const [count, setCount] = useState(reduced ? text.length : 0)

  useEffect(() => {
    if (reduced) {
      setCount(text.length)
      return
    }
    setCount(0)
    let i = 0
    const id = setInterval(() => {
      i += 1
      setCount(i)
      if (i >= text.length) clearInterval(id)
    }, TYPEWRITER_MS_PER_CHAR)
    return () => clearInterval(id)
  }, [text, reduced])

  return text.slice(0, count)
}

/**
 * Presentational single-select screen. It receives already-resolved props and
 * emits an answerId on tap. It knows NOTHING about conditions or the spec —
 * all resolution happens upstream in ScreenRenderer/engine.
 *
 * Two progression modes:
 *  - `auto` (default): tapping an option advances immediately (the store fires
 *    `Question Answered` + advances). No reveal, no Continue.
 *  - `cta` (e.g. the shampoo-spend reveal, idx-10): tapping an option only
 *    RECORDS it (upstream); once `selected` is non-empty we render the reveal
 *    and a Continue button. `onContinue` advances (the store fires `Question
 *    Answered` then).
 *
 * Answer rendering:
 *  - When answers carry `imageUrl`, each option is an image TILE: a periwinkle
 *    rounded square on the LEFT holding the illustration, label on the right.
 *  - Otherwise options render as plain text cards.
 *
 * Reveal rendering (cta only, after a selection):
 *  - `revealCard` (per-answer title + body, idx-10) → a light-yellow card with a
 *    📚 emoji, bold title, body text, shown ABOVE the answer list.
 *  - else `reveal` (a plain resolved string) → simple plum text below the list.
 */
export interface SingleChoiceScreenProps {
  prompt: string
  answers: Answer[]
  onSelect: (answerId: string) => void
  /** Defaults to 'auto' (advance-on-tap). 'cta' shows reveal + Continue. */
  progression?: Progression
  /** Already-resolved reveal text (only used when progression === 'cta'). */
  reveal?: string
  /** Per-answer reveal card (title + body) for the selected answer (idx-10). */
  revealCard?: AnswerReveal
  /** Currently-recorded answerIds for this question (owned by the store). */
  selected?: string[]
  /** Optional muted line above the prompt. */
  beforeTitle?: string
  /** Optional muted line below the prompt. */
  subtitle?: string
}

export function SingleChoiceScreen({
  prompt,
  answers,
  onSelect,
  progression = 'auto',
  reveal,
  revealCard,
  selected = [],
  beforeTitle,
  subtitle,
}: SingleChoiceScreenProps) {
  const isCta = progression === 'cta'
  const hasSelection = selected.length > 0
  const hasImages = answers.some((a) => a.imageUrl)
  const hasDescriptions = answers.some((a) => a.description)

  // Auto screens flash a "registered" state on the tapped option, then advance
  // after a short delay; cta screens record on tap (no delay) and advance via
  // Continue. `markSelected(id)` is true when an option should render selected.
  const [pendingId, advance] = useRegisterThenAdvance(onSelect)
  const handleTap = (id: string) => (isCta ? onSelect(id) : advance(id))
  const markSelected = (id: string) =>
    isCta ? selected.includes(id) : pendingId === id

  return (
    <div className="flex flex-1 flex-col justify-start gap-5 px-5 pb-8 pt-6">
      <div className="flex flex-col gap-1.5">
        {beforeTitle && <p className="text-center text-sm text-shadow">{beforeTitle}</p>}
        <h1 className="text-center text-[26px] font-medium leading-tight text-rich-black">{prompt}</h1>
        {subtitle && <p className="text-center text-sm text-shadow">{subtitle}</p>}
      </div>

      {/* Per-answer reveal card (idx-10) — sits ABOVE the answer list. It fades +
          slides in on selection (and out on a re-pick) for a smooth reveal. */}
      <AnimatePresence mode="wait" initial={false}>
        {isCta && hasSelection && revealCard && (
          <RevealCard key={selected[0]} card={revealCard} />
        )}
      </AnimatePresence>

      {hasImages && hasDescriptions ? (
        <div className="flex flex-col gap-3">
          {answers.map((a, idx) => {
            const isSelected = markSelected(a.answerId)
            const theme = DREAM_THEMES[idx] ?? DREAM_THEMES[0]
            return (
              <button
                key={a.answerId}
                type="button"
                aria-label={a.label}
                aria-pressed={isCta ? selected.includes(a.answerId) : undefined}
                onClick={() => handleTap(a.answerId)}
                className={`answer-card flex overflow-hidden p-0 ${isSelected ? 'answer-card--selected' : ''}`}
              >
                <span className={`flex w-[145px] shrink-0 items-center justify-center self-stretch ${theme.bg}`}>
                  {a.imageUrl && (
                    <span className={`flex h-[117px] w-[117px] items-center justify-center overflow-hidden rounded-full ${theme.circle}`}>
                      <img src={cdnImg(a.imageUrl, 280)} alt="" className="h-full w-full object-cover" />
                    </span>
                  )}
                </span>
                <span className="flex flex-1 flex-col gap-1.5 py-4 pl-4 pr-3">
                  <span className="text-xl font-bold text-rich-black">{a.label}</span>
                  {a.description && (
                    <span className="text-sm leading-snug text-shadow">{a.description}</span>
                  )}
                  <span className={`mt-auto self-end text-lg font-medium ${theme.arrow}`}>→</span>
                </span>
              </button>
            )
          })}
        </div>
      ) : (
      <div className="flex flex-col gap-3">
        {answers.map((a) => {
          const isSelected = markSelected(a.answerId)
          if (hasDescriptions) {
            return (
              <button
                key={a.answerId}
                type="button"
                aria-label={a.label}
                aria-pressed={isCta ? selected.includes(a.answerId) : undefined}
                onClick={() => handleTap(a.answerId)}
                className={`answer-card flex flex-col items-start gap-1.5 px-5 py-3.5 text-left ${
                  isSelected ? 'answer-card--selected' : ''
                }`}
              >
                <span className="text-lg font-bold text-rich-black">{a.label}</span>
                {a.description && (
                  <span className="text-sm leading-snug text-shadow">{a.description}</span>
                )}
              </button>
            )
          }
          if (hasImages) {
            return (
              <button
                key={a.answerId}
                type="button"
                aria-pressed={isCta ? selected.includes(a.answerId) : undefined}
                onClick={() => handleTap(a.answerId)}
                className={`answer-card flex items-stretch gap-3 overflow-hidden p-0 ${
                  isSelected ? 'answer-card--selected' : ''
                }`}
              >
                <span className="flex w-[92px] shrink-0 items-center justify-center self-stretch overflow-hidden rounded-l-2xl bg-violet">
                  {a.imageUrl && (
                    <img src={cdnImg(a.imageUrl, 280)} alt="" className="h-full w-full object-cover" />
                  )}
                </span>
                <span className="flex min-h-[92px] flex-1 items-center pr-4 text-xl font-medium">{a.label}</span>
              </button>
            )
          }
          return (
            <button
              key={a.answerId}
              type="button"
              aria-pressed={isCta ? selected.includes(a.answerId) : undefined}
              onClick={() => handleTap(a.answerId)}
              className={`answer-card px-5 py-4 text-lg ${isSelected ? 'answer-card--selected' : ''}`}
            >
              {a.label}
            </button>
          )
        })}
      </div>
      )}

      {/* Plain reveal text (back-compat path) — only when there is no card.
          The CONTINUE control itself is the chrome's STICKY bottom CTA bar,
          not rendered here (so FitViewport never scales it away). */}
      {isCta && hasSelection && !revealCard && reveal && (
        <p className="text-center text-lg font-medium leading-relaxed text-plum">{reveal}</p>
      )}
    </div>
  )
}

/**
 * The light-yellow reveal card (idx-10 shampoo-spend). The bold TITLE appears
 * normally; the BODY/description TYPES OUT character-by-character (typewriter)
 * at the original FlutterFlow speed. The whole card fades + slides in on
 * selection. Parent keys this on the selected answerId, so a re-pick restarts
 * both the slide-in AND the type-out.
 */
function RevealCard({ card }: { card: AnswerReveal }) {
  const typedBody = useTypewriter(card.body)
  return (
    <m.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.32, ease: 'easeOut' }}
      className="flex items-start gap-3 rounded-lg border border-reveal-border bg-reveal-bg px-3 py-4"
    >
      <span className="shrink-0 text-xl leading-none md:text-2xl" aria-hidden="true">
        📚
      </span>
      <div className="text-left">
        {/* Title + body scale UP on desktop (md:) so the reveal is readable on a
            large screen; mobile keeps the original 15/13px sizes. */}
        <p className="text-lg font-bold leading-snug text-rich-black md:text-2xl">{card.title}</p>
        {/* Reserve full height (invisible full body) so the row doesn't grow as it
            types, then overlay the typed substring — keeps the card height stable. */}
        <p className="relative mt-1 text-base font-normal leading-snug text-rich-black md:text-xl">
          <span aria-hidden className="invisible">
            {card.body}
          </span>
          <span className="absolute inset-0">{typedBody}</span>
        </p>
      </div>
    </m.div>
  )
}
