/**
 * Scale factor to fit `contentHeight` into `availableHeight` without scroll.
 *
 * With the default `max = 1` it only ever scales DOWN (the mobile behaviour:
 * never upscale, floor at `min`). With `max > 1` it also scales UP to FILL when
 * the content is shorter than the available space — so larger screens (desktop /
 * big phones) use the real estate instead of leaving the content tiny. Always
 * clamped to `[min, max]`.
 */
export function computeScale(
  contentHeight: number,
  availableHeight: number,
  min = 0.45,
  max = 1,
): number {
  if (contentHeight <= 0 || availableHeight <= 0) return 1
  return Math.min(max, Math.max(min, availableHeight / contentHeight))
}
