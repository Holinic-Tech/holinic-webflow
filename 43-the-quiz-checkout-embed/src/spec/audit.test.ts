import { describe, it, expect } from 'vitest'
import type { QuizSpec, QuestionScreen, PitchScreen } from './types'
import {
  auditSpec,
  suggestScreenId,
  suggestQuestionId,
  suggestAnswerId,
  checkIdConventions,
  findReferences,
  auditRemoval,
  conditionalBranches,
  checkQuizPrefix,
  deriveQuizPrefix,
} from './audit'
import { hairquizSpec } from '../quiz/hairquiz.spec'

// --- tiny fixture builders ---------------------------------------------------

function q(partial: Partial<QuestionScreen> & Pick<QuestionScreen, 'id' | 'questionId' | 'answers'>): QuestionScreen {
  return {
    kind: 'question',
    type: 'single',
    prompt: 'prompt',
    progression: 'auto',
    ...partial,
  } as QuestionScreen
}

function baseSpec(screens: QuizSpec['screens']): QuizSpec {
  return {
    id: 'fixture',
    screens,
    checkout: { base: 'https://x', couponRules: [], defaultCoupon: 'o_df' },
    webhookUrl: 'https://x',
  }
}

const codes = (findings: { code: string }[]) => findings.map(f => f.code)

// --- suggesters --------------------------------------------------------------

describe('suggesters', () => {
  it('suggestScreenId slugs a label into s_ form', () => {
    expect(suggestScreenId('Damage Pitch')).toBe('s_damage_pitch')
    expect(suggestScreenId('Biggest Hair Concern!')).toBe('s_biggest_hair_concern')
    expect(suggestScreenId('  Multiple   spaces ')).toBe('s_multiple_spaces')
  })

  it('suggestQuestionId camelCases a label', () => {
    expect(suggestQuestionId('Hair Shedding')).toBe('hairShedding')
    expect(suggestQuestionId('Current Routine')).toBe('currentRoutine')
    expect(suggestQuestionId('age')).toBe('age')
  })

  it('suggestAnswerId prefixes a slug', () => {
    expect(suggestAnswerId('concern', 'Hair loss')).toBe('concern_hairloss')
    expect(suggestAnswerId('diet', 'Vegan / vegetarian')).toBe('diet_veganvegetarian')
  })
})

// --- ID conventions ----------------------------------------------------------

describe('checkIdConventions', () => {
  it('flags a non-conforming screen id', () => {
    const spec = baseSpec([
      q({ id: 'badScreen', questionId: 'hairType', answers: [{ answerId: 'hairType_straight', label: 'S' }] }),
    ])
    const findings = checkIdConventions(spec)
    expect(findings.some(f => f.code === 'id-convention' && f.location?.includes('badScreen'))).toBe(true)
    expect(findings.every(f => f.level === 'error')).toBe(true)
  })

  it('flags a non-conforming questionId and answerId', () => {
    const spec = baseSpec([
      q({ id: 's_x', questionId: 'Hair_Type', answers: [{ answerId: 'BadAnswer', label: 'B' }] }),
    ])
    const found = checkIdConventions(spec)
    expect(found.some(f => f.message.includes('Hair_Type'))).toBe(true)
    expect(found.some(f => f.message.includes('BadAnswer'))).toBe(true)
  })

  it('accepts conforming ids, bare-integer ratings, and the n/a sentinel', () => {
    const spec = baseSpec([
      q({
        id: 's_rating',
        type: 'rating',
        questionId: 'confidence',
        answers: [
          { answerId: '1', label: '1' },
          { answerId: '5', label: '5' },
        ],
      }),
      q({
        id: 's_multi',
        type: 'multi',
        questionId: 'hairMyth',
        answers: [{ answerId: 'myth_rosemary', label: 'R' }],
        noneOfTheAbove: { label: 'None', answerId: 'n/a' },
      }),
      q({
        id: 's_plus',
        questionId: 'age',
        answers: [{ answerId: 'age_50+', label: '50+' }],
      }),
    ])
    expect(checkIdConventions(spec)).toEqual([])
  })
})

// --- quiz-id prefix guard ----------------------------------------------------

describe('deriveQuizPrefix', () => {
  it('strips a trailing -v<n> and initials multi-word slugs', () => {
    expect(deriveQuizPrefix('long-hair-v1')).toBe('lh')
    expect(deriveQuizPrefix('hair-care-v2')).toBe('hc')
  })

  it('keeps a single-word slug whole', () => {
    expect(deriveQuizPrefix('haircare-v1')).toBe('haircare')
    expect(deriveQuizPrefix('haircare')).toBe('haircare')
  })
})

