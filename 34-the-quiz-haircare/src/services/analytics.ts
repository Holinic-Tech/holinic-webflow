// Analytics service for GA, GTM, and CVG tracking

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

// Track question answered
export function trackQuestionAnswered(
  questionId: string,
  answerId: string | string[],
  questionIndex: number
) {
  const properties = {
    question_id: questionId,
    answer_id: Array.isArray(answerId) ? answerId.join(',') : answerId,
    question_index: questionIndex,
    category: 'Quiz',
  };

  trackGA('question_answered', properties);
  trackGTM('question_answered', properties);
}

// Track quiz started
export function trackQuizStarted() {
  const properties = {
    category: 'Quiz',
    timestamp: Date.now(),
  };

  trackGA('quiz_started', properties);
  trackGTM('quiz_started', properties);
  trackCVG({
    method: 'event',
    event: 'Quiz Started',
    properties,
  });
}

// Track quiz completed
export function trackQuizCompleted(
  answers: Record<string, unknown>,
  userInfo: { email: string; name: string; firstName: string; lastName: string }
) {
  const properties = {
    category: 'Quiz',
    answers,
    ...userInfo,
    timestamp: Date.now(),
  };

  trackGA('quiz_completed', properties);
  trackGTM('Completed Quiz', properties);
  trackCVG({
    method: 'event',
    event: 'Completed Quiz',
    properties: { answers, name: userInfo.name, email: userInfo.email },
    profileProperties: { $email: userInfo.email },
    aliases: [`urn:email:${userInfo.email}`],
  });
}

// Track skip dialog opened
export function trackSkipDialogOpened() {
  trackGA('skip_dialog_opened', { category: 'Quiz' });
  trackGTM('Opened Skip Dialog', { category: 'Quiz' });
}

// Track skip dialog closed
export function trackSkipDialogClosed() {
  trackGA('skip_dialog_closed', { category: 'Quiz' });
  trackGTM('Closed Skip Dialog', { category: 'Quiz' });
}

// Track CTA clicked
export function trackCTAClicked(destination: string) {
  const properties = {
    category: 'Quiz',
    destination,
    timestamp: Date.now(),
  };

  trackGA('cta_clicked', properties);
  trackGTM('Go to checkout', properties);
}

// Track continued from pitch screen
export function trackContinuedFromPitch(pitchType: string) {
  const properties = {
    category: 'Quiz',
    pitch_type: pitchType,
    timestamp: Date.now(),
  };

  trackGA('continued_from_pitch', properties);
  trackGTM('Continued From Pitch', properties);
}

// Track result page view
export function trackResultPageView() {
  const properties = {
    category: 'Quiz',
    timestamp: Date.now(),
  };

  trackGA('result_page_view', properties);
  trackGTM('Result Page', properties);
}
