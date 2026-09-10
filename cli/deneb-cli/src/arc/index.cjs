'use strict';

/**
 * Deneb ARC — Adaptive Refactoring Compiler
 *
 * AST-driven adaptive UI refactoring, editable-contract compilation,
 * validation, and self-evaluation engine.
 *
 * Default engine for `npx @deneb-ui/cli init`.
 * Legacy regex converter remains available via `--legacy`.
 */

const fs = require('fs');
const path = require('path');
const { ARC_NAME, ARC_VERSION, SCHEMA_VERSION, ENGINE_ID } = require('./version.cjs');
const { walkFiles, isJsxFile, rel, copyFilePreserve, writeJson, readJsonSafe, findFirstExisting } = require('./fs-utils.cjs');
const { scanProject, buildDependencyGraph, inferOwnerScope } = require('./scanner.cjs');
const { analyzeFile, collectDesignSnapshot } = require('./semantic.cjs');
const { planTransformations } = require('./planner.cjs');
const { applyFilePlan, instrumentLayoutSource, instrumentPageKey, resolveSiteDataSpecifier, ensureJsonModule, sanitizeContradictoryMarkersInSource } = require('./transformer.cjs');
const { parseSource } = require('./ast.cjs');
const { buildSiteDataAndManifest, writeDataBank, loadExistingData, countSchemaFields } = require('./manifest.cjs');
const { validateAstFiles, validateContracts, designPreservationScore, coverageMetrics } = require('./validator.cjs');
const { recordExperience, registryArchitecture } = require('./learning.cjs');
const { matchRecipeV2 } = require('./recipes-v2.cjs');
const { ensureStaticExportConfig, findNextConfig } = require('./next-config.cjs');
const {
  extractMarkers,
  canonicalizeMarkerPath,
  auditMarkerPlacement,
  auditActionLabelCollision,
  auditPathCoverage,
  auditSchemaUniqueness,
  auditPageCoverage,
  auditPreviewRuntime,
  findUncoveredVisibleText,
} = require('./fivora-contract.cjs');
const printer = require('./printer.cjs');

function parseArcOptions(raw = {}) {
  return {
    dryRun: Boolean(raw.dryRun || raw.dryrun),
    explain: Boolean(raw.explain),
    recipeName: raw.recipeName || raw.recipe || null,
    telemetry: raw.telemetry || 'off',
    skipInstall: Boolean(raw.skipInstall),
    detectedPages: raw.detectedPages || null,
    json: Boolean(raw.json),
  };
}

function createRunId() {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  return `arc-${stamp}`;
}

function createBackup(projectDir, runId) {
  const backupDir = path.join(projectDir, `.deneb-backup-${runId}`);
  fs.mkdirSync(backupDir, { recursive: true });
  return backupDir;
}

function backupFile(projectDir, backupDir, absPath) {
  if (!fs.existsSync(absPath)) return;
  const dest = path.join(backupDir, rel(projectDir, absPath));
  copyFilePreserve(absPath, dest);
}

function restoreBackup(projectDir, backupDir) {
  if (!backupDir || !fs.existsSync(backupDir)) return;
  const files = walkFiles(backupDir, { include: () => true });
  for (const abs of files) {
    const relative = path.relative(backupDir, abs);
    copyFilePreserve(abs, path.join(projectDir, relative));
  }
}

function findLayoutFile(profile) {
  const root = profile.root;
  const dirs = [profile.appDir, profile.pagesDir].filter(Boolean).map((d) => path.join(root, d));
  const names = ['layout.tsx', 'layout.jsx', 'layout.js', '_app.tsx', '_app.jsx', '_app.js'];
  const candidates = [];
  for (const dir of dirs) {
    for (const name of names) candidates.push(path.join(dir, name));
  }
  return findFirstExisting(candidates);
}

/**
 * Reads every source file back off disk and inventories the Deneb markers it
 * actually contains, along with which routes render each marker.
 */
