# Deneb ARC — Algorithm Improvement Plan (Fivora-best output)

**Status:** execution plan  
**Target:** every `npx @deneb-ui/cli init` produces a ZIP that Fivora ingest accepts **and** a merchant can edit (content + style + fonts) without redesigning the site.  
**Source of truth:** `cli/deneb-cli/src/arc/` · Fivora contract port in `fivora-contract.cjs` · runtime in `@deneb-ui/core` / `@deneb-ui/ui`  
**Do not:** rewrite ARC from scratch, replace Recast, activate a global LLM rewriter, or put 50 font files inside `@deneb-ui/ui`.

---

## 1. Definition of “best Fivora output”

A converted project is successful only if **all** of these are true:

| Layer | Pass condition |
| --- | --- |
| Ingest | `deneb validate .` matches Fivora strict contract: markers, unique paths, action/label split, page coverage, SiteDataProvider, static export |
| Preview | Click any visible heading/paragraph/CTA/card in the iframe → Fivora popover can bind it |
| Style | `data-preview-style-target` + `data-preview-style-type` exist; `FIVORA_PREVIEW_STYLE_PATCH` changes CSS variables with 0ms lag |
| Persist | Merchant edits land in `site-data.json` `content` **and** `styles` (plus `theme.headingFont` / `bodyFont`) |
| Design | Original `className`, layout, and Tailwind/CSS unchanged except minimum AST bindings |
| Repeat | Second `deneb init` is idempotent (no duplicate wrappers/imports/style markers) |
| Learn | Fingerprints from previous runs **change decisions** on the next unrelated repo |

Today (ARC 1.1): content + style-bind + theme font seed + local fingerprint boost/skip. Global registry still off. Section style-bind and design-preservation of font metrics remain open.

---

## 2. Non-negotiable rules

1. Minimum AST change. Never regenerate pages.
2. Three contracts stay split: **content** / **action** / **style**.
3. Do not rewrite Tailwind to “make it editable.” Overlay `--deneb-*` variables.
4. One preview protocol: `FIVORA_PREVIEW_SITE_DATA` + `FIVORA_PREVIEW_STYLE_PATCH`. No second bridge.
5. Fonts install into the **host project**, not into the UI package.
6. Planner may boost/skip from local fingerprint stats; it must not upload source.
7. Recast + `@babel/parser` stay. Extend `ast.cjs`; do not switch to ts-morph.

---

## 3. Current baseline (what we keep)

```text
runDenebArc
  scanner → semantic → planner → transformer
  manifest + fivora-contract audit
  next-config static export
  learning.recordExperience (write-only)
  recipes-v2 (optional --recipe / signature, max +0.08 confidence)
```

Transformer already applies `auto` **and** `validate` (only `skip` is ignored). Supported ops:

```text
split-action-contract, extract-url, extract-image, extract-alt,
extract-placeholder, extract-text, wrap-text-span, collection-conversion
```

**Missing ops:** `style-bind`, `font-plan`.  
**Missing loop:** `fingerprints.json` is never read by `planner.cjs`.

---

## 4. Phase plan

Work in order. Do not start Phase 4 until Phase 1 is green on fixtures. Each phase has files, tests, and a Fivora “done when.”

---

### Phase 1 — Ingest-perfect content (Fivora will not reject)

**Goal:** converted fixtures pass strict contract with **zero** uncovered visible text and zero action/label collisions.

| Work | Where |
| --- | --- |
| Treat leftover visible text as a **hard fail** in ARC report (not only a warning) when `--strict` or when packaging | `index.cjs`, `printer.cjs` |
| Expand wrap-text-span for remaining heading/button/label cases the audit still flags | `semantic.cjs`, `transformer.cjs`, `ast.cjs` |
| Control-only must list every unbound `content` path ARC wrote | `manifest.cjs`, `fivora-contract.cjs` |
| `validate` decision: if node not found, do not count as applied success | already partly there; fail the run if `validate` ops > 0 after apply **or** auto-apply only after fingerprint verified |
| Rebuild packaged `deneb-template-validator.cjs` so local validate = Fivora preflight | `tool-sources/template-preflight.ts` + `style-validation.ts` |

**Tests:** existing 20 ARC tests stay green; add “uncovered text === 0” on `next-app-basic`, `next-app-storefront`, `next-pages-basic`.

**Done when:** `deneb init` on those fixtures + `deneb validate .` exits 0 without hand edits.

---

