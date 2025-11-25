// Make.com webhook integration
// Payload structure matches Flutter implementation exactly

import type { WebhookPayload, CouponCode } from '../types';
import { questions } from '../data/questions';

const MAKE_WEBHOOK_URL = 'https://hook.us1.make.com/3d6vksxwtqukhrx465bjymy4y6sfdkr6';

export async function submitToWebhook(
  answers: Record<string, string | string[] | number>,
  userInfo: { name: string; firstName: string; lastName: string; email: string }
): Promise<boolean> {
  // Build rawAnswers array format (matches Flutter quizProfile.qaPairs structure)
  const rawAnswers = Object.entries(answers).map(([questionId, answer]) => ({
    questionId,
    answerIds: Array.isArray(answer) ? answer : [String(answer)],
  }));

  // Build ActiveCampaign field mappings (field_X format)
  const activeCampaign: Record<string, string> = {};

  // Build Mixpanel field mappings
  const mixpanel: Record<string, unknown> = {
    $name: userInfo.name,
    $email: userInfo.email,
  };

  for (const [questionId, answer] of Object.entries(answers)) {
    const question = questions[questionId as keyof typeof questions];
    if (!question) continue;

    // For ActiveCampaign: convert arrays to comma-separated strings
    const acValue = Array.isArray(answer)
      ? answer.join(', ')
      : String(answer);

    // ActiveCampaign mapping (field_X format)
    if (question.acField) {
      activeCampaign[`field_${question.acField}`] = acValue;
    }

    // Mixpanel mapping
    if (question.mpField) {
      // Mixpanel: arrays stay as arrays, numbers stay as numbers
      if (Array.isArray(answer)) {
        mixpanel[question.mpField] = answer;
      } else if (typeof answer === 'number') {
        mixpanel[question.mpField] = answer;
      } else {
        mixpanel[question.mpField] = answer;
      }
    }
  }

  const payload: WebhookPayload = {
    name: userInfo.name,
    firstName: userInfo.firstName,
    lastName: userInfo.lastName,
    email: userInfo.email,
    quizData: {
      rawAnswers,
    },
    activeCampaign,
    mixpanel,
  };

  try {
    const response = await fetch(MAKE_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error('[Webhook] Failed:', response.status, response.statusText);
      return false;
    }

    console.log('[Webhook] Success', payload);
    return true;
  } catch (error) {
    console.error('[Webhook] Error:', error);
    return false;
  }
}

// Build checkout URL with query params
export function buildCheckoutUrl(
  baseUrl: string,
  userInfo: { firstName: string; lastName: string; email: string },
  couponCode: CouponCode
): string {
  const params = new URLSearchParams();

  if (userInfo.email) {
    params.set('billing_email', userInfo.email);
  }
  if (userInfo.firstName) {
    params.set('billing_first_name', userInfo.firstName);
  }
  if (userInfo.lastName) {
    params.set('billing_last_name', userInfo.lastName);
  }
  params.set('aero-coupons', couponCode);

  // Try to get CVG tracking IDs from cookies or URL
  const cvgUid = getCookie('__cvg_uid') || getUrlParam('__cvg_uid');
  const cvgSid = getCookie('__cvg_sid') || getUrlParam('__cvg_sid');

  if (cvgUid) params.set('__cvg_uid', cvgUid);
  if (cvgSid) params.set('__cvg_sid', cvgSid);

  return `${baseUrl}?${params.toString()}`;
}

// Helper to get cookie value
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

// Helper to get URL parameter
function getUrlParam(name: string): string | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}
