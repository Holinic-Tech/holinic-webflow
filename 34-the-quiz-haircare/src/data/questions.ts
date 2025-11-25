import type { QuestionConfig, QuestionId } from '../types';

// All 15 quiz questions with exact content from Flutter app
export const questions: Record<QuestionId, QuestionConfig> = {
  // Q1: Hair Goal
  hairGoal: {
    id: 'hairGoal',
    questionText: 'Start by selecting your goal:',
    format: 'imageCard',
    acField: '48',
    mpField: 'Hair Goal',
    options: [
      {
        id: 'goal_hairloss',
        answer: 'I want to stop my hair loss',
        image: 'https://assets.hairqare.co/mid-hairloss-graphic.webp',
      },
      {
        id: 'goal_betterhair',
        answer: 'I want longer, better looking hair',
        image: 'https://assets.hairqare.co/mid-hair-graphic.webp',
      },
      {
        id: 'goal_both',
        answer: 'I want both',
        image: 'https://picsum.photos/seed/682/600',
      },
    ],
  },

  // Q2: Hair Type
  hairType: {
    id: 'hairType',
    questionText: 'Which hair type do you have?',
    format: 'imageCard',
    acField: '20',
    mpField: 'Hair Type',
    options: [
      {
        id: 'hairType_straight',
        answer: 'Straight',
        image: 'https://assets.hairqare.co/Straight%20Hair%20.webp',
      },
      {
        id: 'hairType_wavy',
        answer: 'Wavy',
        image: 'https://assets.hairqare.co/Wavy%20Hair.webp',
      },
      {
        id: 'hairType_curly',
        answer: 'Curly',
        image: 'https://assets.hairqare.co/Curly%20Hair.webp',
      },
      {
        id: 'hairType_coily',
        answer: 'Coily',
        image: 'https://assets.hairqare.co/Coily%20Hair.webp',
      },
      {
        id: 'hairType_unknown',
        answer: "I don't know",
        image: 'https://assets.hairqare.co/Q1-Not%20Sure.webp',
      },
    ],
  },

  // Q3: Age
  age: {
    id: 'age',
    questionText: 'How old are you?',
    format: 'imageCard',
    acField: '6',
    mpField: 'Age Cohort',
    options: [
      {
        id: 'age_18to29',
        answer: '18 - 29',
        image: 'https://assets.hairqare.co/Age%2018-29.webp',
      },
      {
        id: 'age_30to39',
        answer: '30 - 39',
        image: 'https://assets.hairqare.co/Age%2030-39.webp',
      },
      {
        id: 'age_40to49',
        answer: '40 - 49',
        image: 'https://assets.hairqare.co/Age%2040-49.webp',
      },
      {
        id: 'age_50+',
        answer: '50 +',
        image: 'https://assets.hairqare.co/Age%2050%2B.webp',
      },
    ],
  },

  // Q4: Hair Concern
  hairConcern: {
    id: 'hairConcern',
    questionText: 'What is your biggest hair concern right now?',
    subtitle: 'Select one',
    format: 'imageCard',
    acField: '8',
    mpField: 'Hair Concern Type',
    options: [
      {
        id: 'concern_hairloss',
        answer: 'Hair loss or hair thinning',
        image: 'https://assets.hairqare.co/Q3%20Hair%20loss.webp',
      },
      {
        id: 'concern_damage',
        answer: 'Damage from dye, heat, or chemical treatments',
        image: 'https://assets.hairqare.co/Q3%20Damage%20Hair.webp',
      },
      {
        id: 'concern_scalp',
        answer: 'Scalp irritation or dandruff',
        image: 'https://assets.hairqare.co/Q3%20Irritation.webp',
      },
      {
        id: 'concern_splitends',
        answer: 'Split ends, frizz, and dryness',
        image: 'https://assets.hairqare.co/Q3%20Split%20ends.webp',
      },
      {
        id: 'concern_mixed',
        answer: 'Other, mixed issues',
        image: 'https://assets.hairqare.co/Q3%20other.webp',
      },
    ],
  },

  // Q5: Knowledge State
  knowledgeState: {
    id: 'knowledgeState',
    questionText: 'Do you already know exactly what\'s causing your hair issues?',
    format: 'textOption',
    acField: '50',
    mpField: 'Hair Current Issues',
    options: [
      {
        id: 'knowledge_yes',
        answer: '🙏 Yes, but I need more support',
        title: 'Yes, but I need more support',
        emoji: '🙏',
      },
      {
        id: 'knowledge_no',
        answer: "😢 No and I'm tired of searching",
        title: "No and I'm tired of searching",
        emoji: '😢',
      },
      {
        id: 'knowledge_notsure',
        answer: "😥 Not sure, it's complicated by myself",
        title: "Not sure, it's complicated",
        emoji: '😥',
      },
    ],
  },

  // Q6: Mindset State (with feedback)
  mindsetState: {
    id: 'mindsetState',
    questionText: 'Do you believe your hair problems could be influenced by factors beyond just products?',
    subtitle: 'Things like stress, diet, or overall health',
    format: 'feedbackCard',
    acField: '56',
    mpField: 'Hairqare Knowledge',
    options: [
      {
        id: 'mindset_aware',
        answer: 'Yes, definitely',
        image: 'https://assets.hairqare.co/Natural.webp',
        feedbackTitle: "You're absolutely right!",
        feedbackDescription: "Diet, stress, environment, and internal health all impact your hair. Our holistic approach addresses ALL these factors for truly transformative results.",
      },
      {
        id: 'mindset_unsure',
        answer: "Maybe, I'm not sure",
        image: 'https://assets.hairqare.co/None.webp',
        feedbackTitle: "You're on the right track!",
        feedbackDescription: "Diet, stress, environment, and internal health all impact your hair. Our holistic approach addresses ALL these factors for truly transformative results.",
      },
      {
        id: 'mindset_unaware',
        answer: "I've never considered that",
        image: 'https://assets.hairqare.co/Occasional.webp',
        feedbackTitle: "You'll be surprised!",
        feedbackDescription: "Diet, stress, environment, and internal health all impact your hair. Our holistic approach addresses ALL these factors for truly transformative results.",
      },
      {
        id: 'mindset_oblivious',
        answer: 'No, I just need the right product',
        image: 'https://assets.hairqare.co/Basic%20care.webp',
        feedbackTitle: "It's a common misconception",
        feedbackDescription: "Most women focus only on external treatments, missing 50% of what determines hair health. Our approach changes that.",
      },
    ],
  },

  // Q7: Diet
  diet: {
    id: 'diet',
    questionText: 'What best describes your diet?',
    subtitle: 'What we eat affects our hair growth and quality.',
    format: 'imageCard',
    acField: '34',
    mpField: 'Diet',
    options: [
      {
        id: 'diet_balanced',
        answer: 'Balanced / Whole foods',
        image: 'https://assets.hairqare.co/Healthy%20and%20balanced%20diet.webp',
      },
      {
        id: 'diet_vegan',
        answer: 'Vegan / vegetarian',
        image: 'https://assets.hairqare.co/Vegan-vegetarian%20diet.webp',
      },
      {
        id: 'diet_processed',
        answer: 'Fast food / Processed food diet',
        image: 'https://assets.hairqare.co/Mostly%20unhealthy%20diet.webp',
      },
      {
        id: 'diet_custom',
        answer: 'Custom nutrition protocol',
        image: 'https://assets.hairqare.co/Professional%20planned%20diet.webp',
      },
      {
        id: 'diet_other',
        answer: 'Something else',
        image: 'https://assets.hairqare.co/None.webp',
      },
    ],
  },

  // Q8: Shampoo Spending (with feedback)
  shampooSpending: {
    id: 'shampooSpending',
    questionText: 'How much do you spend on a bottle of shampoo?',
    format: 'feedbackCard',
    acField: '7',
    mpField: 'Spending',
    options: [
      {
        id: 'spend_under10',
        answer: 'Less than $10',
        image: 'https://assets.hairqare.co/Less%20than%20%2410.webp',
        feedbackTitle: "Awesome! You're budget conscious!",
        feedbackDescription: "You can actually have amazing results without spending more than you do now (or even less) while avoiding harmful products.",
      },
      {
        id: 'spend_10to20',
        answer: '$10 - $20',
        image: 'https://assets.hairqare.co/%2410%20-%20%2420.webp',
        feedbackTitle: "Amazing! You value your hair!",
        feedbackDescription: "You're spending thoughtfully, but likely still paying for marketing rather than results. With the right routine, you could get transformative results.",
      },
      {
        id: 'spend_20to50',
        answer: '$20 - $50',
        image: 'https://assets.hairqare.co/%2420-%2450.webp',
        feedbackTitle: 'You clearly care about your hair!',
        feedbackDescription: "Did you know, in premium haircare up to 90% of what you're paying goes to packaging and marketing, not quality ingredients?",
      },
      {
        id: 'spend_over50',
        answer: 'More than $50',
        image: 'https://assets.hairqare.co/More%20than%20%2450.webp',
        feedbackTitle: 'Your hair deserves the best!',
        feedbackDescription: "Did you know premium haircare often uses the same ingredients as budget options? With the right personalized routine, you can achieve better results.",
      },
    ],
  },

  // Q9: Hair Myths (multi-select)
  hairMyth: {
    id: 'hairMyth',
    questionText: 'Which of these hair care myths do you believe?',
    subtitle: '(Select all that apply)',
    format: 'multiSelect',
    allowMultiple: true,
    acField: '35',
    mpField: 'hairMyth',
    options: [
      {
        id: 'myth_rosemary',
        title: 'Rosemary oil reduces hair loss',
        answer: 'Rosemary oil reduces hair loss',
        image: 'https://assets.hairqare.co/Rosemary%20Oil.webp',
      },
      {
        id: 'myth_coconut',
        title: 'Coconut oil is the best hair oil',
        answer: 'Coconut oil is the best hair oil',
        image: 'https://assets.hairqare.co/Coconut%20Oil.webp',
      },
      {
        id: 'myth_ricewater',
        title: 'Rice water makes hair grow faster',
        answer: 'Rice water makes hair grow faster',
        image: 'https://assets.hairqare.co/Rice%20Water.webp',
      },
      {
        id: 'myth_organic',
        title: 'Natural / organic products are better',
        answer: 'Natural / organic products are better',
        image: 'https://assets.hairqare.co/Natural.webp',
      },
      {
        id: 'myth_nopoo',
        title: 'Not washing hair is good for the scalp',
        answer: 'Not washing hair is good for the scalp',
        image: 'https://assets.hairqare.co/Not%20Washing.webp',
      },
      {
        id: 'myth_none',
        title: 'None of them',
        answer: 'None of them',
      },
    ],
  },

  // Q10: Hair Damage Activity (multi-select)
  hairDamageActivity: {
    id: 'hairDamageActivity',
    questionText: 'Select the damaging practices that you regularly do',
    subtitle: '(Select all that apply)',
    format: 'multiSelect',
    allowMultiple: true,
    acField: '51',
    mpField: 'hairDamageActivity',
    options: [
      {
        id: 'damage_heat',
        title: 'Heat styling',
        answer: 'Heat styling',
        image: 'https://assets.hairqare.co/heat.webp',
      },
      {
        id: 'damage_dye',
        title: 'Bleaching / hair colouring',
        answer: 'Bleaching / hair colouring',
        image: 'https://assets.hairqare.co/dye.webp',
      },
      {
        id: 'damage_sun',
        title: 'Sun exposure',
        answer: 'Sun exposure',
        image: 'https://assets.hairqare.co/sun.webp',
      },
      {
        id: 'damage_swimming',
        title: 'Frequent swimming',
        answer: 'Frequent swimming',
        image: 'https://assets.hairqare.co/swim.webp',
      },
      {
        id: 'damage_hairstyles',
        title: 'Tight hair styles (braids, bun, ponytail...)',
        answer: 'Tight hair styles',
        image: 'https://assets.hairqare.co/hairstyle.webp',
      },
      {
        id: 'damage_none',
        title: 'None of the above',
        answer: 'None of the above',
      },
    ],
  },

  // Q11: Current Routine
  currentRoutine: {
    id: 'currentRoutine',
    questionText: 'What best describes your current haircare routine?',
    format: 'textOption',
    acField: '18',
    mpField: 'Haircare Background',
    options: [
      {
        id: 'routine_complex',
        title: 'Advanced',
        answer: 'Advanced',
        description: 'Salon visits, premium products, specialists, supplements',
        emoji: '🤓',
      },
      {
        id: 'routine_basic',
        title: 'Basic care',
        answer: 'Basic care',
        description: 'Mostly just shampoo and conditioner',
        emoji: '🫧',
      },
      {
        id: 'routine_intermediete',
        title: 'Occasional pampering',
        answer: 'Occasional pampering',
        description: 'Basic care and occasional hair masks',
        emoji: '🤗',
      },
      {
        id: 'routine_natural',
        title: 'Natural remedies',
        answer: 'Natural remedies',
        description: 'Mostly oils, herbs or DIY treatments',
        emoji: '🌿',
      },
      {
        id: 'routine_other',
        title: 'None of the above',
        answer: 'None of the above',
        description: 'I follow a different haircare routine',
        emoji: '😌',
      },
    ],
  },

  // Q12: Professional Referral
  professionalReferral: {
    id: 'professionalReferral',
    questionText: 'Did a professional refer you to us?',
    format: 'textOption',
    mpField: 'professionalReferral',
    options: [
      {
        id: 'professional_yes',
        title: 'Yes',
        answer: 'Yes',
      },
      {
        id: 'professional_no',
        title: 'No',
        answer: 'No',
      },
      {
        id: 'professional_self',
        title: "I'm a professional",
        answer: "I'm a professional",
      },
    ],
  },

  // Q13: Hairqare Awareness
  hairqare: {
    id: 'hairqare',
    questionText: 'How familiar are you with HairQare and our approach to holistic haircare?',
    format: 'imageCard',
    acField: '56',
    mpField: 'mindsetState',
    options: [
      {
        id: 'hairqare_unknown',
        answer: "I'm hearing about it for the first time",
        image: 'https://assets.hairqare.co/emoji-1.webp',
      },
      {
        id: 'hairqare_notunknown',
        answer: 'I know a few things',
        image: 'https://assets.hairqare.co/emoji-3.webp',
      },
      {
        id: 'hairqare_familiar',
        answer: 'Yes, I know everything about it',
        image: 'https://assets.hairqare.co/emoji-2.webp',
      },
    ],
  },

  // Q14: Confidence (slider)
  confidence: {
    id: 'confidence',
    questionText: 'My reflection in the mirror affects my mood and self-esteem.',
    subtitle: 'How much do you relate to the following statement?',
    format: 'slider',
    acField: '53',
    mpField: 'Emotions Mirror',
    minLabel: 'Not at all',
    maxLabel: 'Totally',
    options: [], // Slider doesn't use options
  },

  // Q15: Comparison (slider)
  comparison: {
    id: 'comparison',
    questionText: "I tend to compare my hair to others' and it makes me frustrated.",
    subtitle: 'How much do you relate to the following statement?',
    format: 'slider',
    acField: '54',
    mpField: 'Emotions Comparison',
    minLabel: 'Not at all',
    maxLabel: 'Totally',
    options: [], // Slider doesn't use options
  },
};

// Question order array
export const questionsOrder: QuestionId[] = [
  'hairGoal',
  'hairType',
  'age',
  'hairConcern',
  'knowledgeState',
  'mindsetState',
  'diet',
  'shampooSpending',
  'hairMyth',
  'hairDamageActivity',
  'currentRoutine',
  'professionalReferral',
  'hairqare',
  'confidence',
  'comparison',
];

export const TOTAL_QUESTIONS = questionsOrder.length;

// Helper to get question by index
export function getQuestionByIndex(index: number): QuestionConfig | null {
  const questionId = questionsOrder[index];
  return questionId ? questions[questionId] : null;
}

// Helper to get question by ID
export function getQuestionById(id: QuestionId): QuestionConfig {
  return questions[id];
}