### Phase 2 — Style-bind compiler (Fivora Style tab can hit converted DOM)

**Goal:** every content field ARC binds also gets a style address, without changing look.

**New modules (do not fork a second converter):**

```text
cli/deneb-cli/src/arc/style-candidates.cjs
cli/deneb-cli/src/arc/ast.cjs          → jsxStyleAttrs(stylePath, kind)
cli/deneb-cli/src/arc/planner.cjs      → style-bind-* ops after content plan
cli/deneb-cli/src/arc/transformer.cjs  → add to `supported` Set
cli/deneb-cli/src/arc/manifest.cjs     → siteData.styles[path]
cli/deneb-cli/src/arc/fivora-contract.cjs → optional style-target coverage (warn then strict)
```

**Kind mapping (deterministic):**

| Node | `styleType` | `stylePath` |
| --- | --- | --- |
| text/heading/span with field-path | `text` | same as field path |
| collection item card/article | `card` | `${itemPath}.card` |
| visual button (not href owner) | `button` | field path of label or dedicated cta style path |
| grid/list container | `grid` | `${listPath}.grid` |
| section / `data-design-section` | `section` | `${sectionName}.section` |

**Rules:**

- Skip if `data-preview-style-target` already exists (idempotent).
- Skip `@deneb-ui/ui` Editable* if already marked.
- Never put style-target on the action URL node.
- Do **not** strip original classes. Empty `styles[path] = {}` is enough for Fivora to patch.
- Later (Phase 2b): optional Tailwind token extraction (`text-4xl` → `fontSize`) at confidence ≥ 0.9 only.

**Tests:** storefront fixture HTML/source contains `data-preview-style-type="text"` on hero title and `="card"` on product items; second init does not duplicate attributes.

**Done when:** a converted storefront in Fivora preview responds to:

```js
postMessage({
  type: 'FIVORA_PREVIEW_STYLE_PATCH',
  targetPath: 'home.heroTitle',
  styleType: 'text',
  properties: { fontSize: '40px' }
}, '*')
```

---

### Phase 3 — Font plan (typography actually loads on Fivora hosting)

**Goal:** converted apps use registry ids and self-host or CDN-load the fonts Fivora will display.

| Work | Where |
| --- | --- |
| Discover fonts from theme, CSS snapshot, `next/font`, class tokens | `font-plan.cjs` (new), `semantic.cjs` snapshot |
| Map through `lookupFontDefinition()` | `@deneb-ui/core` |
| Write `theme.headingFont` / `bodyFont` | `manifest.cjs` |
| Pass `fontIds` into `installProjectFonts()` after apply (not dry-run) | `index.cjs` — CLI init already installs defaults; ARC must pass **planned** ids |
| `--skip-install` / `DENEB_SKIP_FONTS=1` still skip download | existing |

**Do not** `--all` (53 packages) on every init. Use discovered ∪ `DEFAULT_PROJECT_FONT_IDS`.

**Tests:** site-data theme fonts are registry-resolvable; layout import of `deneb-fonts.css` is idempotent.

**Done when:** Fivora preview of a converted app renders Inter/Playfair (or discovered family) without a blank/system fallback.

---

### Phase 4 — Close the learning loop (algorithm improves on the *next* project)

**Goal:** `fingerprints.json` and recipes change planner output.

| Work | Where |
| --- | --- |
| `loadFingerprintBoost(fingerprint)` | `learning.cjs` |
| If `verified` and fail === 0 → +0.05 to +0.12 (cap 0.99) | `planner.cjs` |
| If `deprecated` → `decision = skip` unless explicit `--recipe` | `planner.cjs` |
| Increment recipe `successfulApplications` on contract-pass | `recipes-v2.cjs` / recipe-engine |
| `deneb save-recipe` remains the **human** promotion path for site-type packs | already exists |
| Never send source, `.env`, or customer copy to a network | keep `registryArchitecture.enabled = false` until a real corpus exists |

**Promotion thresholds (already in `promoteState`):** keep 5 success → candidate, 25/0 fail → verified, 3 fails dominating → deprecated. **Wire them into decideThreshold.**

**Tests:** mock fingerprint store: same candidate auto vs skip based on state.

**Done when:** converting fixture A, then fixture B, shows a measurable confidence/decision change attributable to fingerprints (explain mode prints `fingerprintBoost`).

---

### Phase 5 — Library adapters (Fivora’s real-world failures)

**Goal:** shadcn / HeroUI / Radix / Next `Link` never collide action + label.

