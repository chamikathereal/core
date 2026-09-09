import {
  buildStyleFallbackSelectors,
  STYLE_TARGET_ATTRIBUTE,
  STYLE_TYPE_ATTRIBUTE,
} from '../types/markers';
import type { StyleKind } from '../types/styles';
import { deepMerge } from './deepMerge';
import { styleToCssVariables } from './cssVariables';

const liveStyleCache = new Map<string, Record<string, unknown>>();

export function getLiveStyleCache(): Map<string, Record<string, unknown>> {
  return liveStyleCache;
}

export function applyCssVariablesToElement(
  element: HTMLElement,
  cssVars: Record<string, string>,
): void {
  for (const [varName, varVal] of Object.entries(cssVars)) {
    if (varVal) {
      element.style.setProperty(varName, varVal);
    } else {
      element.style.removeProperty(varName);
    }
  }
}

export function findStyleTargetElement(
  targetPath: string,
  styleType?: StyleKind,
): HTMLElement | null {
  if (typeof document === 'undefined' || !targetPath) return null;
  for (const selector of buildStyleFallbackSelectors(targetPath, styleType)) {
    const match = document.querySelector<HTMLElement>(selector);
    if (match) return match;
  }
  return null;
}

export function patchElementStyle(
  element: HTMLElement,
  styleKind: StyleKind,
  updates: Record<string, unknown>,
): void {
  const targetPath = element.getAttribute(STYLE_TARGET_ATTRIBUTE) ?? '';
  const cacheKey = targetPath || element.getAttribute('data-preview-field-path') || '';
  const previous = cacheKey ? liveStyleCache.get(cacheKey) ?? {} : {};
  const merged = deepMerge(previous, updates);
  if (cacheKey) liveStyleCache.set(cacheKey, merged);

  const cssVars = styleToCssVariables(styleKind, merged);
  applyCssVariablesToElement(element, cssVars);

  if (!element.getAttribute(STYLE_TYPE_ATTRIBUTE)) {
    element.setAttribute(STYLE_TYPE_ATTRIBUTE, styleKind);
  }
}

export function patchStyleByPath(
  targetPath: string,
  styleKind: StyleKind,
  updates: Record<string, unknown>,
): boolean {
  const element = findStyleTargetElement(targetPath, styleKind);
  if (!element) return false;
  patchElementStyle(element, styleKind, updates);
  return true;
}
