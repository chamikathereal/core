export const STYLE_TARGET_ATTRIBUTE = 'data-preview-style-target';
export const STYLE_TYPE_ATTRIBUTE = 'data-preview-style-type';
export const PREVIEW_FIELD_ATTRIBUTE = 'data-preview-field-path';
export const PREVIEW_ITEM_ATTRIBUTE = 'data-preview-item-path';
export const PREVIEW_LIST_ATTRIBUTE = 'data-preview-list-path';

function escapeAttributeValue(value: string): string {
  if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') {
    return CSS.escape(value);
  }
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

export function buildStyleTargetSelector(targetPath: string): string {
  return `[${STYLE_TARGET_ATTRIBUTE}="${escapeAttributeValue(targetPath)}"]`;
}

export function buildStyleFallbackSelectors(
  targetPath: string,
  styleType?: string,
): string[] {
  const selectors = [
    buildStyleTargetSelector(targetPath),
    `[${PREVIEW_FIELD_ATTRIBUTE}="${escapeAttributeValue(targetPath)}"]`,
    `[${PREVIEW_ITEM_ATTRIBUTE}="${escapeAttributeValue(targetPath)}"]`,
  ];
  if (styleType === 'card' && targetPath.endsWith('.card')) {
    const itemPath = targetPath.slice(0, -'.card'.length);
    selectors.push(`[${PREVIEW_ITEM_ATTRIBUTE}="${escapeAttributeValue(itemPath)}"]`);
  }
  if (targetPath.includes(':')) {
    const [listPrefix, subPart] = targetPath.split(':');
    if (subPart === 'card') {
      selectors.push(
        `[${PREVIEW_LIST_ATTRIBUTE}="${escapeAttributeValue(listPrefix)}"] [${PREVIEW_ITEM_ATTRIBUTE}]`,
        `[${PREVIEW_LIST_ATTRIBUTE}="${escapeAttributeValue(listPrefix)}"] .card`,
        `[${PREVIEW_LIST_ATTRIBUTE}="${escapeAttributeValue(listPrefix)}"] article`,
      );
    } else if (subPart) {
      selectors.push(
        `[${PREVIEW_LIST_ATTRIBUTE}="${escapeAttributeValue(listPrefix)}"] [${PREVIEW_FIELD_ATTRIBUTE}$=".${escapeAttributeValue(subPart)}"]`,
      );
    }
  }
  return selectors;
}
