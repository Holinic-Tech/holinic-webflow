import type { CheckoutConfig } from '../spec/types'
import type { AnswerState } from '../engine/answers'

function setIncludes(answers: AnswerState, questionId: string, ids?: string[], all = false): boolean {
  if (!ids) return false
  const picked = answers[questionId] ?? []
  return all ? ids.every(i => picked.includes(i)) : ids.some(i => picked.includes(i))
}
export function resolveCoupon(cfg: CheckoutConfig, answers: AnswerState): string {
  for (const r of cfg.couponRules) {
    if (setIncludes(answers, r.when.questionId, r.when.containsAny, false) ||
        setIncludes(answers, r.when.questionId, r.when.containsAll, true)) return r.coupon
  }
  return cfg.defaultCoupon
}
function cvgValue(name: string): string | null {
  const m = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  if (m) return m[2]
  return new URLSearchParams(window.location.search).get(name)
}
export interface CheckoutUser { firstName?: string; lastName?: string; email?: string }
function checkoutParams(cfg: CheckoutConfig, user: CheckoutUser, answers: AnswerState): URLSearchParams {
  const p = new URLSearchParams()
  if (user.email) p.set('billing_email', user.email)
  if (user.firstName) p.set('billing_first_name', user.firstName)
  if (user.lastName) p.set('billing_last_name', user.lastName)
  p.set('aero-coupons', resolveCoupon(cfg, answers))
  const uid = cvgValue('__cvg_uid'); const sid = cvgValue('__cvg_sid')
  if (uid) p.set('__cvg_uid', uid)
  if (sid) p.set('__cvg_sid', sid)
  return p
}
export function buildCheckoutUrl(cfg: CheckoutConfig, user: CheckoutUser, answers: AnswerState): string {
  return `${cfg.base}?${checkoutParams(cfg, user, answers).toString()}`
}
/**
 * Iframe-src variant: same params on `embed.base ?? base`, plus `hq_embed=1` —
 * the flag the checkout-side bridge plugin uses to mark the Woo session as
 * embedded (gateway policy, e.g. hiding PayPal's popup flow). The redirect URL
 * (buildCheckoutUrl) never carries it.
 */
export function buildEmbedCheckoutUrl(cfg: CheckoutConfig, user: CheckoutUser, answers: AnswerState): string {
  const p = checkoutParams(cfg, user, answers)
  p.set('hq_embed', '1')
  return `${cfg.embed?.base ?? cfg.base}?${p.toString()}`
}
export function redirectToCheckout(cfg: CheckoutConfig, user: CheckoutUser, answers: AnswerState): void {
  window.location.href = buildCheckoutUrl(cfg, user, answers)
}
