import type { ConditionalText } from '../../spec/types'

// ===========================================================================
// idx 6 — DAMAGE PITCH
// ===========================================================================

const DAMAGE_BODY_HEAD = 'Did you know research shows that'
const DAMAGE_BODY_TAIL = ' within 14 days of switching to a holistic haircare routine.'

const damagePercent: Record<string, string> = {
  concern_hairloss: ' 96.3%',
  concern_splitends: ' 92.5%',
  concern_scalp: ' 93.8%',
  concern_damage: ' 91.2%',
}
const DAMAGE_PERCENT_DEFAULT = ' over 90%'

const damageConcernPhrase: Record<string, string> = {
  concern_hairloss: ' hair loss and thinning',
  concern_splitends: ' split ends and dryness',
  concern_scalp: ' dandruff and scalp irritation',
  concern_damage: ' damaged hair and breakage',
}
const DAMAGE_CONCERN_PHRASE_DEFAULT = ' mixed hair issues'

/** NOTE: "fourties" is a verbatim [sic]. */
const damageAgePhrase: Record<string, string> = {
  age_18to29: ' in their twenties,',
  age_30to39: ' in their thirties,',
  age_40to49: ' in their fourties,',
  'age_50+': ' after the age of 50,',
}
const DAMAGE_AGE_PHRASE_DEFAULT = ' regardless of their age,'

/** NOTE: split-ends "see visibly see visibly" is a verbatim [sic]. */
const damageOutcomePhrase: Record<string, string> = {
  concern_hairloss: ' see visibly denser and thicker hair',
  concern_splitends: ' see visibly see visibly denser hair and less frizz',
  concern_scalp: ' stop experiencing scalp irritation and flakes',
  concern_damage: ' experience less breakage and more density',
}
const DAMAGE_OUTCOME_PHRASE_DEFAULT = ' achieve visibly better hair'

export function damagePitchBody(concernAnswer: string, ageAnswer: string): string {
  const pct = damagePercent[concernAnswer] ?? DAMAGE_PERCENT_DEFAULT
  const concern = damageConcernPhrase[concernAnswer] ?? DAMAGE_CONCERN_PHRASE_DEFAULT
  const age = damageAgePhrase[ageAnswer] ?? DAMAGE_AGE_PHRASE_DEFAULT
  const outcome = damageOutcomePhrase[concernAnswer] ?? DAMAGE_OUTCOME_PHRASE_DEFAULT
  return `${DAMAGE_BODY_HEAD}${pct} of women, struggling with${concern}${age}${outcome}${DAMAGE_BODY_TAIL}`
}

// ---------------------------------------------------------------------------
// idx 6 — before/after IMAGE, conditional on hairConcern × age
// ---------------------------------------------------------------------------

const DAMAGE_IMG_HAIRLOSS_YOUNG =
  'https://pub.hairqare.co/cdn-cgi/image/width=750,quality=85,format=auto/Aleeyah_before-after.webp'
const DAMAGE_IMG_HAIRLOSS_OLDER =
  'https://pub.hairqare.co/cdn-cgi/image/width=750,quality=85,format=auto/anna-before-after-smaller.webp'

const damageImageByConcern: Record<string, string> = {
  concern_splitends:
    'https://assets.hairqare.co/cdn-cgi/image/width=750,quality=85,format=auto/P5%20Split%20Ends.webp',
  concern_scalp:
    'https://pub.hairqare.co/cdn-cgi/image/width=750,quality=85,format=auto/alina-before-after.webp',
  concern_damage:
    'https://pub.hairqare.co/cdn-cgi/image/width=750,quality=85,format=auto/bella-before-after.webp',
}
const DAMAGE_IMAGE_DEFAULT =
  'https://pub.hairqare.co/cdn-cgi/image/width=750,quality=85,format=auto/claudia-large-before-after.webp'

export function damagePitchImage(concernAnswer: string, ageAnswer: string): string {
  if (concernAnswer === 'concern_hairloss') {
    return ageAnswer === 'age_40to49' || ageAnswer === 'age_50+'
      ? DAMAGE_IMG_HAIRLOSS_OLDER
      : DAMAGE_IMG_HAIRLOSS_YOUNG
  }
  return damageImageByConcern[concernAnswer] ?? DAMAGE_IMAGE_DEFAULT
}

export const damagePitchConcernKeys: readonly string[] = [
  'concern_hairloss',
  'concern_splitends',
  'concern_scalp',
  'concern_damage',
]

export const damagePitchTitle = "Don't worry! We got you."

// ===========================================================================
// idx 8 — HOLISTIC PITCH (all copy & images FIXED — no conditionals)
// ===========================================================================

export const holisticDescription =
  'Our evidence-based programs are developed by Sarah Tran, a certified hair loss specialist, along with a team of researchers, formulation scientists, and medical professionals.'

export const holisticClaim = 'Clinically proven to heal your hair quickly and permanently.'

export const holisticValueProp = 'Proven Results for:'

export const holisticCheckmarkIcon = 'https://assets.hairqare.co/checkmark-medium.webp'

export const holisticValues: string[] = [
  'Any hair concern ',
  'Any age',
  'Any hair type',
  'Any hair goal',
]

const CONCERN_INDIRECT: Record<string, string> = {
  concern_hairloss:  'you see more hair in your shower drain',
  concern_damage:    "your hair's been through a lot to look good",
  concern_scalp:     "your scalp hasn't felt right lately",
  concern_splitends: 'your ends break before they grow',
  concern_mixed:     "it's been a bit of everything lately",
}

const DREAM_PHRASE: Record<string, string> = {
  dream_length:   'longer, stronger',
  dream_health:   'softer, shinier, healthier',
  dream_fullness: 'thicker, fuller-looking',
}

export function damagePracticesConclusion(concern: string, dream: string): string {
  const dreamPhrase = DREAM_PHRASE[dream] ?? 'your dream'
  const concernPhrase = CONCERN_INDIRECT[concern]
  if (!concernPhrase) return `Here's what's possible for your dream **${dreamPhrase} hair**:`
  return `So even if ${concernPhrase}, here's what's possible for your dream **${dreamPhrase} hair**:`
}

export const holisticCarouselImages: ConditionalText[] = [
  'https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/67098b9996f780267051a1eb_Pitch%202%20Lindsey.webp',
  'https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/67098b996a9a2ab7893daea6_Pitch%202%20beingdani.webp',
  'https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/67098b98dd5e7ffff5bd68d8_Pitch%202%20Melodie.webp',
]
