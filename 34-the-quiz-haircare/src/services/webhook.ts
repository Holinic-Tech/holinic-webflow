// Make.com webhook integration

import type { WebhookPayload, CouponCode } from '../types';

const MAKE_WEBHOOK_URL = 'https://hook.us1.make.com/3d6vksxwtqukhrx465bjymy4y6sfdkr6';

export async function submitToWebhook(
  answers: Record<string, string | string[] | number>,
  userInfo: { name: string; firstName: string; lastName: string; email: string },
  segment: CouponCode
): Promise<boolean> {
  const payload: WebhookPayload = {
    name: userInfo.name,
    firstName: userInfo.firstName,
    lastName: userInfo.lastName,
    email: userInfo.email,
    quizData: {
      rawAnswers: answers,
    },
    segment,
    timestamp: new Date().toISOString(),
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

    console.log('[Webhook] Success');
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
