import { test, expect, type Page } from '@playwright/test'
import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

/**
 * Phase 3 Task 8 — visual / content PARITY gate for the REAL quiz, screens 0-18
 * (plus a structural check of the dashboard / result, idx 19).
 *
 * IMPORTANT — what this does and does NOT do:
 *  - The golden PNGs under `docs/reference/golden/*.png` are screenshots of the
 *    LIVE FLUTTER quiz, a DIFFERENT renderer (fonts, layout, scaling differ).
 *    Pixel-diffing the React app against them would ALWAYS fail, so we DO NOT.
 *  - Instead the automated gate is CONTENT/DOM (the meaningful regression catch)
 *    plus the NO-SCROLL invariant (the genuine visual rule from CLAUDE.md), with
 *    Playwright OWN-baseline snapshots guarding future React-side changes, and a
 *    human-review folder of React captures for eyeballing against the Flutter PNGs.
 *
 * Per screen (idx 0-18, canonical happy path):
 *  1. CONTENT — assert the expected prompt / sub-instruction text and the expected
 *     answer-option labels are present (catches copy regressions meaningfully).
 *  2. NO-SCROLL — assert `scrollingElement.scrollHeight <= clientHeight` (the
 *     fit-to-viewport invariant); the result screen is the ONE exception.
 *  3. OWN-BASELINE — `toHaveScreenshot('NN-<id>.png')` to establish the REACT app's
 *     own snapshot baseline (NOT compared to the Flutter PNGs).
 *  4. HUMAN-REVIEW — also save each capture to `e2e/review/NN-<id>.react.png` so a
 *     human can compare it side-by-side with `docs/reference/golden/NN-*.png`.
 *
 * Side-effects are stubbed (webhook fulfilled `{}`, Converge `trackEvent` no-op,
 * checkout navigation aborted) so no real lead is ever created.
 */

// Mobile target device — the 390x844 viewport the quiz is designed for.
test.use({ viewport: { width: 390, height: 844 } })

const REVIEW_DIR = fileURLToPath(new URL('./review', import.meta.url))

/** The rating sub-instruction (template subQuestion) shared by idx 14 & 15. */
const RATING_SUBINSTRUCTION = 'How much do you relate to the following statement?'

/**
 * One descriptor per screen along the canonical happy path. `kind` tells the walk
 * how to advance:
 *   - 'auto'  : single/image/rating — tap an option auto-advances.
 *   - 'cta'   : multi/reveal — tap option(s) then click Continue.
 *   - 'pitch' : interstitial — click Continue.
 *   - 'loading': transient — auto-advances after its timer.
 *   - 'email' : fill name+email then Continue.
 * `texts` = strings that MUST be visible on that screen (prompt + sub-instruction).
 * `options` = answer-option labels that MUST be present.
 * `pick` = the option label to click to walk the canonical path (for auto/cta).
 */
interface ScreenDesc {
  idx: number
  file: string // NN-<id> for snapshot + review file naming
  kind: 'auto' | 'cta' | 'pitch' | 'loading' | 'email'
  texts: string[]
  options: string[]
  pick?: string
}

