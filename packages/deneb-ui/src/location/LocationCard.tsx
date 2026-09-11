'use client';

import React from 'react';
import { Address } from './Address';
import { MapLink } from './MapLink';
import { EditableText } from '../EditableText';

export interface LocationCardProps {
  name?: string | null;
  title?: string;
  titleFieldPath?: string;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postalCode?: string | null;
  mapUrl?: string | null;
  addressUrl?: string | null;
  url?: string | null;
  fieldPath?: string;
  nameFieldPath?: string;
  addressFieldPath?: string;
  mapUrlFieldPath?: string;
  directionsLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Premium storefront LocationCard displaying address, pin icon, and Google Maps directions button.
 */
export function LocationCard({
  name,
  title = 'Our Location',
  titleFieldPath,
  address,
  city,
  state,
  country,
  postalCode,
  mapUrl,
  addressUrl,
  url,
  fieldPath,
  nameFieldPath,
  addressFieldPath = 'common.business.location.address',
  mapUrlFieldPath = 'common.business.location.addressUrl',
  directionsLabel = 'Get Directions →',
  className = '',
  style,
}: LocationCardProps) {
  const explicitUrl = (addressUrl || mapUrl || url || '').trim();
  const cardTitle = name || title || 'Our Location';
  const resolvedTitleFieldPath = nameFieldPath || titleFieldPath || (fieldPath ? `${fieldPath}.name` : 'contact.locationTitle');

  if (!address && !city && !country && !explicitUrl && !name) {
    return null;
  }

  const cardStyles: React.CSSProperties = {
    padding: '2rem',
    borderRadius: '1rem',
    border: '1px solid var(--color-border, #e2e8f0)',
    backgroundColor: 'var(--color-surface, #ffffff)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '1rem',
    maxWidth: '400px',
    ...style,
  };

  const iconCircleStyles: React.CSSProperties = {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-secondary, #f1f5f9)',
    color: 'var(--color-primary, #0f172a)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div className={`deneb-location-card ${className}`.trim()} style={cardStyles}>
      <div style={iconCircleStyles}>
        <svg data-preview-static="location-card-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      </div>

      <EditableText
        as="h3"
        id={titleFieldPath || (fieldPath ? `${fieldPath}.title` : 'contact.locationTitle')}
        defaultValue={cardTitle}
        style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text, #0f172a)' }}
      />

      <Address
        address={address}
        city={city}
        country={country}
        postalCode={postalCode}
        fieldPath={fieldPath}
        addressFieldPath={addressFieldPath}
      />

      <div style={{ marginTop: '0.5rem', width: '100%' }}>
        <MapLink
          name={name}
          mapUrl={explicitUrl}
          addressUrl={explicitUrl}
          url={explicitUrl}
          address={address}
          city={city}
          state={state}
          country={country}
          postalCode={postalCode}
          label={directionsLabel}
          urlFieldPath={mapUrlFieldPath}
          variant="primary"
          size="md"
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
}
