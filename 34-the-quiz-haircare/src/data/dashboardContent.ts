// Dashboard content data - personalized based on quiz answers

// Age avatar images - keys must match question answer IDs in questions.ts
export const ageAvatars: Record<string, string> = {
  age_18to29: 'https://uploads-ssl.webflow.com/62cbaa353a301eb715aa33d0/66b37050731caef7208325c3_Under%2018.svg',
  age_30to39: 'https://uploads-ssl.webflow.com/62cbaa353a301eb715aa33d0/66b3705002a6a9516930e533_25-34.svg',
  age_40to49: 'https://uploads-ssl.webflow.com/62cbaa353a301eb715aa33d0/66b3705003f42517011b493e_35-44.svg',
  'age_50+': 'https://uploads-ssl.webflow.com/62cbaa353a301eb715aa33d0/66b370508968423fab443088_45%2B.svg',
};

// Age summary text - keys must match question answer IDs in questions.ts
export const ageSummaryText: Record<string, string> = {
  age_18to29: 'In my 20s',
  age_30to39: 'In my 30s',
  age_40to49: 'In my 40s',
  'age_50+': 'Age 50+',
};

// Context images shown above the timeline (condition-specific illustration)
export const contextImages: Record<string, string> = {
  concern_hairloss: 'https://assets.hairqare.co/RP%20Hairloss.webp',
  concern_splitends: 'https://assets.hairqare.co/RP%20Split%20ends.webp',
  concern_scalp: 'https://assets.hairqare.co/RP%20Dandruff.webp',
  concern_damage: 'https://assets.hairqare.co/RP%20Damage.webp',
  concern_mixed: 'https://assets.hairqare.co/RP%20Others.webp',
};

// Timeline images based on hair concern
export const timelineImages: Record<string, string> = {
  concern_hairloss: 'https://assets.hairqare.co/RP%20hairloss%20timeline.webp',
  concern_splitends: 'https://assets.hairqare.co/RP%20Split%20ends%20timeline.webp',
  concern_scalp: 'https://assets.hairqare.co/RP%20dandruff%20timeline.webp',
  concern_damage: 'https://assets.hairqare.co/RP%20damage%20timeline.webp',
  concern_mixed: 'https://assets.hairqare.co/RP%20others%20timeline.webp',
};

// Goal descriptions based on hair concern
export const goalDescriptions: Record<string, string> = {
  concern_hairloss: 'Denser hair and noticeable regrowth that fills in sparse areas, so I can have peace of mind and feel beautiful again.',
  concern_splitends: 'Smoother, frizz-free hair that makes me feel confident and put-together every day.',
  concern_scalp: 'A calm, itch and flake free scalp that allows me to go through my day without constant distraction or embarrassment from scratching.',
  concern_damage: 'Stronger, more resilient hair that I can style daily without guilt or worry about damage.',
  concern_mixed: 'Healthy, problem-free hair that behaves exactly how I want it to, letting me enjoy my hair without constantly battling different problems.',
};

// Concern text for challenge call-to-action
export const concernTextMap: Record<string, string> = {
  concern_hairloss: 'hair loss',
  concern_splitends: 'split-ends',
  concern_scalp: 'scalp issues',
  concern_damage: 'damaged hair',
  concern_mixed: 'chronic hair problems',
};

// Score testimonial text based on hair goal
export const scoreTestimonialText: Record<string, string> = {
  goal_hairloss: '9 out of 10 women with this score said their shedding stopped, and they started seeing new baby hairs after the challenge.',
  goal_betterhair: '9 out of 10 women with this score said their hair felt softer, healthier, and looked better after the challenge.',
  goal_both: '9 out of 10 women with this score said their shedding stopped, and their hair looked and felt better after the challenge.',
};

