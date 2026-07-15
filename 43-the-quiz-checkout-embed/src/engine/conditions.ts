import type { ConditionalText, AnswerSetCondition } from '../spec/types'
import type { AnswerState } from './answers'

function matches(cond: AnswerSetCondition, answers: AnswerState): boolean {
  const picked = answers[cond.questionId] ?? []
  if (cond.containsAll && !cond.containsAll.every(a => picked.includes(a))) return false
  if (cond.containsAny && !cond.containsAny.some(a => picked.includes(a))) return false
  return Boolean(cond.containsAll || cond.containsAny)
}

export function resolveConditional(text: ConditionalText, answers: AnswerState): string {
  if (typeof text === 'string') return text
  if ('by' in text) {
    const picked = answers[text.by]?.[0]
    return (picked && text.cases[picked]) || text.default
  }
  for (const rule of text.rules) if (matches(rule.when, answers)) return rule.text
  return text.default
}

/** Which branch of a ConditionalText produced the resolved value. */
export type ConditionalBranch =
  /** the field was a plain (non-conditional) string */
  | { kind: 'static' }
  /** a `by`/`cases` lookup matched the case keyed by this answerId */
  | { kind: 'case'; key: string }
  /** the i-th rule of a `rules` conditional matched (first match wins) */
  | { kind: 'rule'; index: number }
  /** no case/rule matched — the catch-all `default` was used (a FALLBACK) */
  | { kind: 'default' }

export interface ExplainedConditional {
  value: string
  branch: ConditionalBranch
}

/**
 * Like {@link resolveConditional} but ALSO reports WHICH branch produced the
 * value, so the Studio can flag when a persona hits the catch-all `default`
 * (a "FALLBACK") versus a tailored case/rule. The `value` is byte-identical to
 * `resolveConditional(text, answers)` for every input — this helper mirrors the
 * exact same matching logic and is unit-tested for parity.
 */
export function explainConditional(text: ConditionalText, answers: AnswerState): ExplainedConditional {
  if (typeof text === 'string') return { value: text, branch: { kind: 'static' } }
  if ('by' in text) {
    const picked = answers[text.by]?.[0]
    if (picked && text.cases[picked]) return { value: text.cases[picked], branch: { kind: 'case', key: picked } }
    return { value: text.default, branch: { kind: 'default' } }
  }
  for (let i = 0; i < text.rules.length; i++) {
    if (matches(text.rules[i].when, answers)) {
      return { value: text.rules[i].text, branch: { kind: 'rule', index: i } }
    }
  }
  return { value: text.default, branch: { kind: 'default' } }
}
