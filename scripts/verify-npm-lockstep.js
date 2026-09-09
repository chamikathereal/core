'use strict';

const { execSync } = require('node:child_process');

const version = process.argv[2];
if (!version) {
  console.error('Usage: node scripts/verify-npm-lockstep.js <version>');
  process.exit(1);
}

const names = ['@deneb-ui/core', '@deneb-ui/ui', '@deneb-ui/cli', '@deneb-ui/create-template'];
const missing = [];

for (const name of names) {
  try {
    const published = execSync(`npm view ${name}@${version} version`, { encoding: 'utf8' }).trim();
    if (published !== version) missing.push(`${name}@${version}`);
    else console.log(`✔ ${name}@${version}`);
  } catch {
    missing.push(`${name}@${version}`);
  }
}

if (missing.length) {
  console.error(`npm lockstep failed. Not published:\n- ${missing.join('\n- ')}`);
  process.exit(1);
}

console.log(`All four packages published at v${version}`);
