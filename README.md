# DENEB UI Framework

### A modern UI system for the web.

> **DENEB UI — Build beautiful interfaces, effortlessly.**  
> The visual-first React component ecosystem and storefront authoring suite.  
> Proudly presented by **DENEB-UI Collaborate with FIVORA**.

[![Framework: DENEB UI](https://img.shields.io/badge/Framework-DENEB_UI_v2.0-blue.svg)](https://github.com/deneb-ui/ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-orange.svg)](https://opensource.org/licenses/MIT)

---

## 🚀 Quickstart

### 1. Install DENEB UI in any React / Next.js project:

```bash
npm install @deneb-ui/ui
# or with pnpm
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

### 2. Scaffold a complete storefront template in seconds:

```bash
npx @deneb-ui/create-template my-store
# or
npx create-deneb my-store
```

### 3. Add components on-demand via CLI:

```bash
# List available components:
npx @deneb-ui/cli add list

# Add specific components into src/components/ui/:
npx @deneb-ui/cli add product-card
npx @deneb-ui/cli add contact-actions
npx @deneb-ui/cli add location-card
npx @deneb-ui/cli add whatsapp-button
npx @deneb-ui/cli add dialog
npx @deneb-ui/cli add all
```

---

## 📦 Packages in this Monorepo

| Package | Purpose | Installation |
| :--- | :--- | :--- |
| **`@deneb-ui/ui`** | Complete visual-first UI framework (shadcn & HeroUI style primitives + smart template components) | `npm i @deneb-ui/ui` |
| **`@deneb-ui/cli`** | Developer CLI (`deneb add`, `validate`, `lab`, `zip`, `init`) | `npm i -D @deneb-ui/cli` |
| **`@deneb-ui/create-template`** | Scaffolding CLI to generate pre-validated storefront templates | `npx @deneb-ui/create-template <app>` |

---

## 🌟 Smart Template Components

DENEB UI includes a dedicated suite of high-converting smart action components designed for commerce:

### 1. Smart Contact & Messaging
- **`ContactActions`**: Automatically inspects available contact channels (`phone`, `whatsapp`, `email`) and renders active buttons with automatic fallback.
- **`WhatsAppButton`**: One-click click-to-chat button with built-in SVG icon and automatic URL generation (`https://wa.me/...`).
- **`PhoneButton`**: One-click calling button with `tel:` handler and raw number visual editing bindings.
- **`EmailButton`**: One-click email button with `mailto:` handler and optional subject lines.

### 2. Smart Location & Navigation
- **`LocationCard`**: High-converting location card with pin icon, formatted address, and Google Maps directions button.
- **`LocationLink`**: Address display paired with an interactive "Get Directions" action.
- **`MapLink`**: Direct button to open Google Maps directions or search queries.
- **`MapEmbed`**: Responsive map embed iframe with safe graceful fallback to `MapLink` when embed URLs are unconfigured.
- **`Address`**: Structured semantic `<address>` component with individual street, city, and country field markers.

### 3. Social & Operating Hours
- **`SocialLinks`**: Smart container that automatically filters out unconfigured social platforms.
- **`SocialButton`**: Brand-colored social button with built-in SVGs (Instagram, Facebook, TikTok, YouTube, LinkedIn, X, Pinterest, GitHub).
- **`BusinessHours`**: Weekly schedule renderer with a live dynamic **Open Now** / **Closed** status badge.
- **`DenebAction`** / **`ActionLink`**: Foundation action primitive connecting action types, URL generation, and visual editing markers.

---

## 🛠️ Monorepo Commands

```bash
# Build all packages & sync template
npm run build

# Bump versions across monorepo (patch / minor / major)
npm run bump
npm run bump:minor

# Run preflight compliance validation on reference template
node cli/deneb-cli/bin/index.js validate templates/nextjs --skip-install

# Test CLI component registry
node cli/deneb-cli/bin/index.js add list
```

---

## 👤 Author & Architecture

Created and architected by **Chamika Gayashan & Induranga Kawishwara**.  
Built for high-converting, modern storefronts.