| Adapter | File |
| --- | --- |
| Button `asChild` + Link | `adapters.cjs` (extend) |
| HeroUI `onPress` navigation | `adapters.cjs` |
| Next.js `Link` vs `<a>` | already partly there — cover remaining |
| Framer Motion wrappers: bind inner text, do not unwrap motion | `semantic.cjs` skip rules |

**Tests:** fixture with shadcn Button asChild (already have one — keep it failing-closed).

**Done when:** storefront + a shadcn-header fixture: 0 action/label collisions.

---

### Phase 6 — Collections + dynamic data (catalogs on Fivora)

**Goal:** product grids from `map()` are list/item editable; fetch/API arrays are **not** invented site-data rows.

| Work | Rule |
| --- | --- |
| Static arrays in source → collection-conversion (exists) | keep |
| `data.map` from props/fetch → list marker only, no fake products in site-data | new skip + explain |
| Item style-bind `${list}[*].card` | Phase 2 |

**Done when:** storefront fixture products stay editable; a pages fixture that maps `props.products` does not duplicate 50 dummy products into site-data.

---

### Phase 7 — Build + ingest parity

**Goal:** catch static-export breakage before upload.

| Work | Notes |
| --- | --- |
| Optional `deneb init --verify-build` runs `next build` | slow; off by default; on in CI |
| Packaged validator includes `validateTemplateStyleContract` | Phase 1 leftover |
| ARC report maps each Fivora error to `file:line` | `printer.cjs` + `fivora-contract` loc |

**Done when:** a broken `next.config` is reported in init, not only after Fivora upload.

---

### Phase 8 — Fivora editor surface (outside ARC, required for “perfect”)

ARC cannot replace Fivora UI. Track as a **platform** milestone:

- `LocalTemplateVisualEditPopover` sends `FIVORA_PREVIEW_STYLE_PATCH` on slider drag
- Debounced commit into `siteData.styles`
- Font dropdown options = `DENEB_FONT_REGISTRY` from `@deneb-ui/core`

Without this, merchants still only edit text even if ARC is perfect.

---

## 5. Suggested file layout after the plan

```text
cli/deneb-cli/src/arc/
  index.cjs                 hook font-plan + strict uncovered-text
  planner.cjs               fingerprint boost + style-bind ops
  transformer.cjs           style-bind in supported set
  ast.cjs                   jsxStyleAttrs
  style-candidates.cjs      NEW
  font-plan.cjs             NEW
  learning.cjs              loadFingerprintBoost (read path)
  manifest.cjs              styles + theme fonts
  fivora-contract.cjs       style coverage (phased: warn → error)
  __tests__/arc.test.cjs    extend fixtures
```

No new top-level engine. No parallel `arc-v2` folder.

---

## 6. Verification matrix

| Check | Command / method |
| --- | --- |
| Unit | `npm test` in `@deneb-ui/cli` (ARC fixtures) |
| Fonts | `@deneb-ui/core` font tests + `deneb fonts list` |
| Contract | `deneb validate .` on converted fixture dirs |
| Idempotency | init twice, git diff empty of duplicates |
| Style patch | jsdom or focus-bridge unit: STYLE_PATCH sets `--deneb-font-size` |
| Graph | `graphify update .` after ARC file changes |
| Fivora | upload ZIP from `validate-and-zip`; click hero + card in lab |

---

## 7. Milestone sequence (do not parallelize 1–4)

```text
M1  Ingest-green fixtures          (Phase 1)
M2  style-bind + styles{}          (Phase 2)
M3  font-plan into init            (Phase 3)
M4  planner reads fingerprints     (Phase 4)
M5  adapters + collections         (Phase 5–6)
M6  validator rebuild + --verify-build (Phase 7)
M7  Fivora popover contract        (Phase 8, Fivora-main)
```

Bump `ARC_VERSION` in `version.cjs` on M2 and M4 (behavior change).

---

## 8. Explicitly out of scope

```text
LLM rewriting JSX
Uploading customer repos to a global registry
Installing --all Google Fonts on every init
Replacing developer cards with EditableProductCard unless layout-identical
Changing Fivora ingest JSON independently of fivora-contract.cjs
```

---

## 9. One-sentence strategy

**Keep the current compiler; teach it to emit style+font addresses, fail locally on the same rules Fivora uses, and feed fingerprint stats back into the next `init`.**

That is the complete improvement plan. Execute M1 → M7 in order.