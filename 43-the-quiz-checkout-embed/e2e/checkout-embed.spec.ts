import { test, expect, type Page } from '@playwright/test'

/**
 * Embedded-checkout e2e. The checkout origin is route-FULFILLED with a stub
 * document, so the iframe's origin is the real https://checkout.hairqare.co —
 * the parent's postMessage origin check is exercised for real. The stub speaks
 * the v1 protocol (ready + resize) from docs/reference/checkout-embed-contract.md.
 */

const STUB_HTML = `<!doctype html><html><body style="margin:0"><h1 data-stub>Stub checkout</h1>
<script>
  parent.postMessage({ source: 'hairqare-checkout', v: 1, type: 'ready' }, '*')
  parent.postMessage({ source: 'hairqare-checkout', v: 1, type: 'resize', height: 900 }, '*')
</script></body></html>`

type GAEvent = { event: string } & Record<string, unknown>

/** Shared harness: stub webhook + checkout origin, capture GA events. */
async function setup(page: Page, opts: { checkout: 'stub' | 'abort' }) {
  await page.route('**/quiz/submit', (r) => r.fulfill({ status: 200, body: '{}' }))
  await page.route('**://checkout.hairqare.co/**', (r) =>
    opts.checkout === 'stub'
      ? r.fulfill({ status: 200, contentType: 'text/html', body: STUB_HTML })
      : r.abort(),
  )
  await page.addInitScript(() => {
    const w = window as unknown as { __events: unknown[]; dataLayer: unknown[]; trackEvent: () => void }
    w.__events = []
    w.trackEvent = () => {}
    w.dataLayer = new Proxy([] as unknown[], {
      set(target, prop, value, receiver) {
        if (prop !== 'length' && value && typeof value === 'object') {
          w.__events.push(value)
          // Mirror to the console: a legacy-redirect attempt (location.href)
          // tears down the JS world even when route-aborted (see golden.spec.ts),
          // so post-redirect assertions must read the console stream.
          // eslint-disable-next-line no-console
          console.log('__GA__' + JSON.stringify(value))
        }
        return Reflect.set(target, prop, value, receiver)
      },
    })
  })
  const consoleEvents: GAEvent[] = []
  page.on('console', (msg) => {
    const text = msg.text()
    if (text.startsWith('__GA__')) {
      try { consoleEvents.push(JSON.parse(text.slice('__GA__'.length))) } catch { /* ignore */ }
    }
  })
  return { consoleEvents }
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.addInitScript(() => { Object.assign(window, { __quizPauseCarousels__: true }) })
}

const events = (page: Page) =>
  page.evaluate(() => (window as unknown as { __events: GAEvent[] }).__events)

/** The canonical happy-path walk (mirrors golden.spec.ts) up to the result page. */
async function walkToResult(page: Page) {
  const click = (name: string) => page.getByRole('button', { name, exact: true }).first().click()
  await page.goto('/')
  await click('Longer hair')
  await click('Straight')
  await click('18 - 29')
  await click('Hair loss or hair thinning')
  await click('🫧 Basic care')
  await click('Continue')
  await click("I'm hearing about it for the first time")
  await click('Continue')
  await click('Less than $10')
  await click('Continue')
  await click('Rosemary oil is reduces hair loss')
  await click('Continue')
  await click('Heat styling')
  await click('Continue')
  await click('Continue')
  // Two consecutive rating screens share button names 1–5; wait for each
  // screen's distinct heading before tapping so a click can never land on the
  // still-exiting previous screen.
  await expect(page.getByRole('heading', { name: /reflection in the mirror/i })).toBeVisible()
  await click('3')
  await expect(page.getByRole('heading', { name: /compare my hair/i })).toBeVisible()
  await click('3')
  await click('No')
  await page.getByLabel('Name').fill('Test Tester')
  await page.getByLabel('Email').fill('test@example.com')
  await page.getByRole('button', { name: 'Submit', exact: true }).click()
  await expect
    .poll(async () => (await events(page)).filter((e) => e.event === 'Viewed Results Page').length)
    .toBeGreaterThanOrEqual(1)
}

