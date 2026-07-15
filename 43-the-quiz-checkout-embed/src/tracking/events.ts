export const GA = {
  QUIZ_VIEWED: 'Quiz Viewed',
  QUIZ_STARTED: 'Quiz Started',
  QUESTION_ANSWERED: 'Question Answered',
  QUIZ_BACK: 'Quiz Back',
  CONTINUED_FROM_PITCH: 'Continued From Pitch',
  OPENED_SKIP_DIALOG: 'Opened Skip Dialog',
  CLOSED_SKIP_DIALOG: 'Closed Skip Dialog',
  SKIP_QUIZ: 'SkipQuiz',
  OPENED_PLAN_DETAILS: 'Opened Plan Details',
  CLOSED_PLAN_DETAILS: 'Closed Plan Details',
  VIEWED_RESULTS_PAGE: 'Viewed Results Page',
  QUIZ_COMPLETED: 'Quiz Completed',
  QUIZ_SUBMITTED: 'Quiz Submitted',
  GO_TO_CHECKOUT_RESULTS: 'Go to  checkout', // TWO spaces — load-bearing, do not "fix"
  GO_TO_CHECKOUT_TIMER: 'Go to checkout',    // one space
  GO_TO_NEXT_CHECKOUT_STEP: 'Go to next checkout step',
} as const
export type GAEventName = typeof GA[keyof typeof GA]
