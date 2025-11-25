// Quiz state and context types

export type QuestionId =
  | 'hairGoal'
  | 'hairType'
  | 'age'
  | 'hairConcern'
  | 'knowledgeState'
  | 'mindsetState'
  | 'diet'
  | 'shampooSpending'
  | 'hairMyth'
  | 'hairDamageActivity'
  | 'currentRoutine'
  | 'professionalReferral'
  | 'hairqare'
  | 'confidence'
  | 'comparison';

// Quiz navigation state
export interface QuizState {
  currentQuestionIndex: number;
  answers: Record<QuestionId, string | string[] | number>;
  isComplete: boolean;
  showSkipDialog: boolean;
  startedAt: number | null;
  completedAt: number | null;
}

// User information collected in lead form
export interface UserInfo {
  name: string;
  firstName: string;
  lastName: string;
  email: string;
}

// Combined quiz context
export interface QuizContext {
  quizState: QuizState;
  userInfo: UserInfo | null;
}
