import React, { useMemo, useState, useEffect } from 'react';

export interface EditableMapProps extends React.IframeHTMLAttributes<HTMLIFrameElement> {
  id?: string;
  'data-preview-field-path'?: string;
  mapUrl?: string;
  address?: string;
  defaultLocation?: string;
}

export function parseGoogleMapsEmbedUrl(urlOrLocation: string, addressFallback?: string): string {
  let trimmed = (urlOrLocation || '').trim();
  const fallback = (addressFallback || 'Sri Lanka').trim();

  if (!trimmed) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(fallback)}&output=embed`;
  }

  // 1. If user pasted the full <iframe> embed tag from Google Maps
  if (trimmed.includes('<iframe') && trimmed.includes('src=')) {
    const srcMatch = trimmed.match(/src=["']([^"']+)["']/i);
    if (srcMatch && srcMatch[1]) {
      trimmed = srcMatch[1].trim();
    }
  }

  // 2. Direct embed URL
  if (trimmed.includes('google.com/maps/embed') || trimmed.includes('output=embed')) {
    return trimmed;
  }

  // 3. Extract coordinates: @lat,lng
  const atMatch = trimmed.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (atMatch) {
    return `https://maps.google.com/maps?q=${atMatch[1]},${atMatch[2]}&output=embed`;
  }

  // 4. Extract ll=lat,lng
  const llMatch = trimmed.match(/[?&]ll=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (llMatch) {
    return `https://maps.google.com/maps?q=${llMatch[1]},${llMatch[2]}&output=embed`;
  }

  // 5. Extract place name from /place/Name or /search/Name
  const placeMatch = trimmed.match(/\/maps\/(?:place|search)\/([^/@?#]+)/i);
  if (placeMatch && placeMatch[1]) {
    const decodedPlace = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
    return `https://maps.google.com/maps?q=${encodeURIComponent(decodedPlace)}&output=embed`;
  }

  // 6. Extract query param from Google Maps URLs (e.g. ?q=... or ?daddr=...)
  if (trimmed.includes('google.com/maps') || trimmed.includes('maps.google.com')) {
    const qMatch = trimmed.match(/[?&](?:q|daddr|query)=([^&#]+)/i);
    if (qMatch && qMatch[1]) {
      const decodedQ = decodeURIComponent(qMatch[1].replace(/\+/g, ' '));
      return `https://maps.google.com/maps?q=${encodeURIComponent(decodedQ)}&output=embed`;
    }
  }

  // 7. If it's still a raw URL (like an unresolved shortlink or http link),
  // NEVER pass a raw URL to Google Maps q= parameter, because Google Maps treats
  // it as a KML file, fails, and displays: "Some custom on-map content could not be displayed."
  // Instead, fall back to the address or fallback location.
  if (/^https?:\/\//i.test(trimmed)) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(fallback)}&output=embed`;
  }

  // 8. Plain text location (e.g. "Kandy", "Colombo", "Kandy, Sri Lanka")
  return `https://maps.google.com/maps?q=${encodeURIComponent(trimmed)}&output=embed`;
}

export function EditableMap({
  id,
  'data-preview-field-path': previewFieldPath,
  mapUrl,
  address,
  defaultLocation = 'Sri Lanka',
  className = '',
  style,
  ...props
}: EditableMapProps) {
  const path = previewFieldPath || id;
  const [resolvedUrl, setResolvedUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const trimmed = (mapUrl || '').trim();

    setResolvedUrl(null);

    // If it's a shortlink, try to unshorten it with an unshortener API (with 3s timeout)
    if (trimmed.includes('goo.gl') || trimmed.includes('maps.app.goo.gl')) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 3000);

      fetch(`https://unshorten.me/json/${encodeURIComponent(trimmed)}`, { signal: controller.signal })
        .then((res) => res.json())
        .then((data) => {
          clearTimeout(timer);
          if (active && data?.success && data?.resolved_url) {
            setResolvedUrl(data.resolved_url);
          }
        })
        .catch(() => {
          clearTimeout(timer);
        });

      return () => {
        active = false;
        clearTimeout(timer);
        controller.abort();
      };
    }
  }, [mapUrl]);

  const embedUrl = useMemo(() => {
    const target = resolvedUrl || mapUrl || '';
    return parseGoogleMapsEmbedUrl(target, address || defaultLocation);
  }, [mapUrl, resolvedUrl, address, defaultLocation]);

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

