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

const rootPkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', '..', '..', 'package.json'), 'utf8'));
const denebRange = `^${rootPkg.version}`;

function pinDenebDeps(pkgPath) {
  if (!fs.existsSync(pkgPath)) return;
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  pkg.name = 'deneb-template-starter';
  pkg.dependencies ||= {};
  pkg.devDependencies ||= {};
  delete pkg.dependencies['@deneb/ui'];
  delete pkg.dependencies['@fivora/editable-components'];
  delete pkg.devDependencies['@fivora/cli'];
  pkg.dependencies['@deneb-ui/ui'] = denebRange;
  pkg.devDependencies['@deneb-ui/cli'] = denebRange;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
}

pinDenebDeps(path.join(rootTemplateDir, 'package.json'));
pinDenebDeps(path.join(targetTemplateDir, 'package.json'));

console.log(`✓ Clean template synced successfully (Deneb deps ${denebRange}).`);
