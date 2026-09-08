'use client';

import React from 'react';
import { SocialButton, SocialPlatform } from './SocialButton';

export interface SocialLinksProps {
  social?: Record<string, string | null | undefined>;
  fieldPathPrefix?: string;
  variant?: 'icon' | 'pill' | 'button';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  style?: React.CSSProperties;
}

const SUPPORTED_PLATFORMS: SocialPlatform[] = [
  'instagram',
  'facebook',
  'tiktok',
  'youtube',
  'linkedin',
  'twitter',
  'x',
  'pinterest',
  'github',
];

/**
 * Smart container rendering active social buttons.
 * Automatically filters out any unconfigured or empty platforms.
 */
export function SocialLinks({
  social = {},
  fieldPathPrefix = 'common.business.social',
  variant = 'icon',
  size = 'md',
  className = '',
  style,
}: SocialLinksProps) {
  // Find platforms with valid URLs
  const activePlatforms = Object.entries(social).filter(([platform, url]) => {
    return Boolean(url && typeof url === 'string' && url.trim().length > 0);
  });

  if (activePlatforms.length === 0) {
    return null;
  }

  const containerStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '0.625rem',
    ...style,
  };

  return (
    <div className={`deneb-social-links ${className}`.trim()} style={containerStyles}>
      {activePlatforms.map(([key, url]) => {
        const lowerKey = key.toLowerCase() as SocialPlatform;
        const platform = SUPPORTED_PLATFORMS.includes(lowerKey) ? lowerKey : 'x';

        return (
          <SocialButton
            key={key}
            platform={platform}
            url={url}
            fieldPath={`${fieldPathPrefix}.${key}`}
            variant={variant}
            size={size}
          />
        );
      })}
    </div>
  );
}
