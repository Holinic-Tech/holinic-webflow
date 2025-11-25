// Screen flow based on FlutterFlow source code analysis
// This defines the exact screen sequence from the PageView in home_page_widget.dart

import type { QuestionId } from '../types';

// Screen types
export type ScreenType =
  | 'question'     // Regular question
  | 'pitch'        // Pitch/educational screen
  | 'loading'      // Loading animation screen
  | 'emailCapture' // Email/lead capture
  | 'dashboard'    // Results dashboard
  | 'finalPitch';  // Final CTA/discount

// Pitch screen types
export type PitchType =
  | 'simple'    // PitchBodySimpleTextImagesBody: title, description
  | 'detailed'  // PitchBodyDetailedTextImages: title, description, claim, valueProp, values
  | 'dynamic';  // PitchBodySimpleDetailedTextImages: dynamic content based on answers

// Question format types
export type QuestionFormat =
  | 'heroStart'        // ImageBackgroundQuesBody - start screen with bg image
  | 'largeImage'       // SingleChoiceQuestionLargeImage - large image cards
  | 'smallImage'       // SingleChoiceQuestionSmalllmage - smaller image cards
  | 'titleDescription' // TitlesAndDescriptionAnsBody - text with descriptions
  | 'textAnswer'       // QuestionAnswer - text-only answers
  | 'feedbackCard'     // QuestionAnswerAdditionlInfo - answers with feedback popup
  | 'multiSelect'      // MultiChoiceWithImageQuestionCheckBox - multi-select with images
  | 'rating';          // RatingQuestionOptions - 1-5 scale slider

// Screen configuration
export interface ScreenConfig {
  id: string;
  index: number;
  type: ScreenType;
  questionId?: QuestionId;
  questionFormat?: QuestionFormat;
  pitchType?: PitchType;
}

// The exact screen flow from Flutter PageView (indices 0-20)
// Note: mindsetState question was at index 22 but is hidden/not part of main flow
export const screenFlow: ScreenConfig[] = [
  // 0: Hero Start Screen with hairGoal question (ImageBackgroundQuesBody)
  { id: 'screen_0', index: 0, type: 'question', questionId: 'hairGoal', questionFormat: 'heroStart' },

  // 1: Hair Type question (SingleChoiceQuestionLargeImage)
  { id: 'screen_1', index: 1, type: 'question', questionId: 'hairType', questionFormat: 'largeImage' },

  // 2: Age question (SingleChoiceQuestionSmalllmage)
  { id: 'screen_2', index: 2, type: 'question', questionId: 'age', questionFormat: 'smallImage' },

  // 3: Hair Concern question (SingleChoiceQuestionSmalllmage)
  { id: 'screen_3', index: 3, type: 'question', questionId: 'hairConcern', questionFormat: 'smallImage' },

  // 4: Current Routine question (TitlesAndDescriptionAnsBody)
  { id: 'screen_4', index: 4, type: 'question', questionId: 'currentRoutine', questionFormat: 'titleDescription' },

  // 5: Knowledge State question (QuestionAnswer) - "Do you already know exactly..."
  { id: 'screen_5', index: 5, type: 'question', questionId: 'knowledgeState', questionFormat: 'textAnswer' },

  // 6: PITCH SCREEN 1 - "Don't worry! We got you." (PitchBodySimpleTextImagesBody)
  { id: 'screen_6', index: 6, type: 'pitch', pitchType: 'simple' },

  // 7: HairQare Knowledge question (SingleChoiceQuestionSmalllmage with emoji images)
  { id: 'screen_7', index: 7, type: 'question', questionId: 'hairqare', questionFormat: 'smallImage' },

  // 8: PITCH SCREEN 2 - "Beautiful hair needs more than just products." (PitchBodyDetailedTextImages)
  { id: 'screen_8', index: 8, type: 'pitch', pitchType: 'detailed' },

  // 9: Diet question (SingleChoiceQuestionSmalllmage)
  { id: 'screen_9', index: 9, type: 'question', questionId: 'diet', questionFormat: 'smallImage' },

  // 10: Shampoo Spending question with feedback (QuestionAnswerAdditionlInfo)
  { id: 'screen_10', index: 10, type: 'question', questionId: 'shampooSpending', questionFormat: 'feedbackCard' },

  // 11: Hair Myth multi-select question (MultiChoiceWithImageQuestionCheckBox)
  { id: 'screen_11', index: 11, type: 'question', questionId: 'hairMyth', questionFormat: 'multiSelect' },

  // 12: Hair Damage Activity multi-select question (MultiChoiceWithImageQuestionCheckBox)
  { id: 'screen_12', index: 12, type: 'question', questionId: 'hairDamageActivity', questionFormat: 'multiSelect' },

  // 13: PITCH SCREEN 3 - Dynamic personalized pitch (PitchBodySimpleDetailedTextImages)
  { id: 'screen_13', index: 13, type: 'pitch', pitchType: 'dynamic' },

  // 14: Confidence rating question (RatingQuestionOptions) - "My reflection in the mirror..."
  { id: 'screen_14', index: 14, type: 'question', questionId: 'confidence', questionFormat: 'rating' },

  // 15: Comparison rating question (RatingQuestionOptions) - "I tend to compare my hair..."
  { id: 'screen_15', index: 15, type: 'question', questionId: 'comparison', questionFormat: 'rating' },

  // 16: Professional Referral question (QuestionAnswer)
  { id: 'screen_16', index: 16, type: 'question', questionId: 'professionalReferral', questionFormat: 'textAnswer' },

  // 17: Loading screen - "Creating your personalized haircare program"
  { id: 'screen_17', index: 17, type: 'loading' },

  // 18: Email capture - "Probability to fix your [concern] in 14 days"
  { id: 'screen_18', index: 18, type: 'emailCapture' },

  // 19: Dashboard - Results display
  { id: 'screen_19', index: 19, type: 'dashboard' },

  // 20: Final Pitch - Discount/CTA
  { id: 'screen_20', index: 20, type: 'finalPitch' },
];

