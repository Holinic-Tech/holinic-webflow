import { test, expect } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

interface GAEvent {
  event: string
  event_category?: string
  position?: number
  selected_answer?: unknown
  question_id?: string
  question?: string
  [k: string]: unknown
}

interface GoldenEvent extends GAEvent {
  channel: 'ga' | 'cvg'
  _note?: string
}

interface Golden {
  expectedEvents: GoldenEvent[]
}

/**
 * Phase 3 Task 7 — the full tracking-parity e2e gate.
 *
 * Walk the REAL quiz (`hairquizSpec`, 19 screens, long-hair-v1 flow) along the canonical happy
 * path in a real browser and assert the captured GA `window.dataLayer` event
 * sequence matches the Phase-0 contract fixture `docs/reference/golden-events.json`
 * (the precise source of truth — channel:'ga' events, in order). That sequence
 * INCLUDES the GA lifecycle events `Quiz Started` (once, after the first
 * `Quiz Viewed`, immediately before the first `Question Answered`) and
 * `Quiz Completed` (on the email-screen view, immediately before
 * `Quiz Submitted`) — GTM relays both to Converge, so they must not be dropped.
 *
 * Side-effects are stubbed so no real lead is created: the submission webhook
 * (`**\/quiz/submit`) is fulfilled with `{}` and Converge's `window.trackEvent`
 * is no-op'd via an init script. Only GA dataLayer pushes are observed; the
 * `channel:'cvg'` golden entries ($page_load, Completed Quiz) are server/relay
 * concerns and are filtered out here.
 *
 * We dedupe *consecutive identical* events because React StrictMode in dev
 * double-invokes mount effects (firing `viewed()` twice). That is a dev-only
 * artifact, not part of the analytics contract — the contract is that a view
 * fires once per screen, which the dedupe preserves.
 */

// Resolve the golden contract (source of truth) and split it into the in-walk
// GA sequence (everything captured during the walk) and the post-CTA checkout
// event (fires on the dashboard CTA tap, AFTER results render).
const golden: Golden = JSON.parse(
  readFileSync(
    fileURLToPath(new URL('../docs/reference/golden-events.json', import.meta.url)),
    'utf-8',
  ),
)
const gaEvents = golden.expectedEvents.filter((e) => e.channel === 'ga')
const CHECKOUT_EVENT = 'Go to  checkout' // TWO spaces — load-bearing, do not "fix"
// The in-walk captured sequence is every GA event except the final checkout
// event (which fires only after the results page renders, on the CTA tap).
const expectedWalk: GAEvent[] = gaEvents.filter((e) => e.event !== CHECKOUT_EVENT)

function dedupeConsecutive(events: GAEvent[]): GAEvent[] {
  return events.filter((e, i) => {
    if (i === 0) return true
    const prev = events[i - 1]
    return !(prev.event === e.event && prev.position === e.position)
  })
}

// Mobile viewport for the no-scroll invariant (390x844, the target device).
test.use({ viewport: { width: 390, height: 844 } })

async function expectNoScroll(page: import('@playwright/test').Page) {
  const fits = await page.evaluate(
    () => document.scrollingElement!.scrollHeight <= document.scrollingElement!.clientHeight,
  )
  expect(fits).toBe(true)
}

function readEvents(page: import('@playwright/test').Page): Promise<GAEvent[]> {
  return page.evaluate(() => (window as unknown as { __events: GAEvent[] }).__events || [])
}

/**
 * The canonical happy-path walk of the REAL spec, screen by screen (idx 0-19).
 * Each step names the visible answer label to click; pitch/multi/email steps
 * use their advance control. Single/image/rating auto-advance on tap; multi
 * needs ≥1 selection + Continue; pitches need Continue; loading auto-advances.
 */
const ANSWER_LABELS: Record<string, string> = {
  hairDream: 'Longer hair',
  hairType: 'Straight',
  age: '18 - 29',
  hairConcern: 'Hair loss or hair thinning',
  currentRoutine: '🫧 Basic care',
  hairqare: "I'm hearing about it for the first time",
  shampooSpending: 'Less than $10',
  hairMyth: 'Rosemary oil is reduces hair loss',
  hairDamageActivity: 'Heat styling',
  confidence: '3',
  comparison: '3',
  professionalReferral: 'No',
}