test('dashboard CTA opens the modal, fires the TWO-space event, skeleton swaps on ready — no navigation', async ({ page }) => {
  await setup(page, { checkout: 'stub' })
  await walkToResult(page)

  await page.getByRole('button', { name: 'JOIN THE CHALLENGE', exact: true }).first().click()

  const modal = page.getByTestId('checkout-modal')
  await expect(modal).toBeVisible()
  await expect(modal.getByTestId('checkout-embed-frame')).toBeVisible()
  // ready arrived from the stub → skeleton gone.
  await expect(modal.getByText('Loading secure checkout…')).toBeHidden()
  // The stub document actually rendered inside the frame.
  await expect(page.frameLocator('[data-testid="checkout-embed-frame"]').locator('[data-stub]')).toBeVisible()

  const captured = await events(page)
  expect(captured.filter((e) => e.event === 'Go to  checkout')).toHaveLength(1) // TWO spaces
  expect(captured.filter((e) => e.event === 'Go to checkout')).toHaveLength(0)
  // No navigation happened: the quiz document (and __events) is still alive,
  // and the legacy "redirecting" overlay never appeared.
  await expect(page.getByText('Taking you to secure checkout…')).toBeHidden()
})

test('timer JOIN fires the ONE-space event and opens the same modal; close restores the result page', async ({ page }) => {
  await setup(page, { checkout: 'stub' })
  await walkToResult(page)

  await page.getByRole('button', { name: 'JOIN', exact: true }).first().click()
  await expect(page.getByTestId('checkout-modal')).toBeVisible()

  const captured = await events(page)
  expect(captured.filter((e) => e.event === 'Go to checkout')).toHaveLength(1) // ONE space
  expect(captured.filter((e) => e.event === 'Go to  checkout')).toHaveLength(0)

  await page.getByRole('button', { name: 'Close checkout' }).click()
  await expect(page.getByTestId('checkout-modal')).toBeHidden()
  // Result page intact underneath (dashboard CTA still there), no redirect.
  await expect(page.getByRole('button', { name: 'JOIN THE CHALLENGE', exact: true }).first()).toBeVisible()
  await expect(page.getByText('Taking you to secure checkout…')).toBeHidden()

  // Reopen: the frame was preserved (display-toggled, not remounted) — still ready.
  await page.getByRole('button', { name: 'JOIN', exact: true }).first().click()
  await expect(page.getByTestId('checkout-modal')).toBeVisible()
  await expect(page.getByTestId('checkout-modal').getByText('Loading secure checkout…')).toBeHidden()
})

test('frame that never becomes ready falls back to the legacy redirect after the timeout', async ({ page }) => {
  test.setTimeout(60_000) // includes the 8s in-app loadTimeoutMs wait
  const { consoleEvents } = await setup(page, { checkout: 'abort' }) // iframe request dies → no ready message

  // Distinguish the two checkout-origin requests: the iframe src carries
  // hq_embed=1; the legacy-redirect URL does not.
  const checkoutRequests: string[] = []
  page.on('request', (r) => {
    if (r.url().includes('checkout.hairqare.co')) checkoutRequests.push(r.url())
  })

  await walkToResult(page)

  await page.getByRole('button', { name: 'JOIN THE CHALLENGE', exact: true }).first().click()
  await expect(page.getByTestId('checkout-modal')).toBeVisible()
  await expect(page.getByTestId('checkout-modal').getByText('Loading secure checkout…')).toBeVisible()

  // After loadTimeoutMs (spec default 8000) the fallback engages: a top-level
  // navigation to the LEGACY checkout URL (no hq_embed). The location.href
  // assignment tears down the JS world even though the request is aborted, so
  // assert via the network + the console-mirrored GA stream, not the DOM.
  await expect
    .poll(() => checkoutRequests.filter((u) => !u.includes('hq_embed=1')).length, { timeout: 12_000 })
    .toBeGreaterThanOrEqual(1)
  const redirectUrl = checkoutRequests.find((u) => !u.includes('hq_embed=1'))!
  expect(redirectUrl).toContain('/buy/hairqare-challenge-save-85-5/')
  expect(redirectUrl).toContain('aero-coupons=c_hl')
  expect(redirectUrl).toContain('billing_email=test%40example.com')

  // The iframe attempt itself carried the embed marker.
  expect(checkoutRequests.some((u) => u.includes('hq_embed=1'))).toBe(true)

  // Exactly ONE checkout event — the fallback must not double-fire it.
  expect(consoleEvents.filter((e) => e.event === 'Go to  checkout')).toHaveLength(1)
})
