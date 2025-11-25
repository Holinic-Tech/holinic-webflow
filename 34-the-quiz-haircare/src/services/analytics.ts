// Analytics service for GA, GTM, and CVG tracking
// Event names and properties match Flutter track_g_a_event.dart EXACTLY
//
// CRITICAL: Flutter uses dataLayer.push() as PRIMARY with gtag() as FALLBACK
// CRITICAL: Flutter uses q_name and q_email (not name/email) to avoid GA conflicts

declare global {
  interface Window {
    dataLayer: Array<Record<string, unknown>>;
    gtag: (...args: unknown[]) => void;
    cvg: (config: CVGConfig) => void;
  }
}

interface CVGConfig {
  method: 'event' | 'track';
  event?: string;
  eventName?: string;
  properties?: Record<string, unknown>;
  eventId?: string;
  profileProperties?: Record<string, unknown>;
  aliases?: string[];
}

// Store reference to get quiz position - will be set by useQuiz hook
let getQuizPositionFn: (() => number) | null = null;

export function setQuizPositionGetter(fn: () => number) {
  getQuizPositionFn = fn;
}

function getCurrentQuizPosition(): number {
  return getQuizPositionFn ? getQuizPositionFn() : 0;
}

/**
 * Core GA tracking function - matches Flutter track_g_a_event.dart EXACTLY
 *
 * Flutter implementation:
 * 1. Creates params with event, event_category, position
 * 2. Adds optional question_id, question, selected_answer
 * 3. Uses q_name/q_email (NOT name/email) to avoid GA conflicts
 * 4. Uses dataLayer.push() as PRIMARY, gtag() as FALLBACK
 */
export function trackGAEvent(
  eventName: string,
  questionId?: string,
  question?: string,
  selectedAnswer?: string[],
  name?: string,
  email?: string,
  positionOverride?: number
) {
  // Get position from override or store
  const position = positionOverride ?? getCurrentQuizPosition();

  // Build params exactly like Flutter does
  const params: Record<string, unknown> = {
    event: eventName,
    event_category: 'Quiz',
    position: position,
  };

  // Add optional parameters if they exist (matches Flutter null checks)
  if (questionId) params.question_id = questionId;
  if (question) params.question = question;

  // selected_answer is always an array (even if empty)
  params.selected_answer = selectedAnswer ?? [];

  // CRITICAL: Use q_name and q_email to avoid conflicts with GA reserved fields
  // Flutter comment: "Use q_name and q_email field names to avoid conflicts"
  if (name && name.trim()) params.q_name = name;
  if (email && email.trim()) params.q_email = email;

  // PRIMARY: dataLayer.push (Flutter does this first)
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push(params);
    console.log('[dataLayer.push]', eventName, params);
  } else if (typeof window !== 'undefined' && window.gtag) {
    // FALLBACK: gtag only if dataLayer unavailable
    window.gtag('event', eventName, params);
    console.log('[gtag fallback]', eventName, params);
  }
}

// CVG (Customer Value Generation) tracking - separate from GA
export function trackCVG(config: CVGConfig) {
  if (typeof window !== 'undefined' && window.cvg) {
    window.cvg(config);
    console.log('[CVG]', config.event || config.eventName, config.properties);
  }
}

// ============================================================================
// EVENT TRACKING FUNCTIONS - Match Flutter's 16 events exactly
// ============================================================================

/**
 * Quiz Viewed - fires on hero screen load
 * Flutter: image_background_ques_body_v3_widget.dart:95
 */
export function trackQuizViewed(position: number = 0) {
  trackGAEvent('Quiz Viewed', undefined, undefined, [], undefined, undefined, position);
}

/**
 * Quiz Started - fires when user clicks start button
 * Flutter: image_background_ques_body_widget.dart:405
 */
export function trackQuizStarted(position: number = 0) {
  trackGAEvent('Quiz Started', undefined, undefined, [], undefined, undefined, position);

  // Also track CVG event
  trackCVG({
    method: 'event',
    event: 'Quiz Started',
    properties: {
      event_category: 'Quiz',
      position: position,
    },
  });
}

/**
 * Question Answered - fires when user selects an answer
 * Flutter: home_page_widget.dart:647
 */
export function trackQuestionAnswered(
  questionId: string,
  questionText: string,
  selectedAnswer: string | string[],
  position: number
) {
  // Always convert to array to match Flutter structure
  const answerArray = Array.isArray(selectedAnswer) ? selectedAnswer : [selectedAnswer];
  trackGAEvent('Question Answered', questionId, questionText, answerArray, undefined, undefined, position);
}

/**
 * Quiz Back - fires when user clicks back button
 * Flutter: header_with_progress_bar_widget.dart:119
 */
