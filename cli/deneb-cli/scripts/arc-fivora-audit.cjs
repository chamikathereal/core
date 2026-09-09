'use strict';

/**
 * Runs ARC against a fixture copy and audits the result with the ported
 * Fivora strict contract rules. Reports exactly what the platform would reject.
 */

const fs = require('fs');
const os = require('os');
const path = require('path');

const contract = require('../src/arc/fivora-contract.cjs');
const { runDenebArc } = require('../src/arc/index.cjs');

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(from, to);
    else fs.copyFileSync(from, to);
  }
}

function collectSources(root) {
  const out = [];
  (function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.deneb')) continue;
      const abs = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(abs);
      else if (/\.(tsx|jsx|ts|js)$/.test(entry.name)) {
        out.push({ rel: path.relative(root, abs).replace(/\\/g, '/'), code: fs.readFileSync(abs, 'utf8') });
      }
    }
  })(root);
  return out;
}

/** Resolves each manifest page to its source file for both Next.js routers. */
function routeFileMap(root, pages) {
  const map = {};
  for (const page of pages || []) {
    const segment = page.route === '/' ? '' : String(page.route || '').replace(/^\//, '');
    const candidates = [];
    for (const base of ['src/app', 'app']) {
      for (const ext of ['tsx', 'jsx', 'js']) {
        candidates.push(segment ? path.join(base, segment, `page.${ext}`) : path.join(base, `page.${ext}`));
      }
    }
    for (const base of ['src/pages', 'pages']) {
      for (const ext of ['tsx', 'jsx', 'js']) {
        candidates.push(path.join(base, `${segment || 'index'}.${ext}`));
        if (segment) candidates.push(path.join(base, segment, `index.${ext}`));
      }
    }
    for (const candidate of candidates) {
      if (fs.existsSync(path.join(root, candidate))) {
        map[page.id] = candidate.replace(/\\/g, '/');
        break;
      }
    }
  }
  return map;
}

function main() {
  const fixture = process.argv[2] || path.join(__dirname, '..', 'src', 'arc', '__fixtures__', 'next-app-basic');
  const work = fs.mkdtempSync(path.join(os.tmpdir(), 'arc-audit-'));
  const projectDir = path.join(work, 'project');
  copyDir(fixture, projectDir);

  const silence = console.log;
  console.log = () => {};
  let result;
  try {
    result = runDenebArc(projectDir, 'audit-store', { telemetry: 'off' });
  } finally {
    console.log = silence;
  }

  const manifest = JSON.parse(fs.readFileSync(path.join(projectDir, 'fivora-template.json'), 'utf8'));
  const siteData = JSON.parse(
    fs.readFileSync(path.join(projectDir, manifest.siteDataFile), 'utf8')
  );

  const sources = collectSources(projectDir);
  const allMarkers = [];
  const pageMarkersByFile = {};
  const placementErrors = [];
  const collisionErrors = [];
  const uncoveredText = [];

  for (const source of sources) {
    const { markers } = contract.extractMarkers(source.code, source.rel);
    allMarkers.push(...markers);
    const pageKeys = markers.filter((m) => m.kind === 'page').map((m) => m.value);
    if (pageKeys.length) pageMarkersByFile[source.rel] = pageKeys;
    placementErrors.push(...contract.auditMarkerPlacement(source.code, source.rel));
    collisionErrors.push(...contract.auditActionLabelCollision(source.code, source.rel));
    uncoveredText.push(...contract.findUncoveredVisibleText(source.code, source.rel));
  }

  const coverage = contract.auditPathCoverage({
    content: siteData.content,
    editorSchema: manifest.editorSchema,
    markers: allMarkers,
    controlOnlyPaths: manifest.visualEditing?.controlOnlyPaths || [],
  });

  const schemaErrors = contract.auditSchemaUniqueness(manifest.editorSchema);
  const pageErrors = contract.auditPageCoverage({
    pages: manifest.pages,
    routeFiles: routeFileMap(projectDir, manifest.pages),
    pageMarkersByFile,
  });
  const runtimeErrors = contract.auditPreviewRuntime(sources.map((s) => s.code));

  const controlOnlyUnknown = [];
  const knownForControl = [
    ...coverage.contentInventory.fieldPatterns,
    ...coverage.contentInventory.concreteFields,
  ];
  for (const declared of manifest.visualEditing?.controlOnlyPaths || []) {
    const canonical = contract.canonicalizeMarkerPath(declared);
    if (!canonical || !knownForControl.some((k) => contract.wildcardPath(k) === contract.wildcardPath(canonical))) {
      controlOnlyUnknown.push(`controlOnlyPaths contains unknown editable field path "${declared}".`);
    }
  }

  const groups = {
    'PATH COVERAGE (site-data field with no DOM marker)': coverage.errors,
    'CONTROL-ONLY DECLARATIONS': controlOnlyUnknown,
    'MARKER PLACEMENT': placementErrors,
    'ACTION/LABEL COLLISION': collisionErrors,
    'SCHEMA UNIQUENESS / TYPES': schemaErrors,
    'PAGE COVERAGE': pageErrors,
    'PREVIEW RUNTIME': runtimeErrors,
    'UNCOVERED VISIBLE TEXT (strict-mode error)': uncoveredText.map(
      (f) => `${f.filePath}:${f.line} <${f.tag}> text "${f.text.slice(0, 60)}" not covered by field-path or static.`
    ),
  };

  let total = 0;
  for (const [label, findings] of Object.entries(groups)) {
    const unique = [...new Set(findings)];
    total += unique.length;
    console.log(`\n=== ${label}: ${unique.length} ===`);
    for (const finding of unique.slice(0, 25)) console.log(`  - ${finding}`);
    if (unique.length > 25) console.log(`  ... ${unique.length - 25} more`);
  }

  console.log(`\nARC self-report: outcome=${result.outcome} coverage=${result.coverage?.editableCoverage} design=${result.designPreservation}`);
  console.log(`FIVORA STRICT VIOLATIONS: ${total}`);
  console.log(`workdir: ${projectDir}`);
}

main();
