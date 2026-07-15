/**
 * Copy functions for the aspirational result page (v2).
 * Personalization fires at exactly THREE moments (HIT #1 / #2 / #3).
 * Everything else is universal. Functions are pure — no side effects.
 *
 * Mindset A = age 18–29 "Early & Curious"
 * Mindset B = age 30–39 "Wants Herself Back"
 * Mindset C = age 40–49 + 50+  "Done Guessing"
 *
 * Dream L = dream_length · S = dream_health · F = dream_fullness
 */

export type Mindset = 'A' | 'B' | 'C'

export function mindsetFor(ageId: string): Mindset {
  if (ageId === 'age_18to29') return 'A'
  if (ageId === 'age_40to49' || ageId === 'age_50+') return 'C'
  return 'B'
}

// HIT #1 — hero support line, keyed on MINDSET
export function heroSupportLine(name: string, mindset: Mindset): string {
  switch (mindset) {
    case 'A':
      return `You're early, ${name}. The advantage most women wish they'd had. The habits that decide your hair are still yours to shape.`
    case 'B':
      return `Your hair can feel like yours again, ${name}. You're not starting over. You're picking back up.`
    case 'C':
      return `You've tried a lot, ${name}. This is the one thing no one ever actually taught you.`
  }
}

// Score bar label, keyed on DREAM
export function dreamScoreLabel(dream: string): string {
  switch (dream) {
    case 'dream_length':   return 'How close you are to longer hair'
    case 'dream_health':   return 'How close you are to healthier, shinier hair'
    case 'dream_fullness': return 'How close you are to thicker, fuller hair'
    default:                  return 'How close you are to longer hair'
  }
}

// Goal card dream paragraph, keyed on DREAM
export function goalCardCopy(dream: string): string {
  switch (dream) {
    case 'dream_length':   return 'Long, strong hair that finally grows past where it always stalls.'
    case 'dream_health':   return 'Soft, glossy hair that looks healthy and feels alive again.'
    case 'dream_fullness': return "Full, thick hair with the body I've been missing."
    default:                  return 'Long, strong hair that finally grows past where it always stalls.'
  }
}

// HIT #2 — future-self headline, keyed on DREAM
export function futureSelfHeadline(dream: string): string {
  switch (dream) {
    case 'dream_length':   return 'This is the part you stopped believing was possible.'
    case 'dream_health':   return 'This is your hair, alive again.'
    case 'dream_fullness': return 'This is hair you don\'t have to hide.'
    default:               return 'This is the part you stopped believing was possible.'
  }
}

// FEEL pill in the KNOW/FEEL/BECOME graphic, keyed on DREAM
export function futureSelfFeelLine(dream: string): string {
  switch (dream) {
    case 'dream_length':   return 'stronger, ready to grow'
    case 'dream_health':   return 'softer, with real shine'
    case 'dream_fullness': return 'fuller, with more body'
    default:                  return 'stronger, ready to grow'
  }
}

// Future-self closing identity line, keyed on CONFIDENCE rating
export function futureSelfClosingLine(confidence: string): string {
  const n = Number(confidence)
  if (n >= 4) return "The version of you that doesn't think twice before wearing it down."
  if (n === 3) return 'The version of you that reaches for the hair tie a little less.'
  return 'The version of you that starts seeing herself again.'
}

// HIT #3 — offer headline, keyed on DREAM
export function offerHeadline(dream: string): string {
  switch (dream) {
    case 'dream_length':
      return "Join the 14-Day Challenge and start building the longer, stronger hair you want, with a routine that's yours for life."
    case 'dream_health':
      return "Join the 14-Day Challenge and bring back the soft, shiny, healthy hair you want, with a routine that's yours for life."
    case 'dream_fullness':
      return "Join the 14-Day Challenge and start building the fuller, thicker hair you want, with a routine that's yours for life."
    default:
      return "Join the 14-Day Challenge and start building the longer, stronger hair you want, with a routine that's yours for life."
  }
}

// Day-14 timeline milestone label, keyed on DREAM
export function timeline14DayLabel(dream: string): string {
  switch (dream) {
    case 'dream_length':   return 'Stronger and ready to grow'
    case 'dream_health':   return 'Visibly shinier and healthier'
    case 'dream_fullness': return 'Fuller, with more body'
    default:                  return 'Stronger and ready to grow'
  }
}
