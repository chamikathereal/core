import React from 'react';
import { BoxSpacing } from './EditableBox';
import { useComponentStyle } from './hooks/useComponentStyle';
import { RESPONSIVE_SECTION_PADDING } from './utils/responsive';

const SECTION_PADDING_MAP: Record<string, string> = RESPONSIVE_SECTION_PADDING;

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

  const stylePath = `${name}.section`;
  const { cssVars: styleVars } = useComponentStyle(stylePath, 'section');

  const sectionStyle: React.CSSProperties = {
    ...(resolvedPadding ? { padding: resolvedPadding } : {}),
    ...(bg ? { background: bg } : {}),
    ...(color ? { color } : {}),
    ...(maxWidth !== undefined ? { maxWidth, marginLeft: 'auto', marginRight: 'auto' } : {}),
    ...(resolvedBorder ? { borderBottom: resolvedBorder } : {}),
    ...styleVars,
    ...style,
  };

  return (
    <Component
      data-design-section={name}
      data-preview-style-target={stylePath}
      data-preview-style-type="section"
      className={`deneb-section editable-section ${className}`.trim()}
      style={sectionStyle}
      {...(props as any)}
    >
      {children}
    </Component>
  );
}