const SCREENS: ScreenDesc[] = [
  {
    // idx 0 — COVER dream cards: illustrated options replace the old 'Start' CTA.
    // The intro text stack is: orange subhead chip → headline → forcing cue → cards.
    idx: 0,
    file: '00-s_goal',
    kind: 'auto',
    texts: [
      'See how close you are to the hair you want',
      "What's your hair dream?",
      'Pick what matters most right now.',
    ],
    options: ['Longer hair', 'Healthier, shinier hair', 'Thicker, fuller hair'],
    pick: 'Longer hair',
  },
  {
    idx: 1,
    file: '01-s_hairtype',
    kind: 'auto',
    texts: ['Which hair type do you have?'],
    options: ['Straight', 'Wavy', 'Curly', 'Coily', "I don't know"],
    pick: 'Straight',
  },
  {
    idx: 2,
    file: '02-s_age',
    kind: 'auto',
    texts: ['How old are you?'],
    options: ['18 - 29', '30 - 39', '40 - 49', '50 +'],
    pick: '18 - 29',
  },
  {
    // idx 3 — s_concern (was idx 4 in /40; s_hair_dream removed).
    // Prompt is a hairDream-keyed conditional; assert stable answer options.
    idx: 3,
    file: '03-s_concern',
    kind: 'auto',
    texts: [],
    options: [
      'Hair loss or hair thinning',
      'Damage from dye, heat, or chemical treatments',
      'Scalp irritation or dandruff',
      'Split ends, frizz, and dryness',
      'Other, mixed issues',
    ],
    pick: 'Hair loss or hair thinning',
  },
  {
    idx: 4,
    file: '04-s_routine',
    kind: 'auto',
    texts: ['What best describes your current haircare routine?'],
    options: [
      '🤓 Advanced',
      '🫧 Basic care',
      '🤗 Occasional pampering',
      '🌿 Natural remedies',
      '😌 None of the above',
    ],
    pick: '🫧 Basic care',
  },
  {
    idx: 5,
    file: '05-s_damage_pitch',
    kind: 'pitch',
    // The first text block renders with InlineBold which splits on \n → <br/>,
    // making the full sentence undetectable as a single getByText string.
    // Assert the Continue button (done for all pitches) + the second block text.
    texts: ["the problem was never you"],
    options: [],
  },
  {
    idx: 6,
    file: '06-s_hairqare',
    kind: 'auto',
    texts: ['How familiar are you with HairQare and our approach to holistic haircare?'],
    options: [
      "I'm hearing about it for the first time",
      'I know a few things',
      'Yes, I know everything about it',
    ],
    pick: "I'm hearing about it for the first time",
  },
  {
    idx: 7,
    file: '07-s_holistic_pitch',
    kind: 'pitch',
    // Hero headline + the community stat card are the stable visible copy; the
    // testimonial carousel below is masked in the snapshot (remote images).
    texts: [
      "HairQare's evidence-based programs come from Sarah Tran",
      // statCard ("The World's Largest Haircare Community") was replaced by a trust-bar image in /41
    ],
    options: [],
  },
  {
    // idx 8 — s_spend is `single`+`cta` with a reveal: tap an option to reveal the
    // per-answer text + Continue, then click Continue to advance.
    idx: 8,
    file: '08-s_spend',
    kind: 'cta',
    texts: ['How much do you spend on a bottle of shampoo?'],
    options: ['Less than $10', '$10 - $20', '$20 - $50', 'More than $50'],
    pick: 'Less than $10',
  },
  {
    idx: 9,
    file: '09-s_myths',
    kind: 'cta',
    texts: ['Which of these hair care myths do you believe?'],
    options: [
      'Rosemary oil is reduces hair loss',
      'Coconut oil is the best hair oil',
      'Rice water makes hair grow faster',
      'Natural / organic products are better',
      'Not washing hair is good for the scalp',
      'None of the above',
    ],
    pick: 'Rosemary oil is reduces hair loss',
  },
  {
    idx: 10,
    file: '10-s_damage_activity',
    kind: 'cta',
    texts: ['Select the damaging practices that you regularly do'],
    options: [
      'Heat styling',
      'Bleaching / hair colouring',
      'Sun exposure',
      'Frequent swimming',
      'Tight hair styles (braids, bun, ponytail...)',
      'None of the above',
    ],
    pick: 'Heat styling',
  },
  {
    idx: 11,
    file: '11-s_damage_practices_pitch',
    kind: 'pitch',
    texts: [],
    options: [],
  },
  {
    idx: 12,
    file: '12-s_confidence',
    kind: 'auto',
    texts: ['My reflection in the mirror affects my mood and self-esteem.', RATING_SUBINSTRUCTION],
    options: ['1', '2', '3', '4', '5'],
    pick: '3',
  },
  {
    idx: 13,
    file: '13-s_comparison',
    kind: 'auto',
    texts: ["I tend to compare my hair to others' and it makes me frustrated.", RATING_SUBINSTRUCTION],
    options: ['1', '2', '3', '4', '5'],
    pick: '3',
  },
  {
    idx: 14,
    file: '14-s_professional',
    kind: 'auto',
    texts: ['Did a professional refer you to us?'],
    options: ['Yes', 'No', "I'm a professional"],
    pick: 'No',
  },
  {
    idx: 15,
    file: '15-s_loading',
    kind: 'loading',
    texts: ["The only haircare program you'll ever need", 'Checking your hair condition'],
    options: [],
  },
  {
    idx: 16,
    file: '16-s_email',
    kind: 'email',
    texts: [
      'Your results are ready!',
      "On the next screen, you'll see if the Challenge can help you achieve your hair goal.",
      'Your info is 100% secure and never shared with third parties.',
    ],
    options: [],
  },
]

async function expectNoScroll(page: Page) {
  const fits = await page.evaluate(
    () => document.scrollingElement!.scrollHeight <= document.scrollingElement!.clientHeight,
  )
  expect(fits, 'non-result screen must not scroll (fit-to-viewport invariant)').toBe(true)
}

/** Click a button by exact accessible name (first match). */
const clickButton = (page: Page, name: string) =>
  page.getByRole('button', { name, exact: true }).first().click()

/**
 * Select an option on a `cta` (multi-select / reveal) screen and confirm it stuck
 * before clicking Continue. React StrictMode double-invokes mount effects in dev,
 * which can race a bare tap; for a multi-select we toggle until the option is
 * `aria-pressed`, so the Continue button reliably enables. For the reveal screen
 * (no aria-pressed), a single click is enough and the retry loop no-ops.
 */
