/**
 * DENEB UI — URL & Action Helpers
 * Created by Chamika Gayashan & Induranga Kawishwara
 */

export interface MapLocationInput {
  mapUrl?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
}

/**
 * Creates a valid WhatsApp click-to-chat URL.
 * Automatically cleans spaces, dashes, and special characters from the phone number.
 */
export function createWhatsAppUrl(phone?: string | null, message?: string | null): string {
  if (!phone) return '';
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  if (!cleanPhone) return '';

  const baseUrl = `https://wa.me/${cleanPhone}`;
  if (message && message.trim()) {
    return `${baseUrl}?text=${encodeURIComponent(message.trim())}`;
  }
  return baseUrl;
}

/**
 * Creates a telephone URI for one-click calling.
 */
export function createPhoneUrl(phone?: string | null): string {
  if (!phone) return '';
  const cleanPhone = phone.replace(/[^0-9+]/g, '');
  return cleanPhone ? `tel:${cleanPhone}` : '';
}

/**
 * Creates an email mailto: URI with optional subject and body.
 */
export function createEmailUrl(
  email?: string | null,
  subject?: string | null,
  body?: string | null
): string {
  if (!email || !email.trim()) return '';
  const cleanEmail = email.trim();
  const params: string[] = [];

  if (subject && subject.trim()) {
    params.push(`subject=${encodeURIComponent(subject.trim())}`);
  }
  if (body && body.trim()) {
    params.push(`body=${encodeURIComponent(body.trim())}`);
  }

  return params.length > 0 ? `mailto:${cleanEmail}?${params.join('&')}` : `mailto:${cleanEmail}`;
}

/**
 * Creates a Google Maps search or direction URL.
 * Prefers an explicit mapUrl, otherwise constructs a query using address, city, and country.
 */
export function createMapUrl(location?: MapLocationInput | string | null): string {
  if (!location) return '';

  if (typeof location === 'string') {
    if (location.startsWith('http://') || location.startsWith('https://')) {
      return location;
    }
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
  }

  if (location.mapUrl && location.mapUrl.trim()) {
    return location.mapUrl.trim();
  }

  const queryParts = [location.address, location.city, location.country]
    .filter((part): part is string => Boolean(part && part.trim()))
    .map((part) => part.trim());

  if (queryParts.length > 0) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(queryParts.join(', '))}`;
  }

  return '';
}

/**
 * Validates if a string is a safe, valid external link (prevents script injection).
 */
export function isSafeExternalLink(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim().toLowerCase();
  return (
    trimmed.startsWith('https://') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('tel:') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('//') ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('#')
  );
}
