'use client';

import { contentList, contentObject, contentText, useSiteData } from '@/lib/siteDataContext';
import { withBasePath } from '@/lib/utils';

export default function ServicesPage() {
  const siteData = useSiteData();
  const content = contentObject(siteData.content);
  const page = contentObject(content.servicesPage);
  const services = contentList(content.services);

  return (
    <div data-preview-page-key="services">
      <section className="page-section page-heading" data-design-section="services-heading">
        <h1 data-preview-field-path="servicesPage.heading">{contentText(page.heading)}</h1>
        <p data-preview-field-path="servicesPage.intro">{contentText(page.intro)}</p>
      </section>
      <section className="page-section alt" data-design-section="services-list">
        <div className="card-grid" data-preview-list-path="services">
          {services.map((rawService, index) => {
            const service = contentObject(rawService);
            const features = contentList(service.features);
            return (
              <article className="card" key={contentText(service.id) || index} data-preview-item-path={`services[${index}]`}>
                <img
                  className="card-image"
                  src={withBasePath(contentText(service.imageUrl) || '/placeholder.svg')}
                  alt=""
                  data-preview-field-path={`services[${index}].imageUrl`}
                />
                <h2 data-preview-field-path={`services[${index}].name`}>{contentText(service.name)}</h2>
                <p data-preview-field-path={`services[${index}].description`}>{contentText(service.description)}</p>
                <ul data-preview-list-path={`services[${index}].features`}>
                  {features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      data-preview-item-path={`services[${index}].features[${featureIndex}]`}
                      data-preview-field-path={`services[${index}].features[${featureIndex}]`}
                    >
                      {contentText(feature)}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
