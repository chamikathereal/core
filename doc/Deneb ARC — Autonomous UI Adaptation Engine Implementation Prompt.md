# DENEB ARC

## Adaptive Refactoring Compiler for Autonomous Editable UI Conversion

You are acting as a Principal Compiler Engineer, Staff Frontend Infrastructure Engineer, AST Transformation Specialist, and Platform Architect.

You are working on **Deneb**, specifically the CLI command:

```bash
npx @deneb-ui/cli init
```

The system being developed is called:

# Deneb ARC
### Deneb Adaptive Refactoring Compiler

Deneb ARC is an AST-driven adaptive UI refactoring, editable-contract generation, validation, and self-evaluation engine.

Its mission is:

> Take an arbitrary existing React / Next.js frontend project created by another developer, deeply understand its framework, components, styling system, architecture, routes, content, interactions, and UI libraries, and automatically convert the existing website into a fully Deneb/Fivora editable website WITHOUT visually redesigning, restructuring, or damaging the developer's original implementation.

The system must become increasingly capable of handling previously unseen frontend architectures through a controlled self-evaluation and pattern-learning architecture.

---

# 1. PRIMARY OBJECTIVE

Upgrade the current Deneb CLI implementation so that running:

```bash
npx @deneb-ui/cli init
```

inside an arbitrary frontend repository performs an intelligent project-wide conversion.

Target ecosystems include, but are not limited to:

```text
React
Next.js
JavaScript
TypeScript
Tailwind CSS
CSS Modules
Vanilla CSS
SCSS
shadcn/ui
HeroUI
React Bits
Radix UI
Headless UI
Framer Motion
Lucide
custom component libraries
custom design systems
```

The system must NOT depend on one specific starter template or folder structure.

It must adapt to the project it discovers.

---

# 2. NON-NEGOTIABLE PRINCIPLE

Deneb ARC must:

> MAKE THE EXISTING WEBSITE EDITABLE WITHOUT CHANGING ITS ORIGINAL DESIGN.

Preserve as much as technically possible:

```text
DOM hierarchy
layout
spacing
typography
responsive behavior
Tailwind classes
CSS classes
animations
Framer Motion behavior
component hierarchy
icons
SVGs
event handlers
client/server boundaries
navigation
routing
accessibility behavior
hover states
transitions
mobile behavior
third-party UI components
developer formatting/style where practical
```

Do NOT regenerate the frontend from scratch.

Do NOT replace working components simply because another architecture is easier.

Do NOT arbitrarily normalize the developer's source code.

Perform the minimum safe AST transformation necessary.

Deneb is a compiler/refactoring engine, not a page builder that recreates the website.

---

# 3. CURRENT DENEB BEHAVIOR

The existing implementation includes concepts from:

```text
template-converter.cjs
recipe-engine.cjs
```

The current implementation already performs parts of:

```text
AST parsing
text extraction
URL extraction
editable field generation
site-data.json generation
fivora-template.json generation
recipe matching
action/label contract splitting
social URL recognition
fallback generation
backup generation
```

Do NOT destroy working functionality.

First inspect the existing Deneb implementation.

Understand it.

Document its internal pipeline.

Then refactor or extend it incrementally.

Prefer evolution over total replacement unless architectural evidence proves replacement is necessary.

---

# 4. PHASE 1 — DEEP PROJECT DISCOVERY

Before transforming any file, build a complete Project Intelligence Model.

Inspect recursively and intelligently.

At minimum inspect:

```text
package.json
package-lock.json
pnpm-lock.yaml
yarn.lock
bun.lock / bun.lockb
next.config.*
vite.config.*
tsconfig.json
jsconfig.json
tailwind.config.*
postcss.config.*
components.json
eslint configuration
prettier configuration
src/
app/
pages/
components/
layouts/
styles/
public/
assets/
lib/
utils/
hooks/
data/
content/
theme files
CSS files
SCSS files
CSS Modules
global stylesheet files
route files
layout files
configuration files
```

Do not rely only on filenames.

Inspect actual imports and AST relationships.

Create an internal representation similar to:

