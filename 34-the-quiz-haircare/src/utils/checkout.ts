import { CHECKOUT_BASE_URL } from '../data/dashboardContent';

// Get CVG cookie value by name, with URL param fallback
function getCvgValue(name: string): string | null {
  // Try cookie first
  const cookieMatch = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (cookieMatch) {
    return cookieMatch[2];
  }

  // Fallback: try URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name) || null;
}

interface UserInfo {
  firstName?: string;
  lastName?: string;
  email?: string;
}

// Build checkout URL with parameters including CVG cookies
export function buildCheckoutUrl(
  user?: UserInfo,
  couponTag?: string
): string {
  const params = new URLSearchParams();

  // Add user info if available
  if (user?.email) {
    params.append('billing_email', user.email);
  }
  if (user?.firstName) {
    params.append('billing_first_name', user.firstName);
  }
  if (user?.lastName) {
    params.append('billing_last_name', user.lastName);
  }

  // Add coupon if available
  if (couponTag) {
    params.append('aero-coupons', couponTag);
  }

  // Add CVG cookies for cross-domain tracking
  const cvgUid = getCvgValue('__cvg_uid');
  const cvgSid = getCvgValue('__cvg_sid');

  if (cvgUid) {
    params.append('__cvg_uid', cvgUid);
  }
  if (cvgSid) {
    params.append('__cvg_sid', cvgSid);
  }

  const queryString = params.toString();
  return queryString ? `${CHECKOUT_BASE_URL}?${queryString}` : CHECKOUT_BASE_URL;
}

// Redirect to checkout
export function redirectToCheckout(user?: UserInfo, couponTag?: string): void {
  const url = buildCheckoutUrl(user, couponTag);
  window.location.href = url;
}
