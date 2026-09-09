import { chmod, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { build, transform } from 'esbuild';
import {
  TEMPLATE_PREVIEW_FOCUS_BRIDGE_SCRIPT,
  TEMPLATE_PREVIEW_FOCUS_BRIDGE_VERSION,
} from './template-preview-focus-bridge';

const toolsDir = join(__dirname, '..', 'src', 'tools');

export async function buildStandaloneTemplateValidator() {
  const outputPath = join(toolsDir, 'deneb-template-validator.cjs');
  await mkdir(toolsDir, { recursive: true });
  await build({
    entryPoints: [join(__dirname, 'template-preflight.ts')],
    outfile: outputPath,
    bundle: true,
    platform: 'node',
    target: 'node20',
    format: 'cjs',
    minify: true,
    sourcemap: false,
    legalComments: 'none',
    banner: {
      js: '#!/usr/bin/env node',
    },
  });
  await chmod(outputPath, 0o755).catch(() => undefined);
  process.stdout.write(`Built standalone validator: ${outputPath}\n`);
}

export async function buildTemplatePreviewBridge() {
  const outputPath = join(toolsDir, 'template-preview-focus-bridge.cjs');
  const nameShim =
    "var __name = typeof __name === 'function' ? __name : ((target, value) => (typeof Object.defineProperty === 'function' ? Object.defineProperty(target, 'name', { value, configurable: true }) : target));\n";
  const sourceToTransform = TEMPLATE_PREVIEW_FOCUS_BRIDGE_SCRIPT.includes('var __name')
    ? TEMPLATE_PREVIEW_FOCUS_BRIDGE_SCRIPT
    : `${nameShim}${TEMPLATE_PREVIEW_FOCUS_BRIDGE_SCRIPT}`;
  const minified = await transform(sourceToTransform, {
    minify: true,
    target: 'es2020',
    legalComments: 'none',
  });
  const source = [
    "'use strict';",
    '',
    `// Generated from visual editor bridge (v${TEMPLATE_PREVIEW_FOCUS_BRIDGE_VERSION}).`,
    `module.exports = ${JSON.stringify(minified.code.trim())};`,
    '',
  ].join('\n');
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, source, 'utf8');
  process.stdout.write(`Built template preview bridge: ${outputPath}\n`);
}

export async function buildLocalTemplateLab() {
  const inputPath = join(__dirname, 'local-template-lab.cjs');
  const outputPath = join(toolsDir, 'local-template-lab.cjs');
  await mkdir(dirname(outputPath), { recursive: true });

  let rawSource = await readFile(inputPath, 'utf8');
  if (rawSource.startsWith('#!')) {
    rawSource = rawSource.replace(/^#![^\r\n]*[\r\n]+/, '');
  }

  const fallbackMatch = rawSource.match(
    /const FALLBACK_LOCAL_VISUAL_BRIDGE_SCRIPT = String\.raw`([\s\S]*?)`;/,
  );
  if (fallbackMatch && fallbackMatch[1]) {
    const minifiedFallback = await transform(fallbackMatch[1], {
      minify: true,
      target: 'es2020',
      legalComments: 'none',
    });
    rawSource = rawSource.replace(
      fallbackMatch[0],
      `const FALLBACK_LOCAL_VISUAL_BRIDGE_SCRIPT = ${JSON.stringify(minifiedFallback.code.trim())};`,
    );
  }

  const result = await transform(rawSource, {
    minify: true,
    target: 'node20',
    format: 'cjs',
    legalComments: 'none',
  });

  const finalSource = `#!/usr/bin/env node\n${result.code}`;
  await writeFile(outputPath, finalSource, 'utf8');
  await chmod(outputPath, 0o755).catch(() => undefined);
  process.stdout.write(`Built local template lab: ${outputPath}\n`);
}

export async function buildAllTools() {
  await buildStandaloneTemplateValidator();
  await buildTemplatePreviewBridge();
  await buildLocalTemplateLab();
  process.stdout.write('All tools built successfully.\n');
}

if (require.main === module) {
  void buildAllTools().catch((error: unknown) => {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  });
}
