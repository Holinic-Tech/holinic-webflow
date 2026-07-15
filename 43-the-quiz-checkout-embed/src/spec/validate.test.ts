import { describe, it, expect } from 'vitest'
import { validateSpec } from './validate'
import { exampleSpec } from './example.spec'

describe('validateSpec', () => {
  it('passes the example spec', () => {
    expect(validateSpec(exampleSpec)).toEqual([])
  })

  it('flags duplicate screen ids', () => {
    const bad = { ...exampleSpec, screens: [...exampleSpec.screens, exampleSpec.screens[0]] }
    expect(validateSpec(bad).some(e => e.includes('duplicate'))).toBe(true)
  })

  it('flags a by/cases condition referencing an unknown questionId', () => {
    const q = { kind: 'pitch', id: 'p_x', label: 'X', headline: 'h', body: { by: 'NOPE', cases: {}, default: 'd' } } as any
    const bad = { ...exampleSpec, screens: [exampleSpec.screens[0], q, ...exampleSpec.screens.slice(1)] }
    expect(validateSpec(bad).some(e => e.includes('NOPE'))).toBe(true)
  })

  it('flags a cdp acField that is not a positive integer', () => {
    const screens = exampleSpec.screens.map(s => s.kind === 'question' ? { ...s, cdp: { acField: -1 } } : s)
    expect(validateSpec({ ...exampleSpec, screens } as any).some(e => e.includes('acField'))).toBe(true)
  })

  it('flags a question with no answers', () => {
    const screens = exampleSpec.screens.map(s => s.kind === 'question' ? { ...s, answers: [] } : s)
    expect(validateSpec({ ...exampleSpec, screens } as any).some(e => e.includes('answer'))).toBe(true)
  })

  it('flags duplicate answerIds within a question', () => {
    const screens = exampleSpec.screens.map(s =>
      s.kind === 'question'
        ? { ...s, answers: [{ answerId: 'dup', label: 'A' }, { answerId: 'dup', label: 'B' }] }
        : s,
    )
    expect(validateSpec({ ...exampleSpec, screens } as any).some(e => e.includes('dup'))).toBe(true)
  })

  it('flags a by/cases referencing an unknown answerId of a known question', () => {
    const q = {
      kind: 'pitch', id: 'p_y', label: 'Y', headline: 'h',
      body: { by: 'hairConcern', cases: { not_an_answer: 'x' }, default: 'd' },
    } as any
    const bad = { ...exampleSpec, screens: [exampleSpec.screens[0], q, ...exampleSpec.screens.slice(1)] }
    expect(validateSpec(bad).some(e => e.includes('not_an_answer'))).toBe(true)
  })

  it('flags a set-logic rule referencing a questionId not defined earlier', () => {
    const q = {
      kind: 'pitch', id: 'p_z', label: 'Z', headline: 'h',
      body: { rules: [{ when: { questionId: 'laterQ', containsAny: ['x'] }, text: 't' }], default: 'd' },
    } as any
    const bad = { ...exampleSpec, screens: [exampleSpec.screens[0], q, ...exampleSpec.screens.slice(1)] }
    expect(validateSpec(bad).some(e => e.includes('laterQ'))).toBe(true)
  })

  it('flags a pitch screen with an empty label', () => {
    const screens = exampleSpec.screens.map(s => s.kind === 'pitch' ? { ...s, label: '' } : s)
    expect(validateSpec({ ...exampleSpec, screens } as any).some(e => e.toLowerCase().includes('label'))).toBe(true)
  })

  it('flags a coupon rule referencing an unknown answerId (dangling coupon ref)', () => {
    const checkout = {
      ...exampleSpec.checkout,
      couponRules: [{ when: { questionId: 'hairConcern', containsAny: ['ghost_answer'] }, coupon: 'c_x' }],
    }
    expect(validateSpec({ ...exampleSpec, checkout } as any).some(e => e.includes('ghost_answer'))).toBe(true)
  })

  it('flags a coupon rule referencing an unknown questionId', () => {
    const checkout = {
      ...exampleSpec.checkout,
      couponRules: [{ when: { questionId: 'mysteryQ', containsAny: ['x'] }, coupon: 'c_x' }],
    }
    expect(validateSpec({ ...exampleSpec, checkout } as any).some(e => e.includes('mysteryQ'))).toBe(true)
  })

  it('flags a noneOfTheAbove.answerId colliding with a real answerId', () => {
    const screens = exampleSpec.screens.map(s =>
      s.kind === 'question' && s.noneOfTheAbove
        ? { ...s, noneOfTheAbove: { label: 'None', answerId: s.answers[0].answerId } }
        : s,
    )
    expect(validateSpec({ ...exampleSpec, screens } as any).some(e => e.toLowerCase().includes('none')).valueOf()).toBe(true)
  })
})

describe('checkout.embed validation', () => {
  const withEmbed = (embed: any) =>
    validateSpec({ ...exampleSpec, checkout: { ...exampleSpec.checkout, embed } } as any)

  it('accepts a minimal enabled block and a fully-specified one', () => {
    expect(withEmbed({ enabled: true })).toEqual([])
    expect(
      withEmbed({
        enabled: true,
        mode: 'inline',
        base: 'https://checkout.hairqare.co/embed-checkout/',
        preload: 'onResult',
        loadTimeoutMs: 5000,
        allowedOrigin: 'https://checkout.hairqare.co',
        redirectInWebview: true,
      }),
    ).toEqual([])
  })

  it('flags a bad mode / preload / timeout', () => {
    expect(withEmbed({ enabled: true, mode: 'popup' }).some(e => e.includes('embed.mode'))).toBe(true)
    expect(withEmbed({ enabled: true, preload: 'always' }).some(e => e.includes('embed.preload'))).toBe(true)
    expect(withEmbed({ enabled: true, loadTimeoutMs: 0 }).some(e => e.includes('loadTimeoutMs'))).toBe(true)
  })

  it('flags non-https base and a non-origin allowedOrigin', () => {
    expect(withEmbed({ enabled: true, base: 'http://checkout.hairqare.co/x/' }).some(e => e.includes('embed.base'))).toBe(true)
    expect(withEmbed({ enabled: true, allowedOrigin: 'https://checkout.hairqare.co/' }).some(e => e.includes('allowedOrigin'))).toBe(true)
    expect(withEmbed({ enabled: true, allowedOrigin: 'https://checkout.hairqare.co/path' }).some(e => e.includes('allowedOrigin'))).toBe(true)
  })
})
