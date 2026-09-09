---

# Architecture Overview: The Real-Time Style Ecosystem

When a merchant or developer interacts with the visual editor popover (as shown in your screenshot), style updates must reflect **immediately (0ms lag)** inside the template iframe without causing full React page re-renders, dropping keystrokes, or breaking responsive layouts.

```text
┌──────────────────────────────────────────────────────────────────────────────────┐
│                   FIVORA VISUAL EDITOR (Parent Window / Lab)                     │
│  - LocalTemplateVisualEditPopover / TemplateVisualEditPopover                    │
│  - Controls: Typography, Card Size, Border/Radius, Shadow, Colors, Spacing       │
└────────────────────────────────────────┬─────────────────────────────────────────┘
                                         │ 
                     postMessage Protocol│ 1. FIVORA_PREVIEW_STYLE_PATCH (Instant 0ms)
                                         │ 2. FIVORA_PREVIEW_SITE_DATA (Debounced Commit)
                                         ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                   TEMPLATE IFRAME RUNTIME (Next.js Storefront)                   │
│                                                                                  │
│   ┌──────────────────────────────────────────────────────────────────────────┐   │
│   │                              @deneb-ui/core                              │   │
│   │  - Style Patcher: Injects scoped CSS variables into DOM (0ms response)  │   │
│   │  - Style Contract: Validates & normalizes TextStyle, CardStyle, etc.     │   │
│   │  - Token Resolver: Resolves fallback theme tokens (colors, fonts)        │   │
│   │  - State Engine: Deep merges changes into `siteData.styles` tree         │   │
│   └────────────────────────────────────┬─────────────────────────────────────┘   │
│                                        │ provides hooks & CSS vars               │
│                                        ▼                                         │
│   ┌──────────────────────────────────────────────────────────────────────────┐   │
│   │                               @deneb-ui/ui                               │   │
│   │  - SiteDataProvider: Broadcasts active style tree                        │   │
│   │  - EditableText: Typography styling (h1-h6, p, span)                     │   │
│   │  - EditableCard: Card sizing, radius, shadow, background, auto-balance   │   │
│   │  - EditableButton: Variant, size, colors, hover transitions              │   │
│   │  - EditableGrid: Dynamic columns, row/col gap, equal-height rows         │   │
│   │  - EditableSection: Section padding, max-width container, background     │   │
│   └──────────────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

# 1. Full Functional Requirements: All Editable Components

### 1.1 Typography (Headlines, Subtitles, Paragraphs, Badges, Labels)
* **Font Family**: Curated Google Fonts (`Editorial Serif`, `Plus Jakarta Sans`, `Inter`, `Playfair Display`, `Outfit`, `Cormorant Garamond`, `Montserrat`, `System Sans`) with dynamic webfont loader.
* **Font Size**: Numeric slider or input (`px` or `rem`), with responsive clamp fallback.
* **Font Weight**: Discrete selector (`Regular [400]`, `Medium [500]`, `Semibold [600]`, `Bold [700]`, `Extra Bold [800]`).
* **Line Height**: Multiplier stepper (e.g. `1.1`, `1.2`, `1.4`, `1.6`, `2.0`).
* **Letter Spacing (Tracking)**: Range from `-0.05em` (tight) to `0.25em` (wide).
* **Text Color**: Palette picker, native color wheel, and manual hex/rgb input with opacity.
* **Text Alignment**: 4-state toggle (`Left`, `Center`, `Right`, `Justify`).
* **Text Transform**: Options for `none`, `uppercase`, `lowercase`, `capitalize`.
* **Margin / Spacing**: 4-way box model (`Top`, `Bottom`, `Left`, `Right` in `px`).

### 1.2 Cards & Containers (`EditableCard`, Product Cards, Testimonial Cards, Feature Blocks)
* **Card Sizing & Geometry**:
  * **Width**: `auto`, fixed `px` (e.g. `280px`, `320px`, `360px`), or percentage `100%`.
  * **Min / Max Width**: Prevents card squishing or excessive stretching.
  * **Aspect Ratio**: `auto`, `1:1 Square`, `4:3 Standard`, `16:9 Landscape`.
* **Padding (Inner Spacing)**: Independent or linked `Top`, `Bottom`, `Left`, `Right` in `px`.
* **Corners & Border Radius**: `0px` (Sharp), `8px` (Subtle), `16px` (Rounded), `24px` (Pill/Soft), `9999px` (Full Pill).
* **Border Controls**:
  * Border width (`0px`, `1px`, `2px`, `4px`).
  * Border style (`solid`, `dashed`, `dotted`, `none`).
  * Border color with opacity.
* **Elevation & Box Shadow**:
  * Presets: `None`, `Soft (sm)`, `Card (md)`, `Floating (lg)`, `Dramatic (xl)`, `Colored Ambient Glow`.
* **Background & Surface**:
  * Solid surface color (defaults to theme surface).
  * Gradient overlay (linear angle, start/stop colors).
  * Glassmorphism toggle (`backdrop-filter: blur(8px)` + semi-transparent white/dark surface).
* **Auto-Balancing**: Flex-1 stretch mechanism ensuring all cards in a grid maintain identical height regardless of content length.

### 1.3 Buttons & Actions (`EditableButton`, CTA Blocks)
* **Variants**: `Solid`, `Outline`, `Ghost`, `Soft/Tinted`.
* **Size**: `sm`, `md`, `lg`, `xl` with customizable `paddingX` and `paddingY`.
* **Corner Radius**: Sharp, Rounded, or Full Pill.
* **Colors**: Background color, Text color, Border color.
* **Hover Interactions**: Hover background accent, hover shadow lift, hover text color shift.

### 1.4 Grids & Lists (`EditableGrid`)
* **Column Configuration**: Responsive presets (`1`, `2`, `3`, `4`, `auto-fit`, `auto-fill`).
* **Min Card Width**: Minimum width before wrapping columns (e.g. `280px`).
* **Grid Gaps**: Independent Row Gap and Column Gap (`8px`, `16px`, `24px`, `32px`, `48px`).
* **Alignment**: Horizontal justify (`start`, `center`, `space-between`) and vertical stretch (`stretch`, `center`).

### 1.5 Sections (`EditableSection`, Hero, Contact, Features)
* **Section Padding**: Vertical padding Y (`py-12`, `py-20`, `py-32`) and horizontal padding X.
* **Container Width**: Max-width constraint (`sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`, `2xl: 1536px`, `Full`).
* **Section Background**: Solid, Subtle Pattern, Gradient, or Image Background with dark/light overlay mask.

---

# 2. Package-by-Package Update Blueprint

## Package 1: `@deneb-ui/core` (The Headless Engine)

`@deneb-ui/core` is framework-agnostic. It contains the data contracts, CSS variable generators, instant DOM patchers, and preview messaging protocols.

### 2.1 File Structure to Create/Update
```text
packages/@deneb-ui/core/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts                     # Main entry point exporting types and utilities
    ├── types/
    │   ├── styles.ts                # TextStyle, CardStyle, ButtonStyle, GridStyle schemas
    │   ├── protocol.ts              # PostMessage payloads (FIVORA_PREVIEW_STYLE_PATCH)
    │   └── markers.ts               # Marker attribute definitions (data-preview-style-*)
    ├── engine/
    │   ├── cssVariables.ts          # Converts style objects to CSS variables
    │   ├── domPatcher.ts            # 0ms live style injector
    │   ├── tokenResolver.ts         # Resolves theme variables (var(--color-primary))
    │   └── deepMerge.ts             # Immutable deep merge to prevent state drops
    └── validation/
        └── styleSchemaValidator.ts  # Validates style objects during preflight
