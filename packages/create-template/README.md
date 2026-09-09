<p align="center">
  <a href="https://deneb.fivora.site">
    <img src="https://img.shields.io/badge/DENEB_Create--Template-Scaffold_in_Seconds-6366F1?style=for-the-badge&labelColor=0f172a" alt="DENEB create-template" />
  </a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@deneb-ui/create-template"><img src="https://img.shields.io/npm/v/@deneb-ui/create-template.svg?style=flat-square&color=6366F1" alt="npm version" /></a>
  <img src="https://img.shields.io/badge/Next.js-15-000?style=flat-square&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/Tailwind-Ready-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-emerald?style=flat-square" alt="MIT License" /></a>
</p>

<p align="center">
  <strong>Generate a production-ready DENEB UI storefront template in one command.</strong>
</p>

<p align="center">
  <a href="https://deneb.fivora.site/docs/templates"><strong>Template Guide</strong></a> ·
  <a href="https://deneb.fivora.site/docs/installation"><strong>Installation</strong></a> ·
  <a href="https://github.com/deneb-ui/core"><strong>GitHub</strong></a>
</p>

---

## Quick start

```bash
npm create @deneb-ui/template my-store
# npx @deneb-ui/create-template my-store
# pnpm create @deneb-ui/template my-store
```

Then:

```bash
cd my-store
npm run dev          # Local development
npm run lab          # Visual editing preview lab
npm run validate     # Fivora contract checks
npm run zip          # Upload-ready package
```

---

## What's included

Each scaffolded project ships with:

- **Next.js 15** App Router + static export support  
- **Tailwind CSS** pre-configured  
- **`@deneb-ui/ui`** — full component library with responsive defaults  
- **`@deneb-ui/cli`** — validate, lab, zip, and add commands  
- **`fivora-template.json`** + **`site-data.json`** — editor-ready from day one  

---

## Options

```bash
npx @deneb-ui/create-template <project-name> [--skip-install]
```

| Flag | Description |
| :--- | :--- |
| `--skip-install` | Skip `npm install` after scaffolding |

---

## Authors

Created and maintained by **[Chamika Gayashan](https://github.com/chamikathereal)** and **[Induranga Kawishwara](https://github.com/Induranga-kawishwara)**.

<p align="center">
  <sub>MIT © DENEB UI</sub>
</p>
