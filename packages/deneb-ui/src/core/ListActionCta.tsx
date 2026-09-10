'use client';

import React from 'react';
import { resolveActionUrl } from '../utils/urls';

export interface ListActionCtaProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** List path without index, e.g. `seasonal.preOrderCta`. */
  listPath: string;
  itemIndex?: number;
  /** When true, stamps list/item paths and editable label + hidden URL (use on first card only). */
  editable?: boolean;
  buttonLabel: string;
  buttonUrl: string;
  urlMode?: 'auto' | 'external';
  /** Optional icons or extra content rendered before the label span. */
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
}

/**
 * Shared list CTA for grids (Pre-Order, Add to Tray, etc.).
 * Edit via the first card's button; other cards mirror the same label/URL statically.
 */
export function ListActionCta({
  listPath,
  itemIndex = 0,
  editable = true,
  buttonLabel,
  buttonUrl,
  urlMode = 'auto',
  leading,
  trailing,
  className,
  ...rest
}: ListActionCtaProps) {
  const href = resolveActionUrl(buttonUrl, urlMode);
  const labelPath = `${listPath}[${itemIndex}].buttonLabel`;
  const urlPath = `${listPath}[${itemIndex}].buttonUrl`;
  const opensNewTab = Boolean(href && /^https?:\/\//i.test(href));

  const link = (
    <a
      href={href || '#'}
      target={opensNewTab ? '_blank' : undefined}
      rel={opensNewTab ? 'noopener noreferrer' : undefined}
      className={className}
      data-preview-static={editable ? undefined : 'list-action-cta'}
      {...rest}
    >
      {leading}
      {editable ? (
        <span data-preview-field-path={labelPath}>{buttonLabel}</span>
      ) : (
        <span data-preview-static="list-action-cta-label">{buttonLabel}</span>
      )}
      {trailing}
    </a>
  );

  if (!editable) return link;

  return (
    <div data-preview-list-path={listPath}>
      <div data-preview-item-path={`${listPath}[${itemIndex}]`}>
        {link}
        <span hidden aria-hidden="true" data-preview-field-path={urlPath}>
          {buttonUrl}
        </span>
      </div>
    </div>
  );
}
