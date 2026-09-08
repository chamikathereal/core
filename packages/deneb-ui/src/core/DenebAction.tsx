'use client';

import React from 'react';
import { createWhatsAppUrl, createPhoneUrl, createEmailUrl, createMapUrl } from '../utils/urls';

export type DenebActionType =
  | 'whatsapp'
  | 'phone'
  | 'email'
  | 'location'
  | 'page'
  | 'external'
  | 'custom';

export interface DenebActionProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  type?: DenebActionType;
  value?: string | null;
  fieldPath?: string;
  targetPage?: string;
  label?: React.ReactNode;
  children?: React.ReactNode;
  openInNewTab?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export function DenebAction({
  type = 'custom',
  value,
  href,
  fieldPath,
  targetPage,
  label,
  children,
  openInNewTab,
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  style,
  ...rest
}: DenebActionProps) {
  // Derive destination URL
  let resolvedHref = href || value || '#';
  let shouldOpenNewTab = openInNewTab;

  switch (type) {
    case 'whatsapp':
      resolvedHref = createWhatsAppUrl(value || href);
      if (shouldOpenNewTab === undefined) shouldOpenNewTab = true;
      break;
    case 'phone':
      resolvedHref = createPhoneUrl(value || href);
      if (shouldOpenNewTab === undefined) shouldOpenNewTab = false;
      break;
    case 'email':
      resolvedHref = createEmailUrl(value || href);
      if (shouldOpenNewTab === undefined) shouldOpenNewTab = false;
      break;
    case 'location':
      resolvedHref = createMapUrl(value || href);
      if (shouldOpenNewTab === undefined) shouldOpenNewTab = true;
      break;
    case 'external':
      if (shouldOpenNewTab === undefined) shouldOpenNewTab = true;
      break;
    case 'page':
      if (shouldOpenNewTab === undefined) shouldOpenNewTab = false;
      break;
    default:
      break;
  }

  // If no valid destination could be generated and no children/label, don't render empty broken link
  if (!resolvedHref && !children && !label) {
    return null;
  }

  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    fontWeight: 500,
    textDecoration: 'none',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    borderRadius: '0.5rem',
    ...style,
  };

  const sizeStyles: Record<'sm' | 'md' | 'lg', React.CSSProperties> = {
    sm: { fontSize: '0.875rem', padding: '0.4rem 0.75rem' },
    md: { fontSize: '0.95rem', padding: '0.6rem 1.2rem' },
    lg: { fontSize: '1.05rem', padding: '0.75rem 1.6rem' },
  };

  const variantStyles: Record<'primary' | 'secondary' | 'outline' | 'ghost' | 'link', React.CSSProperties> = {
    primary: {
      backgroundColor: 'var(--color-primary, #0f172a)',
      color: '#ffffff',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
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

  const linkElement = (
    <a
      href={resolvedHref}
      data-preview-field-path={fieldPath}
      target={shouldOpenNewTab ? '_blank' : undefined}
      rel={shouldOpenNewTab ? 'noopener noreferrer' : undefined}
      className={`deneb-action deneb-action-${type} deneb-action-${variant} ${className}`.trim()}
      style={mergedStyles}
      {...rest}
    >
      {icon && <span className="deneb-action-icon">{icon}</span>}
      {children || label}
    </a>
  );

  // If targetPage is provided, wrap in span with data-target-page for platform route-pruning compliance
  if (targetPage) {
    return (
      <span data-target-page={targetPage} style={{ display: 'inline-block' }}>
        {linkElement}
      </span>
    );
  }

  return linkElement;
}

/**
 * Smart action link alias
 */
export const ActionLink = DenebAction;
