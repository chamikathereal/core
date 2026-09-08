import React from 'react';
import { BoxSpacing } from './EditableBox';

const SECTION_PADDING_MAP: Record<string, string> = {
  none: '0',
  xs: '1.5rem 0',
  sm: '2.5rem 0',
  md: '4rem 0',
  lg: '6rem 0',
  xl: '8rem 0',
  '2xl': '10rem 0',
};

export interface EditableSectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;

  /**
   * Required fivora design section identifier (e.g. 'home-hero', 'home-introduction', 'home-features').
   * Automatically sets `data-design-section` to satisfy strict Fivora validator rules.
   */
  name: string;

  /**
   * Vertical section padding ('none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' or custom CSS).
   */
  padding?: BoxSpacing;

  /**
   * Background color or CSS variable.
   */
  bg?: string;

  /**
   * Text color for the section.
   */
  color?: string;

  /**
   * Max width for the section container content.
   */
  maxWidth?: string | number;

  /**
   * Section border style.
   */
  border?: string | boolean;
}

/**
 * EditableSection standardizes section spacing and automatically applies the required
 * `data-design-section` marker for 100% fivora contract compliance.
 */
export function EditableSection({
  as: Component = 'section',
  name,
  padding = 'lg',
  bg,
  color,
  maxWidth,
  border,
  className = '',
  style,
  children,
  ...props
}: EditableSectionProps) {
  const resolvedPadding =
    padding !== undefined ? (SECTION_PADDING_MAP[String(padding)] || String(padding)) : undefined;

  const resolvedBorder =
    border === true
      ? '1px solid var(--border-color, rgba(226, 232, 240, 0.8))'
      : typeof border === 'string'
      ? border
      : undefined;

  const sectionStyle: React.CSSProperties = {
    ...(resolvedPadding ? { padding: resolvedPadding } : {}),
    ...(bg ? { background: bg } : {}),
    ...(color ? { color } : {}),
    ...(maxWidth !== undefined ? { maxWidth, marginLeft: 'auto', marginRight: 'auto' } : {}),
    ...(resolvedBorder ? { borderBottom: resolvedBorder } : {}),
    ...style,
  };

  return (
    <Component
      data-design-section={name}
      className={`editable-section ${className}`.trim()}
      style={sectionStyle}
      {...(props as any)}
    >
      {children}
    </Component>
  );
}