```ts
interface ProjectProfile {
  framework: string;
  frameworkVersion?: string;
  language: "javascript" | "typescript" | "mixed";
  router?: "next-app" | "next-pages" | "react-router" | "custom";
  packageManager?: string;

  cssSystems: string[];
  componentLibraries: string[];
  animationLibraries: string[];
  iconLibraries: string[];

  aliases: Record<string, string>;

  routes: RouteProfile[];
  components: ComponentProfile[];

  contentSources: ContentSource[];
  assets: AssetProfile[];

  architectureFingerprint: string;
}
```

The discovery engine should answer questions such as:

```text
Is this Next.js App Router or Pages Router?

Which components are server components?

Which components use "use client"?

Where does global CSS enter the application?

Is Tailwind v3 or v4 being used?

Does shadcn components.json exist?

Does the project use HeroUI?

Does it use React Bits?

Are styles local or global?

Are components composed through wrappers?

Are UI sections generated with arrays/maps?

Is content already stored in objects?

Are products fetched from APIs?

Which content is static versus dynamic?

Which routes share a common layout?

Which components repeat across pages?

Which content belongs in common/global scope?

Which content is route-specific?
```

---

# 5. PHASE 2 — DEPENDENCY GRAPH

Create a project-level dependency graph.

Track:

```text
route -> layout
route -> page
page -> section
section -> component
component -> child component
component -> CSS
component -> asset
component -> static data
component -> dynamic API
component -> third-party component
```

Do not treat files independently.

Example:

```text
app/page.tsx
  -> HomeHero
     -> CTAButton
  -> FeaturedProducts
     -> ProductCard
```

If `ProductCard` is reused 25 times, Deneb ARC should understand that transforming its component once can affect 25 instances.

Avoid duplicated schema fields caused by misunderstanding reusable component architecture.

---

# 6. PHASE 3 — AST-BASED SEMANTIC ANALYSIS

Use AST parsing as the primary transformation mechanism.

Do NOT use regex for JSX/TSX transformations when a proper AST representation exists.

Regex may be used only for limited discovery where structurally safe.

Support JSX and TSX.

Detect semantic UI patterns including:

```text
navbar
header
announcement bar
logo
navigation menu
hero section
title
subtitle
description
CTA
button
link
badge
image
gallery
collection
product card
product grid
price
sale price
testimonial
FAQ
feature section
contact section
WhatsApp button
phone link
email link
social links
newsletter
footer
copyright
payment icons
legal links
breadcrumbs
tabs
accordions
dialogs
drawers
carousels
```

Do not rely only on HTML element names.

Use combined signals:

```text
DOM semantics
component names
prop names
class names
text content
href values
route position
parent/child structure
icons
ARIA labels
neighboring nodes
repetition patterns
```

---

# 7. EDITABLE FIELD CLASSIFICATION ENGINE

Every content candidate should be classified.

Potential field types include:

```text
string
textarea
richtext
image
url
email
phone
number
currency
boolean
color
select
array
object
```

Classification must use context.

Example:

```tsx
<img src="/hero.jpg" alt="Summer Collection" />
```

should potentially produce:

```text
heroImage
heroImageAlt
```

instead of treating both as arbitrary strings.

Example:

```tsx
<a href="https://wa.me/947...">
  Chat with us
</a>
```

should produce separate fields:

```text
whatsappUrl
whatsappLabel
```

---

# 8. DENEB EDITABILITY CONTRACT

This requirement is CRITICAL.

A single DOM element must not simultaneously own conflicting editable responsibilities.

Especially:

```text
interactive destination
+
visible text
```

must not share the same preview binding.

Example input:

```tsx
<a href="https://wa.me/123">
  Start a Conversation
</a>
```

Correct output concept:

```tsx
<a
  href={siteData?.content?.home?.whatsappUrl || "https://wa.me/123"}
  data-preview-field-path="home.whatsappUrl"
>
  <span data-preview-field-path="home.whatsappLabel">
    {siteData?.content?.home?.whatsappLabel || "Start a Conversation"}
  </span>
</a>
```

The outer interactive element owns the action/URL contract.

The inner element owns the visible label contract.

---

# 9. DENEB CONTRACT SPLITTER

Build a generalized Contract Splitter.

It must support:

```text
<a>
<button>
<Link>
custom Button components
shadcn Button
HeroUI Button
wrapped links
navigation items
CTA components
phone actions
mailto actions
WhatsApp actions
social links
```

