'use strict';

const fs = require('node:fs');
const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');

const packages = [
  ['package.json', 'deneb-ui-framework-monorepo'],
  ['packages/deneb-core/package.json', '@deneb-ui/core'],
  ['packages/deneb-ui/package.json', '@deneb-ui/ui'],
  ['cli/deneb-cli/package.json', '@deneb-ui/cli'],
  ['packages/create-template/package.json', '@deneb-ui/create-template'],
];

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(rootDir, relativePath), 'utf8'));
}

const versions = packages.map(([file, expectedName]) => {
  const pkg = readJson(file);
  if (pkg.name !== expectedName) {
    console.error(`Lockstep failed: ${file} name is ${pkg.name}, expected ${expectedName}`);
    process.exit(1);
  }
  return { file, name: pkg.name, version: pkg.version };
});

const canonical = versions[0].version;
const drift = versions.filter((entry) => entry.version !== canonical);
if (drift.length) {
  console.error('Release lockstep failed. All publishable packages must share one version:\n');
  for (const entry of versions) {
    console.error(`  ${entry.name}: ${entry.version} (${entry.file})`);
  }
  process.exit(1);
}

console.log(`Release lockstep ok: ${canonical}`);
