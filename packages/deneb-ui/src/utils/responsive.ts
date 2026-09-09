'use client';

import { useEffect, useState } from 'react';

/** Standard DENEB UI breakpoints (mobile-first). */
export const BREAKPOINTS = {
  xs: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

export type BreakpointKey = keyof typeof BREAKPOINTS;
export type DeviceTier = 'mobile' | 'tablet' | 'desktop';

export function getDeviceTier(width: number): DeviceTier {
  if (width < BREAKPOINTS.md) return 'mobile';
  if (width < BREAKPOINTS.lg) return 'tablet';
  return 'desktop';
}

export function mediaQueryUp(breakpoint: BreakpointKey): string {
  return `(min-width: ${BREAKPOINTS[breakpoint]}px)`;
}

export function mediaQueryDown(breakpoint: BreakpointKey): string {
  return `(max-width: ${BREAKPOINTS[breakpoint] - 0.02}px)`;
}

/**
 * Subscribe to a min-width media query. SSR-safe (defaults to false until mounted).
 */
export function useMediaQuery(query: string, defaultValue = false): boolean {
  const [matches, setMatches] = useState(defaultValue);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

/** Current viewport tier: mobile (<768), tablet (768–1023), desktop (≥1024). */
export function useDeviceTier(): DeviceTier {
  const isDesktop = useMediaQuery(mediaQueryUp('lg'));
  const isTablet = useMediaQuery(mediaQueryUp('md'));
  if (isDesktop) return 'desktop';
  if (isTablet) return 'tablet';
  return 'mobile';
}

export function useIsMobile(): boolean {
  return useDeviceTier() === 'mobile';
}

export function useIsTablet(): boolean {
  return useDeviceTier() === 'tablet';
}

export function useIsDesktop(): boolean {
  return useDeviceTier() === 'desktop';
}

/** Map section padding tokens to fluid clamp values that scale across devices. */
export const RESPONSIVE_SECTION_PADDING: Record<string, string> = {
  none: '0',
  xs: 'clamp(1rem, 3vw, 1.5rem) 0',
  sm: 'clamp(1.5rem, 4vw, 2.5rem) 0',
  md: 'clamp(2rem, 5vw, 4rem) 0',
  lg: 'clamp(2.5rem, 6vw, 6rem) 0',
  xl: 'clamp(3rem, 7vw, 8rem) 0',
  '2xl': 'clamp(3.5rem, 8vw, 10rem) 0',
};

export interface ResponsiveColumnsConfig {
  mobile?: number;
  tablet?: number;
  desktop?: number;
}

export function resolveResponsiveColumns(
  columns: number | ResponsiveColumnsConfig | undefined,
  minCardWidth = '280px',
): { template: string; dataAttrs?: Record<string, string> } {
  if (typeof columns === 'number') {
    return { template: `repeat(${columns}, minmax(0, 1fr))` };
  }
  if (columns && typeof columns === 'object') {
    const mobile = columns.mobile ?? 1;
    const tablet = columns.tablet ?? columns.mobile ?? 2;
    const desktop = columns.desktop ?? columns.tablet ?? 3;
    return {
      template: `repeat(${mobile}, minmax(0, 1fr))`,
      dataAttrs: {
        'data-deneb-responsive-cols': 'true',
        'data-cols-mobile': String(mobile),
        'data-cols-tablet': String(tablet),
        'data-cols-desktop': String(desktop),
      },
    };
  }
  return { template: `repeat(auto-fit, minmax(${minCardWidth}, 1fr))` };
}
