// Result page and segment types

// Hair concern segments for result personalization
export type HairConcernSegment =
  | 'concern_hairloss'
  | 'concern_splitends'
  | 'concern_damage'
  | 'concern_scalp'
  | 'concern_mixed';

// Age groups for personalization
export type AgeGroup =
  | 'age_18to29'
  | 'age_30to39'
  | 'age_40to49'
  | 'age_50+';

// Coupon codes based on segment
export type CouponCode = 'c_hl' | 'c_dh' | 'c_si' | 'd_bc' | 'o_df';

// Testimonial data
export interface Testimonial {
  imageUrl: string;
  name?: string;
  quote?: string;
}

// Result segment content
export interface SegmentContent {
  headline: string;
  subheadline: string;
  goalText: string;
  issueDescription: string;
  testimonials: Testimonial[];
  ageSpecificImage?: string;
  ageSpecificText?: string;
}

// Complete result configuration
export interface ResultConfig {
  segment: HairConcernSegment;
  content: SegmentContent;
  couponCode: CouponCode;
  checkoutUrl: string;
}

// Question-Answer pair for webhook rawAnswers (matches Flutter structure)
export interface QuestionAnswerPair {
  questionId: string;
  answerIds: string[];
}

// Webhook payload structure (for Make.com) - matches Flutter structure exactly
export interface WebhookPayload {
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  quizData: {
    rawAnswers: QuestionAnswerPair[];
  };
  activeCampaign: Record<string, string>;
  mixpanel: Record<string, unknown>;
}

// Analytics event types
export type AnalyticsEventName =
  | 'quiz_started'
  | 'question_answered'
  | 'quiz_completed'
  | 'email_submitted'
  | 'skip_dialog_opened'
  | 'skip_dialog_closed'
  | 'cta_clicked';

export interface AnalyticsEvent {
  event: AnalyticsEventName;
  properties: Record<string, unknown>;
  timestamp: number;
}
