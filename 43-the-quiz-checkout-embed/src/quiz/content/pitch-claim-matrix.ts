import type { ConditionalText } from '../../spec/types'

// ---------------------------------------------------------------------------
// Table 1 — idx 5 knowledge-state PROMPT by `hairConcern`
// ---------------------------------------------------------------------------

const KNOWLEDGE_PROMPT_PREFIX = 'Do you already know exactly '

const knowledgePromptSuffix: Record<string, string> = {
  concern_hairloss: "what's triggering your hair fall or thinning?",
  concern_splitends: 'how you can tame your frizz and dryness?',
  concern_scalp: "what's behind your scalp irritation or dandruff issues?",
  concern_damage: 'how you can save your hair from further damage?',
}
const KNOWLEDGE_PROMPT_DEFAULT_SUFFIX = "what's causing your hair issues?"

export const knowledgeStatePrompt: ConditionalText = {
  by: 'hairConcern',
  cases: Object.fromEntries(
    Object.entries(knowledgePromptSuffix).map(([id, suffix]) => [
      id,
      KNOWLEDGE_PROMPT_PREFIX + suffix,
    ]),
  ),
  default: KNOWLEDGE_PROMPT_PREFIX + KNOWLEDGE_PROMPT_DEFAULT_SUFFIX,
}

// ---------------------------------------------------------------------------
// Table 2 — idx 13 pitch DESCRIPTION by `hairDamageActivity` (multi-select)
// ---------------------------------------------------------------------------

const PITCH_DESCRIPTION_PREFIX = "With the right routine it's fine to "

export const pitchDescription: ConditionalText = {
  rules: [
    {
      when: {
        questionId: 'hairDamageActivity',
        containsAny: ['damageAction_heat', 'damageAction_dye', 'damageAction_hairstyles'],
      },
      text: PITCH_DESCRIPTION_PREFIX + 'to style, curl or color your hair.',
    },
    {
      when: {
        questionId: 'hairDamageActivity',
        containsAny: ['damageAction_swimming', 'damageAction_sun'],
      },
      text: PITCH_DESCRIPTION_PREFIX + 'live an active lifestyle.',
    },
  ],
  default:
    PITCH_DESCRIPTION_PREFIX +
    'style your hair any way you like and do the activities you enjoy.',
}

// ---------------------------------------------------------------------------
// Table 3 — idx 13 pitch CLAIM by `currentRoutine` × `hairConcern` (5×5)
// ---------------------------------------------------------------------------

const CLAIM_PREFIX = 'But if you are still struggling with '
const CLAIM_SUFFIX = ", you're missing important haircare knowledge."

const concernPhrase: Record<string, string> = {
  concern_hairloss: 'hair loss and thinning',
  concern_splitends: 'split ends and dryness',
  concern_scalp: 'dandruff and scalp irritation',
  concern_damage: 'damaged hair and breakage',
}
const CONCERN_PHRASE_DEFAULT = 'mixed hair issues'

const routineClause: Record<string, string> = {
  routine_complex: "despite all the treatments, specialists and products you've tried",
  routine_basic: 'while only relying on using shampoo & conditioner',
  routine_intermediete: 'despite making time for hair masks and other treatments',
  routine_natural: 'despite using organic products and home remedies',
}
const ROUTINE_CLAUSE_DEFAULT = "despite what you've already tried"

export function pitchClaim(routineAnswer: string, concernAnswer: string): string {
  const concern = concernPhrase[concernAnswer] ?? CONCERN_PHRASE_DEFAULT
  const routine = routineClause[routineAnswer] ?? ROUTINE_CLAUSE_DEFAULT
  return `${CLAIM_PREFIX}${concern} ${routine}${CLAIM_SUFFIX}`
}

export const claimRoutineKeys: readonly string[] = Object.keys(routineClause)
export const claimConcernKeys: readonly string[] = Object.keys(concernPhrase)

const ROUTINE_IDS = [
  'routine_complex',
  'routine_basic',
  'routine_intermediete',
  'routine_natural',
  'routine_other',
] as const
const CONCERN_IDS = [
  'concern_hairloss',
  'concern_splitends',
  'concern_scalp',
  'concern_damage',
  'concern_mixed',
] as const

export function claimKey(routineAnswer: string, concernAnswer: string): string {
  return `${routineAnswer}|${concernAnswer}`
}

