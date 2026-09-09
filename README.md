<p align="center">
  <a href="https://deneb.fivora.site">
    <img src="https://img.shields.io/badge/DENEB_UI-Visual--First_Storefront_Framework-6366F1?style=for-the-badge&labelColor=0f172a" alt="DENEB UI" />
  </a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/org/deneb-ui"><img src="https://img.shields.io/npm/v/@deneb-ui/ui.svg?style=flat-square&label=@deneb-ui/ui&color=6366F1" alt="npm" /></a>
  <img src="https://img.shields.io/badge/Monorepo-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Fivora-Visual_Editing-818CF8?style=flat-square" alt="Fivora" />
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-emerald?style=flat-square" alt="MIT" /></a>
</p>

<p align="center">
  <strong>Visual-first React components + CLI toolchain for editable commerce storefronts.</strong>
</p>

<p align="center">
  <a href="https://deneb.fivora.site"><strong>Documentation</strong></a> ·
  <a href="https://www.npmjs.com/org/deneb-ui"><strong>npm</strong></a> ·
  <a href="https://github.com/deneb-ui/ui"><strong>Docs repo</strong></a>
</p>

---

## Packages

Published under the [`@deneb-ui`](https://www.npmjs.com/org/deneb-ui) npm organization:

| Package | Description | Install |
| :--- | :--- | :--- |
| [**@deneb-ui/ui**](packages/deneb-ui) | React component library — 40+ editable storefront components | `npm i @deneb-ui/ui` |
| [**@deneb-ui/cli**](cli/deneb-cli) | CLI — init, validate, zip, doctor, lab, add | `npm i -D @deneb-ui/cli` |
| [**@deneb-ui/create-template**](packages/create-template) | Scaffold new storefront templates | `npm create @deneb-ui/template` |

---

## Quick start

```bash
# New project from template
npm create @deneb-ui/template my-store

# Or convert an existing Next.js app
npx @deneb-ui/cli init
```

```tsx
import { SiteDataProvider, Navbar, Hero, Footer } from "@deneb-ui/ui";
```

---

## Repository structure

```
core/
├── packages/deneb-ui/       # @deneb-ui/ui component library
├── cli/deneb-cli/           # @deneb-ui/cli + Deneb ARC engine
├── packages/create-template/# @deneb-ui/create-template
├── templates/nextjs/        # Reference storefront template
└── .github/workflows/       # CI/CD + npm publish with provenance
```

Documentation site (separate repo): **[github.com/deneb-ui/ui](https://github.com/deneb-ui/ui)** → [deneb.fivora.site](https://deneb.fivora.site)

---

## Development

```bash
npm install
npm run build

# Run ARC tests
node --test cli/deneb-cli/src/arc/__tests__/arc.test.cjs

# Validate reference template
node cli/deneb-cli/bin/index.js validate templates/nextjs --skip-install
```

---

## Authors

**[Chamika Gayashan](https://github.com/chamikathereal)** · **[Induranga Kawishwara](https://github.com/Induranga-kawishwara)**

DENEB UI · Collaborate with Fivora · MIT License
