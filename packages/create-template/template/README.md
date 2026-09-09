# Fivora Store Template

A high-performance, conversion-engineered e-commerce storefront built with **Next.js (App Router)** and **`@deneb-ui/ui`**, ready for **Fivora**.

---

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view your store.

---

## Developer Commands

This template is pre-configured with official Fivora developer tools:

| Command | Description |
| :--- | :--- |
| **`npm run dev`** | Starts the Next.js local development server with hot reload |
| **`npm run lab`** | Launches the **Fivora Visual Editing Lab** to test live merchant editing |
| **`npm run validate`** | Runs strict preflight compliance checks against Fivora contract rules |
| **`npm run zip`** | Packages your template into a clean, upload-ready `.zip` archive |
| **`npm run build`** | Generates the static production export in the `out/` directory |

---

## Project Structure

```text
├── fivora-template.json       # Fivora template manifest (Version 2 strict contract)
├── package.json               # Dependencies and Fivora scripts
├── next.config.ts             # Next.js configuration (static export enabled)
├── src/
│   ├── app/                   # Next.js App Router pages (Home, About, Services, Contact)
│   │   ├── page.tsx           # Home page
│   │   ├── about_us/          # About Us route
│   │   ├── services/          # Services route
│   │   └── contact/           # Contact form (integrated with Fivora endpoint)
│   ├── components/            # Reusable UI components & layouts
│   ├── data/
│   │   └── site-data.json     # Merchant defaults, theme colors, navigation, & site content
│   └── lib/                   # Site data context & live preview bridge
└── public/                    # Static assets & logos
```

---

## How Visual Editing Works

Fivora allows merchants to click and visually edit any text, image, or product on their website.

To make an element visually editable, use **`data-preview-field-path`** pointing to its key in `src/data/site-data.json`:

```tsx
import { EditableHeading, EditableText } from '@deneb-ui/ui';

// In your component:
<EditableHeading
  level={1}
  data-preview-field-path="home.heroTitle"
  defaultValue={content.home.heroTitle}
/>
```

When you run **`npm run lab`**, you can click directly on any element with a `data-preview-field-path` to test editing in real-time.

---

## How to Customize

### 1. Change Theme & Colors
Edit `src/data/site-data.json` under `template.structure.theme`:
```json
"theme": {
  "primaryColor": "#016a7e",
  "secondaryColor": "#0a1931",
  "accentColor": "#00adb5",
  "backgroundColor": "#ffffff",
  "textColor": "#0f172a",
  "headingFont": "Inter",
  "bodyFont": "Inter"
}
```

### 2. Add New Pages or Routes
1. Create your page route in `src/app/your-page/page.tsx`.
2. Declare the page in `fivora-template.json` under `"pages"`:
   ```json
   { "id": "your_page", "label": "Your Page", "route": "/your-page" }
   ```
3. Add the page content to `src/data/site-data.json`.

---

## Packaging for Fivora

When your template design is ready:

1. **Validate Compliance:**
   ```bash
   npm run validate
   ```
   Ensures all preview markers, empty states, and required routes pass the Fivora preflight contract.

2. **Generate Upload ZIP:**
   ```bash
   npm run zip
   ```
   This generates a clean `fivora-template.zip` in your root folder with all cache, build, and `node_modules` files automatically excluded.

3. **Upload:** Go to your **Fivora Merchant/Developer Portal** and upload `fivora-template.zip`.

---

## License

MIT © [Fivora](https://fivora.com)
