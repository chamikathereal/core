import { DENEB_FONT_BY_ID, DENEB_FONT_REGISTRY } from './registry';
import type { DenebFontDefinition } from './types';

export function normalizeFontId(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export function lookupFontDefinition(value: string | undefined): DenebFontDefinition | null {
  if (!value || !value.trim()) return null;
  const slug = normalizeFontId(value);
  const direct = DENEB_FONT_BY_ID.get(slug);
  if (direct) return direct;

  for (const font of DENEB_FONT_REGISTRY) {
    if (normalizeFontId(font.label) === slug) return font;
    if (normalizeFontId(font.family) === slug) return font;
  }

  // Match partial family from css stack input e.g. "Inter, sans-serif"
  const primary = value.split(',')[0]?.trim().replace(/^['"]|['"]$/g, '');
  if (primary) {
    const primarySlug = normalizeFontId(primary);
    return DENEB_FONT_BY_ID.get(primarySlug) ?? lookupFontDefinition(primarySlug);
  }

  return null;
}

export function resolveInstallableFont(value: string | undefined): DenebFontDefinition | null {
  const font = lookupFontDefinition(value);
  if (!font) return null;
  if (font.fontsourcePackage) return font;
  if (font.substituteId) return DENEB_FONT_BY_ID.get(font.substituteId) ?? null;
  return null;
}

export function resolveFontFamily(value: string | undefined): string | undefined {
  if (!value || !value.trim()) return undefined;
  const font = lookupFontDefinition(value);
  if (font) return font.cssStack;
  // Pass through quoted stacks or raw family names
  if (value.includes(',')) return value;
  return `'${value.trim()}', system-ui, sans-serif`;
}

export function listFontsByCategory(): Record<string, DenebFontDefinition[]> {
  const grouped: Record<string, DenebFontDefinition[]> = {};
  for (const font of DENEB_FONT_REGISTRY) {
    grouped[font.category] ??= [];
    grouped[font.category].push(font);
  }
  return grouped;
}

export function collectFontIdsFromSiteData(siteData: unknown): string[] {
  const ids = new Set<string>();
  const add = (raw: unknown) => {
    if (typeof raw !== 'string' || !raw.trim()) return;
    const font = lookupFontDefinition(raw);
    if (font) {
      ids.add(font.id);
      if (font.substituteId) ids.add(font.substituteId);
      return;
    }
    const slug = normalizeFontId(raw);
    if (slug) ids.add(slug);
  };

  if (!siteData || typeof siteData !== 'object') return [];
  const data = siteData as Record<string, unknown>;

  const theme =
    (data.theme as Record<string, unknown> | undefined) ??
    ((data.template as Record<string, unknown> | undefined)?.structure as Record<string, unknown> | undefined)?.theme as Record<string, unknown> | undefined;
  add(theme?.headingFont);
  add(theme?.bodyFont);

  const styles = data.styles;
  if (styles && typeof styles === 'object' && !Array.isArray(styles)) {
    for (const styleEntry of Object.values(styles as Record<string, unknown>)) {
      if (styleEntry && typeof styleEntry === 'object' && !Array.isArray(styleEntry)) {
        add((styleEntry as Record<string, unknown>).fontFamily);
      }
    }
  }

  const walkContent = (node: unknown) => {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) {
      node.forEach(walkContent);
      return;
    }
    for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
      if (key.endsWith('Style') && value && typeof value === 'object') {
        add((value as Record<string, unknown>).fontFamily);
      }
      walkContent(value);
    }
  };
  walkContent(data.content);

  ids.delete('system-sans');
  return Array.from(ids);
}
