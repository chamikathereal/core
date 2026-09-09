import type { StyleKind } from '../types/styles';

const STYLE_KINDS = new Set<StyleKind>(['text', 'card', 'button', 'grid', 'section']);

export interface StyleValidationIssue {
  path: string;
  message: string;
}

export function isValidStyleKind(value: unknown): value is StyleKind {
  return typeof value === 'string' && STYLE_KINDS.has(value as StyleKind);
}

export function validateStyleTree(
  styles: unknown,
  knownTargets?: Set<string>,
): StyleValidationIssue[] {
  const issues: StyleValidationIssue[] = [];
  if (styles === undefined || styles === null) return issues;
  if (typeof styles !== 'object' || Array.isArray(styles)) {
    issues.push({ path: 'styles', message: 'styles must be an object' });
    return issues;
  }

  for (const [path, value] of Object.entries(styles as Record<string, unknown>)) {
    if (!path.trim()) {
      issues.push({ path: 'styles', message: 'style path cannot be empty' });
      continue;
    }
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      issues.push({ path: `styles.${path}`, message: 'style entry must be an object' });
      continue;
    }
    if (knownTargets && !knownTargets.has(path)) {
      issues.push({
        path: `styles.${path}`,
        message: 'no matching data-preview-style-target marker in template',
      });
    }
  }
  return issues;
}

export function collectStyleTargetsFromHtml(html: string): Set<string> {
  const targets = new Set<string>();
  const attrPattern = /data-preview-style-target=["']([^"']+)["']/g;
  let match: RegExpExecArray | null;
  while ((match = attrPattern.exec(html)) !== null) {
    targets.add(match[1]);
  }
  return targets;
}
