import React from 'react';

export type ImageAspectRatio =
  | 'square'
  | '1/1'
  | 'video'
  | '16/9'
  | 'portrait'
  | '3/4'
  | '4/3'
  | '2/3'
  | '21/9'
  | (string & {});

export type ImageRadius =
  | 'none'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | 'full'
  | (string & {});

const ASPECT_MAP: Record<string, string> = {
  square: '1 / 1',
  '1/1': '1 / 1',
  video: '16 / 9',
  '16/9': '16 / 9',
  portrait: '3 / 4',
  '3/4': '3 / 4',
  '4/3': '4 / 3',
  '2/3': '2 / 3',
  '21/9': '21 / 9',
};

const RADIUS_MAP: Record<string, string> = {
  none: '0px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '24px',
  full: '9999px',
};

export interface EditableImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  id?: string;
  'data-preview-field-path'?: string;
  fallbackSrc?: string;
  aspectRatio?: ImageAspectRatio;
  radius?: ImageRadius;
  fit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  hoverZoom?: boolean;
}

const DEFAULT_FALLBACK_SVG =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" fill="none"><rect width="600" height="400" fill="%23f1f5f9"/><path d="M250 180a30 30 0 100-60 30 30 0 000 60zM170 300l80-90 60 70 70-100 90 120H170z" fill="%23cbd5e1"/></svg>';

export function EditableImage({
  id,
  'data-preview-field-path': previewFieldPath,
  src,
  fallbackSrc = DEFAULT_FALLBACK_SVG,
  alt = '',
  aspectRatio,
  radius,
  fit = 'cover',
  hoverZoom = false,
  style,
  className = '',
  ...props
}: EditableImageProps) {
  const path = previewFieldPath || id;
  const resolvedAspect = aspectRatio ? (ASPECT_MAP[aspectRatio] || aspectRatio) : undefined;
  const resolvedRadius = radius ? (RADIUS_MAP[radius] || radius) : undefined;

  const combinedStyle: React.CSSProperties = {
    ...(resolvedAspect ? { aspectRatio: resolvedAspect } : {}),
    ...(resolvedRadius ? { borderRadius: resolvedRadius } : {}),
    ...(fit ? { objectFit: fit } : {}),
    ...(hoverZoom ? { transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)' } : {}),
    ...style,
  };

  return (
    <img
      data-preview-field-path={path}
      src={src || fallbackSrc}
      alt={alt}
      style={combinedStyle}
      className={`editable-image ${hoverZoom ? 'hover:scale-105' : ''} ${className}`.trim()}
      {...props}
    />
  );
}

