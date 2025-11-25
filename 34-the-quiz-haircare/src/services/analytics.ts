// Analytics service for GA, GTM, and CVG tracking
// Event names and properties match Flutter implementation exactly

declare global {
  interface Window {
    dataLayer: Array<Record<string, unknown>>;
    gtag: (...args: unknown[]) => void;
    cvg: (config: CVGConfig) => void;
  }
}

interface CVGConfig {
  method: 'event' | 'track';
  event: string;
  properties?: Record<string, unknown>;
  eventId?: string;
  profileProperties?: Record<string, unknown>;
  aliases?: string[];
}

// Google Analytics tracking
export function trackGA(eventName: string, properties: Record<string, unknown> = {}) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, properties);
    console.log('[GA]', eventName, properties);
  }
}

// Google Tag Manager dataLayer push
export function trackGTM(eventName: string, properties: Record<string, unknown> = {}) {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...properties,
    });
    console.log('[GTM]', eventName, properties);
  }
}

// CVG (Customer Value Generation) tracking
export function trackCVG(config: CVGConfig) {
  if (typeof window !== 'undefined' && window.cvg) {
    window.cvg(config);
    console.log('[CVG]', config.event, config.properties);
  }
}

// Track question answered - matches Flutter event structure exactly
export function trackQuestionAnswered(
  questionId: string,
  questionText: string,
  selectedAnswer: string | string[],
  position: number
) {
  // Always convert to array to match Flutter structure
  const answerArray = Array.isArray(selectedAnswer) ? selectedAnswer : [selectedAnswer];

  const properties = {
    event_category: 'Quiz',
    position: position,
    question_id: questionId,
    question: questionText,
    selected_answer: answerArray,
  };

  // Title Case event name to match Flutter
  trackGA('Question Answered', properties);
  trackGTM('Question Answered', properties);
}

// Track quiz started - matches Flutter event structure
export function trackQuizStarted() {
  const properties = {
    event_category: 'Quiz',
    position: 0,
    question_id: '',
    question: '',
    selected_answer: [] as string[],
  };

  trackGA('Quiz Started', properties);
  trackGTM('Quiz Started', properties);
  trackCVG({
    method: 'event',
    event: 'Quiz Started',
    properties,
  });
}

// Track quiz completed - matches Flutter event structure exactly
export function trackQuizCompleted(
  answers: Record<string, unknown>,
  userInfo: { email: string; name: string; firstName: string; lastName: string }
) {
  const properties = {
    event_category: 'Quiz',
    answers,
    ...userInfo,
  };

  trackGA('Quiz Completed', properties);
  trackGTM('Completed Quiz', properties);
  // CVG event matches Flutter webhookCallcvg exactly
  trackCVG({
    method: 'event',
    event: 'Completed Quiz',
    properties: {
      answers,
      name: userInfo.name,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      email: userInfo.email,
    },
    profileProperties: { $email: userInfo.email },
    aliases: [`urn:email:${userInfo.email}`],
  });
}

// Track skip dialog opened - matches Flutter event structure
export function trackSkipDialogOpened(position: number) {
  const properties = {
    event_category: 'Quiz',
    position: position,
    question_id: '',
    question: '',
    selected_answer: [] as string[],
  };

  trackGA('Opened Skip Dialog', properties);
  trackGTM('Opened Skip Dialog', properties);
}

// Track skip dialog closed - matches Flutter event structure
export function trackSkipDialogClosed(position: number) {
  const properties = {
    event_category: 'Quiz',
    position: position,
    question_id: '',
    question: '',
    selected_answer: [] as string[],
  };

  trackGA('Closed Skip Dialog', properties);
  trackGTM('Closed Skip Dialog', properties);
}

// Track quiz skipped - matches Flutter SkipQuiz event
export function trackSkipQuiz(position: number) {
  const properties = {
    event_category: 'Quiz',
    position: position,
    question_id: '',
    question: '',
    selected_answer: [] as string[],
  };

  trackGA('SkipQuiz', properties);
  trackGTM('SkipQuiz', properties);
}

// Track quiz back navigation - matches Flutter Quiz Back event
export function trackQuizBack(position: number) {
  const properties = {
    event_category: 'Quiz',
    position: position,
    question_id: '',
    question: '',
    selected_answer: [] as string[],
  };

  trackGA('Quiz Back', properties);
  trackGTM('Quiz Back', properties);
}

// Track CTA clicked
export function trackCTAClicked(destination: string) {
  const properties = {
    event_category: 'Quiz',
    destination,
  };

  trackGA('Go to checkout', properties);
  trackGTM('Go to checkout', properties);
}

// Track continued from pitch screen - matches Flutter event structure
// pitchType maps to question field: 'simple' -> 'Simple Pitch', 'detailed' -> 'Detailed Pitch', 'dynamic' -> 'Dynamic Pitch'
export function trackContinuedFromPitch(pitchType: string, position: number) {
  // Map pitch type to human-readable name
  const pitchNameMap: Record<string, string> = {
    simple: 'Simple Pitch',
    detailed: 'Detailed Pitch',
    dynamic: 'Dynamic Pitch',
  };

  const pitchName = pitchNameMap[pitchType] || pitchType;

  const properties = {
    event_category: 'Quiz',
    position: position,
    question_id: '',
    question: pitchName,
    selected_answer: [] as string[],
  };

  trackGA('Continued From Pitch', properties);
  trackGTM('Continued From Pitch', properties);
}

// Track result page view - matches Flutter event structure
export function trackResultPageView() {
  const properties = {
    event_category: 'Quiz',
  };

  trackGA('Viewed Results Page', properties);
  trackGTM('Viewed Results Page', properties);
}
