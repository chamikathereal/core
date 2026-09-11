<p align="center">
  <a href="https://deneb.fivora.site">
    <img src="https://img.shields.io/badge/DENEB_UI-Visual--First_React_Components-6366F1?style=for-the-badge&labelColor=0f172a" alt="DENEB UI" />
  </a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@deneb-ui/ui"><img src="https://img.shields.io/npm/v/@deneb-ui/ui.svg?style=flat-square&color=6366F1" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/@deneb-ui/ui"><img src="https://img.shields.io/npm/dm/@deneb-ui/ui.svg?style=flat-square&color=6366F1" alt="npm downloads" /></a>
  <img src="https://img.shields.io/badge/React-18%20%7C%2019-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-Ready-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-emerald?style=flat-square" alt="MIT License" /></a>
</p>

<p align="center">
  <strong>Build beautiful, editable storefronts — on mobile, tablet, and desktop.</strong><br />
  The visual-first React component library for Next.js commerce, ARC Engine, and Fivora live visual editing.
</p>

<p align="center">
  <a href="https://deneb.fivora.site/docs/introduction"><strong>Documentation</strong></a> ·
  <a href="https://deneb.fivora.site/docs/components/button"><strong>Components</strong></a> ·
  <a href="https://deneb.fivora.site/docs/responsive-design"><strong>Responsive Design</strong></a> ·
  <a href="https://github.com/deneb-ui/core"><strong>GitHub</strong></a>
</p>

---

## Getting Started

### Installation

```bash
npm install @deneb-ui/ui
# or
pnpm add @deneb-ui/ui
# or
yarn add @deneb-ui/ui
```

### Quick Start Example

```tsx
import { 
  SiteDataProvider, 
  Navbar, 
  Hero, 
  GoogleFeedback, 
  TestimonialSection, 
  Map, 
  Footer 
} from "@deneb-ui/ui";
import siteData from "@/data/site-data.json";

export default function Page() {
  return (
    <SiteDataProvider initialSiteData={siteData}>
      <Navbar />
      <Hero />
      <GoogleFeedback basePath="feedback" />
      <TestimonialSection basePath="testimonials" />
      <div className="w-full h-96 rounded-2xl overflow-hidden shadow-lg">
        <Map mapUrl={siteData.content.contact?.mapUrl} />
      </div>
      <Footer />
    </SiteDataProvider>
  );
}
```

`SiteDataProvider` automatically injects **ResponsiveBaseStyles** — every component adapts seamlessly across phone, tablet, and desktop without extra configuration.

---

## Canonical Component Aliases

`@deneb-ui/ui` provides both canonical shorthand aliases (shadcn / HeroUI style) and full `Editable*` identifiers:

| Canonical Alias | Full Component Identifier | Description |
| :--- | :--- | :--- |
| `GoogleFeedback` | `EditableGoogleFeedback` | Official Google review badge, aggregate rating, & review cards |
| `TestimonialSection` | `EditableTestimonialSection` | Editorial critic testimonials with typography & star ratings |
| `Testimonials` | `EditableTestimonialSection` | Alias for `EditableTestimonialSection` |
| `Map` | `EditableMap` | Universal Google Maps embed with automatic URL parsing |
| `CustomerReviews` | `EditableCustomerReviews` | Customer review summary & rating breakdown |
| `ProductCard` | `EditableProductCard` | Visual commerce product card with live price & badges |
| `ProductGrid` | `EditableProductGrid` | Responsive grid with visual editing markers |
| `Navbar` / `Header` | `EditableNavbar` | Responsive header with mobile drawer & cart trigger |
| `Hero` | `EditableHeroCentered` | High-converting split / centered storefront hero |
| `Footer` | `EditableFooter` | Multi-column commerce footer with social links & legal links |
| `CartDrawer` | `EditableCartDrawer` | Sliding visual cart drawer with item counter |
| `Accordion` / `FAQ`| `EditableFAQAccordion` | Collapsible FAQ accordion with Fivora list markers |
| `Button` | `EditableButton` | Visual button with action contract & ripple feedback |
| `Image` | `EditableImage` | Visual image with aspect ratio preservation & Fivora focus |
| `Text` | `EditableText` | Inline editable text with instant DOM sync |

---

## Component Guides & API Reference

