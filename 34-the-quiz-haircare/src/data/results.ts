import type { HairConcernSegment, SegmentContent, CouponCode } from '../types';

// Result content by hair concern segment
export const resultsBySegment: Record<HairConcernSegment, SegmentContent> = {
  concern_hairloss: {
    headline: 'Your Personalized Hair Regrowth Plan',
    subheadline: "Based on your answers, we've identified the perfect approach for you",
    goalText: 'Denser hair and noticeable regrowth that fills in sparse areas, so I can have peace of mind and feel beautiful again.',
    issueDescription: 'hair loss',
    testimonials: [
      {
        imageUrl: 'https://uploads-ssl.webflow.com/62cbaa353a301eb715aa33d0/6683d09ec26442e4eeba9de4_Hair%20Loss%20-%201%20Testimonial.webp',
      },
      {
        imageUrl: 'https://uploads-ssl.webflow.com/62cbaa353a301eb715aa33d0/6683d09e2543cd8a08757fb8_Hair%20Loss%20-%202%20Testimonial.webp',
      },
      {
        imageUrl: 'https://uploads-ssl.webflow.com/62cbaa353a301eb715aa33d0/6683d09f2b94a250bd1383e2_Hair%20Loss%20-%203%20Testimonial.webp',
      },
    ],
  },
  concern_splitends: {
    headline: 'Your Anti-Frizz & Repair Plan',
    subheadline: 'Smoothing solutions tailored to your hair needs',
    goalText: 'Smoother, frizz-free hair that makes me feel confident and put-together every day.',
    issueDescription: 'split ends and frizz',
    testimonials: [
      {
        imageUrl: 'https://uploads-ssl.webflow.com/62cbaa353a301eb715aa33d0/6683d3a9d2d4a61eaa91554b_Split%20ends%2C%20frizz%2C%20and%20dryness%20-%201%20testimonial.webp',
      },
      {
        imageUrl: 'https://uploads-ssl.webflow.com/62cbaa353a301eb715aa33d0/6683d3a9089c6bbad97f81c7_Split%20ends%2C%20frizz%2C%20and%20dryness%20-%202%20testimonial.webp',
      },
      {
        imageUrl: 'https://uploads-ssl.webflow.com/62cbaa353a301eb715aa33d0/6683d3a931fd5be8fd4bb15f_Split%20ends%2C%20frizz%2C%20and%20dryness%20-%203%20testimonial.webp',
      },
    ],
  },
  concern_damage: {
    headline: 'Your Hair Repair & Strength Plan',
    subheadline: 'Rebuild and protect your damaged hair',
    goalText: 'Stronger, more resilient hair that I can style daily without worry about further damage.',
    issueDescription: 'hair damage',
    testimonials: [
      {
        imageUrl: 'https://uploads-ssl.webflow.com/62cbaa353a301eb715aa33d0/6683d24f9e0893a5f3dc4b85_P1%20-%20Damage%20Hair%20-%201%20Testimonial.webp',
      },
      {
        imageUrl: 'https://uploads-ssl.webflow.com/62cbaa353a301eb715aa33d0/6683d24fd2d4a61eaa8f5ecd_P1%20-%20Damage%20Hair%20-%202%20Testimonial.webp',
      },
      {
        imageUrl: 'https://uploads-ssl.webflow.com/62cbaa353a301eb715aa33d0/6683d24fa2ced03eff81ffab_P1%20-%20Damage%20Hair%20-%203%20Testimonial.webp',
      },
    ],
  },
  concern_scalp: {
    headline: 'Your Scalp Health & Balance Plan',
    subheadline: 'Soothe, heal, and restore your scalp',
    goalText: 'A calm, itch and flake free scalp that feels healthy and comfortable.',
    issueDescription: 'scalp issues',
    testimonials: [
      {
        imageUrl: 'https://uploads-ssl.webflow.com/62cbaa353a301eb715aa33d0/6683d2e6b48c41fa6be3e2a5_P2%20-%20Dandruff%20-%201%20Testimonial.webp',
      },
      {
        imageUrl: 'https://uploads-ssl.webflow.com/62cbaa353a301eb715aa33d0/6683d2e67bf6260f9a6fa5bc_P2%20-%20Dandruff%20-%202%20Testimonial.webp',
      },
      {
        imageUrl: 'https://uploads-ssl.webflow.com/62cbaa353a301eb715aa33d0/6683d2e78c424f44a9f3b6ed_P2%20-%20Dandruff%20-%203%20Testimonial.webp',
      },
    ],
  },
  concern_mixed: {
    headline: 'Your Complete Hair Wellness Plan',
    subheadline: 'A holistic approach for all your hair concerns',
    goalText: 'Healthier, more beautiful hair that addresses all my concerns with one comprehensive routine.',
    issueDescription: 'hair concerns',
    testimonials: [
      {
        imageUrl: 'https://uploads-ssl.webflow.com/62cbaa353a301eb715aa33d0/6683d4a66e73d2fd6d9c49d7_P4%20Others%20-%201%20Testimonial.webp',
      },
      {
        imageUrl: 'https://uploads-ssl.webflow.com/62cbaa353a301eb715aa33d0/6683d4a6dfe0e6f84dd1fa81_P4%20Others%20-%202%20Testimonial.webp',
      },
      {
        imageUrl: 'https://uploads-ssl.webflow.com/62cbaa353a301eb715aa33d0/6683d4a6f3d1e5b8e11ef3a9_P4%20Others%20-%203%20Testimonial.webp',
      },
    ],
  },
};

// Age-based text formatting
export const ageText: Record<string, string> = {
  'age_18to29': 'in their twenties',
  'age_30to39': 'in their thirties',
  'age_40to49': 'in their forties',
  'age_50+': 'after the age of 50',
};

// Get coupon code based on answers
export function getCouponCode(
  hairConcern: string,
  diet?: string
): CouponCode {
  if (hairConcern === 'concern_hairloss') return 'c_hl';
  if (hairConcern === 'concern_damage' || hairConcern === 'concern_splitends') return 'c_dh';
  if (hairConcern === 'concern_scalp') return 'c_si';
  if (diet === 'diet_custom' || diet === 'diet_balanced') return 'd_bc';
  return 'o_df';
}

// Get result content based on hair concern
export function getResultContent(hairConcern: string): SegmentContent {
  const segment = hairConcern as HairConcernSegment;
  return resultsBySegment[segment] || resultsBySegment.concern_mixed;
}

// Get age-specific text
export function getAgeText(age: string): string {
  return ageText[age] || '';
}