describe('checkQuizPrefix', () => {
  it('errors on questionIds and answerIds that carry the quiz-id prefix', () => {
    const spec = baseSpec([
      q({
        id: 's_concern',
        questionId: 'lhHairConcern',
        answers: [{ answerId: 'lh_concern_hairloss', label: 'Hair loss' }],
      }),
    ])
    const findings = checkQuizPrefix(spec, 'long-hair-v1')
    expect(findings.every(f => f.code === 'quiz-id-prefix' && f.level === 'error')).toBe(true)
    expect(findings.some(f => f.message.includes("questionId 'lhHairConcern'") && f.message.includes("use 'hairConcern'"))).toBe(true)
    expect(findings.some(f => f.message.includes("answerId 'lh_concern_hairloss'") && f.message.includes("use 'concern_hairloss'"))).toBe(true)
  })

  it('is wired into auditSpec only when quizSlug is supplied', () => {
    const spec = baseSpec([
      q({
        id: 's_concern',
        questionId: 'lhHairConcern',
        answers: [{ answerId: 'lh_concern_hairloss', label: 'Hair loss' }],
      }),
    ])
    expect(auditSpec(spec).some(f => f.code === 'quiz-id-prefix')).toBe(false)
    const errs = auditSpec(spec, { quizSlug: 'long-hair-v1' }).filter(
      f => f.code === 'quiz-id-prefix',
    )
    expect(errs.length).toBeGreaterThan(0)
    expect(errs.every(f => f.level === 'error')).toBe(true)
  })

  it('does NOT false-positive on the canonical haircare spec', () => {
    const findings = auditSpec(hairquizSpec, { quizSlug: '43-the-quiz-checkout-embed' }).filter(
      f => f.code === 'quiz-id-prefix',
    )
    expect(findings).toEqual([])
  })
})

// --- duplicate questionId ----------------------------------------------------

describe('duplicate questionId', () => {
  it('emits a dup-question-id error', () => {
    const spec = baseSpec([
      q({ id: 's_a', questionId: 'hairConcern', answers: [{ answerId: 'concern_a', label: 'A' }] }),
      q({ id: 's_b', questionId: 'hairConcern', answers: [{ answerId: 'concern_b', label: 'B' }] }),
    ])
    const findings = auditSpec(spec).filter(f => f.code === 'dup-question-id')
    expect(findings).toHaveLength(1)
    expect(findings[0].level).toBe('error')
  })
})

// --- missing fallback --------------------------------------------------------

describe('missing fallback', () => {
  it('errors on a by/cases conditional with empty default', () => {
    const spec = baseSpec([
      q({ id: 's_concern', questionId: 'hairConcern', answers: [{ answerId: 'concern_a', label: 'A' }] }),
      {
        kind: 'pitch',
        id: 's_pitch',
        label: 'Pitch',
        headline: { by: 'hairConcern', cases: { concern_a: 'hi' }, default: '   ' },
        body: 'ok',
      } as PitchScreen,
    ])
    const findings = auditSpec(spec).filter(f => f.code === 'missing-fallback')
    expect(findings).toHaveLength(1)
    expect(findings[0].level).toBe('error')
    expect(findings[0].location).toContain('headline')
  })

  it('errors on a rules conditional with empty default in a pitch block', () => {
    const spec = baseSpec([
      q({ id: 's_concern', questionId: 'hairConcern', answers: [{ answerId: 'concern_a', label: 'A' }] }),
      {
        kind: 'pitch',
        id: 's_pitch',
        label: 'Pitch',
        headline: 'ok',
        body: 'ok',
        blocks: [
          {
            kind: 'text',
            text: { rules: [{ when: { questionId: 'hairConcern', containsAny: ['concern_a'] }, text: 'x' }], default: '' },
          },
        ],
      } as PitchScreen,
    ])
    const findings = auditSpec(spec).filter(f => f.code === 'missing-fallback')
    expect(findings.length).toBeGreaterThanOrEqual(1)
    expect(findings[0].location).toContain('blocks')
  })
})

// --- coverage / overlap / dead rules -----------------------------------------

