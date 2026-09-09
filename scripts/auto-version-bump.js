const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

const rootDir = path.resolve(__dirname, '..');

const packagePaths = [
  path.join(rootDir, 'packages', 'deneb-ui', 'package.json'),
  path.join(rootDir, 'cli', 'deneb-cli', 'package.json'),
  path.join(rootDir, 'packages', 'create-template', 'package.json'),
  path.join(rootDir, 'package.json'),
];

function getRemoteVersion(pkgName) {
  try {
    const out = execSync(`npm view ${pkgName} version`, { encoding: 'utf8' }).trim();
    return out || '0.0.0';
  } catch {
    return '0.0.0';
  }
}

function parseSemver(v) {
  const [major = 0, minor = 0, patch = 0] = (v || '0.0.0')
    .replace(/^v/, '')
    .split('.')
    .map((n) => parseInt(n, 10) || 0);
  return { major, minor, patch };
}

function compareSemver(a, b) {
  const sa = parseSemver(a);
  const sb = parseSemver(b);
  if (sa.major !== sb.major) return sa.major - sb.major;
  if (sa.minor !== sb.minor) return sa.minor - sb.minor;
  return sa.patch - sb.patch;
}

function bumpPatch(v) {
  const s = parseSemver(v);
  return `${s.major}.${s.minor}.${s.patch + 1}`;
}

// 1. Get current local version
const localPkg = JSON.parse(fs.readFileSync(packagePaths[0], 'utf8'));
const localVersion = localPkg.version;

// 2. Query npm for latest published version
const remoteVersion = getRemoteVersion('@deneb-ui/ui');

console.log(`\n🔍 Checking versions for @deneb-ui:`);
console.log(`   Local repo version:  v${localVersion}`);
console.log(`   Latest npm version:  v${remoteVersion}`);

// 3. Determine base version: highest of local or remote
const baseVersion = compareSemver(localVersion, remoteVersion) >= 0 ? localVersion : remoteVersion;

// 4. If remote is equal to or greater than baseVersion, auto-bump patch
let nextVersion = baseVersion;
let hasBumped = false;

if (compareSemver(remoteVersion, baseVersion) >= 0) {
  nextVersion = bumpPatch(baseVersion);
  hasBumped = true;
  console.log(`\n⚡ Version v${baseVersion} is already on npm. Auto-bumping to next dynamic version: v${nextVersion}`);
} else {
  console.log(`\n✔ Local version v${localVersion} is ahead of npm. Using v${nextVersion}`);
}

// 5. Update all package.json files
for (const p of packagePaths) {
  if (fs.existsSync(p)) {
    const pkg = JSON.parse(fs.readFileSync(p, 'utf8'));
    pkg.version = nextVersion;
    fs.writeFileSync(p, JSON.stringify(pkg, null, 2) + '\n');
    console.log(`   ✔ Updated ${pkg.name || 'root'} -> v${nextVersion}`);
  }
}

// 6. Keep the root and standalone CLI lockfiles aligned with package metadata.
console.log(`\n🔒 Refreshing package locks...`);
execSync('npm install --package-lock-only --ignore-scripts', {
  cwd: rootDir,
  stdio: 'inherit',
});
execSync('npm install --package-lock-only --ignore-scripts --workspaces=false', {
  cwd: path.join(rootDir, 'cli', 'deneb-cli'),
  stdio: 'inherit',
});

// Purge obsolete workspaces from root lockfile
const rootLockPath = path.join(rootDir, 'package-lock.json');
if (fs.existsSync(rootLockPath)) {
  const lock = JSON.parse(fs.readFileSync(rootLockPath, 'utf8'));
  let modified = false;
  for (const stale of ['packages/editable-components', 'packages/ceeg-ui', 'cli/fivora-cli']) {
    if (lock.packages?.[stale]) {
      delete lock.packages[stale];
      modified = true;
    }
  }
  if (modified) {
    fs.writeFileSync(rootLockPath, JSON.stringify(lock, null, 2) + '\n');
  }
}


// 7. Rebuild packages and sync templates
console.log(`\n📦 Rebuilding packages and syncing templates for v${nextVersion}...`);
execSync('npm run build', { cwd: rootDir, stdio: 'inherit' });

console.log(`\n🎉 Ready to publish v${nextVersion} to npm!`);
