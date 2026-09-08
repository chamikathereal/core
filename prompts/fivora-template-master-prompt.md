# Fivora Template Master Implementation Prompt

Copy everything inside the block into an AI coding agent. Attach or paste the complete Fivora Template Developer Guide and give the agent access to the template source directory. This prompt is designed to be pasted unchanged; the agent must discover project-specific routes and fields instead of forcing a generic schema.

```text
You are the implementation owner for converting the website in the current template workspace into a production-ready Fivora template. Read the complete attached Fivora Template Developer Guide before taking action. Inspect the whole template repository, implement every required change, validate the result, and produce a clean source ZIP. Do not stop after an audit, explanation, partial page, or first successful build.

OUTCOME
Deliver one strict manifest-v2 Next.js static template that works as either Standard or Premium. Both tiers use the committed base theme and support Fivora project manual design overrides. Premium additionally supports AI-assisted design generation. Preserve the existing design, responsiveness, animations, and legitimate assets unless a targeted contract or static-export correction is necessary.

DISCOVERY — DO THIS BEFORE EDITING
1. Locate the template root and Fivora authoring-kit root from the workspace. Do not ask for paths that can be discovered.
2. Read fivora-template.json, package.json, lock file, next.config.*, TypeScript/ESLint config, the manifest-declared site data file, root layout, every route, every shared component, header, footer, navigation, forms, cards, lists, galleries, carousels, modals, and the existing preview provider.
3. Inventory every merchant-visible text, image, link label, destination, action, contact/social value, list, price, option, and boolean.
4. Produce internal tables for: route -> rendered components -> content paths; list path -> item shape -> demo/min/max counts; image placement -> field path; and selected page -> allowed destinations. Use those tables to implement the complete conversion.

CONTENT CONTRACT
1. Derive siteData.content from this design. Do not impose a generic home/about/services/products/gallery schema when the design differs.
2. Every merchant-visible or behavioral value has one source below siteData.content. Truly shared values belong under content.common.
3. Realistic demo values exist only in the manifest-declared site data JSON. Delete duplicated demo constants and code fallbacks such as title || 'Demo Company' or services.length ? services : DEMO_SERVICES.
4. Use optional/nullable runtime types and defensive helpers. Incoming validation data may contain null, empty strings, false, zero, empty objects, empty arrays, missing optional fields, and replaced arrays.
5. Model one repeated visual/business entity as one atomic object-list item. Never use parallel positional arrays. Primitive image or text lists are allowed only when the item is truly a single primitive.
6. System IDs are not merchant questions. Put nonvisual ID wildcard paths in visualEditing.controlOnlyPaths, use IDs only as internal keys/references, and use current indexes in preview paths.

MANIFEST
1. Keep fivora-template.json at package root.
2. Use framework nextjs-static-export, version 2, visualEditing contractVersion 1, mode strict, outputDirectory out, a real siteDataFile, install/build commands, and the configured basePathEnvVar.
3. Declare every page with a lowercase stable ID and canonical static route. Page ID, editorSchema pageKey, requirements.requiredPages values, route-root data-preview-page-key, and selected-page filtering must agree exactly.
4. Define an accurate editor schema with useful labels/types/options/required rules, list minItems/maxItems, and recommendedWidth/recommendedHeight for every image field. Keep demo cardinality within those bounds. Do not author generated rendered-content metadata.
5. Retain or add themeSchema for precise manual design controls on every tier. Read merged flat theme values from siteData.template.structure.theme, expose CSS variables with safe defaults, and consume them in the actual design. Do not create a separate Standard code branch.

LIVE PREVIEW
1. Wrap the complete site, including header and footer, in SiteDataProvider.
2. Editable UI must read through useSiteData, never a direct JSON UI import.
3. Preserve these exact protocol strings: FIVORA_PREVIEW_SITE_DATA, FIVORA_PREVIEW_READY, and FIVORA_PREVIEW_FOCUS_PAGE.
4. Validate parent message source/origin, announce readiness, deep-merge objects, replace arrays, and focus the exact field target.
5. Use the same components for local demo, merchant editor, admin test, and published export.

EXACT VISUAL-EDITING MARKERS
1. Put data-preview-page-key on each real route root.
2. Put data-preview-field-path on the smallest real visible or behavioral leaf for every editable concrete path.
3. Put data-preview-list-path on each collection container and keep it mounted at zero items.
4. Put data-preview-item-path on each current item. Use dynamic indexed JSX paths such as services[${index}].name. Never use IDs or fixed/sparse demo indexes.
5. Keep targets mounted for cleared strings, empty images, false, zero, required controls, and empty lists. Use neutral empty slots, never demo-business restoration.
6. data-preview-static is only for the smallest genuinely fixed element. NEVER place data-preview-field-path, data-preview-list-path, or data-preview-item-path on a data-preview-static element or anywhere below a data-preview-static ancestor. Never blanket-mark wrappers, pages, layouts, or the HTML/body root static.
7. Never create hidden marker banks, aria-hidden targets, display:none targets, fake duplicates, compiler injection, or post-build HTML rewriting to satisfy validation.
8. For editable links, model and mark label and destination separately when both are editable. For images, mark the real image slot and keep local public assets base-path safe.

SELECTED PAGES
1. requirements.requiredPages is the runtime source of truth.
2. Filter every route destination in headers, heroes, body links, cards, teasers, menus, and footers. Generated HTML must never contain href to an unselected manifest page.
3. Put data-target-page="<exact-manifest-page-id>" on every complete route-control wrapper. Never infer its destination from button text or business-category words.
4. Omit a CTA when its target page is unselected. If strict marker coverage requires a non-navigation fallback wrapper, keep the exact data-target-page on that wrapper so Fivora hides it completely. Never leave visible button-styled fallback text, href="#", or a disabled route control.
5. Keep content genuinely consumed by a selected route. Home-page cards may remain editable even when their dedicated listing page is absent; hide only their controls that navigate to that page. When the page is selected, render those controls again.

STATIC BUILD
1. Configure output: 'export', trailingSlash, images.unoptimized: true, and basePath/assetPrefix from the manifest environment variable.
2. Prefix local public assets and imperative navigation with the base path. Test a non-empty base path.
3. Remove runtime-only APIs, Server Actions, middleware, ISR, runtime database calls, and ungenerated dynamic routes.
4. Do not weaken TypeScript, lint, security, visual markers, or the manifest to force a green build.

PUBLISHED SEO AND TRACKING OWNERSHIP
1. Render meaningful merchant content in semantic exported HTML. Use one descriptive page heading, logical heading levels, crawlable anchor links between selected pages, and accurate image alt text.
2. Keep only safe fallback title/description metadata in the template. The Fivora writes reviewed per-page metadata, canonical URLs, robots rules, social tags, favicon, Search Console verification, structured business data, robots.txt, and sitemap.xml during publishing.
3. Never hardcode or runtime-fetch tenant Google Analytics IDs, Meta/Facebook Pixel IDs, verification tokens, canonical hosts, noindex rules, sitemaps, or tenant structured data in the template. Preview and unpublished builds must not send tenant tracking events.

VERIFICATION — ALL ARE REQUIRED
1. Install from the lock file or generate/update the lock file deterministically.
2. Run lint.
3. Run the normal static build.
4. Run a build with NEXT_PUBLIC_SITE_BASE_PATH=/template-test.
5. From the Fivora authoring-kit directory, run npm run validate -- <template-directory> without --skip-build or --skip-install. This must pass package-policy, selected-page probe, and empty-state phases.
6. Explicitly inspect exported HTML for exact page/field/list/item markers, static-ancestor violations, and links to unselected routes.
7. Test lists at zero, one, min, max when present, and add/duplicate/remove/reorder semantics. Test nulls, missing IDs, cleared text/images, false, zero, and equal visible values at different paths.
8. Run npm run package:template -- <template-directory> --output <package-name>.zip from the authoring kit. Upload only the ZIP it publishes after fresh-extraction validation.
9. Ensure the ZIP just produced is the file reported for upload; do not reuse an older archive.

FINAL RESPONSE
Lead with whether the template is ready. Report: files changed; content-path/page/list/image audit summary; Standard/Premium behavior; exact install/lint/build/base-path/contract-validation results; ZIP absolute path; ZIP integrity/inventory result; and any honest remaining blocker. A partial implementation, recommendations-only answer, validator bypass, or unverified ZIP is not complete.
```
