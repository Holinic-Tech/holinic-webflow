// Pitch screen content based on FlutterFlow source code analysis
// These are standalone screens that appear between questions

import type { PitchType } from './screenFlow';

// Images based on hair concern
export const concernImages: Record<string, string> = {
  concern_hairloss: 'https://assets.hairqare.co/P3%20Hair%20Loss.webp',
  concern_splitends: 'https://assets.hairqare.co/P5%20Split%20Ends.webp',
  concern_scalp: 'https://assets.hairqare.co/P2%20Dandruff.webp',
  concern_damage: 'https://assets.hairqare.co/P1%20Damage%20Hair.webp',
  default: 'https://assets.hairqare.co/P4%20Others.webp',
};

// Statistics based on hair concern
export const concernStats: Record<string, string> = {
  concern_hairloss: '96.3%',
  concern_splitends: '92.5%',
  concern_scalp: '93.8%',
  concern_damage: '91.2%',
  default: 'over 90%',
};

// Concern text descriptions
export const concernText: Record<string, string> = {
  concern_hairloss: 'hair loss and thinning',
  concern_splitends: 'split ends and dryness',
  concern_scalp: 'dandruff and scalp irritation',
  concern_damage: 'damaged hair and breakage',
  default: 'mixed hair issues',
};

// Results text based on hair concern
export const concernResults: Record<string, string> = {
  concern_hairloss: 'see visibly denser and thicker hair',
  concern_splitends: 'see visibly denser hair and less frizz',
  concern_scalp: 'stop experiencing scalp irritation and flakes',
  concern_damage: 'experience less breakage and more density',
  default: 'achieve visibly better hair',
};

// Age text mapping
export const ageText: Record<string, string> = {
  age_18to29: 'in their twenties,',
  age_30to39: 'in their thirties,',
  age_40to49: 'in their fourties,',
  'age_50+': 'after the age of 50,',
  default: 'regardless of their age,',
};

// Pitch Screen 1 (index 6): Simple pitch after knowledgeState
export interface SimplePitchData {
  type: 'simple';
  title: string;
  getDescription: (answers: Record<string, string | string[] | number>) => string;
  getImage: (answers: Record<string, string | string[] | number>) => string;
}

export const simplePitchData: SimplePitchData = {
  type: 'simple',
  title: "Don't worry! We got you.",
  getDescription: (answers) => {
    const hairConcern = answers.hairConcern as string;
    const age = answers.age as string;

    const stat = concernStats[hairConcern] || concernStats.default;
    const concern = concernText[hairConcern] || concernText.default;
    const agePhrase = ageText[age] || ageText.default;
    const result = concernResults[hairConcern] || concernResults.default;

    return `Did you know research shows that ${stat} of women, struggling with ${concern} ${agePhrase} ${result} within 14 days of switching to evidence-based haircare.`;
  },
  getImage: (answers) => {
    const hairConcern = answers.hairConcern as string;
    return concernImages[hairConcern] || concernImages.default;
  },
};

// Pitch Screen 2 (index 8): Detailed pitch after hairqareKnowledge
export interface DetailedPitchData {
  type: 'detailed';
  description: string;
  claim: string;
  valueProp: string;
  values: string[];
  carouselImages: string[];
}

export const detailedPitchData: DetailedPitchData = {
  type: 'detailed',
  description: 'Our evidence-based programs are developed by Sarah Tran, a certified hair loss specialist, along with a team of researchers, formulation scientists, and medical professionals.',
  claim: 'Clinically proven to heal your hair quickly and permanently.',
  valueProp: 'Proven Results for:',
  values: [
    'Any hair concern',
    'Any age',
    'Any hair type',
    'Any hair goal',
  ],
  carouselImages: [
    'https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/67098b9996f780267051a1eb_Pitch%202%20Lindsey.webp',
    'https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/67098b996a9a2ab7893daea6_Pitch%202%20beingdani.webp',
    'https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/67098b98dd5e7ffff5bd68d8_Pitch%202%20Melodie.webp',
  ],
};

// Pitch Screen 3 (index 13): Dynamic pitch after hairDamageActivity
export interface DynamicPitchData {
  type: 'dynamic';
  getDescription: (answers: Record<string, string | string[] | number>) => string;
  getClaim: (answers: Record<string, string | string[] | number>) => string;
  conclusion: string;
  valueProp: string;
  getCarouselImages: (answers: Record<string, string | string[] | number>) => string[];
}