function collectMarkerInventory(projectDir, profile, graph) {
  const fieldPaths = new Set();
  const listPaths = new Set();
  const itemPaths = new Set();
  const markerRoutes = {};
  const pageKeysByFile = {};
  const sources = [];

  for (const relativeFile of profile.jsxFiles) {
    const abs = path.join(projectDir, relativeFile);
    let code = '';
    try {
      code = fs.readFileSync(abs, 'utf8');
    } catch {
      continue;
    }
    sources.push({ rel: relativeFile, code });
    const { markers } = extractMarkers(code, relativeFile);
    const routes = graph.routesByFile?.[relativeFile] || [];

    for (const marker of markers) {
      if (marker.kind === 'page') {
        pageKeysByFile[relativeFile] = pageKeysByFile[relativeFile] || [];
        if (!pageKeysByFile[relativeFile].includes(marker.value)) {
          pageKeysByFile[relativeFile].push(marker.value);
        }
        continue;
      }
      const canonical = canonicalizeMarkerPath(marker.value);
      if (!canonical) continue;
      if (marker.kind === 'field') fieldPaths.add(canonical);
      if (marker.kind === 'list') listPaths.add(canonical);
      if (marker.kind === 'item') itemPaths.add(canonical);
      markerRoutes[canonical] = [...new Set([...(markerRoutes[canonical] || []), ...routes])];
    }
  }

  return {
    fieldPaths: [...fieldPaths],
    listPaths: [...listPaths],
    itemPaths: [...itemPaths],
    markerRoutes,
    pageKeysByFile,
    sources,
  };
}

/**
 * Runs the ported Fivora strict contract against the converted project so a
 * rejection surfaces locally rather than at upload time.
 */
function auditFivoraContract({ profile, siteData, manifest, inventory }) {
  const placement = [];
  const collisions = [];
  const uncoveredText = [];
  const allMarkers = [];

  for (const source of inventory.sources) {
    const { markers } = extractMarkers(source.code, source.rel);
    allMarkers.push(...markers);
    placement.push(...auditMarkerPlacement(source.code, source.rel));
    collisions.push(...auditActionLabelCollision(source.code, source.rel));
    uncoveredText.push(...findUncoveredVisibleText(source.code, source.rel));
  }

  const coverage = auditPathCoverage({
    content: siteData.content,
    editorSchema: manifest.editorSchema,
    markers: allMarkers,
    controlOnlyPaths: manifest.visualEditing?.controlOnlyPaths || [],
  });

  const routeFiles = {};
  for (const route of profile.routes || []) {
    if (route.file) routeFiles[route.id] = route.file;
  }

  const errors = [
    ...coverage.errors,
    ...placement,
    ...collisions,
    ...auditSchemaUniqueness(manifest.editorSchema),
    ...auditPageCoverage({
      pages: manifest.pages,
      routeFiles,
      pageMarkersByFile: inventory.pageKeysByFile,
    }),
    ...auditPreviewRuntime(inventory.sources.map((source) => source.code)),
  ];

  return {
    passed: errors.length === 0,
    errors: [...new Set(errors)],
    uncoveredVisibleText: uncoveredText,
  };
}

function analyzeProjectFiles(profile, graph) {
  const analyses = [];
  for (const relativeFile of profile.jsxFiles) {
    const abs = path.join(profile.root, relativeFile);
    let code = '';
    try {
      code = fs.readFileSync(abs, 'utf8');
    } catch {
      continue;
    }
    const componentMeta = (profile.components || []).find((c) => c.file === relativeFile);
    const ownerScope = inferOwnerScope(profile, graph, relativeFile);
    let designSnapshot = { classNames: [], styles: [] };
    try {
      designSnapshot = collectDesignSnapshot(code);
    } catch {
      // snapshot is best-effort
    }
    const result = analyzeFile({
      code,
      relativeFile,
      profile,
      graph,
      ownerScope,
      componentMeta,
    });
    analyses.push({
      ...result,
      relativeFile,
      code,
      designSnapshot,
      ownerScope,
    });
  }
  return analyses;
}

