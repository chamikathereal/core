'use client';

import React from 'react';
import { resolveActionUrl } from '../utils/urls';

export interface SplitFieldActionProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Visible button / link label (inspector reads textContent). */
  label: React.ReactNode;
  /** Raw URL stored in site data (hidden from the visible label). */
  urlValue: string;
  labelFieldPath: string;
  urlFieldPath: string;
  /** When `auto`, bare phone numbers become WhatsApp links. */
  urlMode?: 'auto' | 'external';
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Fivora-safe action link: editable label on the anchor, URL on a hidden sibling span.
 * Never put the URL on the same node as the label — the inspector overwrites paired fields.
 */
export function SplitFieldAction({
  label,
  urlValue,
  labelFieldPath,
  urlFieldPath,
  urlMode = 'auto',
  href,
  icon,
  variant = 'primary',
  size = 'md',
  className = '',
  style,
  children,
  ...rest
}: SplitFieldActionProps) {
  const resolvedHref = href || resolveActionUrl(urlValue, urlMode);
  if (!resolvedHref && !label && !children) return null;

  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    fontWeight: 500,
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    borderRadius: '0.5rem',
    ...style,
  };

  const sizeStyles: Record<'sm' | 'md' | 'lg', React.CSSProperties> = {
    sm: { fontSize: '0.875rem', padding: '0.375rem 0.75rem' },
    md: { fontSize: '0.95rem', padding: '0.5rem 1rem' },
    lg: { fontSize: '1.05rem', padding: '0.75rem 1.5rem' },
  };

  const variantStyles: Record<'primary' | 'secondary' | 'outline' | 'ghost' | 'link', React.CSSProperties> = {
    primary: {
      backgroundColor: 'var(--color-primary, #0f172a)',
      color: '#ffffff',
    },
    secondary: {
      backgroundColor: 'var(--color-secondary, #f1f5f9)',
      color: 'var(--color-text, #0f172a)',
    },
    outline: {
      backgroundColor: 'transparent',
      border: '1px solid var(--color-border, #e2e8f0)',
      color: 'var(--color-text, #0f172a)',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--color-text, #0f172a)',
    },
    link: {
      backgroundColor: 'transparent',
      color: 'var(--color-primary, #2563eb)',
      padding: 0,
      textDecoration: 'underline',
      borderRadius: 0,
    },
  };

  const mergedStyles = {
    ...baseStyles,
    ...(variant !== 'link' ? sizeStyles[size] : {}),
    ...variantStyles[variant],
  };

  const finalHref = resolvedHref || '#';
  const opensNewTab = finalHref !== '#' && /^https?:\/\//i.test(finalHref);

  return (
    <span className="deneb-split-field-action" style={{ display: 'contents' }}>
      <a
        href={finalHref}
        data-preview-static="split-field-action"
        target={opensNewTab ? '_blank' : undefined}
        rel={opensNewTab ? 'noopener noreferrer' : undefined}
        className={`deneb-split-field-action-link ${className}`.trim()}
        style={mergedStyles}
        {...rest}
      >
        {icon}
        {children}
        <span data-preview-field-path={labelFieldPath}>{label}</span>
      </a>
      <span hidden aria-hidden="true" data-preview-field-path={urlFieldPath}>
        {urlValue}
      </span>
    </span>
  );
}
