import type { StyleKind, StyleProperties } from './styles';

export const STYLE_PATCH_MESSAGE = 'FIVORA_PREVIEW_STYLE_PATCH';
export const DENEB_STYLE_PATCH_MESSAGE = 'DENEB_PREVIEW_STYLE_PATCH';

export interface StylePatchPayload {
  type: typeof STYLE_PATCH_MESSAGE | typeof DENEB_STYLE_PATCH_MESSAGE;
  targetPath: string;
  styleType: StyleKind;
  properties: Partial<StyleProperties>;
}

export function isStylePatchPayload(value: unknown): value is StylePatchPayload {
  if (!value || typeof value !== 'object') return false;
  const payload = value as Record<string, unknown>;
  const type = payload.type;
  if (type !== STYLE_PATCH_MESSAGE && type !== DENEB_STYLE_PATCH_MESSAGE) {
    return false;
  }
  return (
    typeof payload.targetPath === 'string' &&
    typeof payload.styleType === 'string' &&
    typeof payload.properties === 'object' &&
    payload.properties !== null
  );
}
