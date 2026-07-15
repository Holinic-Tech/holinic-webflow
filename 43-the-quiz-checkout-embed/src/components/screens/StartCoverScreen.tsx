import type { Answer } from '../../spec/types'
import { cdnImg } from '../../lib/img'

// Tint themes for the dream-option illustrated cards (green / amber / lavender).
// Mirror the DREAM_THEMES in SingleChoiceScreen — left panel bg + circle fill.
const COVER_THEMES = [
  { bg: 'bg-green-50', circle: 'bg-green-100' },
  { bg: 'bg-amber-50', circle: 'bg-amber-100' },
  { bg: 'bg-violet',   circle: 'bg-periwinkle' },
] as const

/**
 * Presentational START cover (idx-0).
 *
 * Two layouts — chosen by whether `ctaLabel` is supplied:
 *
 * CTA layout (`ctaLabel` present):
 *   Logo → spacer → headline → subhead → primary CTA button → skip.
 *
 * Dream-options layout (`ctaLabel` absent):
 *   Logo → spacer → subhead → headline → 3 illustrated tinted cards → skip.
 */
export interface StartCoverScreenProps {
  headline: string
  /** Legacy layout only: instruction line shown above the goal tiles. */
  instruction?: string
  backgroundUrl: string
  /**
   * @deprecated The cover renders the local white wordmark; kept so
   * spec's `cover.logoUrl` still type-checks.
   */
  logoUrl?: string
  /** CTA layout: small uppercase eyebrow line above the headline. */
  eyebrow?: string
  /** CTA layout: sub-headline shown under the main headline. */
  subhead?: string
  /** CTA layout: label for the single primary action button. */
  ctaLabel?: string
  /** CTA layout: fires when the primary Start button is tapped (no answer recorded). */
  onStart?: () => void
  /** CTA layout: callback for the "Skip the Quiz" secondary link. */
  onSkip?: () => void
  answers: Answer[]
  onSelect: (answerId: string) => void
}

export function StartCoverScreen({
  headline,
  instruction: _instruction,
  backgroundUrl,
  eyebrow,
  subhead,
  ctaLabel,
  onStart,
  onSkip,
  answers,
  onSelect,
}: StartCoverScreenProps) {
  return (
    <div className="relative flex h-full min-h-full flex-1 flex-col overflow-hidden">
      {/* Full-bleed background — anchored to top so hero subject stays visible */}
      <img
        src={cdnImg(backgroundUrl, 900)}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-top"
        fetchPriority="high"
      />
      {/* Gradient: gentle at top, moderate at bottom — cards add their own contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/55" />

      {/* Content */}
      <div className="relative z-10 flex flex-1 flex-col px-5 pb-10 pt-7 text-white">
        <img
          src={`${import.meta.env.BASE_URL}brand/hairqare-logo-white.webp`}
          alt="Hairqare"
          className="h-[20px] w-auto self-start"
        />

        {ctaLabel ? (
          /* ── CTA layout — text block anchored to bottom ─────────────────── */
          <>
            <div className="flex-1" />

            <div className="mb-5 flex flex-col gap-2">
              {eyebrow && (
                <p className="text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-tangerine">
                  {eyebrow}
                </p>
              )}
              <h1 className="text-center text-[30px] font-bold leading-tight text-white">
                {headline}
              </h1>
              {subhead && (
                <p className="mt-1 text-center text-[15px] font-normal leading-snug text-white/85">
                  {subhead}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={onStart}
              className="btn-primary w-full py-4 text-base"
            >
              {ctaLabel}
            </button>
            {onSkip && (
              <button
                type="button"
                onClick={onSkip}
                className="mt-4 min-h-[44px] px-4 py-3 text-sm font-medium text-white underline underline-offset-2"
              >
                Skip the quiz
              </button>
            )}
          </>
        ) : (
          /* ── Dream-options layout: illustrated tinted cards ─────────────── */
          <>
            <div className="flex-1" />

            <div className="mb-3 flex flex-col gap-1">
              {subhead && (
                <p className="flex justify-center">
                  <span
                    className="rounded bg-black/35 px-3 py-0.5 text-sm font-semibold text-white"
                  >
                    {subhead}
                  </span>
                </p>
              )}
              <h1 className="text-center text-[34px] font-bold leading-tight text-white">
                {headline}
              </h1>
              <p
                className="mt-0.5 text-center text-xs font-normal text-white/65"
                style={{ textShadow: '0 1px 4px rgba(0,0,0,0.7)' }}
              >
                Pick what matters most right now.
              </p>
            </div>

            <div className="mx-1 flex flex-col gap-2.5">
              {answers.map((a, idx) => {
                const theme = COVER_THEMES[idx] ?? COVER_THEMES[0]
                return (
                  <button
                    key={a.answerId}
                    type="button"
                    onClick={() => onSelect(a.answerId)}
                    className="flex w-full overflow-hidden rounded-xl bg-white shadow-md transition-transform active:scale-[0.98]"
                  >
                    <span className={`flex w-[80px] shrink-0 items-center justify-center self-stretch ${theme.bg}`}>
                      {a.imageUrl && (
                        <span className={`flex h-[58px] w-[58px] items-center justify-center overflow-hidden rounded-full ${theme.circle}`}>
                          <img src={cdnImg(a.imageUrl, 160)} alt="" className="h-full w-full object-cover" />
                        </span>
                      )}
                    </span>
                    <span className="flex flex-1 items-center py-3 pl-3 pr-4 text-base font-bold text-rich-black">
                      {a.label}
                    </span>
                  </button>
                )
              })}
            </div>

            {onSkip && (
              <button
                type="button"
                onClick={onSkip}
                className="mt-2 min-h-[44px] px-4 py-2 text-xs font-normal text-white/50 underline underline-offset-2"
              >
                Skip the quiz
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
