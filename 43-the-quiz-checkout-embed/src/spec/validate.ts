import type {
  QuizSpec,
  QuestionScreen,
  ConditionalText,
  AnswerSetCondition,
  AnswerId,
  QuestionId,
} from './types'

/**
 * Validates a quiz spec and returns a list of human-readable error strings.
 * An empty array means the spec is valid.
 *
 * Checks performed:
 *  - screen ids are unique
 *  - every question has at least one answer and no duplicate answerIds
 *  - every conditional-text (`by`/`cases` or set-logic `rules`) references a
 *    questionId defined by an EARLIER question screen, and references only
 *    answerIds that actually exist on that question
 *  - pitch screens have a non-empty `label`
 *  - `cdp.acField` (when present) is a positive integer
 *  - `checkout.couponRules` reference known questionIds/answerIds
 *  - `noneOfTheAbove.answerId` does not collide with a real answerId
 */
export function validateSpec(spec: QuizSpec): string[] {
  const errors: string[] = []

  // Index question screens by questionId together with their flow position
  // (the screen index) and their set of valid answerIds.
  interface QuestionInfo {
    index: number
    answerIds: Set<AnswerId>
  }
  const questions = new Map<QuestionId, QuestionInfo>()
  spec.screens.forEach((s, index) => {
    if (s.kind === 'question') {
      questions.set(s.questionId, { index, answerIds: new Set(s.answers.map(a => a.answerId)) })
    }
  })

  // --- Unique screen ids ---
  const seenIds = new Set<string>()
  for (const s of spec.screens) {
    if (seenIds.has(s.id)) errors.push(`duplicate screen id: '${s.id}'`)
    seenIds.add(s.id)
  }

  // --- Per-screen checks ---
  spec.screens.forEach((s, index) => {
    if (s.kind === 'question') {
      validateQuestion(s, index, questions, errors)
    } else if (s.kind === 'pitch') {
      if (!s.label || s.label.trim() === '') {
        errors.push(`pitch screen '${s.id}' has an empty label`)
      }
      checkConditional(s.headline, index, s.id, 'headline', questions, errors)
      checkConditional(s.body, index, s.id, 'body', questions, errors)
      // Multi-block pitch body (idx-13): validate each block's conditionals and
      // the claim block's referenced questionIds (all must be earlier questions).
      s.blocks?.forEach((b, i) => {
        if (b.kind === 'text') {
          checkConditional(b.text, index, s.id, `blocks[${i}].text`, questions, errors)
        } else if (b.kind === 'carousel') {
          b.images.forEach((img, j) =>
            checkConditional(img, index, s.id, `blocks[${i}].images[${j}]`, questions, errors),
          )
        } else if (b.kind === 'image') {
          checkConditional(b.src, index, s.id, `blocks[${i}].src`, questions, errors)
        } else if (b.kind === 'claim') {
          for (const qid of [b.routineQuestionId, b.concernQuestionId]) {
            const info = questions.get(qid)
            if (!info || info.index >= index) {
              errors.push(
                `screen '${s.id}' blocks[${i}] claim references questionId '${qid}' which is not defined by an earlier question`,
              )
            }
          }
        } else if (b.kind === 'damageImage' || b.kind === 'damageBody') {
          for (const qid of [b.concernQuestionId, b.ageQuestionId]) {
            const info = questions.get(qid)
            if (!info || info.index >= index) {
              errors.push(
                `screen '${s.id}' blocks[${i}] ${b.kind} references questionId '${qid}' which is not defined by an earlier question`,
              )
            }
          }
        }
      })
    } else if (s.kind === 'email') {
      checkConditional(s.headline, index, s.id, 'headline', questions, errors)
    }
  })

  // --- Checkout coupon rules ---
  spec.checkout.couponRules.forEach((rule, i) => {
    checkSetCondition(
      rule.when,
      // coupon rules may reference any question regardless of flow position
      Number.POSITIVE_INFINITY,
      `checkout.couponRules[${i}]`,
      questions,
      errors,
    )
  })

  // --- Embedded-checkout config ---
  const embed = spec.checkout.embed
  if (embed) {
    if (embed.mode !== undefined && embed.mode !== 'modal' && embed.mode !== 'inline') {
      errors.push(`checkout.embed.mode must be 'modal' or 'inline' (got '${String(embed.mode)}')`)
    }
    if (
      embed.preload !== undefined &&
      !['none', 'onIntent', 'onResult'].includes(embed.preload)
    ) {
      errors.push(`checkout.embed.preload must be 'none' | 'onIntent' | 'onResult' (got '${String(embed.preload)}')`)
    }
    if (embed.loadTimeoutMs !== undefined && !(embed.loadTimeoutMs > 0)) {
      errors.push('checkout.embed.loadTimeoutMs must be > 0')
    }
    for (const [key, value] of [['base', embed.base], ['allowedOrigin', embed.allowedOrigin]] as const) {
      if (value !== undefined && !/^https:\/\//.test(value)) {
        errors.push(`checkout.embed.${key} must be an https:// URL (got '${value}')`)
      }
    }
    // allowedOrigin is compared against event.origin (scheme+host only) — a
    // path or trailing slash would never match and silently break the embed.
    if (embed.allowedOrigin !== undefined && /^https:\/\//.test(embed.allowedOrigin)) {
      try {
        if (new URL(embed.allowedOrigin).origin !== embed.allowedOrigin) {
          errors.push(`checkout.embed.allowedOrigin must be a bare origin, no path/slash (got '${embed.allowedOrigin}')`)
        }
      } catch {
        errors.push(`checkout.embed.allowedOrigin is not a valid URL ('${embed.allowedOrigin}')`)
      }
    }
  }

  return errors
}