```

### 2.2 Core Style Schema Definition (`src/types/styles.ts`)
```typescript
export interface BaseStyleProperties {
  marginTop?: string | number;
  marginBottom?: string | number;
  marginLeft?: string | number;
  marginRight?: string | number;
}

export interface TextStyleProperties extends BaseStyleProperties {
  fontFamily?: string;
  fontSize?: string | number;
  fontWeight?: string | number;
  lineHeight?: string | number;
  letterSpacing?: string;
  color?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
}

export interface CardStyleProperties extends BaseStyleProperties {
  // Sizing & Geometry
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  height?: string;
  aspectRatio?: string;
  // Padding
  paddingTop?: string | number;
  paddingBottom?: string | number;
  paddingLeft?: string | number;
  paddingRight?: string | number;
  // Border & Corners
  borderRadius?: string | number;
  borderWidth?: string | number;
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'none';
  borderColor?: string;
  // Surface Appearance
  backgroundColor?: string;
  backgroundGradient?: string;
  boxShadow?: string;
  backdropBlur?: string;
  // Layout
  gap?: string | number;
}

export interface ButtonStyleProperties extends BaseStyleProperties {
  variant?: 'solid' | 'outline' | 'ghost' | 'soft';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  borderRadius?: string | number;
  paddingX?: string | number;
  paddingY?: string | number;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  hoverBackgroundColor?: string;
  hoverTextColor?: string;
}