The algorithm must inspect component semantics instead of checking only literal `<a>` elements.

Possible situations include:

```tsx
<Button asChild>
  <Link href="/shop">Shop Now</Link>
</Button>
```

```tsx
<Link href="/shop">
  <Button>Shop Now</Button>
</Link>
```

```tsx
<Button onPress={() => router.push("/shop")}>
  Shop Now
</Button>
```

Understand the actionable element and editable label separately.

Never break event behavior.

---

# 10. STATIC DECORATIVE CONTENT

Icons and decorative elements must generally remain static.

Example:

```tsx
<a>
  <WhatsAppIcon />
  <span>Chat Now</span>
</a>
```

The icon should not unnecessarily become an editable content field.

Deneb should classify:

```text
content
action
decoration
layout
behavior
```

independently.

Where required, mark decorative markup with:

```text
data-preview-static
```

or the appropriate Deneb/Fivora mechanism.

---

# 11. CONTENT ADDRESS GENERATION

Create deterministic, readable field paths.

Prefer:

```text
common.header.logo
common.navigation.shopLabel
common.footer.instagramUrl

home.hero.title
home.hero.subtitle
home.hero.primaryCta.label
home.hero.primaryCta.url

home.featuredProducts.heading

about.hero.title
contact.whatsapp.url
```

Avoid meaningless generated identifiers such as:

```text
text1
text2
field83
component_234_title
```

unless unavoidable.

Names should be semantic and stable across repeated CLI runs.

---

# 12. GLOBAL VS ROUTE-SPECIFIC CONTENT

Recognize shared site content.

Examples likely belonging to:

```text
common
```

include:

```text
logo
main navigation
announcement bar
global WhatsApp number
global phone
social media
footer
copyright
payment methods
```

Route-specific content should live under:

```text
home
about
shop
contact
...
```

Use component usage analysis to infer shared versus local ownership.

---

# 13. REPEATED CONTENT / COLLECTIONS

Do not convert repeated UI into hundreds of unrelated fields when the source structure represents a collection.

Example:

```tsx
products.map(product => ...)
```

Understand whether the collection already has structured data.

When appropriate generate arrays such as:

```json
{
  "featuredProducts": [
    {
      "title": "...",
      "image": "...",
      "price": "...",
      "url": "..."
    }
  ]
}
```

Do not destroy existing API-driven or database-driven dynamic content.

Static editable content and runtime business data must be differentiated.

---

# 14. SAFE FALLBACK GENERATION

Preserve original developer values as fallbacks where appropriate.

Example:

```tsx
{siteData?.content?.home?.hero?.title ?? "Original Hero Title"}
```

Prefer `??` over `||` when empty string, `0`, or `false` could be legitimate editable values.

Determine the correct strategy according to field type.

Do NOT blindly use:

```tsx
value || fallback
```

for every value.

---

# 15. DATA BANK GENERATION

Generate or update Deneb's content data structure.

Example destination:

```text
src/data/site-data.json
```

However do not assume this exact location if Deneb architecture defines another canonical location.

The data bank must be:

```text
deterministic
human readable
stable
versionable
mergeable
schema-compatible
```

Do not erase manually configured existing Deneb fields.

Implement intelligent merge behavior.

---

# 16. FIVORA / DENEB MANIFEST GENERATION

Generate:

```text
fivora-template.json
```

or the canonical Deneb manifest.

The schema must include:

```text
routes
groups
sections
field paths
field types
labels
defaults
constraints
editable metadata
action/label relationships
```

Manifest generation must derive from the actual transformed project.

It must not rely exclusively on prebuilt recipes.

Recipes should accelerate understanding, not limit the system.

---

# 17. RECIPE ENGINE 2.0

Upgrade the recipe concept.

A recipe should represent a reusable transformation pattern rather than an entire hard-coded website.

Example recipe/pattern categories:

```text
Next.js App Router navigation

shadcn Button + Link action splitter

HeroUI Button link handling

React Bits animated heading

Tailwind hero image section

social footer link group

product-card repeated collection

Framer Motion editable heading

responsive navbar
```

Recipes should define:

