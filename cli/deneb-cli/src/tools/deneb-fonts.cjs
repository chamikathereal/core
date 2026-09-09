'use strict';

const {
  DENEB_FONT_REGISTRY,
  DENEB_GOOGLE_FONT_COUNT,
  listFontsByCategory,
  normalizeFontId,
  installProjectFonts,
} = (() => {
  try {
    return {
      ...require('@deneb-ui/core'),
      ...require('@deneb-ui/core/install-fonts'),
    };
  } catch {
    return {
      ...require('../../../../packages/deneb-core/dist/index.js'),
      ...require('../../../../packages/deneb-core/dist/fonts/installProject.js'),
    };
  }
})();

function runFontsList(options = {}) {
  if (options.json) {
    console.log(
      JSON.stringify(
        { count: DENEB_FONT_REGISTRY.length, google: DENEB_GOOGLE_FONT_COUNT, grouped: listFontsByCategory() },
        null,
        2,
      ),
    );
    return 0;
  }

  console.log(
    `\n\x1b[1mDENEB Font Catalog\x1b[0m — ${DENEB_FONT_REGISTRY.length} presets (${DENEB_GOOGLE_FONT_COUNT} on Google Fonts)\n`,
  );
  const grouped = listFontsByCategory();
  for (const [category, fonts] of Object.entries(grouped)) {
    console.log(`\x1b[36m${category}\x1b[0m`);
    for (const font of fonts) {
      const badge = font.googleFonts ? 'google' : font.substituteId ? `→ ${font.substituteId}` : 'system';
      console.log(`  ${font.id.padEnd(22)} ${font.label.padEnd(24)} \x1b[90m${badge}\x1b[0m`);
    }
    console.log('');
  }
  return 0;
}

function parseInstallArgs(argv) {
  const fontIds = [];
  let all = false;
  let target = '.';
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--all') all = true;
    else if (arg === '--font' || arg === '-f') fontIds.push(normalizeFontId(argv[++i] || ''));
    else if (arg.startsWith('--font=')) fontIds.push(normalizeFontId(arg.split('=')[1]));
    else if (arg === '--json') continue;
    else if (!arg.startsWith('-')) target = arg;
  }
  return { target, fontIds: fontIds.filter(Boolean), all };
}

function runFontsInstall(projectDirInput, args = []) {
  const parsed = Array.isArray(args)
    ? { target: projectDirInput, fontIds: parseInstallArgs(args).fontIds, all: parseInstallArgs(args).all }
    : parseInstallArgs([projectDirInput, ...(args || [])]);

  const result = installProjectFonts({
    projectDir: parsed.target || projectDirInput || '.',
    fontIds: parsed.fontIds,
    all: parsed.all,
  });
  return result.ok ? 0 : 1;
}

function runFontsCommand(argv = []) {
  const sub = argv[0];
  const rest = argv.slice(1);
  let json = rest.includes('--json');

  if (sub === 'list') return runFontsList({ json });
  if (sub === 'install') {
    const parsed = parseInstallArgs(rest);
    const result = installProjectFonts({
      projectDir: parsed.target,
      fontIds: parsed.fontIds,
      all: parsed.all,
    });
    return result.ok ? 0 : 1;
  }

  console.log(`Usage: deneb fonts <command> [directory] [options]

Commands:
  list                 Show all ${DENEB_FONT_REGISTRY.length} curated DENEB font presets
  install [dir]        Download @fontsource packages, write CSS, patch layout

Options:
  --font <id>          Install a specific font (repeatable)
  --all                Install all Google Fonts presets (~${DENEB_GOOGLE_FONT_COUNT} packages)
  --json               JSON output for list

Examples:
  deneb fonts list
  deneb fonts install .
  deneb fonts install . --font inter --font playfair-display
  deneb fonts install . --all
`);
  return 1;
}

module.exports = { runFontsCommand, runFontsInstall, runFontsList };
