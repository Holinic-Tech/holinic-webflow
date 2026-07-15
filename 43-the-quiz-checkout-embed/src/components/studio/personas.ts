import type { AnswerState } from '../../engine/answers'

/**
 * One-click preset personas for the Studio, built from REAL answerIds in
 * hairquiz.spec.ts. Each is an AnswerState the marketer can load to see how the
 * whole flow resolves for that audience. "Empty / fallback-everywhere" is the
 * blank state — most conditionals resolve to their `default` (FALLBACK).
 */
export interface PersonaPreset {
  id: string
  label: string
  description: string
  answers: AnswerState
}

export const personaPresets: PersonaPreset[] = [
  {
    id: 'empty',
    label: 'Empty / fallback-everywhere',
    description: 'No answers — most conditionals hit their catch-all default.',
    answers: {},
  },
  {
    id: 'hairloss_50',
    label: '50+ hair-loss',
    description: 'Older audience whose primary concern is hair loss/thinning.',
    answers: {
      hairGoal: ['goal_hairloss'],
      hairType: ['hairType_straight'],
      age: ['age_50+'],
      hairConcern: ['concern_hairloss'],
      currentRoutine: ['routine_basic'],
      knowledgeState: ['knowledge_no'],
      hairqare: ['hairqare_unknown'],
      diet: ['diet_balanced'],
      shampooSpending: ['spend_10to20'],
      hairMyth: ['myth_rosemary', 'myth_coconut'],
      hairDamageActivity: ['damageAction_heat', 'damageAction_dye'],
      confidence: ['4'],
      comparison: ['4'],
      professionalReferral: ['professional_no'],
    },
  },
  {
    id: 'damage_30',
    label: '30s damage',
    description: 'Younger audience with heat/chemical damage as the main concern.',
    answers: {
      hairGoal: ['goal_betterhair'],
      hairType: ['hairType_wavy'],
      age: ['age_30to39'],
      hairConcern: ['concern_damage'],
      currentRoutine: ['routine_complex'],
      knowledgeState: ['knowledge_yes'],
      hairqare: ['hairqare_notunknown'],
      diet: ['diet_custom'],
      shampooSpending: ['spend_over50'],
      hairMyth: ['myth_organic'],
      hairDamageActivity: ['damageAction_heat', 'damageAction_dye', 'damageAction_sun'],
      confidence: ['3'],
      comparison: ['5'],
      professionalReferral: ['professional_yes'],
    },
  },
]

export const emptyPersona: AnswerState = {}