export interface GridStyleProperties {
  columns?: number | 'auto-fit' | 'auto-fill';
  minCardWidth?: string;
  gapX?: string | number;
  gapY?: string | number;
  equalHeight?: boolean;
}

export interface SectionStyleProperties {
  paddingTop?: string | number;
  paddingBottom?: string | number;
  paddingX?: string | number;
  maxWidth?: string;
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundOverlayColor?: string;
  backgroundOverlayOpacity?: number;
}

export type ComponentStyle =
  | { kind: 'text'; style: TextStyleProperties }
  | { kind: 'card'; style: CardStyleProperties }
  | { kind: 'button'; style: ButtonStyleProperties }
  | { kind: 'grid'; style: GridStyleProperties }
  | { kind: 'section'; style: SectionStyleProperties };
```

### 2.3 CSS Variable Generator (`src/engine/cssVariables.ts`)
Converts any component style object into standard `--deneb-*` CSS variables:
```typescript
export function formatUnit(value: string | number | undefined): string | undefined {
  if (value === undefined || value === '' || value === null) return undefined;
  if (typeof value === 'number') return `${value}px`;
  return /^\d+$/.test(value) ? `${value}px` : value;
}

export function cardStyleToCssVariables(style: CardStyleProperties): Record<string, string> {
  const vars: Record<string, string> = {};
  if (style.width) vars['--deneb-card-width'] = formatUnit(style.width)!;
  if (style.minWidth) vars['--deneb-card-min-width'] = formatUnit(style.minWidth)!;
  if (style.maxWidth) vars['--deneb-card-max-width'] = formatUnit(style.maxWidth)!;
  if (style.height) vars['--deneb-card-height'] = formatUnit(style.height)!;
  if (style.aspectRatio) vars['--deneb-card-aspect-ratio'] = style.aspectRatio;

  if (style.paddingTop) vars['--deneb-card-pt'] = formatUnit(style.paddingTop)!;
  if (style.paddingBottom) vars['--deneb-card-pb'] = formatUnit(style.paddingBottom)!;
  if (style.paddingLeft) vars['--deneb-card-pl'] = formatUnit(style.paddingLeft)!;
  if (style.paddingRight) vars['--deneb-card-pr'] = formatUnit(style.paddingRight)!;

  if (style.borderRadius) vars['--deneb-card-radius'] = formatUnit(style.borderRadius)!;
  if (style.borderWidth) vars['--deneb-card-border-w'] = formatUnit(style.borderWidth)!;
  if (style.borderStyle) vars['--deneb-card-border-s'] = style.borderStyle;
  if (style.borderColor) vars['--deneb-card-border-c'] = style.borderColor;

  if (style.backgroundColor) vars['--deneb-card-bg'] = style.backgroundColor;
  if (style.boxShadow) vars['--deneb-card-shadow'] = resolveShadowPreset(style.boxShadow);
  if (style.backdropBlur) vars['--deneb-card-blur'] = formatUnit(style.backdropBlur)!;

  return vars;
}
```

### 2.4 Instant 0ms Live DOM Patcher (`src/engine/domPatcher.ts`)
Applies the CSS variables directly to the DOM element without waiting for a React state cycle:
```typescript
export function patchElementStyle(
  element: HTMLElement,
  styleKind: 'text' | 'card' | 'button' | 'grid' | 'section',
  updates: Record<string, unknown>,
) {
  let cssVars: Record<string, string> = {};
  if (styleKind === 'text') {
    cssVars = textStyleToCssVariables(updates as TextStyleProperties);
  } else if (styleKind === 'card') {
    cssVars = cardStyleToCssVariables(updates as CardStyleProperties);
  } else if (styleKind === 'button') {
    cssVars = buttonStyleToCssVariables(updates as ButtonStyleProperties);
  }

  for (const [varName, varVal] of Object.entries(cssVars)) {
    if (varVal) {
      element.style.setProperty(varName, varVal);
    } else {
      element.style.removeProperty(varName);
    }
  }
}
```

---

## Package 2: `@deneb-ui/ui` (The React Component Library)

`@deneb-ui/ui` provides the developer-facing React components that templates import.

### 2.1 File Structure to Create/Update
```text
packages/@deneb-ui/ui/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts
    ├── context/
    │   └── SiteDataProvider.tsx      # Handles live protocol & style state
    ├── hooks/
    │   ├── useSiteData.ts            # Content hook
    │   └── useComponentStyle.ts      # Style resolution hook
    ├── components/
    │   ├── EditableText.tsx          # Real-time typography
    │   ├── EditableCard.tsx          # Real-time card geometry & surface
    │   ├── EditableButton.tsx        # Real-time CTA button
    │   ├── EditableGrid.tsx          # Auto-balancing grid
    │   ├── EditableSection.tsx       # Layout container
    │   ├── EditableHeroCentered.tsx  # Pre-engineered hero section
    │   ├── EditableHeroSplit.tsx     # Split hero section
    │   ├── EditableProductCard.tsx   # Product card wrapper
    │   └── EditableTestimonialCard.tsx
    └── styles/
        └── deneb-components.css      # Default CSS variable definitions & utilities