export function trackQuizBack(position: number) {
  trackGAEvent('Quiz Back', undefined, undefined, [], undefined, undefined, position);
}

/**
 * Opened Skip Dialog - fires when skip button is clicked
 * Flutter: home_page_widget.dart:168
 */
export function trackSkipDialogOpened(position: number) {
  trackGAEvent('Opened Skip Dialog', undefined, undefined, [], undefined, undefined, position);
}

/**
 * Closed Skip Dialog - fires when dialog is dismissed
 * Flutter: skip_dialog_widget.dart:40
 */
export function trackSkipDialogClosed(position: number) {
  trackGAEvent('Closed Skip Dialog', undefined, undefined, [], undefined, undefined, position);
}

/**
 * SkipQuiz - fires when user confirms skip
 * Flutter: skip_dialog_widget.dart:263
 */
export function trackSkipQuiz(position: number) {
  trackGAEvent('SkipQuiz', undefined, undefined, [], undefined, undefined, position);
}

/**
 * Continued From Pitch - fires when user clicks continue on pitch screen
 * Flutter: home_page_widget.dart:488
 */
export function trackContinuedFromPitch(pitchType: string, position: number) {
  // Map pitch type to human-readable name (matches Flutter)
  const pitchNameMap: Record<string, string> = {
    simple: 'Simple Pitch',
    detailed: 'Detailed Pitch',
    dynamic: 'Dynamic Pitch',
  };
  const pitchName = pitchNameMap[pitchType] || pitchType;

  trackGAEvent('Continued From Pitch', undefined, pitchName, [], undefined, undefined, position);
}

/**
 * Quiz Completed - fires before email submit
 * Flutter: login_component_widget.dart:52
 */
export function trackQuizCompleted(
  position: number,
  name?: string,
  email?: string
) {
  trackGAEvent('Quiz Completed', undefined, undefined, [], name, email, position);

  // Also track CVG event with user info
  if (email) {
    trackCVG({
      method: 'event',
      event: 'Quiz Completed',
      properties: {
        event_category: 'Quiz',
        position: position,
      },
      profileProperties: email ? { $email: email } : undefined,
      aliases: email ? [`urn:email:${email}`] : undefined,
    });
  }
}

/**
 * Quiz Submitted - fires after successful email submission
 * Flutter: login_component_widget.dart:623
 */
export function trackQuizSubmitted(
  position: number,
  name: string,
  email: string
) {
  trackGAEvent('Quiz Submitted', undefined, undefined, [], name, email, position);

  // Also track CVG event
  trackCVG({
    method: 'event',
    event: 'Completed Quiz',
    properties: {
      event_category: 'Quiz',
      position: position,
      q_name: name,
      q_email: email,
    },
    profileProperties: { $email: email },
    aliases: [`urn:email:${email}`],
  });
}

/**
 * Viewed Results Page - fires on results page load
 * Flutter: dashboard_widget.dart:68
 */
export function trackResultPageView(position: number) {
  trackGAEvent('Viewed Results Page', undefined, undefined, [], undefined, undefined, position);
}

/**
 * Opened Plan Details - fires when plan card is opened
 * Flutter: final_pitch_widget.dart:1887
 */
export function trackOpenedPlanDetails(position: number) {
  trackGAEvent('Opened Plan Details', undefined, undefined, [], undefined, undefined, position);
}

/**
 * Closed Plan Details - fires when plan card is closed
 * Flutter: pitch_plan_dialog_widget.dart:50
 */
export function trackClosedPlanDetails(position: number) {
  trackGAEvent('Closed Plan Details', undefined, undefined, [], undefined, undefined, position);
}

/**
 * Go to checkout - fires when checkout button is clicked
 * Flutter: pitch_plan_dialog_widget.dart:686
 */
export function trackGoToCheckout(position: number) {
  trackGAEvent('Go to checkout', undefined, undefined, [], undefined, undefined, position);
}

/**
 * Go to next checkout step - secondary checkout variant
 * Flutter: pitch_plan_dialog_copy_widget.dart:737
 */
export function trackGoToNextCheckoutStep(position: number) {
  trackGAEvent('Go to next checkout step', undefined, undefined, [], undefined, undefined, position);
}

// ============================================================================
// LEGACY FUNCTION - Keep for backwards compatibility but redirect to new function
// ============================================================================

/**
 * @deprecated Use trackGoToCheckout instead
 */
export function trackCTAClicked(destination: string, position: number = 0) {
  // Map old destination-based call to new checkout tracking
  if (destination.includes('checkout')) {
    trackGoToCheckout(position);
  } else {
    trackGoToNextCheckoutStep(position);
  }
}
