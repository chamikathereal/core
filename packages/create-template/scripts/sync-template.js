const path = require('node:path');
const fs = require('node:fs');

const rootTemplateDir = path.resolve(__dirname, '..', '..', '..', 'templates', 'nextjs');
const targetTemplateDir = path.resolve(__dirname, '..', 'template');


const FORBIDDEN_DIRS = new Set([
  '.git',
  '.next',
  '.turbo',
  '.cache',
  '.npm',
  '.pnpm-store',
  '__macosx',
  'node_modules',
  'out',
  'dist',
  'build',
  'coverage',
]);

function isForbiddenFile(filename) {
  const lower = filename.toLowerCase();
  return (
    lower.startsWith('.env') ||
    lower.endsWith('.zip') ||
    lower.endsWith('.log') ||
    lower.endsWith('.tsbuildinfo') ||
    lower === '.ds_store' ||
    lower === 'thumbs.db' ||
    lower === 'package-lock.json'
  );
}

function copyClean(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);

    if (entry.isDirectory()) {
      if (!FORBIDDEN_DIRS.has(entry.name.toLowerCase())) {
        copyClean(srcPath, path.join(dest, entry.name));
      }
    } else if (entry.isFile()) {
      if (!isForbiddenFile(entry.name)) {
        // npm strips .gitignore when publishing packages; saving as _gitignore preserves it
        const destName = entry.name === '.gitignore' ? '_gitignore' : entry.name;
        fs.copyFileSync(srcPath, path.join(dest, destName));
      }
    }
  }
}

console.log(`Syncing clean template from ${rootTemplateDir} to ${targetTemplateDir}...`);
if (fs.existsSync(targetTemplateDir)) {
  fs.rmSync(targetTemplateDir, { recursive: true, force: true });
}

copyClean(rootTemplateDir, targetTemplateDir);

// Ensure template package.json points to published versions
const pkgPath = path.join(targetTemplateDir, 'package.json');
if (fs.existsSync(pkgPath)) {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  pkg.name = 'fivora-template-starter';
  if (pkg.dependencies && pkg.dependencies['@deneb-ui/ui']) {
    pkg.dependencies['@deneb-ui/ui'] = '^2.0.0';
  }
  if (pkg.dependencies && pkg.dependencies['@deneb/ui']) {
    pkg.dependencies['@deneb/ui'] = '^2.0.0';
  }
  if (pkg.devDependencies && pkg.devDependencies['@deneb-ui/cli']) {
    pkg.devDependencies['@deneb-ui/cli'] = '^2.0.0';
  }
  if (pkg.dependencies && pkg.dependencies['@fivora/editable-components']) {
    pkg.dependencies['@fivora/editable-components'] = '^1.0.0';
  }
  if (pkg.devDependencies && pkg.devDependencies['@fivora/cli']) {
    pkg.devDependencies['@fivora/cli'] = '^1.0.0';
  }

  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
}

console.log('✓ Clean template synced successfully.');