### 1. `GoogleFeedback` (`EditableGoogleFeedback`)

The **`GoogleFeedback`** component renders an authentic Google Reviews card experience. It features the official Google multi-colored badge, aggregate rating pill, verified buyer checks, and a responsive grid of customer reviews.

#### Key Capabilities
- **Google Design Fidelity**: Uses Google Material star vectors with authentic warm gold (`#fa7014`) and neutral grey (`#dadce0`).
- **Live 1–5 Star DOM Sync**: Typing numbers `1` through `5` into the Fivora live inspector immediately recalculates and repaints the star fills in real time via an internal `MutationObserver`.
- **Zero-Latency Visual Editing**: Built-in `data-preview-field-path` and `data-preview-list-path` attributes compliant with the Fivora Strict Visual Editing Contract.
- **Auto-Fallbacks**: Provides elegant fallback review data if no `feedbacks` array is passed.

#### Props Reference

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `basePath` | `string` | `'feedback'` | Root key in `site-data.json` (`content[basePath]`) |
| `badgeIcon` | `string` | Google G SVG | URL or SVG data URI for the review platform badge |
| `badgeTitle` | `string` | `'Google'` | Review platform label displayed next to badge icon |
| `badgeRating` | `string \| number` | `'4.9'` | Aggregate rating number shown in the top header |
| `badgeReviewsCount` | `string \| number` | `'128 reviews'` | Total review count label (e.g., `'128 reviews'`) |
| `heading` | `string` | `'Loved by Coffee Lovers...'` | Section main heading |
| `subheading` | `string` | `'Real stories and reviews...'` | Section introductory paragraph |
| `feedbacks` | `FeedbackItem[]` | `DEFAULT_FEEDBACKS` | Array of customer review items |
| `maxStars` | `number` | `5` | Maximum number of rating stars to render per card |
| `className` | `string` | `''` | Custom CSS / Tailwind classes for section wrapper |
| `cardClassName` | `string` | `''` | Custom CSS / Tailwind classes for review cards |

#### `FeedbackItem` Schema

```typescript
export interface FeedbackItem {
  id?: string | number;
  name?: string;              // Reviewer full name
  avatar?: string;            // Avatar image URL
  rating?: number | string;   // Star rating value (1 to 5)
  date?: string;              // Relative date (e.g. "2 days ago")
  comment?: string;           // Review body text
  verified?: boolean;         // Verified customer badge
}
```

#### Fivora Data Contract (`site-data.json`)

```json
{
  "content": {
    "feedback": {
      "badgeIcon": "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg",
      "badgeTitle": "Google",
      "badgeRating": "4.9",
      "badgeReviewsCount": "128 reviews",
      "heading": "Loved by Coffee Lovers Across the World",
      "subheading": "Real stories and reviews from our community of coffee purists and daily ritualists.",
      "feedbacks": [
        {
          "id": "1",
          "name": "Elena Vance",
          "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
          "rating": 5,
          "date": "3 days ago",
          "comment": "The Yirgacheffe pour-over is unmatched. Clean notes of jasmine and bergamot.",
          "verified": true
        }
      ]
    }
  }
}
```

#### Fivora `editorSchema` Section

```json
{
  "id": "feedback",
  "path": "feedback",
  "type": "object",
  "label": "Google Customer Feedback",
  "pageKey": "home",
  "fields": [
    { "key": "badgeIcon", "type": "image", "label": "Badge Icon URL" },
    { "key": "badgeTitle", "type": "text", "label": "Badge Title" },
    { "key": "badgeRating", "type": "text", "label": "Aggregate Rating" },
    { "key": "badgeReviewsCount", "type": "text", "label": "Reviews Count" },
    { "key": "heading", "type": "text", "label": "Section Heading" },
    { "key": "subheading", "type": "textarea", "label": "Section Subheading" },
    {
      "key": "feedbacks",
      "type": "list",
      "label": "Customer Reviews",
      "itemLabel": "Review",
      "minItems": 1,
      "maxItems": 12,
      "fields": [
        { "key": "name", "type": "text", "label": "Reviewer Name", "required": true },
        { "key": "avatar", "type": "image", "label": "Profile Picture" },
        { "key": "rating", "type": "number", "label": "Star Rating (1-5)" },
        { "key": "date", "type": "text", "label": "Review Date" },
        { "key": "comment", "type": "textarea", "label": "Review Comment", "required": true }
      ]
    }
  ]
}
```