```ts
interface TransformationRecipe {
  id: string;
  version: string;

  fingerprint: RecipeFingerprint;

  prerequisites: Condition[];

  detectors: Detector[];

  transforms: Transform[];

  validators: Validator[];

  confidenceThreshold: number;

  successfulApplications: number;
  failedApplications: number;
}
```

---

# 18. STRUCTURAL FINGERPRINTING

Create fingerprints for recognized component patterns.

Fingerprint signals may include:

```text
AST node types
JSX hierarchy
component imports
prop names
class token categories
semantic text
interaction type
child count
repetition structure
library origin
route context
```

Do NOT fingerprint exact developer code when unnecessary.

The purpose is to recognize:

> "This unseen component is structurally similar to a pattern Deneb already understands."

---

# 19. CONFIDENCE SCORING

Every transformation should receive a confidence score.

Example:

```text
0.95 — safe automatic transformation

0.82 — likely safe

0.63 — uncertain

0.35 — dangerous / insufficient understanding
```

Create clear thresholds.

Example:

```text
>= 0.85
automatic transformation

0.60 – 0.84
transform only if strong validation is available

< 0.60
leave unchanged and report
```

Never modify uncertain code just to achieve 100% editable coverage.

A safe 92% conversion is better than breaking the website to claim 100%.

---

# 20. SELF-EVALUATION ENGINE

This is a core requirement.

After transformation, Deneb must evaluate itself.

The evaluation pipeline should include, where available:

```text
AST validity
syntax validation
TypeScript validation
build validation
lint validation
import validation
manifest validation
editable-contract validation
duplicate field path detection
orphan field detection
field-to-DOM mapping validation
action/label collision detection
route coverage
component coverage
idempotency
```

If the project supports automated rendering, additionally support:

```text
Playwright smoke tests
route rendering
console error detection
runtime error detection
hydration warning detection
optional visual screenshot comparison
```

---

# 21. DESIGN PRESERVATION VALIDATION

Deneb ARC must attempt to prove that transformation did not redesign the website.

Possible checks:

```text
className equality
style prop equality
DOM structural similarity
CSS file equality where no change was necessary
layout component equality
visual screenshot similarity
responsive screenshot similarity
```

A transformed content binding is acceptable.

Unnecessary class/style/layout changes are not.

Produce a Design Preservation Score.

Example:

```text
Design Preservation: 99.8%
```

Do not fabricate this score.

Calculate it from measurable signals.

---

# 22. EDITABILITY COVERAGE

Produce measurable conversion metrics.

Example:

```text
Detected editable candidates: 164

Safely transformed: 153

Already editable: 4

Skipped dynamic values: 5

Skipped low-confidence values: 2

Action/link contracts validated: 31

Contract collisions: 0

Editable coverage: 95.7%
```

Again, compute actual numbers.

---

# 23. IDEMPOTENCY

Running:

```bash
npx @deneb-ui/cli init
```

multiple times must NOT:

```text
duplicate imports
duplicate wrappers
duplicate data attributes
generate duplicate schema fields
nest spans repeatedly
overwrite intentional developer changes
continually rename fields
```

Second-run behavior should detect existing Deneb integration.

The transformation should converge.

Test this explicitly.

---

# 24. TRANSACTIONAL MODIFICATION

Treat a project conversion like a database transaction.

Before mutation:

```text
analyze
plan
validate transformation plan
create backup
```

Then perform modifications.

If critical validation fails:

```text
abort
or
rollback
```

Never leave the repository half-transformed.

Create a timestamped backup using Deneb's existing backup mechanism.

Prefer additionally writing a machine-readable transformation journal.

Example:

```text
.deneb/
  runs/
    <run-id>/
      project-profile.json
      transform-plan.json
      result.json
      validation.json
```

Do not commit sensitive source code into Deneb metadata.

---

# 25. TRANSFORMATION PLAN

Before writing source files, generate an internal transformation plan.

Example:

```json
{
  "file": "src/components/Hero.tsx",
  "transformations": [
    {
      "node": "...",
      "operation": "extract-text",
      "field": "home.hero.title",
      "confidence": 0.97
    },
    {
      "operation": "split-action-contract",
      "urlField": "home.hero.primaryCta.url",
      "labelField": "home.hero.primaryCta.label",
      "confidence": 0.94
    }
  ]
}
```

Only execute validated plans.

