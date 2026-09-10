'use client';

import React from 'react';
import { Address } from './Address';
import { MapLink } from './MapLink';

export interface LocationLinkProps {
  address?: string | null;
  city?: string | null;
  country?: string | null;
  mapUrl?: string | null;
  fieldPath?: string;
  addressFieldPath?: string;
  mapUrlFieldPath?: string;
  directionsLabel?: string;
  showAddress?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Combines physical address with an interactive "Get Directions" action.
 */
export function LocationLink({
  address,
  city,
  country,
  mapUrl,
  fieldPath,
  addressFieldPath = 'common.business.location.address',
  mapUrlFieldPath = 'common.business.location.addressUrl',
  directionsLabel = 'Get Directions',
  showAddress = true,
  className = '',
  style,
}: LocationLinkProps) {
  if (!address && !city && !country && !mapUrl) {
    return null;
  }

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    alignItems: 'flex-start',
    ...style,
  };

  return (
    <div className={`deneb-location-link ${className}`.trim()} style={containerStyles}>
      {showAddress && (
        <Address
          address={address}
          city={city}
          country={country}
          fieldPath={fieldPath}
          addressFieldPath={addressFieldPath}
        />
      )}
      <MapLink
        mapUrl={mapUrl}
        address={address}
        city={city}
        country={country}
        label={directionsLabel}
        fieldPath={mapUrlFieldPath}
        variant="outline"
        size="sm"
      />
    </div>
  );
}
