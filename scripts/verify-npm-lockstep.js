'use strict';

const { execSync } = require('node:child_process');

const version = process.argv[2];
if (!version) {
  console.error('Usage: node scripts/verify-npm-lockstep.js <version>');
  process.exit(1);
}

const names = ['@deneb-ui/core', '@deneb-ui/ui', '@deneb-ui/cli', '@deneb-ui/create-template'];
const attempts = Number(process.env.NPM_LOCKSTEP_ATTEMPTS || 12);
const delayMs = Number(process.env.NPM_LOCKSTEP_DELAY_MS || 15000);

function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function viewVersion(name) {
  try {
    return execSync(`npm view ${name}@${version} version --no-workspaces`, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();
  } catch {
    return '';
  }
}

for (let attempt = 1; attempt <= attempts; attempt++) {
  const missing = [];
  for (const name of names) {
    if (viewVersion(name) === version) console.log(`✔ ${name}@${version}`);
    else missing.push(`${name}@${version}`);
  }

  if (!missing.length) {
    console.log(`All four packages published at v${version}`);
    process.exit(0);
  }

  console.log(
    `Waiting for npm to index (${attempt}/${attempts}): missing ${missing.join(', ')}`,
  );
  if (attempt < attempts) sleep(delayMs);
}

console.error(
  `npm lockstep failed after ${attempts} attempts. Not visible on the registry yet:\n- ${names
    .filter((name) => viewVersion(name) !== version)
    .map((name) => `${name}@${version}`)
    .join('\n- ')}`,
);
process.exit(1);