#### Usage Example

```tsx
import { GoogleFeedback, useSiteData } from "@deneb-ui/ui";

export function FeedbackSection() {
  const { siteData } = useSiteData();
  const feedbackData = siteData?.content?.feedback || {};

  return (
    <section className="py-20 bg-amber-50/40">
      <GoogleFeedback
        basePath="feedback"
        badgeIcon={feedbackData.badgeIcon}
        badgeTitle={feedbackData.badgeTitle}
        badgeRating={feedbackData.badgeRating}
        badgeReviewsCount={feedbackData.badgeReviewsCount}
        heading={feedbackData.heading}
        subheading={feedbackData.subheading}
        feedbacks={feedbackData.feedbacks}
      />
    </section>
  );
}
```

---

### 2. `TestimonialSection` (`EditableTestimonialSection`)

The **`TestimonialSection`** component provides an editorial, magazine-grade layout for connoisseur quotes, culinary critics, and press reviews.

#### Key Capabilities
- **Editorial Typography**: Large quotation marks, serif italic styling, and prominent author metadata.
- **Accreditation Tags**: Includes specialty tags (e.g. *"Michelin Guide"*, *"World Barista Judge"*).
- **Synchronized Star Ratings**: Dynamic star rating with live inspector sync.
- **Clean Layout**: Fluid responsive grid adapting from 1 column on mobile to 3 columns on desktop.

#### Props Reference

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `basePath` | `string` | `'testimonials'` | Root key in `site-data.json` (`content[basePath]`) |
| `badge` | `string` | `'Critic Acclaim'` | Small uppercase pill badge text |
| `heading` | `string` | `'What Connoisseurs Say'` | Main section title |
| `subheading` | `string` | `'Unfiltered impressions...'` | Subtitle description text |
| `testimonials` | `TestimonialSectionItem[]` | `DEFAULT_TESTIMONIALS` | Array of testimonial items |
| `maxStars` | `number` | `5` | Maximum number of stars per card |
| `className` | `string` | `''` | Section container CSS classes |
| `cardClassName` | `string` | `''` | Individual testimonial card CSS classes |

#### `TestimonialSectionItem` Schema

```typescript
export interface TestimonialSectionItem {
  id?: string | number;
  quote?: string;             // Testimonial quote text
  author?: string;            // Author full name
  role?: string;              // Profession, publication, or title
  avatar?: string;            // Author portrait URL
  tag?: string;               // Category or accreditation badge
  rating?: number | string;   // Star rating (1 to 5)
}
```

#### Usage Example

```tsx
import { TestimonialSection, useSiteData } from "@deneb-ui/ui";

export function EditorialReviews() {
  const { siteData } = useSiteData();
  const data = siteData?.content?.testimonials || {};

  return (
    <TestimonialSection
      basePath="testimonials"
      badge={data.badge}
      heading={data.heading}
      subheading={data.subheading}
      testimonials={data.testimonials}
    />
  );
}
```

---

### 3. `Map` (`EditableMap`)

The **`Map`** component is an intelligent universal Google Maps embedder. It converts any format of Google Maps URL or search query into a high-performance, responsive iframe embed.

#### Universal Link Parser Features
The underlying `parseGoogleMapsEmbedUrl` engine seamlessly processes:
1. **Full `<iframe>` Snippets**: Extracts the `src` attribute automatically when developers or merchants paste standard Google Maps embed HTML.
2. **Standard Embed URLs**: Passes through existing `google.com/maps/embed?...` URLs directly.
3. **Coordinate URLs**: Parses `@lat,lng` patterns (e.g. `google.com/maps/@6.9271,79.8612,15z`).
4. **Place URLs**: Extracts place names from `/maps/place/Name` paths.
5. **Search Query URLs**: Parses `?q=...` parameters.
6. **Short Links**: Handles `maps.app.goo.gl` links with automatic fallback to merchant address.
7. **Raw Search Strings**: Directly wraps street addresses or city names into valid Google Maps embed queries.

