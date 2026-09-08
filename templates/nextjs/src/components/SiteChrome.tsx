'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { useSiteData } from '@/lib/siteDataContext';
import { Navbar, Footer, AnnouncementBar, FloatingContactWidget, getThemeCssProperties } from '@deneb-ui/ui';

export default function SiteChrome({ children }: { children: ReactNode }) {
  const siteData = useSiteData();
  const pathname = usePathname();
  const themeStyle = getThemeCssProperties(
    siteData?.template?.structure?.theme as any,
  );

  return (
    <div className="site-shell" style={themeStyle}>
      <AnnouncementBar />
      <Navbar activeRoute={pathname} />
      <main>{children}</main>
      <Footer />
      <FloatingContactWidget />
    </div>
  );
}