// Testimonial images based on concern
const testimonialImagesByConcern: Record<string, string[]> = {
  concern_hairloss: [
    'https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/66fe7670946a4f4efe78f27f_Hair%20loss%20Testimonial%202.webp',
    'https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/66fe766f521064e5a70c318e_Hair%20loss%20Testimonial%203.webp',
    'https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/66fe766f4e52e1e187b3c477_Hair%20loss%20Testimonial%204.webp',
  ],
  concern_splitends: [
    'https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/66fe76356f58f44bfa5512fa_Split%20Ends%20%20Testimonial%203.webp',
    'https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/66fe7635420a4e34119c551b_Split%20Ends%20%20Testimonial%201.webp',
    'https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/66fe7635d9a4fcb363d5d162_Split%20Ends%20%20Testimonial%204.webp',
  ],
  concern_scalp: [
    'https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/66fe76ce650a4ff4c90f9b78_Dandruff%20%20Testimonial%203.webp',
    'https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/66fe76ce81f8b661564e2394_Dandruff%20%20Testimonial%202.webp',
    'https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/66fe76ceddf5ee9b84190120_Dandruff%20%20Testimonial%204.webp',
  ],
  concern_damage: [
    'https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/66fe769e9687b41e5951e1c4_Damage%20%20Testimonial%203.webp',
    'https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/66fe769f85dca920b329cf16_Damage%20%20Testimonial%201.webp',
    'https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/66fe769f77537071f1a60cdf_Damage%20%20Testimonial%204.webp',
  ],
  default: [
    'https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/66fe75f0f77bbb2bd03633c7_Other%20issue%20Testimonial%203.webp',
    'https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/66fe75efe655a39ef2c53565_Other%20issue%20Testimonial%201.webp',
    'https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/66fe75eff1bd5a87716d7f23_Other%20issue%20Testimonial%204.webp',
  ],
};

export const dynamicPitchData: DynamicPitchData = {
  type: 'dynamic',
  getDescription: (answers) => {
    const hairDamageActivity = answers.hairDamageActivity as string[];

    // Determine activity text based on damage activities
    let activityText = 'style your hair any way you like and do the activities you enjoy.';

    if (hairDamageActivity && Array.isArray(hairDamageActivity)) {
      const hasHeatDyeHairstyles = hairDamageActivity.some(a =>
        ['damageAction_heat', 'damageAction_dye', 'damageAction_hairstyles'].includes(a)
      );
      const hasSwimmingSun = hairDamageActivity.some(a =>
        ['damageAction_swimming', 'damageAction_sun'].includes(a)
      );

      if (hasHeatDyeHairstyles) {
        activityText = 'to style, curl or color your hair.';
      } else if (hasSwimmingSun) {
        activityText = 'live an active lifestyle.';
      }
    }

    return `With the right routine it's fine ${activityText}`;
  },
  getClaim: (answers) => {
    const currentRoutine = answers.currentRoutine as string;
    const hairConcern = answers.hairConcern as string;

    const concern = concernText[hairConcern] || concernText.default;

    if (currentRoutine === 'routine_complex') {
      return `But if you are still struggling with ${concern} despite all the treatments, specialists and products you've tried, you're missing important haircare knowledge.`;
    } else if (currentRoutine === 'routine_basic') {
      return `But if you are still struggling with ${concern} while only relying on using shampoo & conditioner, you're missing important haircare knowledge.`;
    } else {
      return `If you are struggling with ${concern}, you may be missing important haircare knowledge.`;
    }
  },
  conclusion: "The HairQare 14-Day Challenge teaches you the exact science-backed routines and techniques you need to transform your hair—permanently.",
  valueProp: "See what others achieved:",
  getCarouselImages: (answers) => {
    const hairConcern = answers.hairConcern as string;
    const baseImages = testimonialImagesByConcern[hairConcern] || testimonialImagesByConcern.default;

    // Add the common testimonial image
    return [
      baseImages[0],
      'https://assets.hairqare.co/text-only-recommended-testimonial.webp',
      'https://uploads-ssl.webflow.com/62cbaa353a301eb715aa33d0/66c7356034a5be779c112cf1_PITCH%203%20Testimonial%202.webp',
      baseImages[1],
      baseImages[2],
    ];
  },
};

// Loading screen content
export const loadingScreenContent = {
  title: 'Creating your personalized haircare program',
  checkpoints: [
    'Checking your hair condition',
    'Analysing your routine',
    'Checking your challenge-fit',
  ],
  carouselImages: [
    'https://assets.hairqare.co/Hair-Routine_TP-Updated.webp',
    'https://assets.hairqare.co/Hair%20Routine%20(1)-03%20copy.webp',
    'https://assets.hairqare.co/Hair%20Routine-04.webp',
    'https://assets.hairqare.co/Hair%20Routine-05.webp',
  ],
};

// Helper to get pitch data by type
export function getPitchDataByType(pitchType: PitchType) {
  switch (pitchType) {
    case 'simple':
      return simplePitchData;
    case 'detailed':
      return detailedPitchData;
    case 'dynamic':
      return dynamicPitchData;
    default:
      return null;
  }
}
