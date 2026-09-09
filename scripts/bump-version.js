const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

const rootDir = path.resolve(__dirname, '..');
const targetType = process.argv[2] || 'patch'; // 'patch', 'minor', 'major'

const packagePaths = [
  path.join(rootDir, 'package.json'),
  path.join(rootDir, 'packages', 'deneb-core', 'package.json'),
  path.join(rootDir, 'packages', 'deneb-ui', 'package.json'),
  path.join(rootDir, 'cli', 'deneb-cli', 'package.json'),
  path.join(rootDir, 'packages', 'create-template', 'package.json'),
];




function bump(version, type) {
  const parts = version.split('.').map(Number);
  if (type === 'major') {
    parts[0] += 1;
    parts[1] = 0;
    parts[2] = 0;
  } else if (type === 'minor') {
    parts[1] += 1;
    parts[2] = 0;
  } else {
    parts[2] += 1;
  }
  return parts.join('.');
}

// Read current version from first package
const firstPkg = JSON.parse(fs.readFileSync(packagePaths[0], 'utf8'));
const oldVersion = firstPkg.version;
const newVersion = bump(oldVersion, targetType);

console.log(`\n🚀 Bumping all DENEB packages: v${oldVersion} -> v${newVersion} (${targetType})\n`);

for (const pkgPath of packagePaths) {
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    pkg.version = newVersion;
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
    console.log(`  ✔ Updated ${pkg.name} -> v${newVersion}`);
  }
}

console.log(`\n🔒 Refreshing package locks...`);
execSync('npm install --package-lock-only --ignore-scripts', {
  cwd: rootDir,
  stdio: 'inherit',
});
try {
  execSync('npm install --package-lock-only --ignore-scripts --workspaces=false', {
    cwd: path.join(rootDir, 'cli', 'deneb-cli'),
    stdio: 'inherit',
  });
} catch {
  console.log(
    '   ⚠ @deneb-ui/core is not on npm yet; skipping CLI registry lock refresh.',
  );
  const lockPath = path.join(rootDir, 'cli', 'deneb-cli', 'package-lock.json');
  if (fs.existsSync(lockPath)) {
    const lock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
    lock.version = newVersion;
    if (lock.packages && lock.packages['']) lock.packages[''].version = newVersion;
    fs.writeFileSync(lockPath, JSON.stringify(lock, null, 2) + '\n');
  }
}

// Dynamically prune any orphaned workspaces from root lockfile
const rootLockPath = path.join(rootDir, 'package-lock.json');
if (fs.existsSync(rootLockPath)) {
  const lock = JSON.parse(fs.readFileSync(rootLockPath, 'utf8'));
  let modified = false;
  for (const pkgPath of Object.keys(lock.packages || {})) {
    if (pkgPath.startsWith('packages/') || pkgPath.startsWith('cli/') || pkgPath.startsWith('templates/')) {
      const fullPath = path.join(rootDir, pkgPath);
      if (!fs.existsSync(fullPath) || !fs.existsSync(path.join(fullPath, 'package.json'))) {
        delete lock.packages[pkgPath];
        modified = true;
      }
    }
  }
  if (modified) {
    fs.writeFileSync(rootLockPath, JSON.stringify(lock, null, 2) + '\n');
  }
}

console.log(`\n📦 Rebuilding packages and syncing templates...`);
execSync('npm run build', { cwd: rootDir, stdio: 'inherit' });

console.log(`\n🎉 All packages bumped to v${newVersion} and built successfully!`);
console.log(`Ready to publish with: npm run publish:all\n`);
