// Question and answer type definitions

import type { QuestionId } from './quiz.types';

// Different question display formats
export type QuestionFormat =
  | 'imageCard'      // Large image cards with text
  | 'textOption'     // Text-only options with optional descriptions
  | 'multiSelect'    // Checkbox multi-selection
  | 'feedbackCard'   // Cards that show feedback after selection
  | 'slider';        // 1-5 scale slider

// Base answer structure
export interface BaseAnswer {
  id: string;
  answer: string;
}

// Image-based answer (for hairType, age, hairConcern, etc.)
export interface ImageAnswer extends BaseAnswer {
  image: string;
}

// Text option with optional description (for currentRoutine, professionalReferral)
export interface TextOptionAnswer extends BaseAnswer {
  title: string;
  description?: string;
  emoji?: string;
}

// Answer with feedback shown after selection (for mindsetState, shampooSpending)
export interface FeedbackAnswer extends BaseAnswer {
  image: string;
  feedbackTitle: string;
  feedbackDescription: string;
}

// Multi-select checkbox option (for hairMyth, hairDamageActivity)
export interface CheckboxAnswer extends BaseAnswer {
  title: string;
  image?: string;
}

// Union type for all answer types
export type Answer = ImageAnswer | TextOptionAnswer | FeedbackAnswer | CheckboxAnswer;

// Question configuration
export interface QuestionConfig {
  id: QuestionId;
  questionText: string;
  subtitle?: string;
  format: QuestionFormat;
  options: Answer[];
  allowMultiple?: boolean;  // For multi-select questions
  minLabel?: string;        // For slider questions
  maxLabel?: string;        // For slider questions
  // CRM field mappings
  acField?: string;         // ActiveCampaign field ID
  mpField?: string;         // Mixpanel field name
}

// Type guard functions
export function isImageAnswer(answer: Answer): answer is ImageAnswer {
  return 'image' in answer && !('feedbackTitle' in answer);
}

export function isTextOptionAnswer(answer: Answer): answer is TextOptionAnswer {
  return 'title' in answer && !('image' in answer);
}

export function isFeedbackAnswer(answer: Answer): answer is FeedbackAnswer {
  return 'feedbackTitle' in answer && 'feedbackDescription' in answer;
}

export function isCheckboxAnswer(answer: Answer): answer is CheckboxAnswer {
  return 'title' in answer && !('feedbackTitle' in answer);
}
