export const MEDIA_CATEGORIES = [
  {
    key: 'content_image',
    label: 'Content images',
    accept: ['image/jpeg', 'image/png', 'image/webp'],
    maxSizeBytes: 5 * 1024 * 1024,
    maxFiles: 200,
  },
  {
    key: 'business_logo',
    label: 'Business logo',
    accept: ['image/jpeg', 'image/png', 'image/webp'],
    maxSizeBytes: 5 * 1024 * 1024,
    maxFiles: 1,
  },
  {
    key: 'website_banner',
    label: 'Website banner images',
    accept: ['image/jpeg', 'image/png', 'image/webp'],
    maxSizeBytes: 5 * 1024 * 1024,
    maxFiles: 10,
  },
  {
    key: 'gallery',
    label: 'Gallery images',
    accept: ['image/jpeg', 'image/png', 'image/webp'],
    maxSizeBytes: 5 * 1024 * 1024,
    maxFiles: 30,
  },
  {
    key: 'product',
    label: 'Product images',
    accept: ['image/jpeg', 'image/png', 'image/webp'],
    maxSizeBytes: 5 * 1024 * 1024,
    maxFiles: 50,
  },
  {
    key: 'service',
    label: 'Service images',
    accept: ['image/jpeg', 'image/png', 'image/webp'],
    maxSizeBytes: 5 * 1024 * 1024,
    maxFiles: 50,
  },
  {
    key: 'shop_front',
    label: 'Shop front images',
    accept: ['image/jpeg', 'image/png', 'image/webp'],
    maxSizeBytes: 5 * 1024 * 1024,
    maxFiles: 10,
  },
  {
    key: 'company_document',
    label: 'Company documents',
    accept: ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'],
    maxSizeBytes: 10 * 1024 * 1024,
    maxFiles: 10,
  },
  {
    key: 'brochure_pdf',
    label: 'Brochure PDF',
    accept: ['application/pdf'],
    maxSizeBytes: 10 * 1024 * 1024,
    maxFiles: 5,
  },
  {
    key: 'restaurant_menu_pdf',
    label: 'Restaurant menu PDF',
    accept: ['application/pdf'],
    maxSizeBytes: 10 * 1024 * 1024,
    maxFiles: 5,
  },
] as const;

export type MediaCategoryKey = (typeof MEDIA_CATEGORIES)[number]['key'];

export const MEDIA_ROLES = [
  'LOGO',
  'HERO_IMAGE',
  'PRODUCT_IMAGE',
  'SERVICE_IMAGE',
  'ABOUT_IMAGE',
  'SHOP_IMAGE',
  'TEAM_IMAGE',
  'GALLERY_IMAGE',
  'OTHER',
] as const;

export const MEDIA_ENTITY_TYPES = ['PRODUCT', 'SERVICE'] as const;

export function getMediaCategory(key: string) {
  return MEDIA_CATEGORIES.find((category) => category.key === key);
}
