'use strict';

/**
 * Runs after `npm install @deneb-ui/ui`.
 * Walks up to the host Next/React app and self-hosts project fonts.
 * Skip with DENEB_SKIP_FONTS=1.
 */
if (process.env.DENEB_SKIP_FONTS === '1') {
  process.exit(0);
}

try {
  const { installFontsForHostOf } = require('@deneb-ui/core/install-fonts');
  const result = installFontsForHostOf(__dirname);
  if (result.skipped) {
    process.exit(0);
  }
  if (result.ok && result.installed.length > 0) {
    console.log(
      `[@deneb-ui/ui] Configured ${result.installed.length} font(s): ${result.installed.join(', ')}`,
    );
  }
} catch {
  // Never fail the host npm install because fonts could not be configured.
  process.exit(0);
}
