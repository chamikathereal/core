'use client';

import React, { useMemo } from 'react';
import {
  styleToCssVariables,
  type StyleKind,
} from '@deneb-ui/core';
import {
  getFieldStyle,
  isRecord,
  parseFieldPath,
  useSiteData,
  type GenericRecord,
} from '../SiteDataProvider';

function getNestedValue(root: unknown, dottedPath: string): unknown {
  if (!root || !dottedPath) return undefined;
  const parts = parseFieldPath(dottedPath);
  let current: unknown = root;
  for (const part of parts) {
    if (typeof part === 'number') {
      if (!Array.isArray(current)) return undefined;
      current = current[part];
    } else {
      if (!isRecord(current)) return undefined;
      current = current[part];
    }
  }
  return current;
}

export function resolveComponentStyle(
  siteData: GenericRecord,
  stylePath: string,
  defaults?: GenericRecord,
): GenericRecord {
  const stylesTree = isRecord(siteData.styles) ? siteData.styles : {};
  const fromStylesTree = stylesTree[stylePath];
  const fromContentSuffix = getFieldStyle(siteData.content, stylePath);
  const raw = isRecord(fromStylesTree)
    ? fromStylesTree
    : fromContentSuffix ?? {};
  return { ...(defaults ?? {}), ...raw };
}

export function useComponentStyle<T extends GenericRecord = GenericRecord>(
  stylePath: string | undefined,
  styleKind: StyleKind,
  defaults?: Partial<T>,
) {
  const siteData = useSiteData();
  const merged = useMemo(() => {
    if (!stylePath) return (defaults ?? {}) as T;
    return resolveComponentStyle(
      siteData as GenericRecord,
      stylePath,
      defaults as GenericRecord | undefined,
    ) as T;
  }, [siteData, stylePath, defaults]);

  const cssVars = useMemo(
    () => styleToCssVariables(styleKind, merged) as React.CSSProperties,
    [styleKind, merged],
  );

  return { style: merged, cssVars };
}
