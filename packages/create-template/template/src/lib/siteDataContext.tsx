'use client';

import React from 'react';
import {
  SiteDataProvider as BaseSiteDataProvider,
  useSiteData,
  contentText,
  contentObject,
  contentList,
  type SiteData,
  type SiteDataProviderProps,
  PREVIEW_DATA_MESSAGE,
  LEGACY_PREVIEW_DATA_MESSAGE,
  PREVIEW_READY_MESSAGE,
  LEGACY_PREVIEW_READY_MESSAGE,
  PREVIEW_FOCUS_MESSAGE,
  LEGACY_PREVIEW_FOCUS_MESSAGE,
  PREVIEW_FIELD_ATTRIBUTE,
} from '@deneb-ui/ui';

import initialSiteData from '@/data/site-data.json';

export function SiteDataProvider({
  children,
  initialSiteData: providedInitialData,
  ...props
}: {
  children: React.ReactNode;
  initialSiteData?: SiteData;
}) {
  return (
    <BaseSiteDataProvider
      initialSiteData={providedInitialData ?? (initialSiteData as SiteData)}
      {...props}
    >
      {children}
    </BaseSiteDataProvider>
  );
}

export {
  useSiteData,
  contentText,
  contentObject,
  contentList,
  PREVIEW_DATA_MESSAGE,
  LEGACY_PREVIEW_DATA_MESSAGE,
  PREVIEW_READY_MESSAGE,
  LEGACY_PREVIEW_READY_MESSAGE,
  PREVIEW_FOCUS_MESSAGE,
  LEGACY_PREVIEW_FOCUS_MESSAGE,
  PREVIEW_FIELD_ATTRIBUTE,
};

export type { SiteData, SiteDataProviderProps };
