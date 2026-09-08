# DENEB

### The official developer CLI for DENEB UI.

> **DENEB UI — Build beautiful interfaces, effortlessly.**  
> The premier visual-first React component ecosystem.  
> Proudly presented by **DENEB-UI Collaborate with FIVORA**.

[![Framework: DENEB UI](https://img.shields.io/badge/Framework-DENEB_UI_v2.0-blue.svg)](https://github.com/deneb-ui/ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-teal.svg)](https://opensource.org/licenses/MIT)

---

## Installation

You can run commands directly using `npx`:
```bash
npx @deneb-ui/cli <command>
```

Or install as a project devDependency:
```bash
npm install -D @deneb-ui/cli
```

Or install globally:
```bash
npm install -g @deneb-ui/cli
```

The CLI command is available as `deneb` (with alias `denebui`).

---

## Commands

### 1. `deneb add <component>` (Component Registry)
Add production-ready DENEB UI components into `src/components/ui/`:

```bash
# List available components:
npx @deneb-ui/cli add list

# Add specific components:
npx @deneb-ui/cli add product-card
npx @deneb-ui/cli add contact-actions
npx @deneb-ui/cli add location-card
npx @deneb-ui/cli add whatsapp-button
npx @deneb-ui/cli add dialog
npx @deneb-ui/cli add all
```

### 1. `deneb init` (Initialize Existing Project)
Converts and configures any **ongoing Next.js project** for the Fivora platform:
- Generates `fivora-template.json` (Version 2 contract with strict visual editing)
- Creates `src/data/site-data.json` with merchant defaults
- Injects npm scripts (`lab`, `validate`, `zip`, `validate-and-zip`, `update:deneb`)
- Installs `@deneb-ui/ui` and `@deneb-ui/cli`

```bash
npx @deneb-ui/cli init
# Or: deneb init
```

### 2. `deneb update` (Update Packages & DENEB Components)
Keeps your project up to date by updating both npm packages and installed DENEB components:
- Updates `@deneb-ui/ui` and `@deneb-ui/cli` to the latest releases
- Automatically scans `src/components/ui/` and synchronizes existing DENEB UI components with the latest definitions

```bash
npm run update:deneb
# Or: deneb update
```

### 3. `deneb validate` (Preflight Contract Validator)
Runs Fivora preflight verification against manifest contracts, static export fixtures, and visual editing markers (`data-fivora-path`, `data-fivora-page`):

```bash
npm run validate
# Or: deneb validate .
# Or validate and immediately bundle on success:
deneb validate --zip
```

### 4. `deneb zip` / `deneb pack` (Clean Package Generator)
Creates a clean, upload-ready `fivora-template.zip` excluding unnecessary directories and secret files (`node_modules`, `.next`, `.git`, `.env*`, `.cache`, `.turbo`, logs):

```bash
npm run zip
# Or: deneb zip .
```

### 5. `deneb validate-and-zip` (One-Step Preflight Check & Clean ZIP)
The safest, recommended command for releasing templates. Runs full preflight validation; if and only if all platform checks pass 100%, it bundles a clean `fivora-template.zip`:

```bash
npm run validate-and-zip
# Or: deneb validate-and-zip .
# Or: deneb validate and zip
```

### 6. `deneb add <component>` (Component Registry)
Add or update production-ready DENEB UI components into `src/components/ui/`:

```bash
# List available components:
npx @deneb-ui/cli add list

# Add specific components:
npx @deneb-ui/cli add product-card
npx @deneb-ui/cli add contact-actions
npx @deneb-ui/cli add location-card
npx @deneb-ui/cli add whatsapp-button
npx @deneb-ui/cli add dialog
npx @deneb-ui/cli add all
```

### 7. `deneb create <project-name>` (Start from Scratch)
Scaffolds a brand-new Next.js App Router storefront pre-configured with Tailwind CSS and `@deneb-ui/ui`:

```bash
npx @deneb-ui/cli create my-store
```

### 8. `deneb lab` (Local Visual Editing Lab)
Launches the interactive visual editing test lab simulating Fivora editor messages:

```bash
npm run lab
# Or: deneb lab .
```

---

## 👤 Author & Credits

Created and architected by **Chamika Gayashan & Induranga Kawishwara**.  
Part of the **DENEB UI** ecosystem.
