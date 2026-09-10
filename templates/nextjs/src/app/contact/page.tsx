'use client';

import { useState, type FormEvent } from 'react';
import { MapLink } from '@deneb-ui/ui';
import { contentObject, contentText, useSiteData } from '@/lib/siteDataContext';

export default function ContactPage() {
  const siteData = useSiteData();
  const contact = contentObject(contentObject(siteData.content).contact);
  const [status, setStatus] = useState('');

  const directionsLabel = contentText(contact.directionsLabel) || 'Get Directions';
  const directionsUrl =
    contentText(contact.directionsUrl) ||
    contentText(contact.mapUrl) ||
    contentText(contact.addressUrl);
  const address = contentText(contact.address);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const projectId = siteData.project?.id?.trim();
    if (!projectId) {
      setStatus('This website is not connected to a published project yet.');
      return;
    }

    const formData = new FormData(form);
    setStatus('Sending your message...');
    try {
      const response = await fetch('/site-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          name: String(formData.get('name') ?? ''),
          email: String(formData.get('email') ?? ''),
          message: String(formData.get('message') ?? ''),
        }),
      });
      if (!response.ok) throw new Error('Unable to send message.');
      form.reset();
      setStatus('Thanks — your message has been sent successfully.');
    } catch {
      setStatus('We could not send your message right now. Please try again later.');
    }
  }

  return (
    <div data-preview-page-key="contact">
      <section className="page-section page-heading" data-design-section="contact-heading">
        <h1 data-preview-field-path="contact.heading">{contentText(contact.heading)}</h1>
        <p data-preview-field-path="contact.intro">{contentText(contact.intro)}</p>
      </section>
      <section className="page-section contact-grid" data-design-section="contact-details">
        <div className="contact-details">
          <a href={`tel:${contentText(contact.phone)}`} data-preview-field-path="contact.phone">{contentText(contact.phone)}</a>
          <a href={`mailto:${contentText(contact.email)}`} data-preview-field-path="contact.email">{contentText(contact.email)}</a>
          <p data-preview-field-path="contact.address">{address}</p>
          <MapLink
            mapUrl={directionsUrl}
            address={address}
            label={directionsLabel}
            labelFieldPath="contact.directionsLabel"
            urlFieldPath="contact.directionsUrl"
            variant="outline"
            size="md"
          />
        </div>
        <form
          className="contact-form"
          onSubmit={handleSubmit}
          data-fivora-contact-disabled
        >
          <h2 data-preview-field-path="contact.formTitle">{contentText(contact.formTitle)}</h2>
          <label data-preview-static>
            Name
            <input type="text" name="name" autoComplete="name" />
          </label>
          <label data-preview-static>
            Email
            <input type="email" name="email" autoComplete="email" />
          </label>
          <label data-preview-static>
            Message
            <textarea name="message" rows={5} />
          </label>
          <button type="submit" className="button-primary">
            <span data-preview-field-path="contact.submitLabel">{contentText(contact.submitLabel)}</span>
          </button>
          <p role="status" aria-live="polite">{status}</p>
        </form>
      </section>
    </div>
  );
}
