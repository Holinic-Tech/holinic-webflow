import type { Answer } from '../../spec/types'
import { useRegisterThenAdvance } from '../layout/useRegisterThenAdvance'

/**
 * Presentational image-choice (single-select with images) screen. Receives
 * already-resolved props and emits an answerId on tap. It knows NOTHING about
 * conditions, the spec, or answer state — resolution happens upstream.
 *
 * `layout` controls the answer card style:
 *  - `tile` — LARGE 2-col grid; each tile is the illustration with a plum label
 *    strip across its bottom (idx-1 hair type).
 *  - `row`  — compact left-image (periwinkle square) + right-label row
 *    (idx-2 age, idx-3 concern, idx-7 hairqare, idx-9 diet). Default.
 *
 * Optional `beforeTitle` renders a muted line ABOVE the prompt; optional
 * `subtitle` renders a muted line BELOW it (e.g. "Select one").
 */
export interface ImageChoiceScreenProps {
  prompt: string
  answers: Answer[]
  onSelect: (answerId: string) => void
  layout?: 'tile' | 'row'
  beforeTitle?: string
  subtitle?: string
}

export function ImageChoiceScreen({
  prompt,
  answers,
  onSelect,
  layout = 'row',
  beforeTitle,
  subtitle,
}: ImageChoiceScreenProps) {
  // Flash a "registered" state on the tapped tile, then advance after a short delay.
  const [pendingId, advance] = useRegisterThenAdvance(onSelect)
  return (
    <div className="flex flex-1 flex-col justify-start gap-5 px-5 pb-8 pt-6">
      <div className="flex flex-col gap-1.5">
        {beforeTitle && (
          <p className="text-center text-sm text-shadow">{beforeTitle}</p>
        )}
        <h1 className="text-center text-[26px] font-medium leading-tight text-rich-black">{prompt}</h1>
        {subtitle && (
          <p className="text-center text-sm text-shadow">{subtitle}</p>
        )}
      </div>

      {layout === 'tile' ? (
        <div className="grid grid-cols-2 gap-3">
          {answers.map((a) => (
            <button
              key={a.answerId}
              type="button"
              onClick={() => advance(a.answerId)}
              className={`answer-card relative flex flex-col overflow-hidden p-0 ${
                pendingId === a.answerId ? 'answer-card--selected' : ''
              }`}
            >
              {a.imageUrl && (
                <img
                  src={a.imageUrl}
                  alt=""
                  className="aspect-square w-full bg-violet object-cover"
                />
              )}
              <span className="absolute inset-x-0 bottom-0 bg-plum/85 px-2 py-2 text-center text-sm font-medium text-white">
                {a.label}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {answers.map((a) => (
            <button
              key={a.answerId}
              type="button"
              onClick={() => advance(a.answerId)}
              className={`answer-card flex items-stretch gap-3 overflow-hidden p-0 ${
                pendingId === a.answerId ? 'answer-card--selected' : ''
              }`}
            >
              <span className="flex w-[72px] shrink-0 items-center justify-center self-stretch overflow-hidden rounded-l-xl bg-violet">
                {a.imageUrl && (
                  <img src={a.imageUrl} alt="" className="h-full w-full object-cover" />
                )}
              </span>
              <span className="flex min-h-[72px] flex-1 items-center py-2 pr-4 text-base font-medium text-rich-black">
                {a.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
