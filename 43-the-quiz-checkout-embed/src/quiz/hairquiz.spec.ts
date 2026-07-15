import type { QuizSpec } from '../spec/types'
import {
  pitchCarouselImages,
  concernResolutionChance,
} from './content/pitch-claim-matrix'
import { holisticCarouselImages } from './content/pitch-detail-matrix'

export const hairquizSpec: QuizSpec = {
  id: '43-the-quiz-checkout-embed',
  quizId: '43-the-quiz-checkout-embed',
  screens: [
    // idx 0 — Start cover: dream selection (first tap = first answer, zero commit gate)
    {
      kind: 'question',
      id: 's_goal',
      type: 'single',
      questionId: 'hairDream',
      prompt: "What's your hair dream?",
      answers: [
        { answerId: 'dream_length',   label: 'Longer hair',            imageUrl: 'https://pub.hairqare.co/quiz40/long-hair.webp' },
        { answerId: 'dream_health',   label: 'Healthier, shinier hair', imageUrl: 'https://pub.hairqare.co/quiz40/Healthy-hair.webp' },
        { answerId: 'dream_fullness', label: 'Thicker, fuller hair',    imageUrl: 'https://pub.hairqare.co/quiz40/thicker-hair.webp' },
      ],
      progression: 'auto',
      cdp: { acField: 82, mpField: 'Hair_Dream' },
      cover: {
        backgroundUrl: 'https://pub.hairqare.co/quiz40/Sarah-Gradient-2.webp',
        logoUrl: 'https://assets.hairqare.co/Hairqare_white_logo_1.webp',
        subhead: 'See how close you are to the hair you want',
      },
    },
    // idx 1 — Hair type ---------------------------------------------------------
    {
      kind: 'question',
      id: 's_hairtype',
      type: 'image',
      questionId: 'hairType',
      prompt: 'Which hair type do you have?',
      imageLayout: 'tile',
      answers: [
        { answerId: 'hairType_straight', label: 'Straight', imageUrl: 'https://assets.hairqare.co/Straight%20Hair%20.webp' },
        { answerId: 'hairType_wavy', label: 'Wavy', imageUrl: 'https://assets.hairqare.co/Wavy%20Hair.webp' },
        { answerId: 'hairType_curly', label: 'Curly', imageUrl: 'https://assets.hairqare.co/Curly%20Hair.webp' },
        { answerId: 'hairType_coily', label: 'Coily', imageUrl: 'https://assets.hairqare.co/Coily%20Hair.webp' },
        { answerId: 'hairType_unknown', label: "I don't know", imageUrl: 'https://assets.hairqare.co/Q1-Not%20Sure.webp' },
      ],
      progression: 'auto',
      cdp: { acField: 20, mpField: 'Hair Type' },
    },
    // idx 2 — Age ---------------------------------------------------------------
    {
      kind: 'question',
      id: 's_age',
      type: 'image',
      questionId: 'age',
      prompt: 'How old are you?',
      imageLayout: 'row',
      answers: [
        { answerId: 'age_18to29', label: '18 - 29', imageUrl: 'https://assets.hairqare.co/Age%2018-29.webp' },
        { answerId: 'age_30to39', label: '30 - 39', imageUrl: 'https://assets.hairqare.co/Age%2030-39.webp' },
        { answerId: 'age_40to49', label: '40 - 49', imageUrl: 'https://assets.hairqare.co/Age%2040-49.webp' },
        { answerId: 'age_50+', label: '50 +', imageUrl: 'https://assets.hairqare.co/Age%2050%2B.webp' },
      ],
      progression: 'auto',
      cdp: { acField: 6, mpField: 'Age Cohort' },
    },
    // idx 3 — Biggest hair concern ---------------------------------------------
    {
      kind: 'question',
      id: 's_concern',
      type: 'image',
      questionId: 'hairConcern',
      prompt: {
        by: 'hairDream',
        cases: {
          dream_length:   'Is there anything that might be getting in the way of your dream to have longer hair?',
          dream_health:   'Is there anything that might be getting in the way of your dream to have healthier & shinier hair?',
          dream_fullness: 'Is there anything that might be getting in the way of your dream to have thicker & fuller hair?',
        },
        default: 'Is there anything that might be getting in the way of your dream hair?',
      },
      subtitle: 'Select one',
      imageLayout: 'row',
      answers: [
        { answerId: 'concern_hairloss', label: 'Hair loss or hair thinning', imageUrl: 'https://assets.hairqare.co/Q3%20Hair%20loss.webp' },
        { answerId: 'concern_damage', label: 'Damage from dye, heat, or chemical treatments', imageUrl: 'https://assets.hairqare.co/Q3%20Damage%20Hair.webp' },
        { answerId: 'concern_scalp', label: 'Scalp irritation or dandruff', imageUrl: 'https://assets.hairqare.co/Q3%20Irritation.webp' },
        { answerId: 'concern_splitends', label: 'Split ends, frizz, and dryness', imageUrl: 'https://assets.hairqare.co/Q3%20Split%20ends.webp' },
        { answerId: 'concern_mixed', label: 'Other, mixed issues', imageUrl: 'https://assets.hairqare.co/Q3%20other.webp' },
      ],
      progression: 'auto',
      cdp: { acField: 8, mpField: 'Hair Concern Type' },
    },
    // idx 4 — Current routine ---------------------------------------------------
    {
      kind: 'question',
      id: 's_routine',
      type: 'single',
      questionId: 'currentRoutine',
      prompt: 'What best describes your current haircare routine?',
      answers: [
        { answerId: 'routine_complex', label: '🤓 Advanced', description: 'Salon visits, premium products, specialists, supplements' },
        { answerId: 'routine_basic', label: '🫧 Basic care', description: 'Mostly just shampoo and conditioner' },
        { answerId: 'routine_intermediete', label: '🤗 Occasional pampering', description: 'Basic care and occasional hair masks' },
        { answerId: 'routine_natural', label: '🌿 Natural remedies', description: 'Mostly oils, herbs or DIY treatments' },
        { answerId: 'routine_other', label: '😌 None of the above', description: 'I follow a different haircare routine' },
      ],
      progression: 'auto',
      cdp: { acField: 18, mpField: 'Haircare Background' },
    },
    // idx 5 — Damage Pitch (interstitial) --------------------------------------
    {
      kind: 'pitch',
      id: 's_damage_pitch',
      label: 'Damage Pitch',
      headline: "Don't worry. You're not starting from scratch.",
      body: '',
      blocks: [
        { kind: 'damageImage', concernQuestionId: 'hairConcern', ageQuestionId: 'age' },
        { kind: 'text', text: "Don't worry.\nYou're **not starting from scratch**.", weight: 'semibold' },
        {
          kind: 'text',
          text: {
            by: 'hairConcern',
            cases: {
              concern_hairloss:  "If your brush has been collecting more than usual, **the problem was never you**. No one taught you to care for your hair **from the inside out**, instead of reaching for one more product that only works **on the surface**.",
              concern_damage:    "If your hair's paid the price for looking good, **the problem was never you**. No one taught you to care for your hair **from the inside out**, instead of reaching for one more product that only works **on the surface**.",
              concern_scalp:     "If you've been covering up more than showing it off, **the problem was never you**. No one taught you to care for your hair **from the inside out**, instead of reaching for one more product that only works **on the surface**.",
              concern_splitends: "If your ends are dry, frizzy, and breaking before they grow, **the problem was never you**. No one taught you to care for your hair **from the inside out**, instead of reaching for one more product that only works **on the surface**.",
              concern_mixed:     "If your hair's been a bit of everything lately, **the problem was never you**. No one taught you to care for your hair **from the inside out**, instead of reaching for one more product that only works **on the surface**.",
            },
            default: "**The problem was never you**. No one taught you to care for your hair **from the inside out**, instead of reaching for one more product that only works **on the surface**.",
          },
          weight: 'normal',
        },
        {
          kind: 'text',
          text: {
            by: 'hairDream',
            cases: {
              dream_length:   "That's the whole switch.\nIn just **14 days**, you can understand exactly how to get **longer, stronger hair** and keep it **for life**.",
              dream_health:   "That's the whole switch.\nIn just **14 days**, you can understand exactly how to get **softer, shinier, healthier hair** and keep it **for life**.",
              dream_fullness: "That's the whole switch.\nIn just **14 days**, you can understand exactly how to get **thicker, fuller-looking hair** and keep it **for life**.",
            },
            default: "That's the whole switch.\nIn just **14 days**, you can understand exactly how to get **the hair you want** and keep it **for life**.",
          },
          weight: 'normal',
        },
      ],
    },
    // idx 7 — Hairqare-method familiarity --------------------------------------
    {
      kind: 'question',
      id: 's_hairqare',
      type: 'image',
      questionId: 'hairqare',
      prompt: 'How familiar are you with HairQare and our approach to holistic haircare?',
      imageLayout: 'row',
      answers: [
        { answerId: 'hairqare_unknown', label: "I'm hearing about it for the first time", imageUrl: 'https://assets.hairqare.co/emoji-1.webp' },
        { answerId: 'hairqare_notunknown', label: 'I know a few things', imageUrl: 'https://assets.hairqare.co/emoji-3.webp' },
        { answerId: 'hairqare_familiar', label: 'Yes, I know everything about it', imageUrl: 'https://assets.hairqare.co/emoji-2.webp' },
      ],
      progression: 'auto',
      cdp: { acField: 56, mpField: 'mindsetState' },
    },
    // idx 8 — Holistic Pitch (interstitial) ------------------------------------
    {
      kind: 'pitch',
      id: 's_holistic_pitch',
      label: 'Holistic Pitch',
      headline: "HairQare's evidence-based programs come from Sarah Tran, a celebrity stylist working alongside Korea's top beauty formulation experts.",
      body: '',
      blocks: [
        // Credibility statement — single unified sentence, no hierarchy split
        { kind: 'text', text: "HairQare's evidence-based programs come from **Sarah Tran**, a celebrity stylist working alongside **Korea's top beauty formulation experts**.", weight: 'normal', align: 'center' },
        // Mechanism
        { kind: 'text', text: "What she developed **isn't a product**.", weight: 'semibold', align: 'center' },
        { kind: 'text', text: "It's a complete holistic hair routine\nbuilt around **YOUR hair and your body**.", weight: 'normal', align: 'center' },
        { kind: 'text', text: "Once you know how it works, you'll **never** hand your hair over to a bottle, a salon, or a shelf of products again.\n**Not for the rest of your life.**", weight: 'normal', align: 'center' },
        // Trust image — replaces the statCard
        { kind: 'image', src: 'https://pub.hairqare.co/quiz40/trust-bar-for-pitch-screen.webp' },
        // Testimonials
        { kind: 'divider' },
        { kind: 'carousel', images: holisticCarouselImages },
      ],
    },
    // idx 9 — Shampoo spend (image tiles + per-answer reveal card) -------------
    {
      kind: 'question',
      id: 's_spend',
      type: 'single',
      questionId: 'shampooSpending',
      prompt: 'How much do you spend on a bottle of shampoo?',
      answers: [
        {
          answerId: 'spend_under10',
          label: 'Less than $10',
          imageUrl: 'https://assets.hairqare.co/Less%20than%20%2410.webp',
          reveal: {
            title: "Awesome 🤩 you're budget conscious!",
            body: "You can actually have amazing results without spending more than you do now (or even less) while avoiding harmful products that secretly ruin your hair. You just need the right routine for your unique situation.",
          },
        },
        {
          answerId: 'spend_10to20',
          label: '$10 - $20',
          imageUrl: 'https://assets.hairqare.co/%2410%20-%20%2420.webp',
          reveal: {
            title: 'Amazing 🙌 you value your hair!',
            body: "You're spending thoughtfully, but likely still paying for marketing rather than results. With the right routine, you could get truly transformative results tailored to your unique needs without spending more.",
          },
        },
        {
          answerId: 'spend_20to50',
          label: '$20 - $50',
          imageUrl: 'https://assets.hairqare.co/%2420-%2450.webp',
          reveal: {
            title: 'You clearly care about your hair 💜',
            body: "Did you know, in premium haircare up to 90% of what you're paying goes to packaging and marketing, not quality ingredients? With the right routine, you can actually get the premium results you're looking for without the price tag.",
          },
        },
        {
          answerId: 'spend_over50',
          label: 'More than $50',
          imageUrl: 'https://assets.hairqare.co/More%20than%20%2450.webp',
          reveal: {
            title: 'Your hair deserves the best ✨',
            body: 'Did you know premium haircare often uses the same ingredients as budget options? With the right personalized routine, you can actually achieve the results those luxury brands are just promising.',
          },
        },
      ],
      progression: 'cta',
      cdp: { acField: 7, mpField: 'Spending' },
    },
    // idx 11 — Hair myths (multi-select) ---------------------------------------
    {
      kind: 'question',
      id: 's_myths',
      type: 'multi',
      questionId: 'hairMyth',
      prompt: 'Which of these hair care myths do you believe?',
      subtitle: 'Select all that apply',
      answers: [
        { answerId: 'myth_rosemary', label: 'Rosemary oil is reduces hair loss', imageUrl: 'https://assets.hairqare.co/Rosemary%20Oil.webp' },
        { answerId: 'myth_coconut', label: 'Coconut oil is the best hair oil', imageUrl: 'https://assets.hairqare.co/Coconut%20Oil.webp' },
        { answerId: 'myth_ricewater', label: 'Rice water makes hair grow faster', imageUrl: 'https://assets.hairqare.co/Rice%20Water.webp' },
        { answerId: 'myth_organic', label: 'Natural / organic products are better', imageUrl: 'https://assets.hairqare.co/Natural.webp' },
        { answerId: 'myth_nopoo', label: 'Not washing hair is good for the scalp', imageUrl: 'https://assets.hairqare.co/Not%20Washing.webp' },
      ],
      progression: 'cta',
      noneOfTheAbove: { label: 'None of the above', answerId: 'n/a' },
      cdp: { acField: 35, mpField: 'hairMyth' },
    },
    // idx 12 — Damaging practices (multi-select) -------------------------------
    {
      kind: 'question',
      id: 's_damage_activity',
      type: 'multi',
      questionId: 'hairDamageActivity',
      prompt: 'Select the damaging practices that you regularly do',
      subtitle: 'Select all that apply',
      answers: [
        { answerId: 'damageAction_heat', label: 'Heat styling', imageUrl: 'https://assets.hairqare.co/heat.webp' },
        { answerId: 'damageAction_dye', label: 'Bleaching / hair colouring', imageUrl: 'https://assets.hairqare.co/dye.webp' },
        { answerId: 'damageAction_sun', label: 'Sun exposure', imageUrl: 'https://assets.hairqare.co/sun.webp' },
        { answerId: 'damageAction_swimming', label: 'Frequent swimming', imageUrl: 'https://assets.hairqare.co/swim.webp' },
        { answerId: 'damageAction_hairstyles', label: 'Tight hair styles (braids, bun, ponytail...)', imageUrl: 'https://assets.hairqare.co/hairstyle.webp' },
      ],
      progression: 'cta',
      noneOfTheAbove: { label: 'None of the above', answerId: 'n/a' },
      cdp: { acField: 51, mpField: 'hairDamageActivity' },
    },
    // idx 13 — Damage-Practices Pitch ------------------------------------------
    {
      kind: 'pitch',
      id: 's_damage_practices_pitch',
      label: 'Damage Practices Pitch',
      headline: '',
      body: '',
      blocks: [
        { kind: 'text', text: 'With the right routine, you can\nstyle your hair **without any guilt**.', weight: 'semibold', align: 'center' },
        { kind: 'text', text: "Sarah curls, colors and heat styles, and hers stays **long, healthy, thick**. The damage was **never about the styling**. It's about **knowing how to care for your hair around it**.", weight: 'normal', align: 'center' },
        { kind: 'text', text: "That's the part you learn with\nthe haircare challenge.\n**Not by doing less.**\n**By knowing more.**", weight: 'normal', align: 'center' },
        { kind: 'damagePracticesConclusion', concernQuestionId: 'hairConcern', dreamQuestionId: 'hairDream' },
        { kind: 'divider' },
        { kind: 'carousel', images: pitchCarouselImages },
      ],
    },
    // idx 14 — Mirror confidence (rating) --------------------------------------
    {
      kind: 'question',
      id: 's_confidence',
      type: 'rating',
      questionId: 'confidence',
      prompt: 'My reflection in the mirror affects my mood and self-esteem.',
      ratingSubInstruction: 'How much do you relate to the following statement?',
      ratingAnchors: { low: 'Not at all', high: 'Totally' },
      answers: [
        { answerId: '1', label: '1' },
        { answerId: '2', label: '2' },
        { answerId: '3', label: '3' },
        { answerId: '4', label: '4' },
        { answerId: '5', label: '5' },
      ],
      progression: 'auto',
      cdp: { acField: 53, mpField: 'Emotions Mirror' },
    },
    // idx 15 — Comparison (rating) ---------------------------------------------
    {
      kind: 'question',
      id: 's_comparison',
      type: 'rating',
      questionId: 'comparison',
      prompt: "I tend to compare my hair to others' and it makes me frustrated.",
      ratingSubInstruction: 'How much do you relate to the following statement?',
      ratingAnchors: { low: 'Not at all', high: 'Totally' },
      answers: [
        { answerId: '1', label: '1' },
        { answerId: '2', label: '2' },
        { answerId: '3', label: '3' },
        { answerId: '4', label: '4' },
        { answerId: '5', label: '5' },
      ],
      progression: 'auto',
      cdp: { acField: 54, mpField: 'Emotions Comparison' },
    },
    // idx 16 — Professional referral (no AC field) -----------------------------
    {
      kind: 'question',
      id: 's_professional',
      type: 'single',
      questionId: 'professionalReferral',
      prompt: 'Did a professional refer you to us?',
      answers: [
        { answerId: 'professional_yes', label: 'Yes' },
        { answerId: 'professional_no', label: 'No' },
        { answerId: 'professional_self', label: "I'm a professional" },
      ],
      progression: 'auto',
      // AC field 67 "Professional Referral" (pre-existing) — stores the raw answer-id.
      cdp: { acField: 67, mpField: 'professionalReferral' },
    },
    // idx 17 — Loading ----------------------------------------------------------
    {
      kind: 'loading',
      id: 's_loading',
      title: "The only haircare program you'll ever need",
      carouselImages: [
        'https://assets.hairqare.co/Hair-Routine_TP-Updated.webp',
        'https://assets.hairqare.co/illustration-tp-91.webp',
        'https://assets.hairqare.co/Hair%20Routine-04.webp',
        'https://assets.hairqare.co/Hair%20Routine-05.webp',
      ],
      checkpoints: [
        'Checking your hair condition',
        'Analysing your routine',
        'Checking your challenge-fit',
      ],
      messages: [
        "The only haircare program you'll ever need",
        'Checking your hair condition',
      ],
      durationMs: 4000,
    },
    // idx 18 — Email capture / contact details ---------------------------------
    {
      kind: 'email',
      id: 's_email',
      title: 'Your results are ready!',
      subhead:
        "On the next screen, you'll see if the Challenge can help you achieve your hair goal.",
      concernLine: concernResolutionChance,
      cardHeader: 'Enter your details\nto unlock your results 🔐',
      privacy: 'Your info is 100% secure and never shared with third parties.',
      submitLabel: 'Submit',
      headline: concernResolutionChance,
    },
    // idx 19 — Dashboard / result -----------------------------------------------
    {
      kind: 'result',
      id: 's_result',
      result: {
        ctaLabel: 'JOIN THE CHALLENGE',
        timerSeconds: 1800,
        percentageRange: [92, 97],
      },
    },
  ],
  checkout: {
    base: 'https://checkout.hairqare.co/buy/hairqare-challenge-save-85-5/',
    // Embedded checkout (this clone's experiment): same-site iframe of the live
    // /buy/ page, opened as a full-screen modal from all three result CTAs.
    // Requires the WS-B pieces live on checkout.hairqare.co (CF frame-ancestors
    // rule + hairqare-embed-bridge plugin); until then the load-timeout fallback
    // redirects exactly like the legacy quiz. `enabled: false` = full rollback.
    embed: {
      enabled: true,
      mode: 'modal',
      preload: 'onIntent',
    },
    couponRules: [
      { when: { questionId: 'hairConcern', containsAny: ['concern_hairloss'] }, coupon: 'c_hl' },
      { when: { questionId: 'hairConcern', containsAny: ['concern_damage', 'concern_splitends'] }, coupon: 'c_dh' },
      { when: { questionId: 'hairConcern', containsAny: ['concern_scalp'] }, coupon: 'c_si' },
    ],
    defaultCoupon: 'o_df',
  },
  webhookUrl: 'https://quiz-submissions-worker.dndgroup.workers.dev/api/v1/quiz/submit',
  eventEnrichment: ['hairConcern', 'age'],
}
