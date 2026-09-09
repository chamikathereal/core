import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import siteData from '@/data/site-data.json';
import { SiteDataProvider } from '@/lib/siteDataContext';
import SiteChrome from '@/components/SiteChrome';
import './globals.css';
import '../fonts/deneb-fonts.css';

export const metadata: Metadata = {
  title: siteData.content.common.websiteTitle,
  description: siteData.content.common.shortDescription,
  icons: {
    icon: '/fivora-icon.svg',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <SiteDataProvider>
          <SiteChrome>{children}</SiteChrome>
        </SiteDataProvider>
      </body>
    </html>
  );
}
