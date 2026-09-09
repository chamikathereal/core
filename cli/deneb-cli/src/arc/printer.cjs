'use strict';

const { ARC_NAME, ARC_FULL_NAME, ARC_VERSION } = require('./version.cjs');

const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[90m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
  white: '\x1b[37m',
};

function ok(msg) {
  console.log(`  ${C.green}✓${C.reset} ${msg}`);
}

function warn(msg) {
  console.log(`  ${C.yellow}⚠${C.reset} ${msg}`);
}

function info(msg) {
  console.log(`  ${C.cyan}•${C.reset} ${msg}`);
}

function heading(title) {
  console.log(`\n${C.bold}${title}${C.reset}\n`);
}

function printBanner(mode) {
  const suffix = mode === 'dry-run' ? ' (dry run)' : mode === 'explain' ? ' (explain)' : '';
  console.log(`\n${C.cyan}▲${C.reset} ${C.bold}${ARC_NAME}${C.reset}${suffix}`);
  console.log(`${C.dim}${ARC_FULL_NAME}  v${ARC_VERSION}${C.reset}\n`);
}

function printProfile(profile) {
  heading('Analyzing project...');
  const fw = profile.framework === 'nextjs'
    ? `Next.js${profile.frameworkVersion ? ' ' + profile.frameworkVersion : ''}`
    : profile.framework;
  ok(`${fw} detected`);
  ok(`${profile.language === 'javascript' ? 'JavaScript' : profile.language === 'typescript' ? 'TypeScript' : 'Mixed JS/TS'} detected`);
  if (profile.cssSystems.includes('tailwind-v4')) ok('Tailwind CSS v4 detected');
  else if (profile.cssSystems.some((s) => s.startsWith('tailwind'))) ok('Tailwind CSS detected');
  if (profile.shadcn) ok('shadcn/ui detected');
  if (profile.heroui) ok('HeroUI detected');
  if (profile.reactBits) ok('React Bits detected');
  if (profile.router === 'next-app') ok('App Router detected');
  if (profile.router === 'next-pages') ok('Pages Router detected');
  if (profile.router === 'react-router') ok('React Router detected');
}

function printScan(profile, graph, candidateCount, actionCount) {
  heading('Scanning architecture...');
  ok(`${profile.routes.length} routes`);
  ok(`${profile.components.length} components`);
  ok(`${candidateCount} content candidates`);
  ok(`${actionCount} interactive actions`);
  if (graph.sharedFiles?.length) info(`${graph.sharedFiles.length} shared components reused across routes`);
}

function printPlan(plan) {
  heading('Planning editable contracts...');
  ok(`${plan.stats.auto} high-confidence transformations`);
  if (plan.stats.validate) info(`${plan.stats.validate} transformations queued with extra validation`);
  const skippedDynamic = plan.skipped.filter((s) => /dynamic|api/.test(s.reason || '')).length;
  const skippedLow = plan.skipped.filter((s) => (s.confidence || 1) < 0.6).length;
  if (skippedDynamic) ok(`${skippedDynamic} existing dynamic values preserved`);
  if (skippedLow) warn(`${skippedLow} low-confidence candidates skipped`);
}

function printApply(result) {
  heading('Applying Deneb contracts...');
  ok(`${result.filesUpdated} files updated`);
  if (result.layoutUpdated) ok('Root layout instrumented with SiteDataProvider');
}

function printValidation(validation, coverage, design) {
  heading('Validating...');
  if (validation.syntaxPassed) ok('AST');
  else warn('AST validation reported parse issues');
  if (validation.contractPassed) ok('editable contracts');
  else warn('editable contract issues detected');
  ok('manifest');
  if (validation.idempotencyPassed !== false) ok('idempotency');
  console.log('');
  console.log(`  Editable coverage: ${coverage.editableCoverage}%`);
  console.log(`  Design preservation: ${design.score}%`);
}

function printExplain(plan) {
  heading('Explain');
  for (const file of plan.files) {
    if (!file.transformations.length) continue;
    console.log(`  ${C.bold}${file.file}${C.reset}`);
    for (const t of file.transformations) {
      console.log(`    - ${t.operation} ${t.field || t.urlField || ''}`);
      console.log(`      ${C.dim}why: ${t.reason}  confidence: ${t.confidence}  recipe: ${t.recipeId || 'none'}${C.reset}`);
    }
  }
}

function printDryRun(profile, plan) {
  heading('Dry run (no files modified)');
  console.log(`  Technology: ${profile.framework} / ${profile.language} / ${(profile.cssSystems || []).join(', ') || 'css'}`);
  console.log(`  Routes: ${profile.routes.map((r) => r.route).join(', ')}`);
  console.log(`  Components scanned: ${profile.components.length}`);
  console.log(`  Planned transformations: ${plan.stats.planned}`);
  console.log(`  Files affected: ${plan.stats.filesAffected}`);
  if (plan.skipped.length) {
    console.log(`  Risks:`);
    for (const skip of plan.skipped.slice(0, 8)) {
      console.log(`    - ${skip.file}: ${skip.reason} (${skip.confidence})`);
    }
  }
}

function printError(file, reason, confidence) {
  console.log(`\n${C.red}Deneb could not safely determine the transformation in:${C.reset}\n`);
  console.log(`  ${file}\n`);
  console.log(`Reason:\n  ${reason}\n`);
  if (confidence != null) console.log(`Confidence: ${confidence}\n`);
  console.log('Action:\n  Component left unchanged.\n');
  console.log('No source code was damaged.\n');
}

function printSuccess() {
  console.log(`\n${C.green}${C.bold}Deneb ARC completed successfully.${C.reset}\n`);
}

function printRollback(reason) {
  console.log(`\n${C.yellow}Deneb ARC rolled back the conversion.${C.reset}`);
  console.log(`${C.dim}${reason}${C.reset}\n`);
}

module.exports = {
  printBanner,
  printProfile,
  printScan,
  printPlan,
  printApply,
  printValidation,
  printExplain,
  printDryRun,
  printError,
  printSuccess,
  printRollback,
  ok,
  warn,
  info,
};