// Testimonial carousel images by concern (7 images each)
export const testimonialImages: Record<string, string[]> = {
  concern_hairloss: [
    'https://uploads-ssl.webflow.com/62cbaa353a301eb715aa33d0/6683d09ec26442e4eeba9de4_Hair%20Loss%20-%201%20Testimonial.webp',
    'https://assets.hairqare.co/Hair%20loss%20Testimonial%202.webp',
    'https://assets.hairqare.co/Hair%20loss%20Testimonial%203.webp',
    'https://assets.hairqare.co/Hair%20loss%20Testimonial%204.webp',
    'https://assets.hairqare.co/Hair%20loss%20Testimonial%205.webp',
    'https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/66fe7670946a4f4efe78f27f_Hair%20loss%20Testimonial%202.webp',
    'https://uploads-ssl.webflow.com/62cbaa353a301eb715aa33d0/66c8412b13f435c278b09918_Hair%20Loss%20Testimonial%20Result%20Page%202.webp',
  ],
  concern_splitends: [
    'https://uploads-ssl.webflow.com/62cbaa353a301eb715aa33d0/6683d3a9d2d4a61eaa91554b_Split%20ends%2C%20frizz%2C%20and%20dryness%20-%201%20testimonial.webp',
    'https://assets.hairqare.co/Split%20Ends%20%20Testimonial%201.webp',
    'https://assets.hairqare.co/Split%20Ends%20%20Testimonial%203.webp',
    'https://assets.hairqare.co/Split%20Ends%20%20Testimonial%204.webp',
    'https://assets.hairqare.co/Split%20Ends%20%20Testimonial%205.webp',
    'https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/66fe76356f58f44bfa5512fa_Split%20Ends%20%20Testimonial%203.webp',
    'https://uploads-ssl.webflow.com/62cbaa353a301eb715aa33d0/66c8403717c1885294257de6_Frizzy%20hair%20Testimonial%20Result%20Page%202.webp',
  ],
  concern_scalp: [
    'https://uploads-ssl.webflow.com/62cbaa353a301eb715aa33d0/6683d1a61f17786b5fe9c712_Irritation%20or%20dandruff%20-%201%20Testimonial.webp',
    'https://assets.hairqare.co/Dandruff%20%20Testimonial%202.webp',
    'https://assets.hairqare.co/Dandruff%20%20Testimonial%203.webp',
    'https://assets.hairqare.co/Dandruff%20%20Testimonial%204.webp',
    'https://assets.hairqare.co/Dandruff%20%20Testimonial%205.webp',
    'https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/66fe76ce650a4ff4c90f9b78_Dandruff%20%20Testimonial%203.webp',
    'https://uploads-ssl.webflow.com/62cbaa353a301eb715aa33d0/66c840fec3d7ba7a98f73c5e_Dandruff%20Testimonial%20Result%20Page%201.webp',
  ],
  concern_damage: [
    'https://uploads-ssl.webflow.com/62cbaa353a301eb715aa33d0/6683d23f22126707b71fc4b1_Damage%20Hair%20-%201%20Testimonial.webp',
    'https://assets.hairqare.co/Damage%20%20Testimonial%201.webp',
    'https://assets.hairqare.co/Damage%20%20Testimonial%203.webp',
    'https://assets.hairqare.co/Damage%20%20Testimonial%204.webp',
    'https://assets.hairqare.co/Damage%20%20Testimonial%205.webp',
    'https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/66fe769e9687b41e5951e1c4_Damage%20%20Testimonial%203.webp',
    'https://uploads-ssl.webflow.com/62cbaa353a301eb715aa33d0/66c8402237fd9f68f6532610_Color%20Damage%20Testimonial%20Result%20Page%201.webp',
  ],
  concern_mixed: [
    'https://uploads-ssl.webflow.com/62cbaa353a301eb715aa33d0/6683d517d06ef1a809dce40d_Others%20-%201%20testimonial.webp',
    'https://assets.hairqare.co/Other%20issue%20Testimonial%201.webp',
    'https://assets.hairqare.co/Other%20issue%20Testimonial%203.webp',
    'https://assets.hairqare.co/Other%20issue%20Testimonial%204.webp',
    'https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/66fe75f0f77bbb2bd03633c7_Other%20issue%20Testimonial%203.webp',
    'https://uploads-ssl.webflow.com/62cbaa353a301eb715aa33d0/66c8414cec3e40bd589807db_Other%20issues%20Testimonial%20Result%20Page%201.webp',
  ],
};

// Closing images for Section 12 (distinct from carousel testimonials)
export const closingImages: Record<string, string> = {
  concern_hairloss: 'https://uploads-ssl.webflow.com/62cbaa353a301eb715aa33d0/66c8412b13f435c278b09918_Hair%20Loss%20Testimonial%20Result%20Page%202.webp',
  concern_splitends: 'https://uploads-ssl.webflow.com/62cbaa353a301eb715aa33d0/66c8403717c1885294257de6_Frizzy%20hair%20Testimonial%20Result%20Page%202.webp',
  concern_scalp: 'https://uploads-ssl.webflow.com/62cbaa353a301eb715aa33d0/66c840fec3d7ba7a98f73c5e_Dandruff%20Testimonial%20Result%20Page%201.webp',
  concern_damage: 'https://uploads-ssl.webflow.com/62cbaa353a301eb715aa33d0/66c8402237fd9f68f6532610_Color%20Damage%20Testimonial%20Result%20Page%201.webp',
  concern_mixed: 'https://uploads-ssl.webflow.com/62cbaa353a301eb715aa33d0/66c8414cec3e40bd589807db_Other%20issues%20Testimonial%20Result%20Page%201.webp',
};

// Ratings background image
export const ratingsBackgroundImage = 'https://assets.hairqare.co/Ratings%20BG.webp';

// Challenge benefits
export const challengeBenefits = [
  'Target the root causes of your hair issues and stop them from coming back.',
  'Build a personalized, easy-to-follow haircare plan tailored to your unique needs.',
  'Create your own gentle, DIY shampoo & conditioner for lasting results',
];

// Benefits card content
export const benefitsCardContent = [
  {
    boldText: 'reviewed by haircare experts.',
    fullText: 'Science-based and reviewed by haircare experts.',
  },
  {
    boldText: 'personalized to your needs.',
    fullText: 'A haircare routine personalized to your needs.',
  },
  {
    boldText: 'easy to follow daily.',
    fullText: 'Simple steps that are easy to follow daily.',
  },
];

// Checkout URL
export const CHECKOUT_BASE_URL = 'https://checkout.hairqare.co/buy/hairqare-challenge-save-85-5/';