function runDenebArc(projectDir, projectName, options = {}) {
  const opts = parseArcOptions(options);
  const runId = createRunId();
  const startedAt = new Date().toISOString();

  printer.printBanner(opts.dryRun ? 'dry-run' : opts.explain ? 'explain' : 'run');

  const profile = scanProject(projectDir);
  if (opts.detectedPages && Array.isArray(opts.detectedPages) && opts.detectedPages.length) {
    const scannedIds = new Set(profile.routes.map((r) => r.id));
    for (const page of opts.detectedPages) {
      if (page && page.id && !scannedIds.has(page.id)) {
        profile.routes.push(page);
      }
    }
  }

  printer.printProfile(profile);
  const graph = buildDependencyGraph(profile);
  const analyses = analyzeProjectFiles(profile, graph);

  const candidateCount = analyses.reduce(
    (n, a) => n + (a.candidates || []).filter((c) => c.kind !== 'decoration' && c.kind !== 'already-editable' && !c.skip).length,
    0
  );
  const actionCount = analyses.reduce(
    (n, a) => n + (a.candidates || []).filter((c) => c.operation === 'split-action-contract' || c.kind === 'url').length,
    0
  );
  printer.printScan(profile, graph, candidateCount, actionCount);

  const sourceAbs = profile.jsxFiles.map((f) => path.join(projectDir, f));
  const recipeMatch = matchRecipeV2(projectDir, profile, sourceAbs, opts.recipeName);
  if (recipeMatch.recipe) {
    printer.ok(`Matched recipe: ${recipeMatch.recipe.label} (${recipeMatch.recipe.name})`);
  }

  const plan = planTransformations({
    profile,
    analyses,
    recipe: recipeMatch.recipe,
  });
  printer.printPlan(plan);

  if (opts.explain) printer.printExplain(plan);
  if (opts.dryRun) {
    printer.printDryRun(profile, plan);
    const dryReport = buildReport({
      runId, startedAt, projectDir, projectName, profile, graph, plan, recipeMatch, opts,
      filesChanged: [],
      validation: { syntaxPassed: true, contractPassed: true, dryRun: true },
      coverage: coverageMetrics({
        analyses,
        plan,
        appliedCount: 0,
        skippedDynamic: plan.skipped.filter((s) => /dynamic|api/.test(s.reason || '')).length,
        alreadyEditable: analyses.filter((a) => a.alreadyEditable).length,
      }),
      design: { score: 100 },
      outcome: 'dry-run',
    });
    return dryReport;
  }

  const backupDir = createBackup(projectDir, runId);
  const journalDir = path.join(projectDir, '.deneb', 'runs', runId);
  fs.mkdirSync(journalDir, { recursive: true });
  writeJson(path.join(journalDir, 'project-profile.json'), sanitizeProfile(profile));
  writeJson(path.join(journalDir, 'transform-plan.json'), sanitizePlan(plan));

  const existing = loadExistingData(projectDir, profile);
  const changedFiles = [];
  const afterFiles = {};
  let appliedCount = 0;
  let layoutUpdated = false;
  const transformFailures = [];

  const layoutFile = findLayoutFile(profile);
  if (layoutFile) {
    backupFile(projectDir, backupDir, layoutFile);
    const layoutRel = rel(projectDir, layoutFile);
    const siteDataImport = resolveSiteDataSpecifier(profile, layoutRel);
    const original = fs.readFileSync(layoutFile, 'utf8');
    const instrumented = instrumentLayoutSource(original, siteDataImport);
    if (instrumented.updated && instrumented.code !== original) {
      fs.writeFileSync(layoutFile, instrumented.code, 'utf8');
      changedFiles.push(layoutRel);
      layoutUpdated = true;
    }
  }

  for (const filePlan of plan.files) {
    if (!filePlan.transformations.length || filePlan.skippedFile) continue;
    const abs = path.join(projectDir, filePlan.file);
    backupFile(projectDir, backupDir, abs);
    let result;
    try {
      result = applyFilePlan(filePlan, profile);
    } catch (err) {
      transformFailures.push({ file: filePlan.file, reason: err.message, confidence: 0.4 });
      continue;
    }
    if (!result.changed) continue;
    try {
      parseSource(result.code, filePlan.file);
    } catch (err) {
      transformFailures.push({ file: filePlan.file, reason: `AST invalid after transform: ${err.message}`, confidence: 0.3 });
      continue;
    }
    fs.writeFileSync(abs, result.code, 'utf8');
    changedFiles.push(filePlan.file);
    afterFiles[filePlan.file] = result.code;
    appliedCount += result.applied || 0;
    if (result.failures?.length) transformFailures.push(...result.failures.map((f) => ({ file: filePlan.file, ...f })));
  }

  // Every scanned route must carry its own data-preview-page-key, whichever
  // router the project uses.
  for (const route of profile.routes || []) {
    if (!route.file) continue;
    const abs = path.join(projectDir, route.file);
    if (!fs.existsSync(abs)) continue;
    const original = fs.readFileSync(abs, 'utf8');
    const keyed = instrumentPageKey(original, route.file, route.id);
    if (keyed.updated && keyed.code !== original) {
      backupFile(projectDir, backupDir, abs);
      fs.writeFileSync(abs, keyed.code, 'utf8');
      if (!changedFiles.includes(route.file)) changedFiles.push(route.file);
    }
  }

  // Remove any conflicting data-preview-static from elements carrying editable markers
  for (const relativeFile of profile.jsxFiles || []) {
    const abs = path.join(projectDir, relativeFile);
    if (!fs.existsSync(abs)) continue;
    const original = fs.readFileSync(abs, 'utf8');
    const sanitized = sanitizeContradictoryMarkersInSource(original, relativeFile);
    if (sanitized.updated && sanitized.code !== original) {
      backupFile(projectDir, backupDir, abs);
      fs.writeFileSync(abs, sanitized.code, 'utf8');
      if (!changedFiles.includes(relativeFile)) changedFiles.push(relativeFile);
    }
  }

  if (profile.framework === 'nextjs') {
    const before = findNextConfig(projectDir);
    if (before) backupFile(projectDir, backupDir, before.abs);
    const nextConfigResult = ensureStaticExportConfig(projectDir, profile);
    if (nextConfigResult.updated && nextConfigResult.file) {
      changedFiles.push(nextConfigResult.file);
      printer.ok(
        nextConfigResult.created
          ? `Created ${nextConfigResult.file} with static export for Fivora hosting`
          : `Configured static export in ${nextConfigResult.file}`
      );
    }
    for (const warning of nextConfigResult.warnings || []) {
      printer.warn(warning);
    }
  }

  if (profile.tsconfigFile) {
    const abs = path.join(projectDir, profile.tsconfigFile);
    const current = readJsonSafe(abs);
    const next = ensureJsonModule(current);
    if (next.changed) {
      backupFile(projectDir, backupDir, abs);
      writeJson(abs, next.config);
      changedFiles.push(profile.tsconfigFile);
    }
  }

  printer.printApply({ filesUpdated: changedFiles.length, layoutUpdated });

  // Marker inventory must be read back from what was actually written, not from
  // the plan: a planned field that failed to transform must not be advertised
  // as visually editable, and an unrendered field must be declared control-only.
  const markerInventory = collectMarkerInventory(projectDir, profile, graph);

  const dataBundle = buildSiteDataAndManifest({
    projectDir,
    projectName: projectName || profile.packageName,
    profile,
    plan,
    recipe: recipeMatch.recipe,
    existingSiteData: existing.siteData,
    existingManifest: existing.manifest,
    boundFieldPaths: markerInventory.fieldPaths,
    markerRoutes: markerInventory.markerRoutes,
  });

  const siteAbs = path.join(projectDir, dataBundle.siteDataRel);
  const manifestAbs = path.join(projectDir, 'fivora-template.json');
  const createdDuringRun = [];
  if (!fs.existsSync(siteAbs)) createdDuringRun.push(siteAbs);
  if (!fs.existsSync(manifestAbs)) createdDuringRun.push(manifestAbs);
  if (fs.existsSync(siteAbs)) backupFile(projectDir, backupDir, siteAbs);
  if (fs.existsSync(manifestAbs)) backupFile(projectDir, backupDir, manifestAbs);
  writeDataBank(projectDir, dataBundle.siteData, dataBundle.manifest);

  const astResults = validateAstFiles(
    changedFiles
      .filter((f) => isJsxFile(f) || /\.(tsx|jsx|ts|js)$/.test(f))
      .map((f) => ({ abs: path.join(projectDir, f), rel: f }))
  );
  const syntaxPassed = astResults.every((r) => r.passed);
  const contracts = validateContracts(projectDir, dataBundle.siteData, dataBundle.manifest);
  const design = designPreservationScore(plan.files, afterFiles);
  const alreadyEditable = analyses.filter((a) => a.alreadyEditable).length;
  const skippedDynamic = plan.skipped.filter((s) => /dynamic|api/.test(s.reason || '')).length;
  const coverage = coverageMetrics({
    analyses,
    plan,
    appliedCount,
    skippedDynamic,
    alreadyEditable,
  });

  const fivoraAudit = auditFivoraContract({
    profile,
    siteData: dataBundle.siteData,
    manifest: dataBundle.manifest,
    inventory: collectMarkerInventory(projectDir, profile, graph),
  });

  const validation = {
    syntaxPassed,
    fivoraContractPassed: fivoraAudit.passed,
    fivoraContractErrors: fivoraAudit.errors,
    uncoveredVisibleText: fivoraAudit.uncoveredVisibleText.length,
    contractPassed: contracts.contractPassed,
    orphans: contracts.orphans.length,
    missingSchema: contracts.missingSchema.length,
    actionCollisions: contracts.actionCollisions,
    staticAncestorCollisions: contracts.staticAncestorCollisions,
    astFailures: astResults.filter((r) => !r.passed),
    transformFailures,
  };

  const criticalFailure = !syntaxPassed || contracts.actionCollisions > 0 && appliedCount === 0;
  let outcome = 'success';
  if (criticalFailure) {
    restoreBackup(projectDir, backupDir);
    for (const created of createdDuringRun) {
      try {
        if (fs.existsSync(created)) fs.rmSync(created, { force: true });
      } catch {
        // ignore
      }
    }
    outcome = 'rolled-back';
    printer.printRollback(validation.astFailures[0]?.error || 'Critical validation failed');
  }

  printer.printValidation(validation, coverage, design);
  if (!fivoraAudit.passed) {
    console.log(`\n  \x1b[33m⚠ Fivora strict contract: ${fivoraAudit.errors.length} finding(s)\x1b[0m`);
    for (const error of fivoraAudit.errors.slice(0, 8)) {
      console.log(`    \x1b[90m- ${error}\x1b[0m`);
    }
    if (fivoraAudit.errors.length > 8) {
      console.log(`    \x1b[90m... ${fivoraAudit.errors.length - 8} more in .deneb/report.json\x1b[0m`);
    }
  } else {
    console.log('  \x1b[32m✓\x1b[0m Fivora strict contract');
  }
  printer.printUncoveredText(fivoraAudit.uncoveredVisibleText);
  coverage.actionLinkContracts = contracts.fieldPaths.filter((p) => /Url$/.test(p)).length;
  coverage.contractCollisions = contracts.actionCollisions;
  console.log(`  Action/link contracts validated: ${coverage.actionLinkContracts}`);
  console.log(`  Contract collisions: ${coverage.contractCollisions}`);

  if (transformFailures.length) {
    for (const fail of transformFailures.slice(0, 5)) {
      printer.printError(fail.file, fail.reason, fail.confidence);
    }
  }

  const experienceRecords = recordExperience({
    projectDir,
    profile,
    plan,
    validation: {
      syntaxPassed,
      contractPassed: contracts.contractPassed,
      visualPassed: design.score >= 95,
      idempotencyPassed: true,
    },
    outcome,
    telemetry: opts.telemetry,
  });

  const result = {
    engine: ENGINE_ID,
    arcVersion: ARC_VERSION,
    schemaVersion: SCHEMA_VERSION,
    runId,
    backupDir,
    detection: {
      framework: profile.framework,
      frameworkVersion: profile.frameworkVersion,
      detected: [
        profile.framework,
        ...(profile.cssSystems || []),
        ...(profile.componentLibraries || []),
      ],
      hasShadcn: profile.shadcn,
      hasHeroUi: profile.heroui,
      hasTailwind: (profile.cssSystems || []).some((s) => s.startsWith('tailwind')),
      appDir: profile.appDir,
      isAppRouter: profile.router === 'next-app',
      pkg: profile.pkg,
    },
    matchedRecipe: recipeMatch.recipe,
    transformedFilesCount: changedFiles.length,
    totalTransformedElements: appliedCount,
    totalFields: countSchemaFields(dataBundle.manifest),
    coverage,
    designPreservation: design.score,
    validation,
    outcome,
  };

  const report = buildReport({
    runId,
    startedAt,
    projectDir,
    projectName: projectName || profile.packageName,
    profile,
    graph,
    plan,
    recipeMatch,
    opts,
    filesChanged: changedFiles,
    validation,
    coverage,
    design,
    outcome,
    experienceRecords: experienceRecords.length,
    result,
  });
  writeJson(path.join(journalDir, 'result.json'), result);
  writeJson(path.join(journalDir, 'validation.json'), validation);
  writeJson(path.join(projectDir, '.deneb', 'report.json'), report);

  if (outcome === 'success') {
    printer.printSuccess();
    printer.printDeveloperNextSteps();
  }
  return result;
}

