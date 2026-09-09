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
  The visual-first React component library for Next.js commerce and Fivora live editing.
</p>

<p align="center">
  <a href="https://deneb.fivora.site/docs/introduction"><strong>Documentation</strong></a> ·
  <a href="https://deneb.fivora.site/docs/components/button"><strong>Components</strong></a> ·
  <a href="https://deneb.fivora.site/docs/responsive-design"><strong>Responsive Design</strong></a> ·
  <a href="https://github.com/deneb-ui/core"><strong>GitHub</strong></a>
</p>

---

## Getting Started

### Install

```bash
npm install @deneb-ui/ui
# pnpm add @deneb-ui/ui
# yarn add @deneb-ui/ui
```

### Minimal example

```tsx
import { SiteDataProvider, Navbar, Hero, Footer, Grid, ProductCard } from "@deneb-ui/ui";
import siteData from "@/data/site-data.json";

export default function Page() {
  return (
    <SiteDataProvider initialSiteData={siteData}>
      <Navbar />
      <Hero />
      <Grid columns={{ mobile: 1, tablet: 2, desktop: 3 }} gap="lg">
        {/* ProductCard items */}
      </Grid>
      <Footer />
    </SiteDataProvider>
  );
}
```

`SiteDataProvider` automatically injects **ResponsiveBaseStyles** — every component adapts across phone, tablet, and desktop without extra setup.

---

## Features

| Capability | Description |
| :--- | :--- |
| **Visual editing native** | Built-in `data-preview-field-path` bindings for Fivora and DENEB preview protocol |
| **Responsive by default** | Mobile drawer nav, collapsible filters, fluid grids, `clamp()` section spacing |
| **Smart commerce actions** | WhatsApp, phone, email, maps — auto-hide when merchant data is missing |
| **Zero styling lock-in** | Inline CSS + optional Tailwind; works in any React 18/19 app |
| **40+ components** | Navbar, Hero, ProductGrid, CartDrawer, ContactForm, BusinessHours, and more |

---

## Documentation

| Guide | Link |
| :--- | :--- |
| Introduction | [deneb.fivora.site/docs/introduction](https://deneb.fivora.site/docs/introduction) |
| Installation & CLI init | [deneb.fivora.site/docs/installation](https://deneb.fivora.site/docs/installation) |
| Responsive design | [deneb.fivora.site/docs/responsive-design](https://deneb.fivora.site/docs/responsive-design) |
| Theming & tokens | [deneb.fivora.site/docs/theming](https://deneb.fivora.site/docs/theming) |
| Component catalog | [deneb.fivora.site/docs/components/button](https://deneb.fivora.site/docs/components/button) |

---

## Related packages

| Package | Purpose |
| :--- | :--- |
| [`@deneb-ui/cli`](https://www.npmjs.com/package/@deneb-ui/cli) | Convert, validate, and package storefront templates |
| [`@deneb-ui/create-template`](https://www.npmjs.com/package/@deneb-ui/create-template) | Scaffold a new DENEB storefront in one command |

---

## Authors

Created and maintained by **[Chamika Gayashan](https://github.com/chamikathereal)** and **[Induranga Kawishwara](https://github.com/Induranga-kawishwara)**.

Part of the **DENEB UI** ecosystem · Collaborate with **[Fivora](https://fivora.site)**.

<p align="center">
  <sub>MIT © DENEB UI</sub>
</p>
