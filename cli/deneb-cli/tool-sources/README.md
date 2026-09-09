# CLI Tool Sources

This directory contains the original TypeScript source files used to generate the bundled CLI tools in `../src/tools/`:

- `template-preflight.ts` -> compiles into `deneb-template-validator.cjs`
- `template-preview-focus-bridge.ts`, `universal-template-theme.ts`, `universal-page-selection.ts` -> compile into `template-preview-focus-bridge.cjs`
- `local-template-lab.cjs` -> compiles into `local-template-lab.cjs`

## Rebuilding Tools
From `cli/deneb-cli`:

```bash
npm run build:tools
```

The standalone validator bundle (`deneb-template-validator.cjs`) requires the remaining `src/common/*` Fivora preflight modules. Until those sources live in this repo, keep the checked-in bundle and do not treat a failed rebuild as a release blocker.