function sanitizeProfile(profile) {
  const copy = { ...profile };
  delete copy.pkg;
  delete copy.dependencies;
  delete copy.aliasMap;
  delete copy.tsconfig;
  return copy;
}

function sanitizePlan(plan) {
  return {
    stats: plan.stats,
    usedPaths: plan.usedPaths,
    skipped: plan.skipped,
    files: (plan.files || []).map((f) => ({
      file: f.file,
      skippedFile: f.skippedFile,
      skipReason: f.skipReason,
      transformations: f.transformations,
    })),
  };
}

function buildReport(args) {
  return {
    engine: ARC_NAME,
    arcVersion: ARC_VERSION,
    schemaVersion: SCHEMA_VERSION,
    runId: args.runId,
    startedAt: args.startedAt,
    finishedAt: new Date().toISOString(),
    project: args.projectName,
    dryRun: Boolean(args.opts?.dryRun),
    profile: sanitizeProfile(args.profile),
    filesScanned: args.profile.jsxFiles?.length || 0,
    filesChanged: args.filesChanged,
    fieldsGenerated: args.plan?.usedPaths || [],
    routesGenerated: args.profile.routes,
    recipesMatched: args.recipeMatch?.recipe ? [args.recipeMatch.recipe.name] : [],
    confidenceDistribution: {
      auto: args.plan?.stats?.auto || 0,
      validate: args.plan?.stats?.validate || 0,
      skipped: args.plan?.stats?.skipped || 0,
    },
    skippedTransformations: args.plan?.skipped || [],
    warnings: args.validation?.transformFailures || [],
    validation: args.validation,
    coverage: args.coverage,
    designPreservation: args.design,
    learningRecords: args.experienceRecords || 0,
    registry: registryArchitecture(),
    outcome: args.outcome,
  };
}

module.exports = {
  runDenebArc,
  parseArcOptions,
  scanProject,
  ENGINE_ID,
  ARC_VERSION,
};
