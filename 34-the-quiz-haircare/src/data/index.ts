// Re-export questions data
export { questions, questionsOrder } from './questions';

// Re-export results data (but not conflicting exports)
export { resultsBySegment, getCouponCode, getResultContent, getAgeText } from './results';

// Re-export pitch screen data
export {
  simplePitchData,
  detailedPitchData,
  dynamicPitchData,
  loadingScreenContent,
  concernImages,
  concernStats,
  concernText,
  concernResults,
  ageText,
  getPitchDataByType,
} from './pitchScreens';

// Re-export screen flow data
export {
  screenFlow,
  TOTAL_SCREENS,
  TOTAL_QUESTIONS,
  questionScreens,
  getScreenByIndex,
  isQuestionScreen,
  isPitchScreen,
  isSpecialScreen,
  getQuestionProgress,
  shouldShowBackButton,
  shouldShowProgressBar,
} from './screenFlow';

// Re-export types
export type { ScreenType, PitchType, QuestionFormat, ScreenConfig } from './screenFlow';
