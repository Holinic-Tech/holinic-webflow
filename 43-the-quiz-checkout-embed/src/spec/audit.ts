import type {
  QuizSpec,
  QuestionScreen,
  ConditionalText,
  AnswerSetCondition,
  AnswerId,
  QuestionId,
} from './types'
import type { AnswerState } from '../engine/answers'

/**
 * A QC/audit finding. Complements the hard `validateSpec` errors (broken refs,
 * forward references, duplicate ids) with softer, content-quality checks:
 * convention nits, missing user-facing fallbacks, unreachable / overlapping
 * conditional branches, reference/removal impact, and image sanity.
 *
 * `level` is the severity; `code` is a stable machine id (so the Studio & skills
 * can branch on it); `message` is human-readable; `location` points at the field
 * e.g. `screen 's_damage_pitch' › body`.
 */
export type AuditFinding = {
  level: 'error' | 'warn' | 'info'
  code: string
  message: string
  location?: string
}

const SEP = ' › '

// --- ID suggesters (pure, reusable by the Studio + skills) -------------------

/** 'Damage Pitch' -> 's_damage_pitch'. Lowercased, non-alnum -> '_', collapsed. */
export function suggestScreenId(label: string): string {
  const slug = label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
  return `s_${slug}`
}

/** 'Hair Shedding' -> 'hairShedding'. camelCase from word boundaries. */
export function suggestQuestionId(label: string): string {
  const words = label
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
  if (words.length === 0) return ''
  return words
    .map((w, i) => (i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join('')
}

/** ('concern','Hair loss') -> 'concern_hairloss'. Slug = lowercased alnum only. */
export function suggestAnswerId(prefix: string, label: string): string {
  const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, '')
  return `${prefix}_${slug}`
}

// --- ID conventions ----------------------------------------------------------

const SCREEN_ID_RE = /^s_[a-z0-9_]+$/
const QUESTION_ID_RE = /^[a-z][a-zA-Z0-9]*$/
const ANSWER_ID_RE = /^[a-z][a-zA-Z0-9]*_[a-z0-9+]+$/
const BARE_INT_RE = /^[0-9]+$/

function isValidAnswerId(id: AnswerId): boolean {
  return ANSWER_ID_RE.test(id) || BARE_INT_RE.test(id) || id === 'n/a'
}

/**
 * `error`/`id-convention` for any id that doesn't follow the house style:
 *  - screen id   `s_[a-z0-9_]+`
 *  - questionId  camelCase `[a-z][a-zA-Z0-9]*`
 *  - answerId    `prefix_slug` OR a bare integer (ratings) OR `n/a` (sentinel)
 */
export function checkIdConventions(spec: QuizSpec): AuditFinding[] {
  const out: AuditFinding[] = []
  for (const s of spec.screens) {
    if (!SCREEN_ID_RE.test(s.id)) {
      out.push({
        level: 'error',
        code: 'id-convention',
        message: `screen id '${s.id}' does not match ^s_[a-z0-9_]+$`,
        location: `screen '${s.id}'`,
      })
    }
    if (s.kind === 'question') {
      if (!QUESTION_ID_RE.test(s.questionId)) {
        out.push({
          level: 'error',
          code: 'id-convention',
          message: `questionId '${s.questionId}' is not camelCase ^[a-z][a-zA-Z0-9]*$`,
          location: `screen '${s.id}'${SEP}questionId`,
        })
      }
      for (const a of s.answers) {
        if (!isValidAnswerId(a.answerId)) {
          out.push({
            level: 'error',
            code: 'id-convention',
            message: `answerId '${a.answerId}' is not prefix_slug, a bare integer, or 'n/a'`,
            location: `screen '${s.id}'${SEP}answers`,
          })
        }
      }
    }
  }
  return out
}

// --- quiz-id prefix guard ----------------------------------------------------

/**
 * Derive the forbidden id-prefix from a quiz folder slug. question/answer ids are
 * SHARED VOCABULARY across all quiz versions and must NEVER carry the quiz
 * identifier. We compute what that identifier's prefix WOULD look like so we can
 * detect (and reject) it.
 *
 *  - strip a trailing `-v<number>` (the version suffix): `long-hair-v1` -> `long-hair`.
 *  - MULTI-word slug (hyphen/underscore separated) -> initials of each word:
 *    `long-hair` -> `lh`, `hair-care` -> `hc`.
 *  - SINGLE-word slug -> the whole word: `haircare` -> `haircare`.
 *  - lowercased throughout.
 */
export function deriveQuizPrefix(quizSlug: string): string {
  const base = quizSlug.toLowerCase().replace(/-v\d+$/, '')
  const words = base.split(/[-_]+/).filter(Boolean)
  if (words.length === 0) return ''
  if (words.length === 1) return words[0]
  return words.map(w => w.charAt(0)).join('')
}

/**
 * `error`/`quiz-id-prefix`: any questionId matching `^<prefix>[A-Z]` or any
 * answerId matching `^<prefix>_` carries the quiz identifier and is REJECTED.
 * ids are shared vocabulary keyed-on by tracking/CDP/FB-audiences; embedding the
 * quiz name fragments them. The quiz is distinguished ONLY by a `quizId` on the
 * Quiz Viewed event, never by its ids.
 */
export function checkQuizPrefix(spec: QuizSpec, quizSlug: string): AuditFinding[] {
  const out: AuditFinding[] = []
  const prefix = deriveQuizPrefix(quizSlug)
  if (!prefix) return out
  const qRe = new RegExp(`^${prefix}[A-Z]`)
  const aRe = new RegExp(`^${prefix}_`)
  const deprefixQuestion = (id: string) =>
    id.charAt(prefix.length).toLowerCase() + id.slice(prefix.length + 1)
  for (const s of spec.screens) {
    if (s.kind !== 'question') continue
    if (qRe.test(s.questionId)) {
      out.push({
        level: 'error',
        code: 'quiz-id-prefix',
        message: `questionId '${s.questionId}' carries the quiz-id prefix '${prefix}' — ids must never include the quiz identifier; use '${deprefixQuestion(s.questionId)}'`,
        location: `screen '${s.id}'${SEP}questionId`,
      })
    }
    for (const a of s.answers) {
      if (aRe.test(a.answerId)) {
        out.push({
          level: 'error',
          code: 'quiz-id-prefix',
          message: `answerId '${a.answerId}' carries the quiz-id prefix '${prefix}' — ids must never include the quiz identifier; use '${a.answerId.slice(prefix.length + 1)}'`,
          location: `screen '${s.id}'${SEP}answers`,
        })
      }
    }
    if (s.noneOfTheAbove && aRe.test(s.noneOfTheAbove.answerId)) {
      out.push({
        level: 'error',
        code: 'quiz-id-prefix',
        message: `answerId '${s.noneOfTheAbove.answerId}' carries the quiz-id prefix '${prefix}' — ids must never include the quiz identifier; use '${s.noneOfTheAbove.answerId.slice(prefix.length + 1)}'`,
        location: `screen '${s.id}'${SEP}noneOfTheAbove`,
      })
    }
  }
  return out
}

// --- conditional-field traversal ---------------------------------------------

/** One ConditionalText-bearing field located in the spec, with a display path. */
interface ConditionalField {
  text: ConditionalText
  location: string
}

/**
 * Collect every ConditionalText-bearing field across all screens: question
 * prompt/subtitle/beforeTitle/reveal; pitch headline/body and its text/image/
 * carousel blocks; email headline/concernLine. (2D-matrix blocks carry only
 * questionId refs, not ConditionalText — handled separately by findReferences.)
 */
function conditionalFields(spec: QuizSpec): ConditionalField[] {
  const out: ConditionalField[] = []
  const add = (text: ConditionalText | undefined, screenId: string, field: string) => {
    if (text !== undefined) out.push({ text, location: `screen '${screenId}'${SEP}${field}` })
  }
  for (const s of spec.screens) {
    if (s.kind === 'question') {
      add(s.prompt, s.id, 'prompt')
      add(s.subtitle, s.id, 'subtitle')
      add(s.beforeTitle, s.id, 'beforeTitle')
      add(s.reveal, s.id, 'reveal')
    } else if (s.kind === 'pitch') {
      add(s.headline, s.id, 'headline')
      add(s.body, s.id, 'body')
      s.blocks?.forEach((b, i) => {
        if (b.kind === 'text') add(b.text, s.id, `blocks[${i}].text`)
        else if (b.kind === 'image') add(b.src, s.id, `blocks[${i}].src`)
        else if (b.kind === 'carousel')
          b.images.forEach((img, j) => add(img, s.id, `blocks[${i}].images[${j}]`))
      })
    } else if (s.kind === 'email') {
      add(s.headline, s.id, 'headline')
      add(s.concernLine, s.id, 'concernLine')
    }
  }
  return out
}

// --- missing fallback --------------------------------------------------------

/**
 * `error`/`missing-fallback`: every `by`/`cases` or `rules` ConditionalText must
 * carry a non-empty (trimmed) `default`. Hard rule: no user may ever see missing
 * text, so an empty default is a shipping blocker.
 */
function checkMissingFallback(spec: QuizSpec): AuditFinding[] {
  const out: AuditFinding[] = []
  for (const { text, location } of conditionalFields(spec)) {
    if (typeof text === 'string') continue
    if (!text.default || text.default.trim() === '') {
      out.push({
        level: 'error',
        code: 'missing-fallback',
        message: `conditional has an empty default — a user could see missing text`,
        location,
      })
    }
  }
  return out
}

// --- duplicate questionId ----------------------------------------------------

function checkDuplicateQuestionIds(spec: QuizSpec): AuditFinding[] {
  const out: AuditFinding[] = []
  const seen = new Map<QuestionId, string>()
  for (const s of spec.screens) {
    if (s.kind !== 'question') continue
    const prev = seen.get(s.questionId)
    if (prev) {
      out.push({
        level: 'error',
        code: 'dup-question-id',
        message: `questionId '${s.questionId}' is used by both screen '${prev}' and '${s.id}'`,
        location: `screen '${s.id}'${SEP}questionId`,
      })
    } else {
      seen.set(s.questionId, s.id)
    }
  }
  return out
}

// --- coverage / overlap / dead rules -----------------------------------------

/** Reuse the engine's exact AnswerSetCondition semantics (conditions.ts). */
function matches(cond: AnswerSetCondition, answers: AnswerState): boolean {
  const picked = answers[cond.questionId] ?? []
  if (cond.containsAll && !cond.containsAll.every(a => picked.includes(a))) return false
  if (cond.containsAny && !cond.containsAny.some(a => picked.includes(a))) return false
  return Boolean(cond.containsAll || cond.containsAny)
}

interface QuestionInfo {
  type: QuestionScreen['type']
  answerIds: AnswerId[]
}

function indexQuestions(spec: QuizSpec): Map<QuestionId, QuestionInfo> {
  const m = new Map<QuestionId, QuestionInfo>()
  for (const s of spec.screens) {
    if (s.kind === 'question') {
      m.set(s.questionId, { type: s.type, answerIds: s.answers.map(a => a.answerId) })
    }
  }
  return m
}

/** Enumerate candidate picked-sets for a question. */
function candidateSets(info: QuestionInfo): AnswerId[][] {
  const single = info.type !== 'multi'
  if (single) return info.answerIds.map(a => [a])
  // multi-select -> all non-empty subsets
  const sets: AnswerId[][] = []
  const n = info.answerIds.length
  for (let mask = 1; mask < 1 << n; mask++) {
    const set: AnswerId[] = []
    for (let i = 0; i < n; i++) if (mask & (1 << i)) set.push(info.answerIds[i])
    sets.push(set)
  }
  return sets
}

/** The questionId a conditional keys on (`by` form or first rule's `when`). */
function conditionalKeyQuestion(text: ConditionalText): QuestionId | undefined {
  if (typeof text === 'string') return undefined
  if ('by' in text) return text.by
  return text.rules[0]?.when.questionId
}

/**
 * Coverage / overlap / dead-rule analysis via candidate-set enumeration:
 *  - `info`/`default-coverage`   — answer combos that fall through to `default`.
 *  - `warn`/`dead-branch`        — a rule/case that NEVER fires (unreachable).
 *  - `warn`/`branch-overlap`     — a candidate set satisfies >1 rule's `when`.
 *  - `info`/`coverage-skipped`   — multi-select with >10 answers (enumeration
 *                                   would explode), so it is skipped.
 *
 * `by`+`cases` keys that aren't valid answerIds are left to `validateSpec`
 * (`unknown-case`) — not duplicated here.
 */
export function conditionalBranches(spec: QuizSpec): AuditFinding[] {
  const out: AuditFinding[] = []
  const questions = indexQuestions(spec)

  for (const { text, location } of conditionalFields(spec)) {
    if (typeof text === 'string') continue
    const qid = conditionalKeyQuestion(text)
    if (!qid) continue
    const info = questions.get(qid)
    if (!info) continue // unknown question — validate handles this

    if ('by' in text) {
      analyzeByCases(text, info, location, out)
    } else {
      analyzeRules(text, info, location, out)
    }
  }
  return out
}

function analyzeByCases(
  text: { by: QuestionId; cases: Record<AnswerId, string>; default: string },
  info: QuestionInfo,
  location: string,
  out: AuditFinding[],
): void {
  // `by`/`cases` is single-answer keyed (engine reads answers[by][0]).
  const uncovered: AnswerId[] = []
  for (const answerId of info.answerIds) {
    if (!(answerId in text.cases)) uncovered.push(answerId)
  }
  if (uncovered.length > 0) {
    out.push({
      level: 'info',
      code: 'default-coverage',
      message: `answer(s) [${uncovered.join(', ')}] of '${text.by}' fall through to the default`,
      location,
    })
  }
  // A case key not in the question's answerIds can never fire (dead).
  for (const key of Object.keys(text.cases)) {
    if (!info.answerIds.includes(key)) {
      out.push({
        level: 'warn',
        code: 'dead-branch',
        message: `case '${key}' is not an answer of '${text.by}' and can never fire`,
        location,
      })
    }
  }
}

function analyzeRules(
  text: { rules: Array<{ when: AnswerSetCondition; text: string }>; default: string },
  info: QuestionInfo,
  location: string,
  out: AuditFinding[],
): void {
  // Multi-select with too many answers -> enumeration would explode; skip.
  if (info.type === 'multi' && info.answerIds.length > 10) {
    out.push({
      level: 'info',
      code: 'coverage-skipped',
      message: `multi-select '${info.answerIds.length}' answers > 10 — coverage enumeration skipped`,
      location,
    })
    return
  }

  const sets = candidateSets(info)
  const keyQid = text.rules[0]?.when.questionId
  const fired = new Array(text.rules.length).fill(false)
  let overlapFlagged = false
  const fellToDefault: string[] = []

  for (const set of sets) {
    const state: AnswerState = keyQid ? { [keyQid]: set } : {}
    // also expose the set under each rule's own questionId in case rules key
    // on different questions (rare, but matches() reads per-rule questionId).
    let winner = -1
    let matchCount = 0
    text.rules.forEach((rule, i) => {
      // Build a state keyed on THIS rule's questionId for an accurate match.
      const ruleState: AnswerState = { ...state, [rule.when.questionId]: set }
      if (matches(rule.when, ruleState)) {
        matchCount++
        if (winner === -1) winner = i
      }
    })
    if (winner === -1) {
      fellToDefault.push(`[${set.join('+')}]`)
    } else {
      fired[winner] = true
      if (matchCount > 1 && !overlapFlagged) {
        overlapFlagged = true
        out.push({
          level: 'warn',
          code: 'branch-overlap',
          message: `answer combo [${set.join('+')}] satisfies more than one rule's 'when' (first wins) — confirm the intended priority`,
          location,
        })
      }
    }
  }

  text.rules.forEach((_rule, i) => {
    if (!fired[i]) {
      out.push({
        level: 'warn',
        code: 'dead-branch',
        message: `rules[${i}] never fires for any answer combination (unreachable given rule order)`,
        location,
      })
    }
  })

  if (fellToDefault.length > 0) {
    out.push({
      level: 'info',
      code: 'default-coverage',
      message: `answer combo(s) ${fellToDefault.join(', ')} fall through to the default`,
      location,
    })
  }
}

// --- reference finder --------------------------------------------------------

export type ReferenceKind =
  | 'conditional-by'
  | 'conditional-case'
  | 'conditional-rule'
  | 'cdp'
  | 'coupon-rule'
  | 'event-enrichment'
  | 'matrix-block'
  | 'answer'

export interface Reference {
  location: string
  kind: ReferenceKind
}

/**
 * Every place a questionId (and optionally a specific answerId) is referenced:
 * conditionals (`by`, `cases` keys, `rules[].when` questionId/containsAny/
 * containsAll) across all fields incl. pitch blocks; the 2D-matrix block
 * question refs; the question's own `cdp`; `checkout.couponRules`;
 * `eventEnrichment`; and the answer within its own question's `answers`.
 */
export function findReferences(
  spec: QuizSpec,
  target: { questionId: QuestionId; answerId?: AnswerId },
): Reference[] {
  const { questionId, answerId } = target
  const refs: Reference[] = []

  // -- conditional fields (by/cases/rules) across all screens ---
  for (const { text, location } of conditionalFields(spec)) {
    if (typeof text === 'string') continue
    if ('by' in text) {
      if (text.by === questionId) {
        if (!answerId) {
          refs.push({ location, kind: 'conditional-by' })
        } else if (answerId in text.cases) {
          refs.push({ location, kind: 'conditional-case' })
        }
      }
    } else {
      text.rules.forEach((rule, i) => {
        if (rule.when.questionId !== questionId) return
        const ids = [...(rule.when.containsAll ?? []), ...(rule.when.containsAny ?? [])]
        if (!answerId) {
          refs.push({ location: `${location} rules[${i}]`, kind: 'conditional-rule' })
        } else if (ids.includes(answerId)) {
          refs.push({ location: `${location} rules[${i}]`, kind: 'conditional-rule' })
        }
      })
    }
  }

  // -- 2D-matrix blocks (claim / damageImage / damageBody) — questionId refs ---
  if (!answerId) {
    for (const s of spec.screens) {
      if (s.kind !== 'pitch') continue
      s.blocks?.forEach((b, i) => {
        const qids: QuestionId[] = []
        if (b.kind === 'claim') qids.push(b.routineQuestionId, b.concernQuestionId)
        else if (b.kind === 'damageImage' || b.kind === 'damageBody')
          qids.push(b.concernQuestionId, b.ageQuestionId)
        if (qids.includes(questionId)) {
          refs.push({ location: `screen '${s.id}'${SEP}blocks[${i}] (${b.kind})`, kind: 'matrix-block' })
        }
      })
    }
  }

  // -- the question's own cdp + the answer within its own answers ---
  for (const s of spec.screens) {
    if (s.kind !== 'question' || s.questionId !== questionId) continue
    if (s.cdp && !answerId) {
      refs.push({ location: `screen '${s.id}'${SEP}cdp`, kind: 'cdp' })
    }
    if (answerId) {
      if (s.answers.some(a => a.answerId === answerId)) {
        refs.push({ location: `screen '${s.id}'${SEP}answers`, kind: 'answer' })
      }
      if (s.noneOfTheAbove?.answerId === answerId) {
        refs.push({ location: `screen '${s.id}'${SEP}noneOfTheAbove`, kind: 'answer' })
      }
    }
  }

  // -- checkout coupon rules ---
  spec.checkout.couponRules.forEach((rule, i) => {
    if (rule.when.questionId !== questionId) return
    const ids = [...(rule.when.containsAll ?? []), ...(rule.when.containsAny ?? [])]
    if (!answerId || ids.includes(answerId)) {
      refs.push({ location: `checkout.couponRules[${i}]`, kind: 'coupon-rule' })
    }
  })

  // -- eventEnrichment (questionId-level only) ---
  if (!answerId && spec.eventEnrichment?.includes(questionId)) {
    refs.push({ location: 'eventEnrichment', kind: 'event-enrichment' })
  }

  return refs
}

// --- removal impact ----------------------------------------------------------

/**
 * `error`-level findings describing what would break if a question (or specific
 * answer) were removed — so a skill can show the blast radius BEFORE deleting.
 * Empty array means it is safe to remove.
 *
 * The answer's own `answers` entry (and its `cdp` for a question) are the thing
 * being removed, so they are not counted as breakage.
 */
export function auditRemoval(
  spec: QuizSpec,
  target: { questionId?: QuestionId; answerId?: AnswerId },
): AuditFinding[] {
  const { questionId, answerId } = target
  if (!questionId) return []

  const refs = findReferences(spec, { questionId, answerId })
  const subject = answerId ? `answer '${answerId}' (of '${questionId}')` : `question '${questionId}'`

  const breaking = refs.filter(r => {
    // Removing the question removes its own cdp + answers too — not "breakage".
    if (!answerId && (r.kind === 'cdp')) return false
    // Removing an answer removes its own `answers`/noneOfTheAbove entry.
    if (answerId && r.kind === 'answer') return false
    return true
  })

  return breaking.map(r => ({
    level: 'error' as const,
    code: 'removal-impact',
    message: `removing ${subject} would break a ${r.kind} reference`,
    location: r.location,
  }))
}

// --- image sanity ------------------------------------------------------------

const RESIZABLE_HOSTS = new Set(['assets.hairqare.co', 'pub.hairqare.co'])

/** One image URL located in the spec, with a display path. */
export interface SpecImage {
  url: string
  location: string
}

/** Collect every image URL referenced anywhere in the spec. */
export function collectImages(spec: QuizSpec): SpecImage[] {
  const out: SpecImage[] = []
  const add = (url: string | undefined, location: string) => {
    if (url) out.push({ url, location })
  }
  for (const s of spec.screens) {
    if (s.kind === 'question') {
      if (s.cover) {
        add(s.cover.backgroundUrl, `screen '${s.id}'${SEP}cover.backgroundUrl`)
        add(s.cover.logoUrl, `screen '${s.id}'${SEP}cover.logoUrl`)
      }
      s.answers.forEach(a => add(a.imageUrl, `screen '${s.id}'${SEP}answers '${a.answerId}'.imageUrl`))
    } else if (s.kind === 'pitch') {
      add(s.imageUrl, `screen '${s.id}'${SEP}imageUrl`)
      s.blocks?.forEach((b, i) => {
        if (b.kind === 'checkItems') add(b.icon, `screen '${s.id}'${SEP}blocks[${i}].icon`)
        // image/carousel block srcs are ConditionalText (may resolve per-answer)
        // — collect the static-string forms only (dynamic URLs vary by answer).
        else if (b.kind === 'image' && typeof b.src === 'string')
          add(b.src, `screen '${s.id}'${SEP}blocks[${i}].src`)
        else if (b.kind === 'carousel')
          b.images.forEach((img, j) => {
            if (typeof img === 'string') add(img, `screen '${s.id}'${SEP}blocks[${i}].images[${j}]`)
          })
      })
    } else if (s.kind === 'loading') {
      s.carouselImages?.forEach((url, i) => add(url, `screen '${s.id}'${SEP}carouselImages[${i}]`))
    }
  }
  return out
}

function hostOf(url: string): string | undefined {
  try {
    return new URL(url).host
  } catch {
    return undefined
  }
}

/**
 * `error`/`bad-image-url` for non-https URLs; `info`/`image-not-resizable` for
 * https URLs NOT on assets.hairqare.co / pub.hairqare.co (no Cloudflare
 * auto-resize). No network access here.
 */
export function checkImages(spec: QuizSpec): AuditFinding[] {
  const out: AuditFinding[] = []
  for (const { url, location } of collectImages(spec)) {
    if (!url.startsWith('https://')) {
      out.push({
        level: 'error',
        code: 'bad-image-url',
        message: `image URL is not https: '${url}'`,
        location,
      })
      continue
    }
    const host = hostOf(url)
    if (!host || !RESIZABLE_HOSTS.has(host)) {
      out.push({
        level: 'info',
        code: 'image-not-resizable',
        message: `image host '${host ?? '?'}' is not a Cloudflare-resizing host (assets/pub.hairqare.co)`,
        location,
      })
    }
  }
  return out
}

// --- top-level audit ---------------------------------------------------------

/**
 * Run all DETERMINISTIC audit checks (no network). Complements `validateSpec`:
 * convention nits, missing fallbacks, branch coverage/overlap/dead rules,
 * duplicate questionIds, and image sanity.
 */
export function auditSpec(spec: QuizSpec, opts?: { quizSlug?: string }): AuditFinding[] {
  return [
    ...checkIdConventions(spec),
    ...(opts?.quizSlug ? checkQuizPrefix(spec, opts.quizSlug) : []),
    ...checkDuplicateQuestionIds(spec),
    ...checkMissingFallback(spec),
    ...conditionalBranches(spec),
    ...checkImages(spec),
  ]
}
