import type { Screen } from '../../spec/types'
import type { AnswerState } from '../../engine/answers'
import { canonicalScreenType, explainScreenFields, screenDependencies, branchLabel } from './introspect'

/** A pitch label, if the screen is a pitch (for the quoted name). */
function screenName(screen: Screen): string {
  if (screen.kind === 'pitch') return screen.label
  return canonicalScreenType(screen)
}

/**
 * Build the compact "Copy context for Claude" string for the selected screen +
 * persona, e.g.:
 *
 *   Screen s_damage_pitch (pitch "Damage Pitch") | persona: hairConcern=concern_hairloss, age=age_50+ |
 *   resolved headline: "Don't worry! We got you." | body branch: default (FALLBACK)
 *
 * It lists ONLY the persona answers this screen actually depends on, then each
 * conditional field's resolved value + the branch that produced it.
 */
export function buildClaudeContext(screen: Screen, persona: AnswerState): string {
  const deps = screenDependencies(screen)
  const personaStr =
    deps.length === 0
      ? '(none)'
      : deps
          .map((q) => {
            const ids = persona[q] ?? []
            return `${q}=${ids.length ? ids.join('+') : '∅'}`
          })
          .join(', ')

  const fields = explainScreenFields(screen, persona)
  const fieldStr = fields
    .map((f) => `${f.field}: "${f.value}" [${branchLabel(f.branch)}]`)
    .join(' | ')

  const head = `Screen ${screen.id} (${canonicalScreenType(screen)} "${screenName(screen)}")`
  const parts = [head, `persona: ${personaStr}`]
  if (fieldStr) parts.push(fieldStr)
  return parts.join(' | ')
}
