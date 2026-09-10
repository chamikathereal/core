'use client';

import React from 'react';

export type PreviewFieldProps<T extends React.ElementType = 'span'> = {
  as?: T;
  path: string;
  children?: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, 'as' | 'children'>;

/**
 * Leaf node for Fivora visual editing. Uses suppressHydrationWarning because the
 * preview focus bridge may annotate the DOM before React hydrates.
 */
export function PreviewField<T extends React.ElementType = 'span'>({
  as,
  path,
  children,
  ...rest
}: PreviewFieldProps<T>) {
  const Component = (as || 'span') as React.ElementType;
  return (
    <Component
      data-preview-field-path={path}
      suppressHydrationWarning
      {...rest}
    >
      {children}
    </Component>
  );
}
