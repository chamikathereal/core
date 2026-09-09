'use client';

import React, { useEffect, useRef } from 'react';
import { useDenebFonts } from './useDenebFonts';

export const DENEB_FONTS_LINK_ID = 'deneb-google-fonts';

export interface FontLoaderProps {
  /** Additional font ids to preload beyond site-data discovery */
  fontIds?: string[];
  /** Use Google Fonts CDN (default in preview). Set false when `deneb fonts install` CSS is present */
  useGoogleCdn?: boolean;
}

/**
 * Dynamically loads Google Fonts used by the active site-data theme + style tree.
 * In production, pair with `deneb fonts install` which writes self-hosted @fontsource CSS.
 */
export function FontLoader({ fontIds = [], useGoogleCdn = true }: FontLoaderProps) {
  const { googleStylesheetUrl, cssVariables, fontIds: activeFontIds } = useDenebFonts(fontIds);
  const loadedUrl = useRef<string | null>(null);
  const enableCdn = useGoogleCdn;

  useEffect(() => {
    if (!enableCdn || !googleStylesheetUrl || typeof document === 'undefined') return;
    const selfHosted = getComputedStyle(document.documentElement)
      .getPropertyValue('--deneb-fonts-selfhosted')
      .trim();
    if (selfHosted === '1') return;
    if (loadedUrl.current === googleStylesheetUrl) return;

    let link = document.getElementById(DENEB_FONTS_LINK_ID) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.id = DENEB_FONTS_LINK_ID;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    link.href = googleStylesheetUrl;
    loadedUrl.current = googleStylesheetUrl;
  }, [enableCdn, googleStylesheetUrl]);

  if (Object.keys(cssVariables).length === 0) return null;

  return (
    <style
      data-deneb-font-vars
      data-deneb-font-count={activeFontIds.length}
    >{`:root { ${Object.entries(cssVariables)
      .map(([key, value]) => `${key}: ${value};`)
      .join(' ')} }`}</style>
  );
}
