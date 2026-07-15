import type { Screen } from '../../spec/types'
import type { AnswerState } from '../../engine/answers'
import type { ConditionalBranch } from '../../engine/conditions'
import { explainScreenFields, matrixFields, branchLabel } from './introspect'
import { pitchClaim, claimRoutineKeys, claimConcernKeys } from '../../quiz/content/pitch-claim-matrix'
import { damagePitchBody, damagePitchImage, damagePitchConcernKeys } from '../../quiz/content/pitch-detail-matrix'

/**
 * Branch / fallback indicator — the core Studio value. For each conditional field
 * on the selected screen it shows WHICH branch resolved for the current persona
 * (the matched case key / rules index / `static`), and flags a clear FALLBACK
 * badge when the persona fell through to the catch-all `default`. It also lists
 * the 2D-matrix blocks (claim / damageBody / damageImage), resolving them via the
 * same renderer helpers the quiz uses.
 */
export interface BranchPanelProps {
  screen: Screen
  persona: AnswerState
}

function BranchBadge({ branch }: { branch: ConditionalBranch }) {
  const isFallback = branch.kind === 'default'
  const isStatic = branch.kind === 'static'
  const cls = isFallback
    ? 'bg-cta-orange text-white'
    : isStatic
      ? 'bg-neutral-200 text-neutral-600'
      : 'bg-plum text-white'
  return (
    <span className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold ${cls}`}>
      {branchLabel(branch)}
    </span>
  )
}

export function BranchPanel({ screen, persona }: BranchPanelProps) {
  const fields = explainScreenFields(screen, persona)
  const matrices = matrixFields(screen)

  if (fields.length === 0 && matrices.length === 0) {
    return <p className="text-xs text-gray-400">This screen has no conditional fields.</p>
  }

  return (
    <div className="flex flex-col gap-2">
      {fields.map((f) => (
        <div key={f.field} className="rounded-md border border-neutral-200 bg-white p-2">
          <div className="flex items-center justify-between gap-2">
            <code className="text-[11px] font-semibold text-rich-black">{f.field}</code>
            <BranchBadge branch={f.branch} />
          </div>
          <p className="mt-1 line-clamp-3 text-xs text-gray-600">{f.value || <em className="text-gray-300">(empty)</em>}</p>
        </div>
      ))}

      {matrices.map((m) => {
        const value = resolveMatrix(m.kind, m.questionIds, persona)
        const fallback = matrixIsFallback(m.kind, m.questionIds, persona)
        return (
          <div key={m.field} className="rounded-md border border-dashed border-neutral-300 bg-white p-2">
            <div className="flex items-center justify-between gap-2">
              <code className="text-[11px] font-semibold text-rich-black">{m.field}</code>
              <div className="flex items-center gap-1">
                {fallback && (
                  <span className="rounded bg-cta-orange px-1.5 py-0.5 font-mono text-[10px] font-semibold text-white">
                    FALLBACK
                  </span>
                )}
                <span className="rounded bg-periwinkle px-1.5 py-0.5 font-mono text-[10px] font-semibold text-rich-black">
                  2D matrix
                </span>
              </div>
            </div>
            <p className="mt-0.5 text-[10px] text-gray-400">keys: {m.questionIds.join(' × ')}</p>
            <p className="mt-1 line-clamp-3 break-all text-xs text-gray-600">{value}</p>
          </div>
        )
      })}
    </div>
  )
}

/** Resolve a 2D-matrix block exactly as ScreenRenderer does (same helpers). */
function resolveMatrix(
  kind: 'claim' | 'damageBody' | 'damageImage',
  questionIds: string[],
  persona: AnswerState,
): string {
  const pick = (q: string) => (persona[q] ?? [])[0] ?? ''
  if (kind === 'claim') return pitchClaim(pick(questionIds[0]), pick(questionIds[1]))
  if (kind === 'damageBody') return damagePitchBody(pick(questionIds[0]), pick(questionIds[1]))
  return damagePitchImage(pick(questionIds[0]), pick(questionIds[1]))
}

/**
 * Whether a 2D-matrix block resolved via a DEFAULT (catch-all) span for this
 * persona — i.e. at least one of its key questions is unanswered or picked an
 * answer outside the matrix's explicit (tailored) key set.
 *  - claim         keys on currentRoutine × hairConcern — fallback if EITHER misses.
 *  - damageBody    keys on hairConcern × age — concern outside the tailored set, OR
 *                  age missing, yields default spans.
 *  - damageImage   tailored by concern (hairloss also splits by age) — fallback when
 *                  the concern is outside the tailored set.
 */
function matrixIsFallback(
  kind: 'claim' | 'damageBody' | 'damageImage',
  questionIds: string[],
  persona: AnswerState,
): boolean {
  const pick = (q: string) => (persona[q] ?? [])[0] ?? ''
  if (kind === 'claim') {
    const routine = pick(questionIds[0])
    const concern = pick(questionIds[1])
    return !claimRoutineKeys.includes(routine) || !claimConcernKeys.includes(concern)
  }
  // damageBody / damageImage both key concern first, age second.
  const concern = pick(questionIds[0])
  const age = pick(questionIds[1])
  if (kind === 'damageImage') return !damagePitchConcernKeys.includes(concern)
  // damageBody: concern drives the % / phrase / outcome spans; age drives the age span.
  return !damagePitchConcernKeys.includes(concern) || age === ''
}