test('real-spec walkthrough emits the golden GA event sequence', async ({ page }) => {
  // 1) STUB so nothing real leaves the browser.
  await page.route('**/quiz/submit', (r) => r.fulfill({ status: 200, body: '{}' }))
  // The dashboard CTA does `window.location.href = <checkout url>`. Aborting the
  // checkout navigation keeps the document (and window.__events) intact so we can
  // assert the GA event fired synchronously before the redirect.
  await page.route('**://checkout.hairqare.co/**', (r) => r.abort())

  await page.addInitScript(() => {
    const w = window as unknown as {
      __events: unknown[]
      dataLayer: unknown[]
      trackEvent: (...args: unknown[]) => void
    }
    w.__events = []
    w.trackEvent = () => {} // no-op Converge so it never hits the network
    w.dataLayer = new Proxy([] as unknown[], {
      set(target, prop, value, receiver) {
        if (prop !== 'length' && value && typeof value === 'object') {
          w.__events.push(value)
          // Also mirror each event to the console. The dashboard CTA does
          // `window.location.href = <checkout url>`, which tears down the JS world
          // (even when the request is route-aborted) and wipes `window.__events`.
          // Console messages survive that, so we read the checkout event from here.
          // eslint-disable-next-line no-console
          console.log('__GA__' + JSON.stringify(value))
        }
        return Reflect.set(target, prop, value, receiver)
      },
    })
  })

  // Collect mirrored GA events from the console (survives the CTA navigation).
  const consoleEvents: GAEvent[] = []
  page.on('console', (msg) => {
    const text = msg.text()
    if (text.startsWith('__GA__')) {
      try {
        consoleEvents.push(JSON.parse(text.slice('__GA__'.length)))
      } catch {
        /* ignore non-JSON */
      }
    }
  })

  // Reduced motion: instant advance (no register-then-advance delay), paused
  // carousels, final-state framer transitions — keeps the GA-sequence walk
  // deterministic regardless of the new UI animations.
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.addInitScript(() => { Object.assign(window, { __quizPauseCarousels__: true }) })

  await page.goto('/')

  const clickButton = (name: string) =>
    page.getByRole('button', { name, exact: true }).first().click()

  // 2) Walk the REAL quiz along the canonical happy path.

  // idx 0 s_goal — COVER dream cards (records hairDream; fires Quiz Started + Question Answered at position 0)
  await clickButton(ANSWER_LABELS.hairDream)
  // idx 1 s_hairtype (image, auto)
  await clickButton(ANSWER_LABELS.hairType)
  // idx 2 s_age (image, auto)
  await clickButton(ANSWER_LABELS.age)
  // idx 3 s_concern (image, auto) — the canonical concern (was idx 4 in /40)
  await clickButton(ANSWER_LABELS.hairConcern)
  // idx 4 s_routine (single, auto) — was idx 5 in /40
  await clickButton(ANSWER_LABELS.currentRoutine)
  // idx 5 Damage Pitch (pitch, Continue) — was idx 6 in /40
  await expectNoScroll(page)
  await clickButton('Continue')
  // idx 7 s_hairqare (image, auto)
  await clickButton(ANSWER_LABELS.hairqare)
  // idx 8 Holistic Pitch (pitch, Continue)
  await expectNoScroll(page)
  await clickButton('Continue')
  // idx 9 s_spend (single + cta reveal): tap an answer to reveal the
  // per-answer block + Continue, then click Continue to advance (fires the one
  // Question Answered for this screen).
  await clickButton(ANSWER_LABELS.shampooSpending)
  await clickButton('Continue')
  // idx 10 s_myths (multi, select ≥1 + Continue)
  await clickButton(ANSWER_LABELS.hairMyth)
  await expectNoScroll(page)
  await clickButton('Continue')
  // idx 11 s_damage_activity (multi, select ≥1 + Continue)
  await clickButton(ANSWER_LABELS.hairDamageActivity)
  await clickButton('Continue')
  // idx 12 Damage Practices Pitch (pitch, Continue)
  await expectNoScroll(page)
  await clickButton('Continue')
  // idx 13 s_confidence (rating, auto)
  await clickButton(ANSWER_LABELS.confidence)
  // idx 14 s_comparison (rating, auto)
  await clickButton(ANSWER_LABELS.comparison)
  // idx 15 s_professional (single, auto)
  await clickButton(ANSWER_LABELS.professionalReferral)
  // idx 16 s_loading (auto-advances after its timer) -> idx 17 email.

  // idx 18 email: fill a valid name + email and submit (webhook stubbed) -> result.
  // The Submit button lives INSIDE the gradient card (no sticky bottom CTA here).
  await page.getByLabel('Name').fill('Test Tester')
  await page.getByLabel('Email').fill('test@example.com')
  await page.getByRole('button', { name: 'Submit', exact: true }).click()

  // idx 19 result: wait for `Viewed Results Page` to fire.
  await expect
    .poll(async () =>
      page.evaluate(
        () =>
          (window as unknown as { __events: GAEvent[] }).__events.filter(
            (e) => e.event === 'Viewed Results Page',
          ).length,
      ),
    )
    .toBeGreaterThanOrEqual(1)

  // 3) Assert the captured in-walk GA sequence equals the golden contract.
  const captured = dedupeConsecutive(await readEvents(page))

  // 3a) The GA `event` name sequence equals the golden sequence.
  const names = captured.map((e) => e.event)
  expect(names).toEqual(expectedWalk.map((e) => e.event))

  // 3b) Every golden contract param matches the captured payload, param-for-param.
  //     Strip the golden-only `channel`/`_note` keys first. We assert the golden
  //     keys as a SUBSET (`toMatchObject`) rather than a strict full-object equal,
  //     because answer-bearing events now also carry ADDITIVE FB-targeting
  //     enrichment keys (`spec.eventEnrichment`: hairConcern/age/hairGoal — keyed
  //     by questionId) that are NOT part of the byte-for-byte contract. Fidelity is
  //     preserved: every contract key/value still has to match exactly, and the
  //     `event` name sequence above is still a strict equal — enrichment only adds
  //     NEW keys, it never alters or removes a contract param.
  const expectedPayloads = expectedWalk.map(({ channel, _note, ...rest }) => {
    void channel
    void _note
    return rest
  })
  expect(captured).toHaveLength(expectedPayloads.length)
  expectedPayloads.forEach((expected, i) => {
    expect(captured[i]).toMatchObject(expected)
  })

  // 3c) The hairConcern `Question Answered` carries the canonical concern.
  const concernAnswered = captured.find(
    (e) => e.event === 'Question Answered' && e.question_id === 'hairConcern',
  )!
  expect(concernAnswered).toMatchObject({ event_category: 'Quiz' })
  expect(concernAnswered.selected_answer).toEqual(['concern_hairloss'])

  // 3d) The result page fired `Viewed Results Page`.
  expect(names).toContain('Viewed Results Page')

  // 4) Click the dashboard CTA -> the TWO-space `Go to  checkout` fires.
  //    The result screen is the ONE scrollable screen, so do NOT assert no-scroll.
  // The GA event pushes synchronously BEFORE the redirect; we read it from the
  // mirrored console stream (the redirect tears down `window.__events`).
  await page.getByRole('button', { name: 'JOIN THE CHALLENGE', exact: true }).first().click()

  await expect
    .poll(() => consoleEvents.filter((e) => e.event === CHECKOUT_EVENT).length)
    .toBeGreaterThanOrEqual(1)

  const checkoutEvent = consoleEvents.find((e) => e.event === CHECKOUT_EVENT)!
  expect(checkoutEvent).toMatchObject({ event: 'Go to  checkout', event_category: 'Quiz' })
})
