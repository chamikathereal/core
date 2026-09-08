#!/usr/bin/env node

const path = require('node:path');
const fs = require('node:fs');
const readline = require('node:readline');

const args = process.argv.slice(2);
let targetDirInput = args[0];

function stripAnsi(str) {
  return str.replace(/\x1b\[[0-9;]*m/g, '');
}

function createBox(lines, width = 58) {
  const cyan = '\x1b[36m';
  const reset = '\x1b[0m';
  const top = `  ${cyan}╔${'═'.repeat(width)}╗${reset}`;
  const bottom = `  ${cyan}╚${'═'.repeat(width)}╝${reset}`;

  const rows = lines.map((line) => {
    const rawLen = stripAnsi(line).length;
    const padTotal = Math.max(0, width - rawLen);
    const padLeft = Math.floor(padTotal / 2);
    const padRight = padTotal - padLeft;
    return `  ${cyan}║${reset}${' '.repeat(padLeft)}${line}${' '.repeat(padRight)}${cyan}║${reset}`;
  });

  return [top, ...rows, bottom].join('\n');
}

function printBanner() {
  console.log('\n' + createBox([
    '\x1b[1m\x1b[37mDENEB TEMPLATE CREATOR\x1b[0m',
    '\x1b[90mScaffold a fast, compliant commerce template\x1b[0m',
    '\x1b[90mPowered by DENEB-UI Collaborate with FIVORA\x1b[0m'
  ], 58) + '\n');
}

function copyFolderSync(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyFolderSync(srcPath, destPath);
    } else if (entry.isFile()) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function runScaffolding(targetInput) {
  const targetPath = path.resolve(process.cwd(), targetInput.trim());
  const folderName = path.basename(targetPath);
  const sanitizedPkgName = folderName.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
  const templateDir = path.resolve(__dirname, '..', 'template');

  if (!fs.existsSync(templateDir)) {
    console.error(`\n\x1b[31mError:\x1b[0m Template directory not found at ${templateDir}`);
    process.exit(1);
  }

  if (fs.existsSync(targetPath) && fs.readdirSync(targetPath).length > 0) {
    console.error(`\n\x1b[31mError:\x1b[0m Target folder "${folderName}" already exists and is not empty.\n`);
    process.exit(1);
  }

  console.log(`\n\x1b[32mCreating DENEB template in:\x1b[0m ${targetPath}...\n`);
  copyFolderSync(templateDir, targetPath);

  // Restore .gitignore if preserved as _gitignore
  const gitignorePath = path.join(targetPath, '_gitignore');
  if (fs.existsSync(gitignorePath)) {
    fs.renameSync(gitignorePath, path.join(targetPath, '.gitignore'));
  }

  // Update package.json name
  const pkgPath = path.join(targetPath, 'package.json');
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      pkg.name = sanitizedPkgName;
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
    } catch {
      // ignore
    }
  }

  console.log(`\x1b[32m✔ Template structure created!\x1b[0m`);
  console.log(`  \x1b[90m- Pre-configured @deneb-ui/ui (Visual editing & smart template components)\x1b[0m`);
  console.log(`  \x1b[90m- Pre-configured @deneb-ui/cli (lab, validate, zip tools)\x1b[0m\n`);

  const skipInstall = process.argv.includes('--skip-install');

  if (!skipInstall) {
    console.log(`\n\x1b[36m📦 Installing dependencies with npm...\x1b[0m \x1b[90m(Next.js 15, Tailwind CSS, @deneb-ui/ui)\x1b[0m\n`);
    try {
      const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
      const installRes = require('node:child_process').spawnSync(npmCmd, ['install'], {
        cwd: targetPath,
        stdio: 'inherit',
        shell: process.platform === 'win32',
      });

      if (installRes.status === 0) {
        console.log(`\n\x1b[32m✔ All dependencies and DENEB UI components installed successfully!\x1b[0m\n`);
      } else {
        console.log(`\n\x1b[33m! Note: npm install exited with code ${installRes.status}. Run "npm install" inside ${folderName}.\x1b[0m\n`);
      }
    } catch (err) {
      console.log(`\n\x1b[33m! Note: Could not run npm install automatically: ${err.message}\x1b[0m\n`);
    }
  }

  console.log(`\x1b[32m══════════════════════════════════════════════════════════════════════════════\x1b[0m`);
  console.log(`  \x1b[1m\x1b[32m🎉 Success! Created ${folderName} at ${targetPath}\x1b[0m`);
  console.log(`\x1b[32m══════════════════════════════════════════════════════════════════════════════\x1b[0m\n`);
  console.log(`Your storefront template is pre-configured with:`);
  console.log(`  \x1b[36m⚡ Next.js 15 App Router\x1b[0m (React 19 + Static Export support)`);
  console.log(`  \x1b[36m🎨 Tailwind CSS\x1b[0m (Pre-configured tailwind.config.ts & tokens)`);
  console.log(`  \x1b[36m💎 @deneb-ui/ui\x1b[0m (28+ Visual-First Editable Components)`);
  console.log(`  \x1b[36m🛠️ @deneb-ui/cli\x1b[0m (Visual Lab, Preflight Validator & Packager)`);
  console.log(`  \x1b[36m📋 Fivora Manifest\x1b[0m (Version 2 Contract Compliant)\n`);

  console.log(`\x1b[1mNext Steps:\x1b[0m\n`);
  console.log(`  \x1b[36m1. cd ${folderName}\x1b[0m`);
  console.log(`     Navigate into your template directory.\n`);
  if (skipInstall) {
    console.log(`  \x1b[36m2. npm install\x1b[0m`);
    console.log(`     Install dependencies.\n`);
  }
  console.log(`  \x1b[36m${skipInstall ? '3' : '2'}. npm run dev\x1b[0m`);
  console.log(`     Start the local dev server at \x1b[4mhttp://localhost:3000\x1b[0m.`);
  console.log(`     Follow the in-app developer guide right on your homepage!\n`);
  console.log(`  \x1b[36m${skipInstall ? '4' : '3'}. npm run lab\x1b[0m`);
  console.log(`     Launch the interactive Fivora Visual Editing Lab simulation.\n`);
  console.log(`  \x1b[36m${skipInstall ? '5' : '4'}. npm run validate\x1b[0m`);
  console.log(`     Verify preflight compliance to ensure 100% marketplace approval.\n`);
  console.log(`  \x1b[36m${skipInstall ? '6' : '5'}. npm run zip\x1b[0m`);
  console.log(`     Package a clean, upload-ready \x1b[1mfivora-template.zip\x1b[0m.\n`);

  console.log(`\x1b[90mPowered by DENEB-UI Collaborate with FIVORA\x1b[0m`);
  console.log(`\x1b[1m\x1b[36mHappy building with DENEB UI! 🚀\x1b[0m\n`);
}

printBanner();

if (targetDirInput && targetDirInput.trim() && !targetDirInput.startsWith('-')) {
  runScaffolding(targetDirInput);
} else {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log('⚡ Welcome to DENEB UI Template Creator!\n');
  rl.question(' \x1b[36m?\x1b[0m \x1b[1mWhat is your template name?\x1b[0m \x1b[90m(e.g. my-store)\x1b[0m: ', (answer) => {
    rl.close();
    const name = answer.trim() || 'my-deneb-store';
    runScaffolding(name);
  });
}