---

# 26. DRY RUN MODE

Add support for something similar to:

```bash
npx @deneb-ui/cli init --dry-run
```

It should print:

```text
detected technology
routes found
components scanned
content candidates
planned transformations
files affected
confidence levels
potential risks
```

without modifying source code.

---

# 27. EXPLAIN MODE

Support debugging/explanation capabilities such as:

```bash
npx @deneb-ui/cli init --explain
```

or equivalent.

For each transformation Deneb should be capable of explaining:

```text
what it detected
why it considered the content editable
which rule matched
which recipe matched
confidence
what source code changed
what contract was generated
which validators passed
```

This is essential for debugging and improving the engine.

---

# 28. SELF-LEARNING ARCHITECTURE

Do NOT implement unsafe uncontrolled self-modifying code.

Deneb must use controlled learning.

The learning lifecycle should be:

```text
OBSERVE
   ↓
FINGERPRINT
   ↓
PLAN
   ↓
TRANSFORM
   ↓
VALIDATE
   ↓
SCORE
   ↓
RECORD EXPERIENCE
   ↓
CLUSTER REPEATED PATTERNS
   ↓
GENERALIZE CANDIDATE RULE
   ↓
TEST AGAINST CORPUS
   ↓
PROMOTE VERIFIED RULE
```

A single successful conversion must NOT automatically become a global transformation rule.

Require evidence across different projects.

---

# 29. EXPERIENCE RECORD

Every transformation can generate an Experience Record.

Example structure:

```ts
interface DenebExperience {
  engineVersion: string;

  framework: string;
  frameworkVersion?: string;

  structuralFingerprint: string;

  libraries: string[];

  transformationType:
    | "text-extraction"
    | "image-extraction"
    | "url-extraction"
    | "contract-split"
    | "collection-conversion"
    | "other";

  recipeId?: string;

  confidenceBefore: number;

  validation: {
    syntaxPassed: boolean;
    typecheckPassed?: boolean;
    buildPassed?: boolean;
    contractPassed: boolean;
    visualPassed?: boolean;
    idempotencyPassed?: boolean;
  };

  outcome:
    | "success"
    | "partial"
    | "failure"
    | "rolled-back";

  anonymizedFeatures: Record<string, unknown>;
}
```

Do NOT store proprietary source code by default.

---

# 30. LOCAL LEARNING

Support a local knowledge layer.

Possible directory:

```text
~/.deneb/
```

or project-local safe metadata.

Store things such as:

```text
successful structural fingerprints
cached framework detection
transformation outcomes
recipe performance
known incompatibilities
```

Local learning helps repeated work without requiring cloud infrastructure.

---

# 31. GLOBAL DENEB PATTERN REGISTRY

Design the architecture so Deneb can later use a centralized Pattern Registry.

This is required if installations on different developers' computers should improve the global Deneb algorithm.

The registry should accept only opt-in telemetry.

Recommended high-level technology:

```text
PostgreSQL
+
optional pgvector
+
API service
+
recipe/version registry
```

Potential tables/entities:

```text
engine_versions
framework_profiles
component_fingerprints
transformation_patterns
recipe_versions
validation_results
experience_records
promotion_candidates
known_failures
```

Do NOT upload entire source repositories by default.

Prefer anonymized structural features.

---

# 32. PATTERN SIMILARITY

In a future phase, Deneb may use similarity search.

Example:

Unknown component:

```text
HeroUI Button
wrapped by custom Action component
with icon + text
```

Deneb generates a structural feature representation.

The Pattern Registry searches for similar successful transformation patterns.

Possible result:

```text
Pattern A similarity: 0.94
Success history: 381 / 389
Framework compatibility: Next.js
HeroUI compatibility: yes
```

The pattern may increase transformation confidence.

Similarity alone must never authorize dangerous code mutation.

Deterministic validation remains mandatory.

---

# 33. RULE PROMOTION SYSTEM

Newly learned rules should move through states:

```text
observed
candidate
experimental
verified
stable
deprecated
```

Example promotion requirements:

```text
candidate:
5 successful independent examples

experimental:
passes regression corpus

verified:
high success rate across multiple architectures

stable:
passes production test suite and version review
```

Choose reasonable thresholds and make them configurable.

---