function validateQuestion(
  s: QuestionScreen,
  index: number,
  questions: Map<QuestionId, { index: number; answerIds: Set<AnswerId> }>,
  errors: string[],
): void {
  // at least one answer
  if (!s.answers || s.answers.length === 0) {
    errors.push(`question '${s.id}' (${s.questionId}) has no answers`)
  }

  // duplicate answerIds
  const seen = new Set<AnswerId>()
  for (const a of s.answers ?? []) {
    if (seen.has(a.answerId)) {
      errors.push(`question '${s.id}' has duplicate answerId: '${a.answerId}'`)
    }
    seen.add(a.answerId)
  }

  // noneOfTheAbove must not collide with a real answerId
  if (s.noneOfTheAbove && seen.has(s.noneOfTheAbove.answerId)) {
    errors.push(
      `question '${s.id}' noneOfTheAbove.answerId '${s.noneOfTheAbove.answerId}' collides with a real answerId`,
    )
  }

  // conditional fields on the question itself
  checkConditional(s.prompt, index, s.id, 'prompt', questions, errors)
  // `reveal` is shown AFTER the user answers this same screen, so it may
  // reference this screen's OWN question (self-reference); allow same index.
  if (s.reveal) checkConditional(s.reveal, index, s.id, 'reveal', questions, errors, true)

  // cdp.acField must be a positive integer
  if (s.cdp && s.cdp.acField !== undefined) {
    const f = s.cdp.acField
    if (!Number.isInteger(f) || f <= 0) {
      errors.push(`question '${s.id}' has an invalid cdp.acField '${f}' (must be a positive integer)`)
    }
  }
}

function checkConditional(
  text: ConditionalText,
  usingIndex: number,
  screenId: string,
  field: string,
  questions: Map<QuestionId, { index: number; answerIds: Set<AnswerId> }>,
  errors: string[],
  allowSelf = false,
): void {
  if (typeof text === 'string') return

  if ('by' in text) {
    const info = questions.get(text.by)
    if (!info || (allowSelf ? info.index > usingIndex : info.index >= usingIndex)) {
      errors.push(
        `screen '${screenId}' ${field} references questionId '${text.by}' which is not defined by an earlier question`,
      )
      return
    }
    for (const answerId of Object.keys(text.cases)) {
      if (!info.answerIds.has(answerId)) {
        errors.push(
          `screen '${screenId}' ${field} 'by' cases reference unknown answerId '${answerId}' on question '${text.by}'`,
        )
      }
    }
    return
  }

  // set-logic rules
  text.rules.forEach((rule, i) => {
    checkSetCondition(rule.when, usingIndex, `screen '${screenId}' ${field} rules[${i}]`, questions, errors, allowSelf)
  })
}

function checkSetCondition(
  cond: AnswerSetCondition,
  usingIndex: number,
  context: string,
  questions: Map<QuestionId, { index: number; answerIds: Set<AnswerId> }>,
  errors: string[],
  allowSelf = false,
): void {
  const info = questions.get(cond.questionId)
  if (!info || (allowSelf ? info.index > usingIndex : info.index >= usingIndex)) {
    errors.push(`${context} references questionId '${cond.questionId}' which is not defined by an earlier question`)
    return
  }
  for (const answerId of [...(cond.containsAll ?? []), ...(cond.containsAny ?? [])]) {
    if (!info.answerIds.has(answerId)) {
      errors.push(`${context} references unknown answerId '${answerId}' on question '${cond.questionId}'`)
    }
  }
}
