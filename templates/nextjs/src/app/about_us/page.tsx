'use client';

import { HeritageCollage } from '@deneb-ui/ui';
import { contentObject, contentText, contentList, useSiteData } from '@/lib/siteDataContext';
import { withBasePath } from '@/lib/utils';

export default function AboutPage() {
  const siteData = useSiteData();
  const about = contentObject(contentObject(siteData.content).about);
  const collageImages = contentList(about.collageImages) as Array<{ id?: string; image?: string; caption?: string }>;

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

      <section className="page-section" data-design-section="about-heritage">
        <HeritageCollage
          collageHeading={contentText(about.collageHeading)}
          collageDescription={contentText(about.collageDescription)}
          historyHeading={contentText(about.historyHeading)}
          history={contentText(about.history)}
          images={collageImages}
          collageHeadingPath="about.collageHeading"
          collageDescriptionPath="about.collageDescription"
          historyHeadingPath="about.historyHeading"
          historyPath="about.history"
          listPath="about.collageImages"
        />
      </section>
    </div>
  );
}
