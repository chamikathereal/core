import React from 'react';

export interface EditableListProps<T = any> extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  /**
   * The collection path in siteData, e.g. "products", "services", or "home.features".
   */
  path?: string;

  /**
   * Explicit fivora visual editing attribute for strict static analysis.
   */
  'data-preview-list-path'?: string;

  /**
   * The list of items to iterate over.
   */
  items?: T[];

  /**
   * The outer container HTML element or component (default: 'div').
   */
  as?: React.ElementType;

  /**
   * The wrapper element for each item (default: 'div').
   * If false, items are not wrapped automatically.
   */
  itemAs?: React.ElementType | false;

  /**
   * Class name applied to each individual item container.
   */
  itemClassName?: string;

  /**
   * Render function called for each item in the list.
   */
  children: (item: T, index: number, itemPath: string) => React.ReactNode;
}

export function EditableList<T = any>({
  path,
  'data-preview-list-path': previewListPath,
  items = [],
  as: Container = 'div',
  itemAs: ItemContainer = 'div',
  itemClassName,
  children,
  ...props
}: EditableListProps<T>) {
  const listPath = previewListPath || path || '';
  const list = Array.isArray(items) ? items : [];

  return (
    <Container data-preview-list-path={listPath} {...props}>
      {list.map((item, index) => {
        const itemPath = `${listPath}[${index}]`;

        if (ItemContainer === false) {
          return (
            <React.Fragment key={index}>
              {children(item, index, itemPath)}
            </React.Fragment>
          );
        }

        return (
          <ItemContainer
            key={index}
            data-preview-item-path={itemPath}
            className={itemClassName}
          >
            {children(item, index, itemPath)}
          </ItemContainer>
        );
      })}
    </Container>
  );
}
