'use strict';

/** Verifies that a second `init` run converges: no duplicated markers or fields. */

const fs = require('fs');
const os = require('os');
const path = require('path');
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

function snapshot(root) {
  const files = {};
  (function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.deneb')) continue;
      const abs = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(abs);
      else if (/\.(tsx|jsx|ts|js|json)$/.test(entry.name)) {
        files[path.relative(root, abs).replace(/\\/g, '/')] = fs.readFileSync(abs, 'utf8');
      }
    }
  })(root);
  return files;
}

function countMarkers(code) {
  return (code.match(/data-preview-(?:field-path|list-path|item-path|page-key)/g) || []).length;
}

const fixture = process.argv[2] || path.join(__dirname, '..', 'src', 'arc', '__fixtures__', 'next-app-storefront');
const work = fs.mkdtempSync(path.join(os.tmpdir(), 'arc-idem-'));
const projectDir = path.join(work, 'project');
copyDir(fixture, projectDir);

const quiet = console.log;
console.log = () => {};
runDenebArc(projectDir, 'idem-store', { telemetry: 'off' });
const first = snapshot(projectDir);
runDenebArc(projectDir, 'idem-store', { telemetry: 'off' });
const second = snapshot(projectDir);
console.log = quiet;

let drift = 0;
for (const file of Object.keys(first)) {
  if (first[file] === second[file]) continue;
  const before = countMarkers(first[file]);
  const after = countMarkers(second[file]);
  drift += 1;
  console.log(`DRIFT ${file}  markers ${before} -> ${after}`);
  if (before !== after) {
    console.log('  marker count changed on second run (non-idempotent)');
  }
}

const providerCount = Object.values(second).filter((c) => typeof c === 'string')
  .reduce((n, c) => n + (c.match(/<SiteDataProvider/g) || []).length, 0);
const importCount = Object.values(second)
  .reduce((n, c) => n + (c.match(/from "@deneb-ui\/ui"/g) || []).length, 0);

console.log(`\nfiles compared: ${Object.keys(first).length}`);
console.log(`files that drifted on second run: ${drift}`);
console.log(`SiteDataProvider mounts: ${providerCount} (expect 1)`);
console.log(`@deneb-ui/ui imports: ${importCount}`);
console.log(drift === 0 && providerCount === 1 ? 'IDEMPOTENT: PASS' : 'IDEMPOTENT: FAIL');
