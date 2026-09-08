# CLI Tool Sources

This directory contains the original TypeScript source files used to generate the bundled CLI tools in `../src/tools/`:

- `template-preflight.ts` -> compiles into `fivora-template-validator.cjs`
- `template-preview-focus-bridge.ts`, `universal-template-theme.ts`, `universal-page-selection.ts` -> compile into `template-preview-focus-bridge.cjs`
- `local-template-lab.cjs` -> compiles into `local-template-lab.cjs`

## Rebuilding Tools
Run:
```bash
npx ts-node build-tools.ts
```
