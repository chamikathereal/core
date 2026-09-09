'use client';

import { useMemo } from 'react';
import {
  buildGoogleFontsStylesheetUrl,
  collectFontIdsFromSiteData,
  lookupFontDefinition,
  resolveFontFamily,
} from '@deneb-ui/core';
import { useSiteData } from '../SiteDataProvider';

export function useDenebFonts(extraFontIds: string[] = []) {
  const siteData = useSiteData();

  const fontIds = useMemo(() => {
    const fromSite = collectFontIdsFromSiteData(siteData);
    const merged = new Set([...fromSite, ...extraFontIds.filter(Boolean)]);
    return Array.from(merged);
  }, [siteData, extraFontIds]);

  const googleStylesheetUrl = useMemo(
    () => buildGoogleFontsStylesheetUrl(fontIds),
    [fontIds],
  );

  const cssVariables = useMemo(() => {
    const theme =
      (siteData as { theme?: Record<string, unknown> })?.theme ??
      (siteData as { template?: { structure?: { theme?: Record<string, unknown> } } })
        ?.template?.structure?.theme;
    const heading = resolveFontFamily(
      typeof theme?.headingFont === 'string' ? theme.headingFont : undefined,
    );
    const body = resolveFontFamily(
      typeof theme?.bodyFont === 'string' ? theme.bodyFont : undefined,
    );
    return {
      ...(heading ? { '--heading-font': heading } : {}),
      ...(body ? { '--body-font': body } : {}),
    } as Record<string, string>;
  }, [siteData]);

  const catalog = useMemo(
    () => fontIds.map((id) => lookupFontDefinition(id)).filter(Boolean),
    [fontIds],
  );

  return { fontIds, googleStylesheetUrl, cssVariables, catalog };
}
