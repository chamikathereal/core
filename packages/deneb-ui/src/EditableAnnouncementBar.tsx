import React, { useState } from 'react';
import { useSiteData } from './SiteDataProvider';

export interface EditableAnnouncementBarProps {
  fieldPath?: string;
  defaultText?: string;
  defaultBadge?: string;
  defaultLinkText?: string;
  defaultLinkUrl?: string;
  dismissible?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * DENEB UI — Visual-First Announcement Bar
 * 
 * High-converting top promotional ribbon for store announcements,
 * coupon codes, and limited-time offers.
 * 
 * Features:
 * - Live bidirectional Fivora editing bindings (`data-preview-field-path`)
 * - Auto-resolves from site-data.json (`site.announcement` or custom path)
 * - Dismissible button with clean client animation
 * - Tailwind CSS + resilient inline styling fallbacks
 * 
 * Created by Chamika Gayashan & Induranga Kawishwara
 */
export function EditableAnnouncementBar({
  fieldPath = 'site.announcement',
  defaultText = 'Free worldwide shipping on all orders over $50 — Use code: DENEB10',
  defaultBadge = 'PROMO',
  defaultLinkText,
  defaultLinkUrl,
  dismissible = true,
  className = '',
  style = {},
}: EditableAnnouncementBarProps) {
  const { siteData } = useSiteData();
  const [isDismissed, setIsDismissed] = useState(false);

  // Resolve dynamic values from siteData if present
  const announcementData = (siteData as any)?.content?.site?.announcement || (siteData as any)?.site?.announcement;
  const isEnabled = announcementData ? announcementData?.enabled !== false : true;
  const text = announcementData?.text || defaultText;
  const badge = announcementData?.badge || defaultBadge;
  const linkText = announcementData?.linkText || defaultLinkText;
  const linkUrl = announcementData?.linkUrl || defaultLinkUrl;
  const activeFieldPath = fieldPath || 'site.announcement';

  if (isDismissed || !announcementData || !isEnabled) {
    return null;
  }

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 40,
    backgroundColor: 'var(--color-primary, #0f172a)',
    color: '#ffffff',
    fontSize: '0.8125rem',
    lineHeight: '1.25rem',
    fontWeight: 500,
    padding: '0.5rem 1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    transition: 'all 0.2s ease',
    ...style,
  };

  const badgeStyle: React.CSSProperties = {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: '#ffffff',
    padding: '0.125rem 0.5rem',
    borderRadius: '9999px',
    fontSize: '0.6875rem',
    fontWeight: 700,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    marginRight: '0.5rem',
    display: 'inline-flex',
    alignItems: 'center',
  };

  const linkStyle: React.CSSProperties = {
    marginLeft: '0.5rem',
    textDecoration: 'underline',
    fontWeight: 600,
    color: '#ffffff',
    display: 'inline-flex',
    alignItems: 'center',
  };

  const closeButtonStyle: React.CSSProperties = {
    position: 'absolute',
    right: '0.75rem',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: 'rgba(255, 255, 255, 0.7)',
    cursor: 'pointer',
    padding: '0.25rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '0.25rem',
    transition: 'color 0.15s ease',
  };

  return (
    <div
      className={`deneb-announcement-bar relative z-40 bg-slate-900 text-white text-xs md:text-sm font-medium px-4 py-2 flex items-center justify-center text-center ${className}`}
      style={containerStyle}
    >
      <div className="flex items-center justify-center flex-wrap gap-1.5 max-w-7xl mx-auto pr-6">
        {badge && (
          <span
            className="deneb-announcement-badge bg-white/20 text-white px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase inline-flex items-center"
            style={badgeStyle}
            data-preview-field-path={activeFieldPath ? `${activeFieldPath}.badge` : undefined}
          >
            {badge}
          </span>
        )}
        <span
          className="deneb-announcement-text"
          data-preview-field-path={activeFieldPath ? `${activeFieldPath}.text` : undefined}
        >
          {text}
        </span>
        {linkText && linkUrl && (
          <a
            href={linkUrl}
            className="deneb-announcement-link underline font-semibold text-white hover:opacity-90 transition-opacity ml-1 inline-flex items-center gap-1"
            style={linkStyle}
            data-preview-field-path={activeFieldPath ? `${activeFieldPath}.linkText` : undefined}
          >
            {linkText} &rarr;
          </a>
        )}
      </div>

      {dismissible && (
        <button
          type="button"
          onClick={() => setIsDismissed(true)}
          style={closeButtonStyle}
          aria-label="Dismiss announcement"
          className="hover:text-white transition-colors"
          data-preview-static="announcement-dismiss"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}

// Canonical alias
export const AnnouncementBar = EditableAnnouncementBar;
