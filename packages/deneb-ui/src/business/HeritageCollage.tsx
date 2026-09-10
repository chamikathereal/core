'use client';

import React from 'react';
import { withBasePath } from '../utils/urls';

export interface CollageImageItem {
  id?: string;
  image?: string | null;
  caption?: string | null;
}

export interface HeritageCollageProps {
  collageHeading?: React.ReactNode;
  collageDescription?: React.ReactNode;
  historyHeading?: React.ReactNode;
  history?: React.ReactNode;
  images?: CollageImageItem[];
  collageHeadingPath?: string;
  collageDescriptionPath?: string;
  historyHeadingPath?: string;
  historyPath?: string;
  listPath?: string;
  className?: string;
}

const COLLAGE_LAYOUT = [
  'row-span-2 min-h-[220px]',
  'min-h-[140px]',
  'min-h-[140px]',
  'col-span-2 min-h-[180px]',
];

/**
 * Heritage collage + history block for About pages.
 * List images use standard Fivora list/item/field path attributes.
 */
export function HeritageCollage({
  collageHeading,
  collageDescription,
  historyHeading,
  history,
  images = [],
  collageHeadingPath,
  collageDescriptionPath,
  historyHeadingPath,
  historyPath,
  listPath = 'about.collageImages',
  className = '',
}: HeritageCollageProps) {
  const hasContent =
    images.length > 0 ||
    (typeof collageDescription === 'string' ? collageDescription.trim() : collageDescription) ||
    (typeof history === 'string' ? history.trim() : history);

  if (!hasContent) return null;

  return (
    <section
      className={`deneb-heritage-collage ${className}`.trim()}
      data-design-section="heritage-collage"
      style={{ marginTop: '3rem', paddingTop: '2.5rem', borderTop: '1px solid var(--color-border, #e2e8f0)' }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
          alignItems: 'start',
        }}
      >
        {images.length > 0 ? (
          <div
            data-preview-list-path={listPath}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0.75rem',
              gridAutoRows: 'minmax(120px, auto)',
            }}
          >
            {images.map((item, idx) => (
              <figure
                key={item.id || `collage-${idx}`}
                data-preview-item-path={`${listPath}[${idx}]`}
                className={COLLAGE_LAYOUT[idx] ?? COLLAGE_LAYOUT[1]}
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '1rem',
                  border: '1px solid var(--color-border, #e2e8f0)',
                  margin: 0,
                  minHeight: '140px',
                  background: 'var(--color-secondary, #f1f5f9)',
                }}
              >
                <img
                  src={withBasePath(item.image || '/placeholder.svg')}
                  alt=""
                  data-preview-field-path={`${listPath}[${idx}].image`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                {item.caption ? (
                  <figcaption
                    style={{
                      position: 'absolute',
                      insetInline: 0,
                      bottom: 0,
                      padding: '0.75rem 1rem',
                      background: 'linear-gradient(transparent, rgba(15,23,42,0.85))',
                      color: '#fff',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                    }}
                  >
                    <span data-preview-field-path={`${listPath}[${idx}].caption`}>{item.caption}</span>
                  </figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        ) : null}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {collageHeading ? (
            <h2
              {...(collageHeadingPath ? { 'data-preview-field-path': collageHeadingPath } : {})}
              style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}
            >
              {collageHeading}
            </h2>
          ) : null}
          {collageDescription ? (
            <p
              {...(collageDescriptionPath ? { 'data-preview-field-path': collageDescriptionPath } : {})}
              style={{ margin: 0, lineHeight: 1.6, color: 'var(--color-muted, #64748b)' }}
            >
              {collageDescription}
            </p>
          ) : null}
          {historyHeading ? (
            <h3
              {...(historyHeadingPath ? { 'data-preview-field-path': historyHeadingPath } : {})}
              style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0.5rem 0 0' }}
            >
              {historyHeading}
            </h3>
          ) : null}
          {history ? (
            <p
              {...(historyPath ? { 'data-preview-field-path': historyPath } : {})}
              style={{ margin: 0, lineHeight: 1.7 }}
            >
              {history}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
