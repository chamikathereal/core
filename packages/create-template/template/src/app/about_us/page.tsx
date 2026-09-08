'use client';

import { contentObject, contentText, useSiteData } from '@/lib/siteDataContext';
import { withBasePath } from '@/lib/utils';

export default function AboutPage() {
  const siteData = useSiteData();
  const about = contentObject(contentObject(siteData.content).about);

  return (
    <div data-preview-page-key="about_us">
      <section className="page-section split" data-design-section="about">
        <div className="split-copy">
          <h1 className="section-title" data-preview-field-path="about.heading">{contentText(about.heading)}</h1>
          <p data-preview-field-path="about.body">{contentText(about.body)}</p>
        </div>
        <img
          className="split-image"
          src={withBasePath(contentText(about.imageUrl) || '/placeholder.svg')}
          alt=""
          data-preview-field-path="about.imageUrl"
        />
      </section>
    </div>
  );
}
