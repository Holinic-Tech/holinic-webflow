import type { QuizSpec, Screen, ConditionalText, QuestionScreen, QuestionId } from '../../spec/types'
import type { AnswerState } from '../../engine/answers'
import { explainConditional, type ConditionalBranch } from '../../engine/conditions'

/**
 * Studio-only spec introspection. Pure, read-only helpers that turn a screen into
 * the data the Studio chrome needs: the canonical marketer-facing TYPE NAME, the
 * questionIds a screen depends on, and — per conditional field — which branch
 * resolves for the current persona (so a FALLBACK can be flagged).
 *
 * This NEVER renders; it only describes the spec. The faithful preview is still
 * produced by the REAL components via ScreenRenderer.
 */

/** The shared vocabulary a marketer / Claude uses to name a screen TYPE. */
export function canonicalScreenType(screen: Screen): string {
  switch (screen.kind) {
    case 'question':
      if (screen.cover) return 'start cover'
      switch (screen.type) {
        case 'single':
          return 'single-choice'
        case 'image':
          return 'image-tile question'
        case 'multi':
          return 'multi-select'
        case 'rating':
          return 'rating'
      }
      return 'question'
    case 'pitch':
      // A pitch with image/carousel/damageImage blocks is the "image" pitch flavor.
      if (screen.blocks?.some((b) => b.kind === 'image' || b.kind === 'carousel' || b.kind === 'damageImage'))
        return 'pitch (image)'
      return 'pitch (blocks)'
    case 'loading':
      return 'loading'
    case 'email':
      return 'email'
    case 'result':
      return 'result/dashboard'
  }
}

/** One conditional field located on a screen, ready for branch-explaining. */
export interface ConditionalFieldRef {
  /** Human field label, e.g. "prompt", "body", "blocks[2].text". */
  field: string
  text: ConditionalText
}

/**
 * Every ConditionalText-bearing field on ONE screen (mirrors the engine's own
 * resolution surface in ScreenRenderer). 2D-matrix blocks (claim/damageBody/
 * damageImage) are NOT ConditionalText — they're surfaced as dependency edges by
 * {@link screenDependencies}, and shown as matrix blocks by the branch panel.
 */
export function conditionalFields(screen: Screen): ConditionalFieldRef[] {
  const out: ConditionalFieldRef[] = []
  const add = (text: ConditionalText | undefined, field: string) => {
    if (text !== undefined) out.push({ field, text })
  }
  if (screen.kind === 'question') {
    add(screen.prompt, 'prompt')
    add(screen.subtitle, 'subtitle')
    add(screen.beforeTitle, 'beforeTitle')
    add(screen.reveal, 'reveal')
  } else if (screen.kind === 'pitch') {
    add(screen.headline, 'headline')
    add(screen.body, 'body')
    screen.blocks?.forEach((b, i) => {
      if (b.kind === 'text') add(b.text, `blocks[${i}].text`)
      else if (b.kind === 'image') add(b.src, `blocks[${i}].src`)
      else if (b.kind === 'carousel') b.images.forEach((img, j) => add(img, `blocks[${i}].images[${j}]`))
    })
  } else if (screen.kind === 'email') {
    add(screen.headline, 'headline')
    add(screen.concernLine, 'concernLine')
  }
  return out
}

/** A 2D-matrix block (resolved by a renderer helper, not by the engine). */
export interface MatrixFieldRef {
  field: string
  kind: 'claim' | 'damageBody' | 'damageImage'
  questionIds: QuestionId[]
}

/** The 2D-matrix blocks on a pitch screen, with the questionIds they key on. */
export function matrixFields(screen: Screen): MatrixFieldRef[] {
  if (screen.kind !== 'pitch') return []
  const out: MatrixFieldRef[] = []
  screen.blocks?.forEach((b, i) => {
    if (b.kind === 'claim')
      out.push({ field: `blocks[${i}].claim`, kind: 'claim', questionIds: [b.routineQuestionId, b.concernQuestionId] })
    else if (b.kind === 'damageBody')
      out.push({ field: `blocks[${i}].damageBody`, kind: 'damageBody', questionIds: [b.concernQuestionId, b.ageQuestionId] })
    else if (b.kind === 'damageImage')
      out.push({ field: `blocks[${i}].damageImage`, kind: 'damageImage', questionIds: [b.concernQuestionId, b.ageQuestionId] })
  })
  return out
}

/** The questionId a single ConditionalText keys on, if any. */
function keyQuestion(text: ConditionalText): QuestionId | undefined {
  if (typeof text === 'string') return undefined
  if ('by' in text) return text.by
  return text.rules[0]?.when.questionId
}

/** All distinct questionIds this screen's content depends on (conditionals + matrix). */
export function screenDependencies(screen: Screen): QuestionId[] {
  const ids = new Set<QuestionId>()
  for (const f of conditionalFields(screen)) {
    const q = keyQuestion(f.text)
    if (q) ids.add(q)
    // `rules` can key on multiple questions across rules — collect them all.
    if (typeof f.text !== 'string' && 'rules' in f.text) {
      for (const r of f.text.rules) ids.add(r.when.questionId)
    }
  }
  for (const m of matrixFields(screen)) for (const q of m.questionIds) ids.add(q)
  return [...ids]
}

/** A field + which branch resolved for the current persona. */
export interface ExplainedField {
  field: string
  value: string
  branch: ConditionalBranch
}

/** Explain every conditional field on a screen against the current persona. */
export function explainScreenFields(screen: Screen, answers: AnswerState): ExplainedField[] {
  return conditionalFields(screen).map(({ field, text }) => {
    const { value, branch } = explainConditional(text, answers)
    return { field, value, branch }
  })
}

/** Index of questionId -> its question screen (for persona controls). */
export function questionScreens(spec: QuizSpec): QuestionScreen[] {
  return spec.screens.filter((s): s is QuestionScreen => s.kind === 'question')
}

/** Short human label for a branch (badge text). */
export function branchLabel(branch: ConditionalBranch): string {
  switch (branch.kind) {
    case 'static':
      return 'static'
    case 'case':
      return `case:${branch.key}`
    case 'rule':
      return `rule:${branch.index}`
    case 'default':
      return 'FALLBACK'
  }
}