# 34. FAILURE LEARNING

Learning from failures is equally important.

Record patterns causing:

```text
build failure
TypeScript failure
hydration failure
contract collision
invalid JSX
runtime error
visual regression
field duplication
incorrect common/route classification
```

If a fingerprint repeatedly fails, Deneb should lower its confidence or blacklist a transformation recipe until corrected.

---

# 35. REGRESSION CORPUS

Build a fixture-based test corpus.

Create representative example projects/components for:

```text
Next.js App Router
Next.js Pages Router
React + Vite
Tailwind
Tailwind v4
shadcn
HeroUI
React Bits
CSS Modules
SCSS
Framer Motion
plain JSX
TSX
custom Link
custom Button
nested CTA
social footer
product collection
navbar
hero
contact section
```

Every promoted transformation rule must run against the corpus.

Never introduce a learned rule without regression testing.

---

# 36. AST TRANSFORMATION QUALITY

Use source-preserving AST tooling where practical.

Investigate the best existing tools already used by Deneb before introducing new dependencies.

Potential technologies include:

```text
@babel/parser
@babel/traverse
@babel/types
@babel/generator
recast
jscodeshift
ts-morph
```

Do not install every option.

Choose the smallest appropriate toolchain.

Preserve formatting and comments where reasonably possible.

---

# 37. FRAMEWORK-SPECIFIC ADAPTERS

Create adapters rather than contaminating the core engine with endless framework conditionals.

Conceptual architecture:

```text
core/
  analyzer
  ast
  semantic
  contracts
  planner
  transformer
  validator
  evaluator
  learning

adapters/
  nextjs
  react-vite
  tailwind
  shadcn
  heroui
  react-bits

recipes/
  ...

registry/
  ...
```

The core semantic engine should remain framework-independent where possible.

---

# 38. COMPONENT LIBRARY ADAPTER CONTRACT

Create a standard adapter interface.

Example:

```ts
interface ComponentAdapter {
  id: string;

  detect(project: ProjectProfile): boolean;

  recognizeNode(node: unknown): RecognitionResult | null;

  resolveAction?(node: unknown): ActionBinding | null;

  resolveLabel?(node: unknown): ContentBinding | null;

  validate?(context: ValidationContext): ValidationResult[];
}
```

This should make supporting new libraries straightforward.

---

# 39. USER CODE PRIVACY

Assume developers may run Deneb on commercial private repositories.

Therefore:

```text
analysis should happen locally by default
source should remain local
global learning must be opt-in
telemetry should be documented
secrets must never be collected
.env files must not be uploaded
tokens must not be uploaded
private API URLs should be redacted
customer content should not be uploaded unnecessarily
```

Provide a future configuration such as:

```text
deneb.telemetry = off | anonymous | enhanced
```

Default should be privacy-preserving.

---

# 40. SECURITY SCANNING

Before any remote telemetry is considered, detect and redact:

```text
API keys
tokens
passwords
private keys
authorization headers
environment variables
credentials
connection strings
```

No secret should leave the developer's environment.

---

# 41. CLI EXPERIENCE

The developer experience should feel professional.

Example:

```text
▲ Deneb ARC

Analyzing project...

✓ Next.js 16 detected
✓ TypeScript detected
✓ Tailwind CSS detected
✓ shadcn/ui detected
✓ App Router detected

Scanning architecture...

✓ 12 routes
✓ 84 components
✓ 213 content candidates
✓ 37 interactive actions

Planning editable contracts...

✓ 198 high-confidence transformations
✓ 11 existing dynamic values preserved
⚠ 4 low-confidence candidates skipped

Applying Deneb contracts...

✓ 34 files updated

Validating...

✓ AST
✓ TypeScript
✓ editable contracts
✓ manifest
✓ idempotency
✓ build

Editable coverage: 96.1%
Design preservation: 99.9%

Deneb ARC completed successfully.
```

Use actual detected information.

Never hardcode fake results.

---

# 42. ERROR EXPERIENCE

Errors must be actionable.

Bad:

```text
Transformation failed.
```

Good:

```text
Deneb could not safely determine the navigation behavior in:

src/components/navigation/MobileMenu.tsx

Reason:
Custom Action component combines onClick state mutation and navigation.

Confidence: 0.48

Action:
Component left unchanged.

No source code was damaged.
```

