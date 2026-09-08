'use client';

import React from 'react';
import { ContactButton, ContactButtonProps } from './ContactButton';

export interface EmailButtonProps extends Omit<ContactButtonProps, 'type'> {
  emailAddress?: string | null;
}

export function EmailButton({
  emailAddress,
  value,
  label = 'Email Us',
  fieldPath = 'common.business.email',
  variant = 'secondary',
  subject,
  ...rest
}: EmailButtonProps) {
  const email = emailAddress || value;

  if (!email && !fieldPath) return null;

  return (
    <ContactButton
      type="email"
      value={email}
      label={label}
      fieldPath={fieldPath}
      variant={variant}
      subject={subject}
      {...rest}
    />
  );
}
