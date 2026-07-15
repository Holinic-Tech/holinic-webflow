import { describe, it, expect, beforeEach, vi } from 'vitest'

// Stub ONLY the redirect side-effect; URL building/coupons stay real.
vi.mock('../tracking/checkout', async (importOriginal) => {
  const mod = await importOriginal<typeof import('../tracking/checkout')>()
  return { ...mod, redirectToCheckout: vi.fn() }
})

import { createQuizStore } from './quizStore'
import { hairquizSpec } from '../quiz/hairquiz.spec'
import { redirectToCheckout } from '../tracking/checkout'

const resultIndex = hairquizSpec.screens.findIndex((s) => s.kind === 'result')

beforeEach(() => {
  ;(window as any).dataLayer = []
  vi.mocked(redirectToCheckout).mockClear()
})

/**
 * The embed hook contract (CreateQuizStoreOptions.onCheckout): the GA event
 * fires FIRST and byte-identically in every mode; only the redirect is
 * conditional. The two event strings are load-bearing production names —
 * TWO spaces from results/plan-dialog, ONE space from the timer.
 */
describe('store onCheckout hook', () => {
  it("fires 'Go to  checkout' (TWO spaces) and suppresses the redirect when handled", () => {
    const s = createQuizStore(hairquizSpec, { onCheckout: () => 'handled' })
    s.getState().goTo(resultIndex)
    s.getState().checkoutFromResults()
    const e = window.dataLayer.find((x: any) => x.event === 'Go to  checkout')
    expect(e).toBeDefined()
    expect(e.event_category).toBe('Quiz')
    expect(e.position).toBe(resultIndex)
    expect(window.dataLayer.some((x: any) => x.event === 'Go to checkout')).toBe(false)
    expect(redirectToCheckout).not.toHaveBeenCalled()
  })

  it("fires 'Go to checkout' (ONE space) from the timer, still suppressed when handled", () => {
    const s = createQuizStore(hairquizSpec, { onCheckout: () => 'handled' })
    s.getState().goTo(resultIndex)
    s.getState().checkoutFromTimer()
    expect(window.dataLayer.some((x: any) => x.event === 'Go to checkout')).toBe(true)
    expect(window.dataLayer.some((x: any) => x.event === 'Go to  checkout')).toBe(false)
    expect(redirectToCheckout).not.toHaveBeenCalled()
  })

  it('plan-dialog CTA shares the TWO-space event and the hook', () => {
    const onCheckout = vi.fn(() => 'handled' as const)
    const s = createQuizStore(hairquizSpec, { onCheckout })
    s.getState().goTo(resultIndex)
    s.getState().checkoutFromPlanDialog()
    expect(window.dataLayer.some((x: any) => x.event === 'Go to  checkout')).toBe(true)
    expect(onCheckout).toHaveBeenCalledTimes(1)
    expect(redirectToCheckout).not.toHaveBeenCalled()
  })

  it("falls through to the redirect when the hook returns 'redirect'", () => {
    const s = createQuizStore(hairquizSpec, { onCheckout: () => 'redirect' })
    s.getState().goTo(resultIndex)
    s.getState().checkoutFromResults()
    expect(window.dataLayer.some((x: any) => x.event === 'Go to  checkout')).toBe(true)
    expect(redirectToCheckout).toHaveBeenCalledTimes(1)
  })

  it('legacy behavior with no hook: event + redirect', () => {
    const s = createQuizStore(hairquizSpec)
    s.getState().goTo(resultIndex)
    s.getState().checkoutFromTimer()
    expect(window.dataLayer.some((x: any) => x.event === 'Go to checkout')).toBe(true)
    expect(redirectToCheckout).toHaveBeenCalledTimes(1)
  })

  it('confirmSkip (mid-quiz) bypasses the hook and always redirects', () => {
    const onCheckout = vi.fn(() => 'handled' as const)
    const s = createQuizStore(hairquizSpec, { onCheckout })
    s.getState().confirmSkip()
    expect(onCheckout).not.toHaveBeenCalled()
    expect(redirectToCheckout).toHaveBeenCalledTimes(1)
  })
})