```

### 2.2 The `useComponentStyle` Hook (`src/hooks/useComponentStyle.ts`)
```tsx
import { useMemo } from 'react';
import { useSiteDataContext } from '../context/SiteDataProvider';
import { cardStyleToCssVariables, textStyleToCssVariables } from '@deneb-ui/core';

export function useComponentStyle<T extends Record<string, unknown>>(
  stylePath: string,
  defaults?: Partial<T>,
) {
  const { siteData } = useSiteDataContext();

  // 1. Check scoped styles: siteData.styles[stylePath]
  // 2. Fallback to adjacent suffix: siteData.content[stylePath + 'Style']
  const rawStyle = useMemo(() => {
    const fromStylesTree = siteData.styles?.[stylePath];
    if (fromStylesTree) return fromStylesTree;
    const fromContent = getNestedValue(siteData.content, `${stylePath}Style`);
    return fromContent || {};
  }, [siteData, stylePath]);

  const merged = useMemo(() => {
    return { ...defaults, ...rawStyle } as T;
  }, [defaults, rawStyle]);

  return { style: merged };
}
```

### 2.3 `EditableCard` Component (`src/components/EditableCard.tsx`)
```tsx
import React, { useMemo } from 'react';
import { cardStyleToCssVariables } from '@deneb-ui/core';
import { useComponentStyle } from '../hooks/useComponentStyle';

export interface EditableCardProps extends React.HTMLAttributes<HTMLDivElement> {
  itemPath: string;
  balance?: boolean;
  children: React.ReactNode;
  defaultStyle?: Record<string, unknown>;
}

