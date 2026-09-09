import React from 'react';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';
import { BoxAspectRatio, BoxRadius, BoxShadow, BoxSpacing } from './EditableBox';
import { useComponentStyle } from './hooks/useComponentStyle';

export interface CardItem {
  id?: string | number;
  title?: string;
  name?: string;
  body?: string;
  description?: string;
  imageUrl?: string;
  [key: string]: unknown;
}

const RADIUS_MAP: Record<string, string> = {
  none: '0px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '24px',
  full: '9999px',
};

const SHADOW_MAP: Record<string, string> = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
};

const SPACING_MAP: Record<string, string> = {
  none: '0',
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
};

const ASPECT_MAP: Record<string, string> = {
  square: '1 / 1',
  '1/1': '1 / 1',
  video: '16 / 9',
  '16/9': '16 / 9',
  portrait: '3 / 4',
  '3/4': '3 / 4',
  '4/3': '4 / 3',
  landscape: '4 / 3',
};

export interface EditableCardProps extends React.HTMLAttributes<HTMLElement> {
  itemPath: string;
  item: CardItem;
  titleKey?: string;
  bodyKey?: string;
  imageKey?: string;
  imageFallback?: string;
  as?: React.ElementType;

  /**
   * Card sizing and dimension controls
   */
  width?: string | number;
  minWidth?: string | number;
  maxWidth?: string | number;
  height?: string | number;
  minHeight?: string | number;
  maxHeight?: string | number;
  aspectRatio?: BoxAspectRatio;

  /**
   * Auto-balance: ensures card stretches evenly in flex/grid to match adjacent cards.
   */
  balance?: boolean;

  /**
   * Styling controls
   */
  radius?: BoxRadius;
  shadow?: BoxShadow;
  bg?: string;
  border?: string | boolean;
  padding?: BoxSpacing;
  align?: 'left' | 'center' | 'right';
}

/**
 * Reusable card for services, features, or list items across pages with
 * responsive width/height sizing and auto-balancing space support.
 */
export function EditableCard({
  itemPath,
  item,
  titleKey = 'title',
  bodyKey = 'body',
  imageKey = 'imageUrl',
  imageFallback = '/placeholder.svg',
  as: Component = 'article',
  width,
  minWidth,
  maxWidth,
  height,
  minHeight,
  maxHeight,
  aspectRatio,
  balance,
  radius,
  shadow,
  bg,
  border,
  padding,
  align,
  className = '',
  style,
  children,
  ...props
}: EditableCardProps) {
  const title = String(item?.[titleKey] ?? item?.name ?? '');
  const body = String(item?.[bodyKey] ?? item?.description ?? '');
  const imageUrl = item?.[imageKey] !== undefined ? String(item[imageKey]) : undefined;

  const resolvedRadius = radius !== undefined ? (RADIUS_MAP[String(radius)] || String(radius)) : undefined;
  const resolvedShadow = shadow ? (SHADOW_MAP[shadow] || shadow) : undefined;
  const resolvedPadding = padding !== undefined ? (SPACING_MAP[String(padding)] || String(padding)) : undefined;
  const resolvedAspect = aspectRatio ? (ASPECT_MAP[aspectRatio] || aspectRatio) : undefined;

  const resolvedBorder =
    border === true
      ? '1px solid var(--border-color, rgba(226, 232, 240, 0.8))'
      : typeof border === 'string'
      ? border
      : undefined;

  const stylePath = `${itemPath}.card`;
  const { cssVars: styleVars } = useComponentStyle(stylePath, 'card');

  const cardStyle: React.CSSProperties = {
    width: width !== undefined ? `var(--deneb-card-width, ${width})` : 'var(--deneb-card-width, inherit)',
    minWidth: minWidth !== undefined ? `var(--deneb-card-min-width, ${minWidth})` : undefined,
    maxWidth: maxWidth !== undefined ? `var(--deneb-card-max-width, ${maxWidth})` : undefined,
    height: height !== undefined ? `var(--deneb-card-height, ${height})` : undefined,
    minHeight: minHeight !== undefined ? `var(--deneb-card-min-height, ${minHeight})` : undefined,
    maxHeight: maxHeight !== undefined ? `var(--deneb-card-max-height, ${maxHeight})` : undefined,
    ...(resolvedAspect ? { aspectRatio: `var(--deneb-card-aspect-ratio, ${resolvedAspect})` } : {}),
    ...(balance
      ? {
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          flex: '1 1 0%',
        }
      : {}),
    background: bg ? `var(--deneb-card-bg, ${bg})` : 'var(--deneb-card-bg, inherit)',
    borderRadius: resolvedRadius ? `var(--deneb-card-radius, ${resolvedRadius})` : 'var(--deneb-card-radius, inherit)',
    boxShadow: resolvedShadow ? `var(--deneb-card-shadow, ${resolvedShadow})` : 'var(--deneb-card-shadow, inherit)',
    ...(resolvedBorder ? { border: `var(--deneb-card-border, ${resolvedBorder})` } : {}),
    padding: resolvedPadding ? `var(--deneb-card-pt, ${resolvedPadding})` : 'var(--deneb-card-pt, inherit)',
    textAlign: (align ? `var(--deneb-card-align, ${align})` : 'var(--deneb-card-align, inherit)') as any,
    ...styleVars,
    ...style,
  };

  return (
    <Component
      data-preview-item-path={itemPath}
      data-preview-style-target={stylePath}
      data-preview-style-type="card"
      className={`deneb-card editable-card ${balance ? 'deneb-card-balance' : ''} ${className}`.trim()}
      style={cardStyle}
      {...(props as any)}
    >
      {imageUrl !== undefined && (
        <div className="editable-card-image-wrap">
          <EditableImage
            id={`${itemPath}.${imageKey}`}
            src={imageUrl}
            fallbackSrc={imageFallback}
            alt={title}
            className="editable-card-image"
          />
        </div>
      )}

      <div
        className="editable-card-body"
        style={balance ? { display: 'flex', flexDirection: 'column', flex: '1 1 auto' } : undefined}
      >
        {children ? (
          children
        ) : (
          <>
            <EditableText
              variant="h3"
              color="heading"
              id={`${itemPath}.${titleKey}`}
              data-preview-field-path={`${itemPath}.${titleKey}`}
              defaultValue={title}
              className="editable-card-title"
            />

            <EditableText
              variant="p"
              color="muted"
              id={`${itemPath}.${bodyKey}`}
              data-preview-field-path={`${itemPath}.${bodyKey}`}
              defaultValue={body}
              className="editable-card-body-text"
            />
          </>
        )}
      </div>
    </Component>
  );
}
