/**
 * Converts a px/rem font size into a responsive clamp() for storefront viewports.
 * Example: 48px → clamp(2.25rem, 1.5rem + 2.5vw, 3rem)
 */
export function formatResponsiveFontSize(value: string | number): string | undefined {
  if (value === undefined || value === null || value === '') return undefined;

  let px: number;
  if (typeof value === 'number') {
    px = value;
  } else if (/^\d+(\.\d+)?px$/i.test(value.trim())) {
    px = parseFloat(value);
  } else if (/^\d+(\.\d+)?rem$/i.test(value.trim())) {
    px = parseFloat(value) * 16;
  } else if (/^\d+$/.test(value.trim())) {
    px = parseFloat(value);
  } else {
    return value;
  }

  if (!Number.isFinite(px) || px <= 0) return undefined;

  const preferredRem = px / 16;
  const minRem = Math.max(preferredRem * 0.72, 0.75);
  const maxRem = preferredRem * 1.15;
  const vwFactor = Math.min(Math.max(preferredRem * 0.08, 0.5), 3.5);

  return `clamp(${minRem.toFixed(3)}rem, ${(preferredRem * 0.55).toFixed(3)}rem + ${vwFactor.toFixed(2)}vw, ${maxRem.toFixed(3)}rem)`;
}

export function formatFontSize(
  value: string | number | undefined,
  options?: { responsive?: boolean },
): string | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  if (options?.responsive) {
    const clamped = formatResponsiveFontSize(value);
    if (clamped) return clamped;
  }
  if (typeof value === 'number') return `${value}px`;
  return /^\d+$/.test(value) ? `${value}px` : value;
}