async function selectCta(page: Page, label: string) {
  const option = page.getByRole('button', { name: label, exact: true }).first()
  await option.click()
  const isMulti = (await option.getAttribute('aria-pressed')) !== null
  if (isMulti) {
    await expect(option).toHaveAttribute('aria-pressed', 'true')
  }
}

test.beforeAll(() => {
  mkdirSync(REVIEW_DIR, { recursive: true })
})

test('screens 0-16 visual/content parity + no-scroll, with own-baseline snapshots', async ({
  page,
}) => {
  // 19 screens × per-screenshot stability retries can exceed the 30s default,
  // especially during a full --update-snapshots regeneration. Give it headroom.
  test.setTimeout(90_000)
  // Reduced motion → instant advance, paused carousels, final-state framer
  // transitions: keeps the own-baseline screenshots deterministic.
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.addInitScript(() => { Object.assign(window, { __quizPauseCarousels__: true }) })
  // Stub every side-effect so nothing real leaves the browser / no lead is created.
  await page.route('**/quiz/submit', (r) => r.fulfill({ status: 200, body: '{}' }))
  await page.route('**://checkout.hairqare.co/**', (r) => r.abort())
  await page.addInitScript(() => {
    ;(window as unknown as { trackEvent: () => void }).trackEvent = () => {}
  })

  await page.goto('/')

  for (const s of SCREENS) {
    const tag = `idx${s.idx} ${s.file}`

    // --- (1) CONTENT: required prompt / sub-instruction text -------------------
    for (const text of s.texts) {
      if (s.kind === 'email') {
        // 'Name' / 'Email' are <label> text for the inputs.
        await expect(page.getByText(text, { exact: true }).first(), `${tag}: text "${text}"`).toBeVisible()
      } else {
        await expect(page.getByText(text).first(), `${tag}: text "${text}"`).toBeVisible()
      }
    }

    // --- (1b) CONTENT: required answer-option labels ---------------------------
    for (const opt of s.options) {
      await expect(
        page.getByRole('button', { name: opt, exact: true }).first(),
        `${tag}: option "${opt}"`,
      ).toBeVisible()
    }

    // Pitch screens are defined by their Continue control; assert it present.
    if (s.kind === 'pitch') {
      await expect(
        page.getByRole('button', { name: 'Continue', exact: true }).first(),
        `${tag}: Continue`,
      ).toBeVisible()
    }
    // Email screen: assert the inputs + Continue exist.
    if (s.kind === 'email') {
      await expect(page.getByLabel('Name'), `${tag}: Name input`).toBeVisible()
      await expect(page.getByLabel('Email'), `${tag}: Email input`).toBeVisible()
    }

    // --- (2) NO-SCROLL invariant (every screen 0-18 is non-result) -------------
    await expectNoScroll(page)

    // --- (3) OWN-BASELINE regression snapshot ----------------------------------
    // The loading screen (idx 17) carries a width-animated progress bar AND a 4s
    // self-advance timer; mask the animated bar so the snapshot stays stable and
    // doesn't race the timer during Playwright's screenshot-stability retries.
    // The holistic pitch (idx 8) carousel loads 3 REMOTE testimonial images whose
    // paint can race Playwright's screenshot-stability window; mask it so the
    // snapshot is deterministic (the carousel content is asserted via the
    // pitch-carousel testid existing, not pixel-compared).
    const screenshotOpts =
      s.kind === 'loading'
        ? { animations: 'disabled' as const, mask: [page.locator('[data-loading-bar]')] }
        : s.file === '07-s_holistic_pitch'
          ? { animations: 'disabled' as const, mask: [page.locator('[data-testid="pitch-carousel"]')] }
          : { animations: 'disabled' as const }
    // The Damage Pitch (idx 6) renders a remote `damageImage` whose paint can race
    // Playwright's screenshot-stability window (it loads lazily). Wait for every
    // <img> on screen to finish decoding before snapshotting so the baseline is
    // deterministic (no half-loaded image).
    await page.evaluate(() =>
      Promise.all(
        [...document.querySelectorAll('img')].map((img) =>
          img.complete ? Promise.resolve() : img.decode().catch(() => undefined),
        ),
      ),
    )
    await expect(page).toHaveScreenshot(`${s.file}.png`, screenshotOpts)

    // --- (4) HUMAN-REVIEW capture (compare to docs/reference/golden/NN-*.png) --
    await page.screenshot({ path: `${REVIEW_DIR}/${s.file}.react.png`, animations: 'disabled' })
    // eslint-disable-next-line no-console
    console.log(
      `[review] ${s.file}: captured React screen -> e2e/review/${s.file}.react.png ` +
        `(compare vs docs/reference/golden/${String(s.idx).padStart(2, '0')}-*.png)`,
    )

    // --- advance to the next screen along the canonical happy path -------------
    if (s.kind === 'auto') {
      await clickButton(page, s.pick!)
    } else if (s.kind === 'cta') {
      await selectCta(page, s.pick!)
      await clickButton(page, 'Continue')
    } else if (s.kind === 'pitch') {
      await clickButton(page, 'Continue')
    } else if (s.kind === 'email') {
      await page.getByLabel('Name').fill('Test Tester')
      await page.getByLabel('Email').fill('test@example.com')
      await clickButton(page, 'Submit')
    }
    // 'loading' auto-advances via its own timer — nothing to click.
  }

  // After the email submit we land on idx 19 (result). Confirm it renders.
  await expect(
    page.getByRole('button', { name: 'JOIN THE CHALLENGE', exact: true }).first(),
  ).toBeVisible()
})