export function EditableCard({
  itemPath,
  balance = true,
  children,
  className = '',
  style: userInlineStyle,
  defaultStyle,
  ...rest
}: EditableCardProps) {
  const { style } = useComponentStyle(`${itemPath}.card`, defaultStyle);

  const cssVars = useMemo(() => {
    return cardStyleToCssVariables(style) as React.CSSProperties;
  }, [style]);

  return (
    <div
      data-preview-item-path={itemPath}
      data-preview-style-target={`${itemPath}.card`}
      data-preview-style-type="card"
      className={`deneb-card ${balance ? 'deneb-card-balance' : ''} ${className}`}
      style={{ ...cssVars, ...userInlineStyle }}
      {...rest}
    >
      {children}
    </div>
  );
}
```

### 2.4 Built-in Base Styles (`src/styles/deneb-components.css`)
```css
/* Card styling consuming CSS variables */
.deneb-card {
  width: var(--deneb-card-width, auto);
  min-width: var(--deneb-card-min-width, unset);
  max-width: var(--deneb-card-max-width, 100%);
  height: var(--deneb-card-height, auto);
  aspect-ratio: var(--deneb-card-aspect-ratio, auto);
  
  padding-top: var(--deneb-card-pt, 1.25rem);
  padding-bottom: var(--deneb-card-pb, 1.25rem);
  padding-left: var(--deneb-card-pl, 1.25rem);
  padding-right: var(--deneb-card-pr, 1.25rem);

  border-radius: var(--deneb-card-radius, 0.75rem);
  border-width: var(--deneb-card-border-w, 1px);
  border-style: var(--deneb-card-border-s, solid);
  border-color: var(--deneb-card-border-c, rgba(0, 0, 0, 0.08));

  background-color: var(--deneb-card-bg, #ffffff);
  box-shadow: var(--deneb-card-shadow, 0 1px 3px rgba(0, 0, 0, 0.05));
  backdrop-filter: blur(var(--deneb-card-blur, 0px));
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

/* Auto-balancing flex container */
.deneb-card-balance {
  display: flex;
  flex-direction: column;
  flex: 1 1 0%;
}

/* Text styling consuming CSS variables */
.deneb-text {
  font-family: var(--deneb-font-family, inherit);
  font-size: var(--deneb-font-size, inherit);
  font-weight: var(--deneb-font-weight, inherit);
  line-height: var(--deneb-line-height, inherit);
  letter-spacing: var(--deneb-letter-spacing, inherit);
  color: var(--deneb-color, inherit);
  text-align: var(--deneb-text-align, inherit);
  text-transform: var(--deneb-text-transform, inherit);
  margin-top: var(--deneb-margin-top, 0px);
  margin-bottom: var(--deneb-margin-bottom, 0px);
}
```

---

## Package 3: `@deneb-ui/cli` (Validation & Preflight)

`@deneb-ui/cli` validates templates before submission to ensure they conform to the live visual editing rules.

### Updates Required in CLI:
1. **Style Path Validation (`deneb validate`)**:
   - Ensures that any custom style paths declared in `fivora-template.json` map to valid component markers.
   - Verifies that all `EditableCard`, `EditableText`, and `EditableGrid` components maintain fallback default styles so storefronts never render broken or unstyled if no user overrides exist.
2. **Local Visual Lab (`deneb lab`)**:
   - Emits the upgraded `FIVORA_PREVIEW_STYLE_PATCH` messages directly from the local dev server.

---

# 3. How the Visual Editor Popover Integrates

In `developer-panel/src/components/local-template-lab/LocalTemplateVisualEditPopover.tsx`:

### 3.1 Contextual Category Switching
The popover inspects the clicked element's metadata (`clickPayload.descriptorKind` or `clickPayload.fieldPath`):
- If the user clicked a **headline or paragraph**, the Style tab opens with **Typography** and **Margins**.
- If the user clicked a **card, grid item, or container**, the Style tab opens with **Card Size, Borders, Shadow, and Surface**.
- If the user clicked a **button**, it opens with **Button Variant, Radius, and Hover Colors**.

### 3.2 Two-Phase Zero-Lag Commit Pattern
```typescript
// Phase 1: Real-time slider / picker drag (Zero React Lag)
const onSliderInput = (styleKey: string, value: string | number) => {
  // Send instant DOM patch to preview iframe
  iframeRef.contentWindow.postMessage({
    type: 'FIVORA_PREVIEW_STYLE_PATCH',
    targetPath: effectivePath,
    styleType: detectedComponentType, // 'card' | 'text' | 'button'
    properties: { [styleKey]: value }
  }, '*');
};

// Phase 2: Debounced State Commit (Save to site-data.json)
const commitStyleDebounced = useDebounce((finalStyles) => {
  const nextSiteData = structuredClone(siteData);
  if (!nextSiteData.styles) nextSiteData.styles = {};
  nextSiteData.styles[effectivePath] = finalStyles;
  
  // Persist to site-data.json and sync state
  onChange(nextSiteData);
}, 300);
```

---

# 4. Storage Contract in `site-data.json`

Styles are cleanly persisted in a dedicated `"styles"` node at the root of `site-data.json` (with backward-compatible support for `${fieldPath}Style`):

```json
{
  "manifestVersion": 2,
  "theme": {
    "colors": {
      "primary": "#2563eb",
      "surface": "#ffffff",
      "background": "#f8fafc"
    }
  },
  "content": {
    "home": {
      "heroTitle": "Modern Fashion Store",
      "products": [
        { "id": "1", "title": "Classic Wool Coat", "price": "$189" }
      ]
    }
  },
  "styles": {
    "home.heroTitle": {
      "fontFamily": "Playfair Display",
      "fontSize": "48px",
      "fontWeight": "700",
      "lineHeight": 1.2,
      "color": "#0f172a",
      "textAlign": "center",
      "marginBottom": "16px"
    },
    "home.products.card": {
      "width": "100%",
      "aspectRatio": "3/4",
      "paddingTop": "16px",
      "paddingBottom": "16px",
      "paddingLeft": "16px",
      "paddingRight": "16px",
      "borderRadius": "16px",
      "borderWidth": "1px",
      "borderColor": "#e2e8f0",
      "backgroundColor": "#ffffff",
      "boxShadow": "md"
    }
  }
}
```

---

# 5. Developer Experience: How Templates Use the New Packages

A template developer simply uses `@deneb-ui/ui` components without writing any custom iframe listeners or CSS boilerplate:

```tsx
'use client';

import React from 'react';
import { EditableCard, EditableText, EditableGrid, EditableButton } from '@deneb-ui/ui';
import { useSiteData } from '@/lib/siteDataContext';

export function ProductSection() {
  const { content } = useSiteData();
  const products = content?.home?.products || [];

  return (
    <section className="py-16 px-6 max-w-7xl mx-auto">
      {/* Real-time editable headline */}
      <EditableText
        fieldPath="home.productsTitle"
        as="h2"
        className="text-3xl font-bold mb-10 text-center"
      >
        Featured Collection
      </EditableText>

      {/* Real-time editable grid with auto-balancing */}
      <EditableGrid minCardWidth="300px" gap="xl" equalHeight>
        {products.map((product: any, idx: number) => (
          /* Real-time editable card: width, radius, shadow, background */
          <EditableCard
            key={product.id || idx}
            itemPath={`home.products[${idx}]`}
            balance
          >
            <img src={product.image} alt={product.title} className="w-full rounded-md mb-4" />
            <EditableText fieldPath={`home.products[${idx}].title`} as="h3" className="font-semibold text-lg">
              {product.title}
            </EditableText>
            <p className="text-gray-600 mt-1">{product.price}</p>
            <EditableButton
              fieldPath={`home.products[${idx}].cta`}
              label="Add to Cart"
              className="mt-4 w-full"
            />
          </EditableCard>
        ))}
      </EditableGrid>
    </section>
  );
}
```

---

# 6. Step-by-Step Implementation Roadmap

| Phase | Package / Area | Key Deliverables |
| :--- | :--- | :--- |
| **Phase 1** | `@deneb-ui/core` | • Add `TextStyleProperties`, `CardStyleProperties`, `ButtonStyleProperties`<br>• Implement `cardStyleToCssVariables()` and `textStyleToCssVariables()`<br>• Implement `patchElementStyle()` DOM injector<br>• Define `FIVORA_PREVIEW_STYLE_PATCH` message contract |
| **Phase 2** | `@deneb-ui/ui` | • Implement `useComponentStyle()` hook<br>• Build `EditableCard` with geometry, padding, radius, shadow, and auto-balance<br>• Build `EditableText` and `EditableButton`<br>• Add `deneb-components.css` variable mappings |
| **Phase 3** | Focus Bridge (`backend`) | • Update `template-preview-focus-bridge.ts` to listen for `FIVORA_PREVIEW_STYLE_PATCH`<br>• Apply CSS variables to matched elements instantly upon receiving patches |
| **Phase 4** | Visual Editor Popover | • Update `LocalTemplateVisualEditPopover.tsx`<br>• Add Card Geometry controls (Width, Radius, Border, Shadow, Padding)<br>• Add Typography controls (Font, Size, Weight, Tracking, Transform)<br>• Wire sliders to Phase 1 instant DOM patch + Phase 2 debounced commit |
| **Phase 5** | `@deneb-ui/cli` & Docs | • Update preflight validation rules in `deneb validate`<br>• Update `guides/fivora-template-developer-guide.md` with the new style components |

This blueprint gives you the full, production-grade architectural plan and exact requirements to implement real-time visual styling across all storefront components.