// Total number of screens
export const TOTAL_SCREENS = screenFlow.length;

// Get question-only screens for progress calculation
export const questionScreens = screenFlow.filter(s => s.type === 'question');
export const TOTAL_QUESTIONS = questionScreens.length;

// Helper to get screen by index
export function getScreenByIndex(index: number): ScreenConfig | null {
  return screenFlow[index] ?? null;
}

// Helper to check screen type
export function isQuestionScreen(index: number): boolean {
  return screenFlow[index]?.type === 'question';
}

export function isPitchScreen(index: number): boolean {
  return screenFlow[index]?.type === 'pitch';
}

export function isSpecialScreen(index: number): boolean {
  const type = screenFlow[index]?.type;
  return type === 'loading' || type === 'emailCapture' || type === 'dashboard' || type === 'finalPitch';
}

// Get progress (only count questions, not pitch screens)
export function getQuestionProgress(screenIndex: number): { current: number; total: number } {
  let questionCount = 0;
  for (let i = 0; i <= screenIndex && i < screenFlow.length; i++) {
    if (screenFlow[i].type === 'question') {
      questionCount++;
    }
  }
  return { current: questionCount, total: TOTAL_QUESTIONS };
}

// Check if back button should be shown (matches Flutter logic)
export function shouldShowBackButton(screenIndex: number): boolean {
  // No back on: start (0), pitch screens (6, 8, 13), post-loading screens (17-20)
  const noBackScreens = [0, 6, 7, 8, 9, 13, 17, 18, 19, 20];
  return !noBackScreens.includes(screenIndex);
}

// Check if progress bar should be shown (matches Flutter logic)
export function shouldShowProgressBar(screenIndex: number): boolean {
  // No progress on: start (0), post-loading screens (17-20)
  return screenIndex !== 0 && screenIndex < 17;
}
