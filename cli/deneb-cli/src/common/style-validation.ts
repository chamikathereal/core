import {
  collectStyleTargetsFromHtml,
  validateStyleTree,
  type StyleValidationIssue,
} from '@deneb-ui/core';

import type { TemplateVisualEditingArtifact } from './template-visual-edit-contract';

export function validateTemplateStyleContract(input: {
  siteData: unknown;
  artifacts: TemplateVisualEditingArtifact[];
}): StyleValidationIssue[] {
  const issues: StyleValidationIssue[] = [];
  const htmlTargets = new Set<string>();

  for (const artifact of input.artifacts) {
    if (artifact.kind !== 'html') continue;
    for (const target of collectStyleTargetsFromHtml(artifact.content)) {
      htmlTargets.add(target);
    }
  }

  const siteData =
    input.siteData && typeof input.siteData === 'object' && !Array.isArray(input.siteData)
      ? (input.siteData as Record<string, unknown>)
      : null;
  const styles = siteData?.styles;
  issues.push(...validateStyleTree(styles, htmlTargets.size > 0 ? htmlTargets : undefined));
  return issues;
}
