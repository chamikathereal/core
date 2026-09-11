import React, { useMemo } from 'react';

export interface EditableMapProps extends React.IframeHTMLAttributes<HTMLIFrameElement> {
  id?: string;
  'data-preview-field-path'?: string;
  mapUrl?: string;
  defaultLocation?: string;
}

function getGoogleMapsEmbedUrl(urlOrLocation: string): string {
  const trimmed = urlOrLocation.trim();
  
  if (!trimmed) {
    return 'https://maps.google.com/maps?q=Sri+Lanka&output=embed';
  }

  // If it's already an embed URL, return it directly
  if (trimmed.includes('google.com/maps/embed') || trimmed.includes('output=embed')) {
    return trimmed;
  }

  // Try to parse out coordinate lat,lng if available
  const latLngMatch = trimmed.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (latLngMatch) {
    const lat = latLngMatch[1];
    const lng = latLngMatch[2];
    return `https://maps.google.com/maps?q=${lat},${lng}&output=embed`;
  }

  // Fallback: Use the entire input as the search query
  return `https://maps.google.com/maps?q=${encodeURIComponent(trimmed)}&output=embed`;
}

export function EditableMap({
  id,
  'data-preview-field-path': previewFieldPath,
  mapUrl,
  defaultLocation = 'Sri Lanka',
  className = '',
  style,
  ...props
}: EditableMapProps) {
  const path = previewFieldPath || id;
  
  const embedUrl = useMemo(() => {
    return getGoogleMapsEmbedUrl(mapUrl || defaultLocation);
  }, [mapUrl, defaultLocation]);

  return (
    <iframe
      data-preview-field-path={path}
      src={embedUrl}
      className={`editable-map ${className}`.trim()}
      style={{ border: 0, ...style }}
      allowFullScreen={false}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      {...props}
    />
  );
}