---

# 43. REPORT GENERATION

After each run generate a report such as:

```text
.deneb/report.json
```

and optionally a human-readable summary.

Include:

```text
project profile
files scanned
files changed
fields generated
routes generated
recipes matched
confidence distribution
skipped transformations
warnings
validation results
coverage
design preservation
learning records
engine version
run id
```

---

# 44. COMPATIBILITY PRINCIPLE

Never assume that every visible string should become editable.

Examples that may need to stay static:

```text
technical ARIA values
internal identifiers
CSS tokens
code-generated labels
library internals
status strings controlled by business logic
API result values
validation messages
developer diagnostics
```

Semantic understanding is mandatory.

---

# 45. EXISTING DYNAMIC DATA

If existing code has:

```tsx
{product.title}
```

do NOT replace it with static siteData just because it is visible.

Determine ownership.

Possible classifications:

```text
merchant editable static content
application state
API/business data
CMS content
computed content
user-generated content
technical content
```

Only transform appropriate categories.

---

# 46. DATA FLOW ANALYSIS

Perform lightweight data-flow analysis where needed.

Trace:

```text
props
local variables
imported constants
arrays
objects
map callbacks
destructuring
component parameters
```

Example:

```tsx
const heading = "New Arrivals";

return <h2>{heading}</h2>;
```

Deneb should be capable of determining that this is static extractable content even though the literal is outside JSX.

Be conservative with complex runtime expressions.

---

# 47. NEXT.JS SAFETY

Never accidentally introduce client-only behavior into server components.

Importing Deneb data must remain compatible with:

```text
React Server Components
"use client"
static rendering
SSR
SSG
hydration
```

Do not add hooks unnecessarily.

Do not transform a server component into a client component unless absolutely required and explicitly justified.

Prefer static imports/data bindings where compatible.

---

# 48. IMPORT MANAGEMENT

Insert imports using AST-aware logic.

Detect:

```text
aliases
relative path conventions
existing siteData imports
ESM
CJS
TypeScript
JavaScript
```

Never create duplicate imports.

Never assume:

```ts
@/data/site-data.json
```

exists unless project alias configuration confirms it.

---

# 49. BACKWARDS COMPATIBILITY

Existing Deneb projects must continue working.

Introduce explicit engine/schema versions.

Example:

```json
{
  "denebVersion": "...",
  "arcVersion": "...",
  "schemaVersion": 2
}
```

Provide migration handling where required.

---

# 50. ARCHITECTURE YOU SHOULD AIM FOR

Design approximately around these subsystems:

```text
Project Scanner
     ↓
Technology Detector
     ↓
Dependency Graph Builder
     ↓
AST Parser
     ↓
Semantic UI Analyzer
     ↓
Editable Candidate Classifier
     ↓
Structural Fingerprinter
     ↓
Recipe Matcher
     ↓
Contract Planner
     ↓
Confidence Engine
     ↓
Transformation Planner
     ↓
AST Transformer
     ↓
Manifest Generator
     ↓
Validation Engine
     ↓
Self-Evaluation Engine
     ↓
Experience Recorder
     ↓
Pattern Learning Pipeline
```

The exact implementation may differ if the existing repository architecture suggests a better decomposition.

---

# 51. IMPLEMENTATION PROCESS

Do not immediately begin rewriting large parts of the repository.

Work systematically.

FIRST:

Inspect the current codebase thoroughly.

SECOND:

Produce an architecture assessment including:

```text
existing functionality
existing strengths
existing limitations
technical debt
reusable modules
modules requiring refactoring
missing capabilities
```

THIRD:

Create the target architecture.

FOURTH:

Create an implementation plan divided into safe milestones.

FIFTH:

Begin implementation.

After each meaningful milestone:

```text
run tests
run typecheck
run lint if configured
run relevant fixtures
verify no regression
```

Do not postpone testing until the end.

---

# 52. MILESTONE STRATEGY

Recommended milestones:

## Milestone 1
Project Intelligence Scanner.

## Milestone 2
Unified AST abstraction.

## Milestone 3
Semantic Editable Candidate Engine.

## Milestone 4
Generalized Contract Splitter.

## Milestone 5
Stable field-path generator.

