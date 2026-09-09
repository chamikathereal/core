import { DENEB_FONT_BY_ID } from './registry';
import type { DenebFontDefinition } from './types';
import { lookupFontDefinition } from './resolve';

function buildFamilyParam(font: DenebFontDefinition): string | null {
  if (!font.googleQuery) return null;
  const weights = font.weights.length > 0 ? font.weights : [400];
  const unique = Array.from(new Set(weights)).sort((a, b) => a - b);
  if (font.italic) {
    const pairs = unique.flatMap((w) => [`0,${w}`, `1,${w}`]);
    return `family=${font.googleQuery}:ital,wght@${pairs.join(';')}`;
  }
  if (font.variable || unique.length > 4) {
    const min = unique[0];
    const max = unique[unique.length - 1];
    return `family=${font.googleQuery}:wght@${min}..${max}`;
  }
  return `family=${font.googleQuery}:wght@${unique.join(';')}`;
}

export function buildGoogleFontsStylesheetUrl(fontIds: string[]): string | null {
  const params: string[] = [];
  const seen = new Set<string>();

  for (const rawId of fontIds) {
    const font = DENEB_FONT_BY_ID.get(rawId) ?? lookupFontDefinition(rawId);
    if (!font || !font.googleFonts || !font.googleQuery) continue;
    const installId = font.substituteId && !font.fontsourcePackage ? font.substituteId : font.id;
    const installFont = DENEB_FONT_BY_ID.get(installId) ?? font;
    if (seen.has(installFont.id)) continue;
    seen.add(installFont.id);
    const param = buildFamilyParam(installFont);
    if (param) params.push(param);
  }

  if (params.length === 0) return null;
  return `https://fonts.googleapis.com/css2?${params.join('&')}&display=swap`;
}