/**
 * Dashboard / result (idx 19) DOM STRUCTURAL check — the dashboard PIXEL visual is
 * still deferred (ISSUES #8). Here we walk to the result and assert the KEY
 * elements are present: the user name, a match-% number, the benefit text, the CTA
 * button, and the countdown timer. The result screen is the ONE scrollable screen,
 * so we assert it RENDERS (and is allowed to scroll) — we do NOT assert no-scroll.
 */
test('dashboard/result (idx 17) structural check + is allowed to scroll', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.addInitScript(() => { Object.assign(window, { __quizPauseCarousels__: true }) })
  await page.route('**/quiz/submit', (r) => r.fulfill({ status: 200, body: '{}' }))
  await page.route('**://checkout.hairqare.co/**', (r) => r.abort())
  await page.addInitScript(() => {
    ;(window as unknown as { trackEvent: () => void }).trackEvent = () => {}
  })

  await page.goto('/')

  // Walk to the result using the same canonical picks.
  for (const s of SCREENS) {
    if (s.kind === 'auto') {
      await clickButton(page, s.pick!)
    } else if (s.kind === 'cta') {
      await selectCta(page, s.pick!)
      await clickButton(page, 'Continue')
    } else if (s.kind === 'pitch') {
      await clickButton(page, 'Continue')
    } else if (s.kind === 'email') {
      await page.getByLabel('Name').fill('Test Tester')
      await page.getByLabel('Email').fill('test@example.com')
      await clickButton(page, 'Submit')
    }
  }

  // 1) user name — the store splits "Test Tester" -> firstName "Test", shown in
  // the dashboard heading ("Congratulations, Test 🎉") and the summary card.
  await expect(page.getByRole('heading', { name: /Congratulations, Test/ })).toBeVisible()

  // 2) a match-% number — the percentage is in the canonical 92-97 range.
  const matchScore = page.getByText(/^9[2-7]%$/)
  await expect(matchScore.first()).toBeVisible()

  // 3) benefit text — the resolved benefit line sits in the match-score card.
  await expect(page.getByText('How close you are to longer hair')).toBeVisible()
  await expect(page.getByText("That's an outstanding match.")).toBeVisible()

  // 4) CTA button — the primary "JOIN THE CHALLENGE" CTA.
  await expect(page.getByRole('button', { name: 'JOIN THE CHALLENGE', exact: true }).first()).toBeVisible()

  // 5) countdown timer — the sticky 85%-OFF timer renders as mm:ss.
  await expect(page.getByText('85% OFF valid for:')).toBeVisible()
  await expect(page.getByText(/^\d{2}:\d{2}$/).first()).toBeVisible()

  // 6) the rebuilt below-the-fold sections are present (full-content § idx 19):
  //    social proof, the 2nd "START MY CHALLENGE" CTA, scarcity, refund footer.
  await expect(page.getByText(/\d[\d,]+ women/).first()).toBeVisible()
  await expect(page.getByRole('button', { name: 'START MY CHALLENGE', exact: true }).first()).toBeVisible()
  await expect(page.getByText(/Only \d seats remaining\. Hurry Up!/)).toBeVisible()
  await expect(page.getByText('100% Refund guarantee | No Questions Asked')).toBeVisible()

  // The result screen is the ONE scrollable screen — assert it CAN scroll
  // (content taller than the viewport). The single scroll container is now the
  // result wrapper (a fixed-height `overflow-y-auto` box) rather than the
  // document, so the dark countdown timer can stay `position: sticky` pinned to
  // the bottom while scrolling. Assert THAT container overflows.
  const scrolls = await page.evaluate(() => {
    const scroller = [...document.querySelectorAll('div')].find(
      (el) =>
        getComputedStyle(el).overflowY === 'auto' && el.scrollHeight > el.clientHeight,
    )
    return Boolean(scroller)
  })
  expect(scrolls, 'result/dashboard is allowed to scroll').toBe(true)
})
