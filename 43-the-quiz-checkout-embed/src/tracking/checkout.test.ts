import { describe, it, expect, beforeEach } from 'vitest'
import { resolveCoupon, buildCheckoutUrl, buildEmbedCheckoutUrl } from './checkout'
import type { CheckoutConfig } from '../spec/types'

const checkout: CheckoutConfig = {
  base: 'https://checkout.hairqare.co/buy/hairqare-challenge-save-85-5/',
  couponRules: [
    { when: { questionId: 'hairConcern', containsAny: ['concern_hairloss'] }, coupon: 'c_hl' },
    { when: { questionId: 'hairConcern', containsAny: ['concern_damage', 'concern_splitends'] }, coupon: 'c_dh' },
  ],
  defaultCoupon: 'o_df',
}

describe('coupon resolution', () => {
  it('first matching rule wins', () => {
    expect(resolveCoupon(checkout, { hairConcern: ['concern_hairloss'] })).toBe('c_hl')
  })
  it('falls back to default', () => {
    expect(resolveCoupon(checkout, { diet: ['diet_vegan'] })).toBe('o_df')
  })
})

describe('checkout url', () => {
  // jsdom stores one cookie per `document.cookie =` assignment (extra "; k=v" pairs are
  // parsed as attributes and dropped), so set the two cvg cookies separately — in a real
  // browser these are two distinct cookies anyway.
  beforeEach(() => { document.cookie = '__cvg_uid=U1'; document.cookie = '__cvg_sid=S1'; window.history.replaceState({}, '', '/') })
  it('uses the canonical base (no -59) and appends prefill + coupon + cvg ids in order', () => {
    const url = buildCheckoutUrl(checkout, { firstName: 'Ann', lastName: 'Lee', email: 'a@b.co' }, { hairConcern: ['concern_hairloss'] })
    expect(url.startsWith('https://checkout.hairqare.co/buy/hairqare-challenge-save-85-5/?')).toBe(true)
    expect(url).toContain('billing_email=a%40b.co')
    expect(url).toContain('billing_first_name=Ann')
    expect(url).toContain('aero-coupons=c_hl')
    expect(url).toContain('__cvg_uid=U1'); expect(url).toContain('__cvg_sid=S1')
  })
})

describe('embed checkout url', () => {
  beforeEach(() => { document.cookie = '__cvg_uid=U1'; document.cookie = '__cvg_sid=S1'; window.history.replaceState({}, '', '/') })

  it('carries the SAME prefill/coupon/cvg params as the redirect URL, plus hq_embed=1', () => {
    const user = { firstName: 'Ann', lastName: 'Lee', email: 'a@b.co' }
    const answers = { hairConcern: ['concern_hairloss'] }
    const redirect = new URL(buildCheckoutUrl(checkout, user, answers))
    const embed = new URL(buildEmbedCheckoutUrl(checkout, user, answers))
    for (const [k, v] of redirect.searchParams) expect(embed.searchParams.get(k)).toBe(v)
    expect(embed.searchParams.get('hq_embed')).toBe('1')
    expect(redirect.searchParams.has('hq_embed')).toBe(false)
  })

  it('uses embed.base when set, falling back to checkout.base', () => {
    const withBase: CheckoutConfig = {
      ...checkout,
      embed: { enabled: true, base: 'https://checkout.hairqare.co/embed-checkout/' },
    }
    expect(buildEmbedCheckoutUrl(withBase, {}, {})).toMatch(/^https:\/\/checkout\.hairqare\.co\/embed-checkout\/\?/)
    expect(buildEmbedCheckoutUrl(checkout, {}, {})).toMatch(/^https:\/\/checkout\.hairqare\.co\/buy\/hairqare-challenge-save-85-5\/\?/)
  })
})