#### Props Reference

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `mapUrl` | `string` | `undefined` | Google Maps URL, share link, coordinate link, or embed code |
| `address` | `string` | `'Sri Lanka'` | Fallback physical address when `mapUrl` is empty or unresolved |
| `defaultLocation` | `string` | `undefined` | Additional location fallback |
| `data-preview-field-path` | `string` | `undefined` | Fivora visual editing binding path |
| `className` | `string` | `'w-full h-full border-0'` | CSS classes for the iframe element |
| `title` | `string` | `'Google Map Location'` | Accessibility title for the iframe |

#### Usage Example

```tsx
import { Map } from "@deneb-ui/ui";

export function ContactMapSection({ mapUrl, address }: { mapUrl?: string; address?: string }) {
  return (
    <div className="w-full h-96 sm:h-[480px] rounded-3xl overflow-hidden shadow-2xl border border-stone-200">
      <Map
        data-preview-field-path="contact.mapUrl"
        mapUrl={mapUrl}
        address={address}
        className="w-full h-full border-0"
      />
    </div>
  );
}
```

---

## ARC Engine & Fivora Platform Architecture

`@deneb-ui/ui` is built from the ground up for the **ARC Engine** (`@deneb-ui/cli`) and the **Fivora Visual Commerce Platform**.

```
┌─────────────────────────────────────────────────────────────┐
│                    Fivora Admin Portal                      │
│                  (Inspector / Live Studio)                  │
└──────────────────────────────┬──────────────────────────────┘
                               │ Live PostMessage Protocol
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                  Fivora Preview Focus Bridge                │
│    - Focus Target Identification (data-preview-field-path)  │
│    - Fast DOM Mutation & Star Fill Repainting               │
└──────────────────────────────┬──────────────────────────────┘
                               │ Instant DOM / Observer Sync
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                       DENEB UI                              │
│    - GoogleFeedback (MutationObserver Dual-Layer Rating)    │
│    - TestimonialSection (Editorial Critic Cards)            │
│    - EditableMap (Universal URL Parsing Engine)             │
└─────────────────────────────────────────────────────────────┘
```

### Dual-Layer Live Rating Architecture

When editing ratings in visual site builders, updating an element's text content usually destroys child SVG icons. DENEB UI solves this through a dual-layer architecture:

1. **Inspector Target**: A dedicated `<span data-preview-field-path="...">` renders the numeric string (e.g. `"5"`).
2. **Visual Star Array**: A sibling `<div data-fivora-stars-row="true">` contains the 5 vector SVG stars with fill colors `#fa7014` (gold) and `#dadce0` (grey).
3. **`MutationObserver`**: An internal observer listens for inspector text mutations on the numeric span and immediately updates the SVG star fills without remounting or re-rendering errors.
4. **Focus Bridge Support**: The CLI preview bridge recognizes star rating containers and synchronizes fills directly during live keystrokes.

### ARC Engine Automated Scaffolding

When running the ARC Engine:
```bash
npx @deneb-ui/cli arc init
```

The engine automatically:
- Identifies `GoogleFeedback`, `TestimonialSection`, and `Map` components.
- Creates semantic field paths (`feedback.feedbacks`, `testimonials.testimonials`, `contact.mapUrl`).
- Generates typed `editorSchema` sections with proper numeric, image, and textarea descriptors.
- Adds non-editable internal IDs to `visualEditing.controlOnlyPaths` to guarantee 100% contract compliance with Fivora platform ingestion.

---

## Related Packages

| Package | Purpose |
| :--- | :--- |
| [`@deneb-ui/ui`](https://www.npmjs.com/package/@deneb-ui/ui) | Visual-First React component framework |
| [`@deneb-ui/cli`](https://www.npmjs.com/package/@deneb-ui/cli) | ARC Engine compiler, AST transformer & template lab |
| [`@deneb-ui/core`](https://www.npmjs.com/package/@deneb-ui/core) | Shared design tokens, typography registry & contracts |
| [`@deneb-ui/create-template`](https://www.npmjs.com/package/@deneb-ui/create-template) | Instant storefront generator |

---

## Authors

Created and maintained by **[Chamika Gayashan](https://github.com/chamikathereal)** and **[Induranga Kawishwara](https://github.com/Induranga-kawishwara)**.

Part of the **DENEB UI** ecosystem · In collaboration with **[Fivora](https://fivora.site)**.

<p align="center">
  <sub>MIT © DENEB UI — The Visual-First React Framework</sub>
</p>
