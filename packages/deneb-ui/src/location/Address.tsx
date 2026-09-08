'use client';

import React from 'react';

export interface AddressProps extends React.HTMLAttributes<HTMLElement> {
  address?: string | null;
  city?: string | null;
  country?: string | null;
  postalCode?: string | null;
  fieldPath?: string;
  addressFieldPath?: string;
  cityFieldPath?: string;
  countryFieldPath?: string;
  postalCodeFieldPath?: string;
  inline?: boolean;
}

export function Address({
  address,
  city,
  country,
  postalCode,
  fieldPath,
  addressFieldPath = 'common.business.location.address',
  cityFieldPath = 'common.business.location.city',
  countryFieldPath = 'common.business.location.country',
  postalCodeFieldPath,
  inline = false,
  className = '',
  style,
  ...rest
}: AddressProps) {
  if (!address && !city && !country && !postalCode) {
    return null;
  }

  const baseStyles: React.CSSProperties = {
    fontStyle: 'normal',
    lineHeight: 1.5,
    color: 'var(--color-text, #0f172a)',
    ...style,
  };

  if (inline) {
    const parts = [
      address,
      city,
      postalCode,
      country,
    ].filter(Boolean);

    return (
      <address
        data-preview-field-path={fieldPath}
        className={`deneb-address deneb-address-inline ${className}`.trim()}
        style={baseStyles}
        {...rest}
      >
        {parts.join(', ')}
      </address>
    );
  }

  return (
    <address
      className={`deneb-address ${className}`.trim()}
      style={baseStyles}
      {...rest}
    >
      {address && (
        <p data-preview-field-path={addressFieldPath} className="deneb-address-street" style={{ margin: '0 0 0.25rem 0' }}>
          {address}
        </p>
      )}
      {(city || country || postalCode) && (
        <p className="deneb-address-locality" style={{ margin: 0 }}>
          {city && <span data-preview-field-path={cityFieldPath}>{city}</span>}
          {city && (country || postalCode) ? ', ' : null}
          {postalCode && (
            postalCodeFieldPath ? (
              <span data-preview-field-path={postalCodeFieldPath}>{postalCode} </span>
            ) : (
              <span data-preview-static="address-postal-code">{postalCode} </span>
            )
          )}
          {country && <span data-preview-field-path={countryFieldPath}>{country}</span>}
        </p>
      )}
    </address>
  );
}
