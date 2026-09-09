<p align="center">
  <a href="https://deneb.fivora.site">
    <img src="https://img.shields.io/badge/DENEB_CLI-Storefront_Authoring_Toolkit-6366F1?style=for-the-badge&labelColor=0f172a" alt="DENEB CLI" />
  </a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@deneb-ui/cli"><img src="https://img.shields.io/npm/v/@deneb-ui/cli.svg?style=flat-square&color=6366F1" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/@deneb-ui/cli"><img src="https://img.shields.io/npm/dm/@deneb-ui/cli.svg?style=flat-square&color=6366F1" alt="npm downloads" /></a>
  <img src="https://img.shields.io/badge/Node-%3E%3D18-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js" />
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-emerald?style=flat-square" alt="MIT License" /></a>
</p>

<p align="center">
  <strong>Scaffold, convert, validate, and ship Fivora-ready storefront templates.</strong>
</p>

<p align="center">
  <a href="https://deneb.fivora.site/docs/cli"><strong>CLI Reference</strong></a> ·
  <a href="https://deneb.fivora.site/docs/installation"><strong>Installation</strong></a> ·
  <a href="https://github.com/deneb-ui/core"><strong>GitHub</strong></a>
</p>

---

## Quick start

```bash
# Convert an existing Next.js app (Deneb ARC — default engine)
npx @deneb-ui/cli init

# Preview the transformation plan without writing files
npx @deneb-ui/cli init --explain

# Validate Fivora contract compliance
npx @deneb-ui/cli validate .

# Package a clean upload ZIP
npx @deneb-ui/cli validate --zip
```

Install as a dev dependency:

```bash
npm install -D @deneb-ui/cli
# Command: deneb
```

---

## Commands

| Command | Description |
| :--- | :--- |
| `deneb init` | Run **Deneb ARC** — AST conversion of React/Next.js apps into Fivora-editable templates |
| `deneb init --legacy` | Use the legacy regex converter instead of ARC |
| `deneb init --dry-run` | Simulate conversion; print field paths without writing |
| `deneb init --explain` | Show transformation plan with confidence scores |
| `deneb validate` | Preflight manifest + visual editing contract checks |
| `deneb zip` | Create upload-ready `fivora-template.zip` |
| `deneb doctor` | Environment, dependency, and export diagnostics |
| `deneb add <component>` | Copy DENEB UI components into your project |
| `deneb lab` | Launch local visual editing preview lab |
| `deneb update` | Update `@deneb-ui/*` packages and synced components |

Full reference: [deneb.fivora.site/docs/cli](https://deneb.fivora.site/docs/cli)

---

## What `deneb init` does (ARC)

1. **Scans** your Next.js project — routes, dependencies, reachable pages  
2. **Analyzes** JSX for editable text, images, URLs, collections, CTAs  
3. **Transforms** source via AST — injects preview markers and `site-data` bindings  
4. **Generates** `fivora-template.json` + `site-data.json` with strict self-validation  
5. **Backs up** changed files to `.deneb-backup-*` for safe rollback  

---

## Authors

Created and maintained by **[Chamika Gayashan](https://github.com/chamikathereal)** and **[Induranga Kawishwara](https://github.com/Induranga-kawishwara)**.

<p align="center">
  <sub>MIT © DENEB UI</sub>
</p>
