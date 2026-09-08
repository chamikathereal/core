'use client';

import React from 'react';
import { ContactButton, ContactButtonProps } from './ContactButton';

export interface WhatsAppButtonProps extends Omit<ContactButtonProps, 'type'> {
  phoneNumber?: string | null;
}

export function WhatsAppButton({
  phoneNumber,
  value,
  label = 'Chat on WhatsApp',
  fieldPath = 'common.business.whatsapp',
  variant = 'whatsapp',
  message,
  ...rest
}: WhatsAppButtonProps) {
  const number = phoneNumber || value;

  // Don't render if no number and no fieldPath configured
  if (!number && !fieldPath) return null;

  return (
    <ContactButton
      type="whatsapp"
      value={number}
      label={label}
      fieldPath={fieldPath}
      variant={variant}
      message={message}
      {...rest}
    />
  );
}