describe('conditionalBranches coverage', () => {
  it('reports default-coverage, dead-branch and branch-overlap', () => {
    const spec = baseSpec([
      q({
        id: 's_concern',
        questionId: 'hairConcern',
        answers: [
          { answerId: 'concern_a', label: 'A' },
          { answerId: 'concern_b', label: 'B' },
          { answerId: 'concern_c', label: 'C' },
        ],
      }),
      {
        kind: 'pitch',
        id: 's_pitch',
        label: 'Pitch',
        headline: {
          rules: [
            // matches a -> first
            { when: { questionId: 'hairConcern', containsAny: ['concern_a'] }, text: 'first' },
            // ALSO matches a (overlap with rule 0; never the sole winner for a)
            { when: { questionId: 'hairConcern', containsAny: ['concern_a'] }, text: 'overlap-and-dead' },
            // matches b
            { when: { questionId: 'hairConcern', containsAny: ['concern_b'] }, text: 'second' },
          ],
          // concern_c falls through to default
          default: 'fallback',
        },
        body: 'ok',
      } as PitchScreen,
    ])
    const findings = conditionalBranches(spec)
    const cs = codes(findings)
    expect(cs).toContain('default-coverage')
    expect(cs).toContain('dead-branch')
    expect(cs).toContain('branch-overlap')
    // default-coverage must mention the uncovered answer combo
    expect(findings.find(f => f.code === 'default-coverage')?.message).toContain('concern_c')
  })

  it('skips enumeration for a large multi-select with coverage-skipped info', () => {
    const answers = Array.from({ length: 11 }, (_, i) => ({ answerId: `opt_${i}`, label: `O${i}` }))
    const spec = baseSpec([
      q({ id: 's_multi', type: 'multi', questionId: 'manyOpts', answers }),
      {
        kind: 'pitch',
        id: 's_pitch',
        label: 'Pitch',
        headline: {
          rules: [{ when: { questionId: 'manyOpts', containsAny: ['opt_0'] }, text: 'x' }],
          default: 'd',
        },
        body: 'ok',
      } as PitchScreen,
    ])
    const findings = conditionalBranches(spec)
    expect(codes(findings)).toContain('coverage-skipped')
  })
})

// --- findReferences / auditRemoval -------------------------------------------

describe('findReferences and auditRemoval', () => {
  const spec = baseSpec([
    q({
      id: 's_concern',
      questionId: 'hairConcern',
      answers: [
        { answerId: 'concern_a', label: 'A' },
        { answerId: 'concern_b', label: 'B' },
      ],
      cdp: { acField: 8, mpField: 'Hair Concern Type' },
    }),
    {
      kind: 'pitch',
      id: 's_pitch',
      label: 'Pitch',
      headline: { by: 'hairConcern', cases: { concern_a: 'hi' }, default: 'd' },
      body: 'ok',
    } as PitchScreen,
  ])
  const specWithCheckout: QuizSpec = {
    ...spec,
    checkout: {
      base: 'https://x',
      couponRules: [{ when: { questionId: 'hairConcern', containsAny: ['concern_a'] }, coupon: 'c_a' }],
      defaultCoupon: 'o_df',
    },
    eventEnrichment: ['hairConcern'],
  }

  it('finds every reference to a questionId', () => {
    const refs = findReferences(specWithCheckout, { questionId: 'hairConcern' })
    const kinds = refs.map(r => r.kind)
    expect(kinds).toContain('conditional-by')
    expect(kinds).toContain('cdp')
    expect(kinds).toContain('coupon-rule')
    expect(kinds).toContain('event-enrichment')
  })

  it('finds references to a specific answerId', () => {
    const refs = findReferences(specWithCheckout, { questionId: 'hairConcern', answerId: 'concern_a' })
    expect(refs.some(r => r.kind === 'conditional-case')).toBe(true)
    expect(refs.some(r => r.kind === 'coupon-rule')).toBe(true)
    expect(refs.some(r => r.kind === 'answer')).toBe(true)
  })

  it('auditRemoval reports errors for a referenced answer', () => {
    const findings = auditRemoval(specWithCheckout, { questionId: 'hairConcern', answerId: 'concern_a' })
    expect(findings.length).toBeGreaterThan(0)
    expect(findings.every(f => f.level === 'error')).toBe(true)
  })

  it('auditRemoval is empty for a safe-to-remove answer', () => {
    const findings = auditRemoval(spec, { questionId: 'hairConcern', answerId: 'concern_b' })
    expect(findings).toEqual([])
  })
})

// --- image sanity ------------------------------------------------------------

describe('image sanity', () => {
  it('errors on a non-https image and infos on an off-CDN image', () => {
    const spec = baseSpec([
      q({
        id: 's_x',
        type: 'image',
        questionId: 'hairType',
        answers: [
          { answerId: 'hairType_a', label: 'A', imageUrl: 'http://insecure.example.com/a.png' },
          { answerId: 'hairType_b', label: 'B', imageUrl: 'https://cdn.elsewhere.com/b.png' },
          { answerId: 'hairType_c', label: 'C', imageUrl: 'https://assets.hairqare.co/c.webp' },
        ],
      }),
    ])
    const findings = auditSpec(spec)
    expect(findings.some(f => f.code === 'bad-image-url' && f.level === 'error')).toBe(true)
    expect(findings.some(f => f.code === 'image-not-resizable' && f.level === 'info')).toBe(true)
    // the on-CDN image must NOT produce an image-not-resizable finding
    const notResizable = findings.filter(f => f.code === 'image-not-resizable')
    expect(notResizable.every(f => !f.location?.includes('hairType_c'))).toBe(true)
  })
})

// --- the real spec must be clean ---------------------------------------------

describe('hairquizSpec', () => {
  it('produces no error-level audit findings', () => {
    const errors = auditSpec(hairquizSpec).filter(f => f.level === 'error')
    expect(errors).toEqual([])
  })
})
