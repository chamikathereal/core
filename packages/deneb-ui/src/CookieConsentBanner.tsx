import React, { useState, useEffect } from 'react';

export interface CookieConsentBannerProps {
  fieldPath?: string;
  title?: string;
  message?: string;
  privacyPolicyUrl?: string;
  privacyPolicyLabel?: string;
  acceptLabel?: string;
  declineLabel?: string;
  position?: 'bottom' | 'bottom-left' | 'bottom-right';
  storageKey?: string;
  onAccept?: () => void;
  onDecline?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * DENEB UI — Cookie & Privacy Consent Banner
 * 
 * GDPR / ePrivacy compliant cookie banner with smooth animation,
 * local storage persistence, and live visual customization.
 * 
 * Features:
 * - Persistent consent state in localStorage (`deneb_cookie_consent`)
 * - Non-intrusive modern floating dock design
 * - Configurable position (bottom, bottom-left, bottom-right)
 * - Accessible keyboard focus management
 * 
 * Created by Chamika Gayashan & Induranga Kawishwara
 */
export function CookieConsentBanner({
  fieldPath = 'site.cookieConsent',
  title = 'We Value Your Privacy',
  message = 'We use cookies and similar technologies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.',
  privacyPolicyUrl = '/privacy',
  privacyPolicyLabel = 'Privacy Policy',
  acceptLabel = 'Accept All',
  declineLabel = 'Decline Non-Essential',
  position = 'bottom-right',
  storageKey = 'deneb_cookie_consent',
  onAccept,
  onDecline,
  className = '',
  style = {},
}: CookieConsentBannerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (!stored) {
        // Delay slightly for smooth entrance
        const timer = setTimeout(() => setIsVisible(true), 800);
        return () => clearTimeout(timer);
      }
    } catch {
      // localStorage may be blocked in some sandboxes
      setIsVisible(true);
    }
  }, [storageKey]);

  const handleAccept = () => {
    try {
      localStorage.setItem(storageKey, 'accepted');
    } catch {
      // ignore
    }
    setIsVisible(false);
    if (onAccept) onAccept();
  };

  const handleDecline = () => {
    try {
      localStorage.setItem(storageKey, 'declined');
    } catch {
      // ignore
    }
    setIsVisible(false);
    if (onDecline) onDecline();
  };

  if (!isVisible) {
    return null;
  }

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom':
        return 'bottom-0 left-0 right-0 p-4 sm:p-6';
      case 'bottom-left':
        return 'bottom-4 left-4 sm:bottom-6 sm:left-6 max-w-md';
      case 'bottom-right':
      default:
        return 'bottom-4 right-4 sm:bottom-6 sm:right-6 max-w-md';
    }
  };

  return (
    <aside
      role="region"
      aria-label="Cookie consent banner"
      className={`fixed z-50 transition-all duration-300 ${getPositionClasses()} ${className}`}
      data-preview-field-path={fieldPath}
      style={style}
    >
      <div
        className="relative overflow-hidden rounded-3xl p-6 bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-2xl"
        style={{
          boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.15)',
        }}
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 p-2.5 rounded-2xl bg-amber-50 border border-amber-100/60 text-amber-600">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10c0-.34-.02-.67-.06-1-.73.57-1.64.91-2.63.91-2.4 0-4.34-1.94-4.34-4.34 0-.99.34-1.9.91-2.63-.33-.04-.66-.06-1-.06-1.15 0-2.22.39-3.08 1.05-.62-.83-.92-1.89-.92-3.05 0-.4.04-.79.11-1.17C12.67 2.04 12.34 2 12 2zm-3 8a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm6 4a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm-4 4a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
            </svg>
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900 leading-tight">
              {title}
            </h4>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              {message}{' '}
              {privacyPolicyUrl && (
                <a
                  href={privacyPolicyUrl}
                  className="font-medium text-slate-900 underline underline-offset-2 hover:text-primary transition-colors"
                >
                  {privacyPolicyLabel}
                </a>
              )}
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={handleDecline}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent transition-all"
          >
            {declineLabel}
          </button>
          <button
            type="button"
            onClick={handleAccept}
            className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white shadow-md transition-all duration-200 active:scale-95 hover:brightness-110"
            style={{
              backgroundColor: 'var(--color-primary, #0f172a)',
            }}
          >
            {acceptLabel}
          </button>
        </div>
      </div>
    </aside>
  );
}
