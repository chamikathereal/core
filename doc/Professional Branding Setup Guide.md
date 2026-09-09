# DENEB UI — Professional npm & GitHub Branding Guide

**Authors:** [Chamika Gayashan](https://github.com/chamikathereal) · [Induranga Kawishwara](https://github.com/Induranga-kawishwara)

This guide walks you through making `@deneb-ui` on npm and `deneb-ui` on GitHub look as polished as **Next.js** or **shadcn/ui**.

---

## What we already updated in `core`

| Item | Status |
|------|--------|
| Professional READMEs for all 3 npm packages | Done |
| `homepage` → `deneb.fivora.site` (not GitHub `#readme`) | Done |
| Cleaner npm `description` fields (no author suffix) | Done |
| Expanded `keywords` for npm search | Done |
| `contributors` with GitHub profile URLs | Done |
| npm **provenance** on publish (`--provenance` in CI) | Done |
| Monorepo `README.md` with badges + package table | Done |

**Next step:** publish a new version so npm shows the updated READMEs.

```bash
# In core repo — trigger GitHub Actions "Publish DENEB UI Packages to npm"
# Or locally after bump:
cd packages/deneb-ui && npm publish --access public --provenance
```

---

## Part 1 — npm organization (`@deneb-ui`)

### 1.1 Organization profile

1. Go to [npmjs.com/settings/deneb-ui/profile](https://www.npmjs.com/settings/deneb-ui/profile)
2. Set **Display name:** `DENEB UI`
3. Set **Description:**
   ```
   Visual-first React components and CLI tools for editable commerce storefronts. Built for Next.js and Fivora.
   ```
4. Upload a **square logo** (512×512 PNG) — use your DENEB star icon from GitHub org avatar

### 1.2 Link GitHub to npm (for Provenance badge)

Provenance (the green “Built and signed on GitHub Actions” block on Next.js) requires:

1. npm org linked to GitHub org `deneb-ui`
   - [npmjs.com/settings/deneb-ui/integrations](https://www.npmjs.com/settings/deneb-ui/integrations)
2. Enable **Trusted Publishing** per package:
   - Package → Settings → **Publishing access** → GitHub Actions
   - Repository: `deneb-ui/core`
   - Workflow: `ci-cd.yml`
   - Environment: (leave default or `npm`)
3. Our workflow already has:
   ```yaml
   permissions:
     id-token: write
   ```
   and publishes with `--provenance`

After the next CI publish, packages will show **Provenance** like Next.js.

### 1.3 Package settings checklist

For each of `@deneb-ui/ui`, `@deneb-ui/cli`, `@deneb-ui/create-template`:

| Field | Recommended value |
|-------|-------------------|
| Homepage | Already in `package.json` → docs site |
| Repository | `github.com/deneb-ui/core` |
| Bugs | `github.com/deneb-ui/core/issues` |
| README | Ships from repo on publish |

---

## Part 2 — GitHub organization (`deneb-ui`)

### 2.1 Organization profile README (like shadcn)

Create a **public repo** named `.github` under the `deneb-ui` org:

```
deneb-ui/.github
└── profile/
    └── README.md   ← this renders on github.com/deneb-ui
```

Copy the template from `core/doc/github-org-profile-README.md` into that file.

### 2.2 Pin repositories

On [github.com/deneb-ui](https://github.com/deneb-ui):

1. **Customize your pins** → pin these 2 repos:
   - `core` — “Monorepo: @deneb-ui/ui, CLI, create-template”
   - `ui` — “Documentation site → deneb.fivora.site”

2. Archive or hide `demo-repository` (private demo looks unprofessional on org page)

### 2.3 Repository descriptions & topics

**`deneb-ui/core`**

- Description: `Monorepo for @deneb-ui/ui, @deneb-ui/cli, and @deneb-ui/create-template — visual-first storefront framework`
- Website: `https://deneb.fivora.site`
- Topics: `react`, `nextjs`, `components`, `ui`, `ecommerce`, `fivora`, `typescript`, `cli`, `monorepo`

**`deneb-ui/ui`**

- Description: `Official DENEB UI documentation and component showcase — https://deneb.fivora.site`
- Website: `https://deneb.fivora.site`
- Topics: `documentation`, `nextjs`, `deneb-ui`, `storybook-alternative`

Settings → General → Social preview → upload OG image (1200×630) with DENEB branding.

### 2.4 Verify domain (optional but professional)

1. GitHub org → Settings → Verified domains → add `deneb-ui.org` or `deneb.fivora.site`
2. Add DNS TXT record as instructed
3. Shows **Verified** badge next to org name

---

## Part 3 — Compare to Next.js / shadcn

| Element | Next.js | shadcn | DENEB (target) |
|---------|---------|--------|----------------|
| Centered logo + badges | Yes | Yes | README badges added |
| Docs homepage link | nextjs.org | ui.shadcn.com | deneb.fivora.site |
| npm keywords | Many | Many | Expanded in package.json |
| Provenance | GitHub Actions | — | Enabled in CI |
| Org profile README | — | Yes | Template provided |
| Pinned repos | — | ui, ui repo | Pin core + ui |

---

## Part 4 — Publish checklist (do this once)

- [ ] Merge README + package.json changes to `core` main
- [ ] Run GitHub Actions **Publish DENEB UI Packages to npm** (not dry-run)
- [ ] Confirm npm pages show new README + homepage link
- [ ] Create `deneb-ui/.github` repo with org profile README
- [ ] Pin `core` and `ui` on GitHub org
- [ ] Add repo descriptions + topics on both repos
- [ ] Enable npm Trusted Publishing for all 3 packages
- [ ] Upload npm org logo (512×512)

---

## Team

| Name | GitHub | Role |
|------|--------|------|
| Chamika Gayashan | [@chamikathereal](https://github.com/chamikathereal) | Co-creator & architect |
| Induranga Kawishwara | [@Induranga-kawishwara](https://github.com/Induranga-kawishwara) | Co-creator & architect |

Both should be **owners** on the npm `@deneb-ui` org and **admins** on the GitHub `deneb-ui` org.
