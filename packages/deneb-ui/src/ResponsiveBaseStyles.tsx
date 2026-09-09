import React from 'react';

/**
 * Injects viewport-aware CSS for all DENEB UI components.
 * Works without Tailwind — every template gets mobile / tablet / desktop behavior
 * when this is mounted once (included automatically by ThemeStyles).
 */
export function ResponsiveBaseStyles() {
  const css = `
    /* ── Breakpoints: mobile <768 | tablet 768–1023 | desktop ≥1024 ── */

    /* Navbar: hide desktop nav + compact header on mobile */
    .deneb-desktop-nav { display: none !important; }
    .deneb-mobile-toggle { display: flex !important; }
    .deneb-header-cta { display: none !important; }

    @media (min-width: 768px) {
      .deneb-desktop-nav { display: flex !important; }
      .deneb-mobile-toggle { display: none !important; }
      .deneb-header-cta { display: inline-flex !important; }
      .deneb-mobile-drawer { display: none !important; }
    }

    @media (max-width: 767px) {
      .deneb-site-title { font-size: 1rem !important; max-width: 9rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .deneb-logo { height: 32px !important; max-width: 100px !important; }
    }

    /* Responsive grid columns via data attributes */
    .editable-grid[data-deneb-responsive-cols="true"] {
      grid-template-columns: repeat(var(--deneb-cols, 1), minmax(0, 1fr));
    }
    @media (min-width: 640px) {
      .editable-grid[data-deneb-responsive-cols="true"] {
        grid-template-columns: repeat(var(--deneb-cols-tablet, 2), minmax(0, 1fr));
      }
    }
    @media (min-width: 1024px) {
      .editable-grid[data-deneb-responsive-cols="true"] {
        grid-template-columns: repeat(var(--deneb-cols-desktop, 3), minmax(0, 1fr));
      }
    }

    /* Horizontal product card stacks on mobile */
    .editable-product-card.is-horizontal { flex-direction: column !important; }
    .editable-product-card.is-horizontal .deneb-product-card-media { width: 100% !important; }
    @media (min-width: 640px) {
      .editable-product-card.is-horizontal { flex-direction: row !important; align-items: center !important; }
      .editable-product-card.is-horizontal .deneb-product-card-media { width: 38% !important; }
    }

    /* Card padding scales down on small screens */
    .editable-pricing-card,
    .editable-testimonial-card {
      padding: clamp(1.25rem, 4vw, 2.5rem) clamp(1rem, 3vw, 2rem) !important;
    }
    .editable-pricing-card .deneb-pricing-amount {
      font-size: clamp(2rem, 6vw, 2.75rem) !important;
    }

    /* Dialog: tighter padding on phones */
    .deneb-dialog-portal { padding: clamp(0.5rem, 3vw, 1rem) !important; }
    .deneb-dialog-content { padding: clamp(1.25rem, 4vw, 2rem) !important; border-radius: clamp(12px, 3vw, 20px) !important; }
    .deneb-dialog-content h2 { font-size: clamp(1.1rem, 4vw, 1.35rem) !important; }

    /* Floating contact: prevent popup overflow */
    .deneb-contact-popup {
      width: min(18rem, calc(100vw - 2rem)) !important;
      max-width: calc(100vw - 2rem) !important;
    }
    @media (max-width: 479px) {
      .deneb-floating-contact { bottom: 1rem !important; right: 1rem !important; left: auto !important; }
      .deneb-floating-contact.deneb-floating-left { left: 1rem !important; right: auto !important; }
    }

    /* Filter sidebar: collapsible on mobile, always visible on tablet+ */
    .deneb-filter-mobile-toggle { display: flex; width: 100%; align-items: center; justify-content: space-between; }
    @media (min-width: 768px) {
      .deneb-filter-mobile-toggle { display: none !important; }
      .deneb-filter-sidebar-panel { display: block !important; }
    }
    @media (max-width: 767px) {
      .deneb-filter-sidebar-panel { display: none; }
      .deneb-filter-sidebar-panel.is-open { display: block; }
      .deneb-filter-sidebar .deneb-filter-size-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
    }

    /* Contact actions: stack on mobile when row layout */
    @media (max-width: 639px) {
      .deneb-contact-actions.deneb-layout-row {
        flex-direction: column !important;
        align-items: stretch !important;
      }
      .deneb-contact-actions.deneb-layout-row > * { width: 100%; }
    }

    /* Contact form title */
    .deneb-contact-form-title { font-size: clamp(1.25rem, 4vw, 1.75rem) !important; }

    /* Product detail: size grid on xs */
    @media (max-width: 479px) {
      .deneb-product-detail-sizes { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
      .deneb-product-detail-gallery { max-height: 420px !important; }
    }

    /* Footer / trust badges / product grid fallbacks when Tailwind is absent */
    @media (max-width: 639px) {
      .deneb-footer-grid { grid-template-columns: 1fr !important; }
      .deneb-trust-grid { grid-template-columns: 1fr !important; }
      .deneb-product-grid { grid-template-columns: 1fr !important; }
    }
    @media (min-width: 640px) and (max-width: 1023px) {
      .deneb-footer-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
      .deneb-trust-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
      .deneb-product-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
    }
    @media (min-width: 1024px) {
      .deneb-footer-grid { grid-template-columns: repeat(4, minmax(0, 1fr)) !important; }
      .deneb-trust-grid { grid-template-columns: repeat(4, minmax(0, 1fr)) !important; }
    }

    /* Sticky mobile bar: hide on desktop */
    .deneb-sticky-mobile-bar { display: flex; }
    @media (min-width: 1024px) {
      .deneb-sticky-mobile-bar { display: none !important; }
    }

    /* Dialog animations */
    @keyframes deneb-fade-in { from { opacity: 0; } to { opacity: 1; } }
    @keyframes deneb-zoom-in { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
    @keyframes deneb-pop { from { opacity: 0; transform: translateY(8px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
  `;

  return <style data-deneb-responsive="true" dangerouslySetInnerHTML={{ __html: css }} />;
}
