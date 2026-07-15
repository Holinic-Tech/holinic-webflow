import { describe, it, expect } from 'vitest'
import golden from '../../docs/reference/golden-events.json'

/**
 * UNIVERSAL tracking-rules contract — invariants that hold for EVERY quiz in this
 * engine, regardless of content (the "standard event format/rules"). See
 * `docs/reference/tracking-contract.md` §"Event property rules — REBUILD CORRECTIONS".
 *
 * Division of labour:
 *  - `e2e/golden.spec.ts` proves the LIVE quiz emits exactly `golden-events.json`.
 *  - THIS test proves `golden-events.json` itself OBEYS the universal rules.
 * Together: the live quiz obeys the rules. So when a new quiz is created (or content
 * changes) and its golden is regenerated, this test fails LOUDLY if the regeneration
 * reintroduces any of the bugs we fixed — per-screen `Quiz Viewed`, a stale
 * `question_id`/`selected_answer` carried onto a pitch/result event, `selected_answer`
 * left as `[]` (which GTM won't clear), or a position that isn't the raw screen index.
 *
 * These rules are quiz-AGNOSTIC: they assert the SHAPE of every event, never specific
 * questions/answers/positions (those live in the golden + golden.spec.ts and change
 * per quiz). Keep this file identical across quizzes.
 */
interface GAEvent {
  channel: string
  event: string
  event_category?: string
  position?: number
  question_id?: unknown
  selected_answer?: unknown
}

// Only client-observable GA dataLayer events are governed by these rules; the cvg
// entries ($page_load, Completed Quiz) are relay/server concerns with no position.
const ga: GAEvent[] = golden.expectedEvents.filter((e: GAEvent) => e.channel === 'ga')

// Events that legitimately carry a `question_id`: the per-question answer event and
// the once-only lifecycle `Quiz Started` (which names the first question). Every
// OTHER event must RESET question_id to '' so GTM can't carry a prior screen's id.
const CARRIES_QUESTION_ID = new Set(['Question Answered', 'Quiz Started'])

describe('universal tracking rules — golden-events.json obeys the standard event format/rules', () => {
  it('has GA events to check', () => {
    expect(ga.length).toBeGreaterThan(0)
  })

  it('every GA event carries event_category "Quiz" and a numeric position', () => {
    for (const e of ga) {
      expect(e.event_category, e.event).toBe('Quiz')
      expect(typeof e.position, `${e.event} position`).toBe('number')
    }
  })

  it('Quiz Viewed fires EXACTLY ONCE, at position 0 (the landing event — never per-screen)', () => {
    const viewed = ga.filter((e) => e.event === 'Quiz Viewed')
    expect(viewed).toHaveLength(1)
    expect(viewed[0].position).toBe(0)
  })

  it('positions are non-decreasing — they track the raw screen index, so a later event never reports an earlier index', () => {
    const ps = ga.map((e) => e.position as number)
    for (let i = 1; i < ps.length; i++) {
      expect(ps[i], `${ga[i].event} (idx ${i}) position`).toBeGreaterThanOrEqual(ps[i - 1])
    }
  })

  it('selected_answer is the answer array ONLY on Question Answered; null (cleared, not []) on every other event', () => {
    for (const e of ga) {
      if (e.event === 'Question Answered') {
        expect(Array.isArray(e.selected_answer), `${e.event} selected_answer`).toBe(true)
        expect((e.selected_answer as unknown[]).length).toBeGreaterThan(0)
      } else {
        // null — NOT [] — so GTM overwrites/clears a prior event's array.
        expect(e.selected_answer, `${e.event} must clear selected_answer (null, not [])`).toBeNull()
      }
    }
  })

  it('question_id is set ONLY on Question Answered + Quiz Started; reset to "" everywhere else (no stale carry-over)', () => {
    for (const e of ga) {
      if (CARRIES_QUESTION_ID.has(e.event)) {
        expect(typeof e.question_id, `${e.event} question_id`).toBe('string')
        expect((e.question_id as string).length, `${e.event} question_id`).toBeGreaterThan(0)
      } else {
        expect(e.question_id, `${e.event} must reset question_id to ""`).toBe('')
      }
    }
  })
})
