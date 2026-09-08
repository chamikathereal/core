# DENEB

### The official template initializer for DENEB UI.

> **DENEB UI — Build beautiful interfaces, effortlessly.**  
> The premier visual-first React component ecosystem.  
> Proudly presented by **DENEB-UI Collaborate with FIVORA**.

[![Framework: DENEB UI](https://img.shields.io/badge/Framework-DENEB_UI_v2.0-blue.svg)](https://github.com/deneb-ui/ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-teal.svg)](https://opensource.org/licenses/MIT)

---

## Quick Start

Scaffold a complete storefront in seconds with a single command:

```bash
# Using npm
npm create @deneb-ui/template my-store

# Or using npx
npx @deneb-ui/create-template my-store

# Or using yarn / pnpm
yarn create @deneb-ui/template my-store
pnpm create @deneb-ui/template my-store
```

If you don't provide a project name, the interactive wizard will prompt you:

```text
⚡ Welcome to DENEB UI Template Creator!

? What is your template name? (e.g. my-store):
```

Then start developing:

```bash
cd my-store
npm run dev       # Start Next.js + Tailwind local development
npm run lab       # Launch Visual Editing Lab
npm run validate  # Run contract compliance checks
npm run zip       # Create upload-ready clean ZIP
```

---

## What is Included?

Each generated template comes pre-configured with:
- ⚡ **Next.js 15 App Router**: Modern React 19 / Next.js with static HTML export support
- 🎨 **Tailwind CSS**: Pre-configured `tailwind.config.ts`, `postcss.config.mjs`, and Tailwind utility classes
- 💎 **`@deneb-ui/ui`**: Pre-installed DENEB UI visual-first component ecosystem
- 🛠️ **`@deneb-ui/cli`**: Developer toolchain (`deneb lab`, `deneb validate`, `deneb zip`, `deneb add`)
- 📋 **Manifest & Schema**: Pre-configured storefront template contract & visual editing bindings
- 📦 **`src/data/site-data.json`**: Single source of truth for branding, nav labels, and editable content
- 📖 **In-App Developer Guide**: Built-in developer guidance right on the homepage (`src/app/page.tsx`)

---

## Command Options

```bash
npx @deneb-ui/create-template <project-name> [options]
```

| Option | Description |
| :--- | :--- |
| `<project-name>` | Target directory name (e.g. `my-store`) |
| `--skip-install` | Do not run `npm install` automatically after scaffolding |

---

## 👤 Author & Credits

Created and architected by **Chamika Gayashan & Induranga Kawishwara**.  
Part of the **DENEB UI** ecosystem.
