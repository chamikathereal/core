# DENEB

### A modern UI system for the web.

> **DENEB UI — Build beautiful interfaces, effortlessly.**  
> The premier visual-first React component ecosystem.  
> Proudly presented by **DENEB-UI Collaborate with FIVORA**.

[![Framework: DENEB UI](https://img.shields.io/badge/Framework-DENEB_UI_v2.0-blue.svg)](https://github.com/deneb-ui/ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-orange.svg)](https://opensource.org/licenses/MIT)

---

## Quick Installation

```bash
npm install @deneb-ui/ui
# Or with yarn / pnpm
pnpm add @deneb-ui/ui
```

```tsx
import {
  Button,
  Card,
  Dialog,
  ContactActions,
  WhatsAppButton,
  LocationCard,
  SocialLinks,
  BusinessHours,
} from "@deneb-ui/ui";
```

---

## What is DENEB UI?

**DENEB UI** is a modern, modular design system and component framework engineered specifically for live visual editing, dynamic theming, and high-converting commerce storefronts.

Every component in DENEB UI:
- **Zero-Breakage Visual Editing**: Automatically connects to the bidirectional live editor protocol (`DENEB_PREVIEW_SITE_DATA` / `FIVORA_PREVIEW_SITE_DATA`, `DENEB_PREVIEW_READY`, `DENEB_PREVIEW_FOCUS_PAGE`).
- **Auto-Balancing Layouts**: Columns and card heights automatically adapt across desktop, tablet, and mobile regardless of content length.
- **Smart Contact & Location Actions**: One-click WhatsApp, call, email, and Google Maps generation from raw phone numbers and addresses.
- **Dynamic Tokenized Theming**: Fully integrated with tokenized custom properties (`--color-primary`, `--color-secondary`, fonts, spacing) and AI-assisted restyling.
- **Selected-Page Route Guard**: Automatically respects `requirements.requiredPages`, ensuring zero dead links or validation warnings.

---

## Component Catalog

### 1. Smart Template & Action Components
- `<ContactActions />` — Auto-detects and renders active communication channels (`phone`, `whatsapp`, `email`). When a merchant adds a phone number in `site-data.json`, the button appears automatically with zero template changes.
- `<WhatsAppButton />` — One-click WhatsApp click-to-chat button with built-in SVG icon and automatic `https://wa.me/...` URL generation from raw phone numbers.
- `<PhoneButton />` — One-click calling button with `tel:` handler and raw number editing bindings.
- `<EmailButton />` — One-click email button with `mailto:` handler and optional subject lines.
- `<ContactButton />` — Base unified action button supporting WhatsApp, phone, email, and forms.
- `<LocationCard />` — High-converting location card with pin icon, formatted address, and Google Maps directions button.
- `<LocationLink />` — Semantic address display paired with a "Get Directions" action.
- `<MapLink />` — Direct link button to open Google Maps directions or search queries.
- `<MapEmbed />` — Responsive map embed iframe with safe graceful fallback to `MapLink` when embed URLs are unconfigured.
- `<Address />` — Structured `<address>` component with individual street, locality, and country field markers.
- `<SocialLinks />` — Smart social media container that filters out unconfigured platforms automatically.
- `<SocialButton />` — Brand-colored social button with built-in SVGs (Instagram, Facebook, TikTok, YouTube, LinkedIn, X, Twitter, Pinterest, GitHub).
- `<BusinessHours />` — Weekly operating schedule renderer with a dynamic live **Open Now** / **Closed** status badge.
- `<DenebAction />` (or `<ActionLink />`) — Universal action primitive connecting action types, URL generation, and visual editing markers.

### 2. Interactive Primitives
- `<Button />` (or `<EditableButton />`) — Modern button with `primary`, `secondary`, `accent`, `glass`, `ghost` styles and `targetPage` guard.
- `<Dialog />` (or `<EditableDialog />`) — Accessible popup modal with backdrop blur, smooth entrance, keyboard ESC exit, title, description, and footer actions.
- `<Card />` (or `<EditableCard />`) — Flexible surface card with auto-balancing content layout.
- `<Text />`, `<Heading />`, `<Paragraph />` — Typography components with responsive sizing and live editor binding.
- `<Badge />` — Status indicators, tags, and promotional pills (`primary`, `secondary`, `accent`, `glass`, `glow`).
- `<Link />` — Route link that automatically validates against `requirements.requiredPages`.
- `<Quote />` — Editorial pull quotes and callouts.

### 3. Sections & Commerce
- `<ProductCard />` — 4 visual variants (`modern-glass`, `classic`, `minimal`, `horizontal`) with discount tags and pricing.
- `<PricingCard />` — Subscription/pricing tiers with feature checklist.
- `<TestimonialCard />` — Customer reviews with 1–5 stars and author avatar.
- `<ContactForm />` — Direct submission form connected to shared API endpoint.
- `<Navbar />` — Sticky header with logo, mobile drawer, and filtered navigation.
- `<Footer />` — Responsive footer with copyright and route filtering.
- `<Hero />` & `<HeroSplit />` — High-impact hero sections with eyebrow badges and dual CTAs.
- `<Grid />` — Auto-balancing CSS grid with equal height.
- `<Accordion />` / `<FAQ />` — Collapsible Q&A list.
- `<Image />` — Aspect ratio locked image with SVG fallback placeholder.

---

## URL Utility Layer

DENEB UI exports a dedicated utility suite for URL formatting and generation:

```tsx
import {
  createWhatsAppUrl,
  createPhoneUrl,
  createEmailUrl,
  createMapUrl,
  isSafeExternalLink,
} from "@deneb-ui/ui";

// Generates: https://wa.me/94771234567?text=Hello%20Store
const waUrl = createWhatsAppUrl("+94 77 123 4567", "Hello Store");

// Generates: tel:+94112345678
const telUrl = createPhoneUrl("+94 11 234 5678");

// Generates: mailto:hello@store.com?subject=Enquiry
const mailUrl = createEmailUrl("hello@store.com", "Enquiry");

// Generates Google Maps directions search URL
const mapUrl = createMapUrl({ address: "123 Main Street", city: "Colombo", country: "Sri Lanka" });
```

---

## Example Usage

```tsx
import {
  SiteDataProvider,
  Navbar,
  Hero,
  ProductCard,
  ContactActions,
  LocationCard,
  BusinessHours,
  SocialLinks,
  Footer,
  useSiteData,
} from '@deneb-ui/ui';

import siteData from '@/data/site-data.json';

export default function HomePage() {
  const data = useSiteData();
  const business = data.content?.common?.business || {};

  return (
    <SiteDataProvider initialSiteData={siteData}>
      <Navbar />

      <main data-preview-page-key="home">
        <Hero />

        {/* Smart Contact & Actions */}
        <section className="py-12 max-w-5xl mx-auto px-6 flex flex-col items-center gap-6">
          <ContactActions
            phone={business.phone}
            whatsapp={business.whatsapp}
            email={business.email}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mt-6">
            <LocationCard
              address={business.location?.address}
              city={business.location?.city}
              country={business.location?.country}
              mapUrl={business.location?.mapUrl}
            />

            <BusinessHours hours={business.hours} />
          </div>

          <SocialLinks social={business.social} />
        </section>
      </main>

      <Footer />
    </SiteDataProvider>
  );
}
```

---

## Author & Credits

Created and architected by **Chamika Gayashan & Induranga Kawishwara**.  
Built for the global React and storefront developer ecosystem.