## Milestone 6
Transformation planner + confidence scoring.

## Milestone 7
Manifest/data generation.

## Milestone 8
Validation + idempotency.

## Milestone 9
Design-preservation evaluation.

## Milestone 10
Experience recorder.

## Milestone 11
Recipe Engine 2.0.

## Milestone 12
Global Pattern Registry architecture.

Do not attempt cloud learning before the local deterministic conversion engine is reliable.

---

# 53. DATABASE DECISION

Do not introduce a database into the CLI merely because the word "learning" is used.

Use this distinction:

```text
Local deterministic transformation:
NO database required.

Local per-machine experience:
JSON/SQLite/local cache is sufficient.

Global Deneb learning across developers:
central persistence IS required.
```

For the global Pattern Registry, initially prefer:

```text
PostgreSQL
```

Potentially add:

```text
pgvector
```

when structural similarity retrieval becomes valuable.

Do not add vector search before there is a real dataset and benchmark proving its value.

---

# 54. MACHINE LEARNING / LLM POLICY

Deneb ARC's core transformations must remain deterministic and testable.

An LLM may later assist with:

```text
semantic classification
unknown component interpretation
recipe proposal
field naming suggestions
failure analysis
```

But an LLM should NOT directly rewrite arbitrary source code without deterministic AST validation.

Architecture should remain:

```text
LLM proposes
Deneb planner verifies
AST transformer executes
validators approve
```

Never:

```text
LLM produces arbitrary code
→ blindly overwrite repository
```

---

# 55. DEFINITION OF SUCCESS

The algorithm is successful when an arbitrary compatible frontend project can run:

```bash
npx @deneb-ui/cli init
```

and Deneb can:

```text
understand the project
understand its stack
understand its components
understand its CSS architecture
understand its pages/routes
detect editable content
extract content
generate meaningful editable fields
split conflicting editable contracts
preserve original styling
preserve original behavior
generate Deneb/Fivora manifests
validate the transformed project
rollback unsafe operations
report conversion quality
learn reusable structural patterns
perform better on similar future projects
```

without requiring template-specific hand coding for every new project.

---

# 56. CRITICAL QUALITY REQUIREMENTS

The finished architecture must prioritize these properties in this order:

```text
1. Do not break the developer's website.
2. Preserve original visual design.
3. Preserve application behavior.
4. Produce valid editable contracts.
5. Generate stable semantic field paths.
6. Be idempotent.
7. Validate every transformation.
8. Be explainable.
9. Improve reusable pattern knowledge.
10. Increase editable coverage over time.
```

Never sacrifice priorities 1–7 merely to improve item 10.

---

# 57. WHAT I EXPECT FROM YOU NOW

Start by analyzing the existing Deneb repository and current implementation.

Do not assume my description perfectly matches the code.

Treat the repository as the source of truth.

Your first output should provide:

```text
A. Current architecture assessment

B. Exact execution flow of:
   npx @deneb-ui/cli init

C. Current AST transformation architecture

D. Current recipe-engine architecture

E. Current Fivora contract generation behavior

F. Weaknesses that prevent arbitrary-project support

G. Proposed Deneb ARC architecture

H. Proposed folder/module structure

I. Self-evaluation design

J. Controlled self-learning design

K. Database/backend recommendation

L. Privacy architecture

M. Migration strategy from the existing algorithm

N. Milestone implementation plan

O. Risks and mitigations
```

Then begin implementing the plan starting with the safest foundational milestone.

You are authorized to modify the Deneb core repository, but preserve working behavior and maintain backward compatibility.

Whenever you make a significant architectural decision, explain:

```text
problem
decision
alternatives considered
reason
tradeoff
```

Do not give me a superficial prototype.

Build this as infrastructure intended to eventually process thousands of unrelated frontend repositories.

Think like you are building:

> a specialized compiler for converting existing frontend applications into Deneb-native visually editable applications.

The final system must be maintainable, testable, deterministic, extensible, measurable, privacy-conscious, and production-grade.

# Final Product Name

Use:

**Deneb ARC**

Expanded name:

**Deneb Adaptive Refactoring Compiler**

Technical description:

**AST-driven adaptive UI refactoring, editable-contract compilation, validation, and self-evaluation engine.**