export const pitchClaim5x5: Record<string, string> = Object.fromEntries(
  ROUTINE_IDS.flatMap(routineId =>
    CONCERN_IDS.map(concernId => [claimKey(routineId, concernId), pitchClaim(routineId, concernId)]),
  ),
)

// ---------------------------------------------------------------------------
// idx 13 pitch — conclusion + accent line (FIXED text blocks)
// ---------------------------------------------------------------------------

export const pitchConclusion = "That's why nothing has worked so far."

export const pitchAccentLine =
  'Here is what you can achieve in 14 days of following the right routine for your hair:'

// ---------------------------------------------------------------------------
// idx 13 pitch — image CAROUSEL (5 slides, conditional on `hairConcern`)
// ---------------------------------------------------------------------------

const carouselSlide1: ConditionalText = {
  by: 'hairConcern',
  cases: {
    concern_hairloss:
      'https://pub.hairqare.co/cdn-cgi/image/width=750,quality=85,format=auto/kerry-before-after.webp',
    concern_splitends:
      'https://pub.hairqare.co/cdn-cgi/image/width=750,quality=85,format=auto/Split_Ends_Testimonial_3.webp',
    concern_scalp:
      'https://pub.hairqare.co/cdn-cgi/image/width=750,quality=85,format=auto/Dandruff_Testimonial_3.webp',
    concern_damage:
      'https://pub.hairqare.co/cdn-cgi/image/width=750,quality=85,format=auto/Pauline-before_after_LD.webp',
  },
  default:
    'https://pub.hairqare.co/cdn-cgi/image/width=750,quality=85,format=auto/anna-before-after-smaller.webp',
}

const carouselSlide2: ConditionalText = {
  by: 'hairConcern',
  cases: {
    concern_hairloss: 'https://pub.hairqare.co/heather-menopause-shedding.webp',
    concern_splitends:
      'https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/66fe7635d9a4fcb363d5d162_Split%20Ends%20%20Testimonial%204.webp',
    concern_scalp: 'https://pub.hairqare.co/amanda-worth-time-money.webp',
    concern_damage: 'https://pub.hairqare.co/patsy-scalp-any-hair-problem.webp',
  },
  default: 'https://pub.hairqare.co/sarah-deisel-hairloss.webp',
}

const carouselSlide3: ConditionalText = {
  by: 'hairConcern',
  cases: {
    concern_hairloss:
      'https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/66fe766f521064e5a70c318e_Hair%20loss%20Testimonial%203.webp',
    concern_splitends:
      'https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/66fe7635420a4e34119c551b_Split%20Ends%20%20Testimonial%201.webp',
    concern_scalp:
      'https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/66fe76ce81f8b661564e2394_Dandruff%20%20Testimonial%202.webp',
    concern_damage:
      'https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/66fe769f85dca920b329cf16_Damage%20%20Testimonial%201.webp',
  },
  default:
    'https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/66fe75efe655a39ef2c53565_Other%20issue%20Testimonial%201.webp',
}

const carouselSlide4: ConditionalText = 'https://pub.hairqare.co/easy-unlearn-garbage.webp'

const carouselSlide5: ConditionalText =
  'https://assets.hairqare.co/text-only-recommended-testimonial.webp'

export const pitchCarouselImages: ConditionalText[] = [
  carouselSlide1,
  carouselSlide2,
  carouselSlide3,
  carouselSlide4,
  carouselSlide5,
]

// ---------------------------------------------------------------------------
// Table 4 — idx 18 email-capture "concern resolution chance" line by `hairConcern`
// ---------------------------------------------------------------------------

const RESOLUTION_PREFIX = 'Probability to fix your '
const RESOLUTION_SUFFIX = ' in 14 days:'

const resolutionPhrase: Record<string, string> = {
  concern_hairloss: 'hair loss',
  concern_splitends: 'split-ends',
  concern_scalp: 'scalp issues',
  concern_damage: 'damaged hair',
}
const RESOLUTION_PHRASE_DEFAULT = 'hair problems'

export const concernResolutionChance: ConditionalText = {
  by: 'hairConcern',
  cases: Object.fromEntries(
    Object.entries(resolutionPhrase).map(([id, phrase]) => [
      id,
      RESOLUTION_PREFIX + phrase + RESOLUTION_SUFFIX,
    ]),
  ),
  default: RESOLUTION_PREFIX + RESOLUTION_PHRASE_DEFAULT + RESOLUTION_SUFFIX,
}
