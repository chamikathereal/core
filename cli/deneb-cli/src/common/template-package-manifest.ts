import {
  findDuplicateTemplateEditorPaths,
  normalizeTemplateEditorSchema,
  type TemplateEditorSchema,
} from './template-editor-schema';
import type { TemplateVisualEditingConfig } from './template-visual-edit-contract';
import { parseThemeSchema, type ThemeSchema } from './visual-customization';

export type TemplatePackageManifest = {
  framework: 'nextjs-static-export';
  version: number;
  siteDataFile: string;
  contentDefaults?: Record<string, unknown> | null;
  editorSchema?: TemplateEditorSchema | null;
  pages?: Array<{
    id: string;
    label: string;
    route?: string;
    required?: boolean;
    description?: string;
  }>;
  visualEditing?: TemplateVisualEditingConfig | null;
  themeSchema?: ThemeSchema;
  colorPalette?: Array<{
    color: string;
    usageCount: number;
  }>;
  outputDirectory?: string;
  installCommand?: string;
  buildCommand?: string;
  basePathEnvVar?: string;
  publicSiteUrlEnvVar?: string;
  renderedContentPathsByPage?: Record<string, string[]>;
};

type ErrorFactory = (message: string) => Error;

const defaultErrorFactory: ErrorFactory = (message) => new Error(message);
const ALLOWED_INSTALL_COMMANDS = new Set([
  'npm install',
  'npm ci',
  'pnpm install',
  'pnpm install --frozen-lockfile',
  'yarn install',
  'yarn install --frozen-lockfile',
]);
const ALLOWED_BUILD_COMMANDS = new Set([
  'npm run build',
  'pnpm run build',
  'yarn build',
  'yarn run build',
]);

/**
 * Canonical parser shared by server-side package intake and the downloadable
 * developer preflight CLI. Keeping the parser here prevents a package from
 * passing locally with manifest rules that differ from upload validation.
 */
export function normalizeTemplatePackageManifest(
  input: unknown,
  errorFactory: ErrorFactory = defaultErrorFactory,
): TemplatePackageManifest {
  const fail = (message: string): never => {
    throw errorFactory(message);
  };

  if (!input || typeof input !== 'object') {
    fail('Template manifest is missing or invalid.');
  }

  const candidate = input as Record<string, unknown>;

  if (candidate.framework !== 'nextjs-static-export') {
    fail('Template manifest framework must be "nextjs-static-export".');
  }

  if (
    typeof candidate.siteDataFile !== 'string' ||
    !candidate.siteDataFile.trim()
  ) {
    fail('Template manifest siteDataFile is required.');
  }

  const version =
    typeof candidate.version === 'number' && Number.isFinite(candidate.version)
      ? candidate.version
      : 1;
  const visualEditing = normalizeVisualEditingConfig(
    candidate.visualEditing,
    version,
    errorFactory,
  );
  const editorSchema = normalizeTemplateEditorSchema(candidate.editorSchema);
  const themeSchema = parseThemeSchema(candidate);
  const colorPalette = Array.isArray(candidate.colorPalette)
    ? candidate.colorPalette
        .filter(
          (entry): entry is Record<string, unknown> =>
            Boolean(entry) && typeof entry === 'object',
        )
        .flatMap((entry) => {
          const color =
            typeof entry.color === 'string'
              ? entry.color.trim().toLowerCase()
              : '';
          if (!/^#[0-9a-f]{6}$/.test(color)) return [];
          const usageCount =
            typeof entry.usageCount === 'number' &&
            Number.isFinite(entry.usageCount)
              ? Math.max(1, Math.floor(entry.usageCount))
              : 1;
          return [{ color, usageCount }];
        })
        .slice(0, 40)
    : [];
  const duplicateEditorPaths = findDuplicateTemplateEditorPaths(editorSchema);
  if (duplicateEditorPaths.length > 0) {
    const examples = duplicateEditorPaths
      .slice(0, 5)
      .map((duplicate) => `"${duplicate.path}"`)
      .join(', ');
    fail(
      `Template editorSchema declares the same editable path in more than one place: ${examples}. Keep each primitive field and list in exactly one section; a dedicated nested section must not also be repeated inside its ancestor section.`,
    );
  }

  const installCommand = normalizePackageCommand(
    candidate.installCommand,
    ALLOWED_INSTALL_COMMANDS,
    'installCommand',
    fail,
  );
  const buildCommand = normalizePackageCommand(
    candidate.buildCommand,
    ALLOWED_BUILD_COMMANDS,
    'buildCommand',
    fail,
  );

  return {
    framework: 'nextjs-static-export',
    version,
    siteDataFile: (candidate.siteDataFile as string).trim(),
    editorSchema,
    pages: Array.isArray(candidate.pages)
      ? candidate.pages
          .filter(
            (page): page is Record<string, unknown> =>
              Boolean(page) && typeof page === 'object',
          )
          .map((page) => {
            const id =
              typeof page.id === 'string' && page.id.trim()
                ? page.id.trim()
                : null;
            const label =
              typeof page.label === 'string' && page.label.trim()
                ? page.label.trim()
                : null;

            if (!id || !label) {
              return fail(
                'Each template manifest page must include id and label.',
              );
            }

            return {
              id,
              label,
              route:
                typeof page.route === 'string' && page.route.trim()
                  ? page.route.trim()
                  : undefined,
              required:
                typeof page.required === 'boolean' ? page.required : false,
              description:
                typeof page.description === 'string'
                  ? page.description.trim()
                  : undefined,
            };
          })
      : undefined,
    visualEditing,
    ...(themeSchema ? { themeSchema } : {}),
    ...(colorPalette.length > 0 ? { colorPalette } : {}),
    outputDirectory:
      typeof candidate.outputDirectory === 'string'
        ? candidate.outputDirectory.trim()
        : undefined,
    installCommand,
    buildCommand,
    basePathEnvVar:
      typeof candidate.basePathEnvVar === 'string'
        ? candidate.basePathEnvVar.trim()
        : 'NEXT_PUBLIC_SITE_BASE_PATH',
    publicSiteUrlEnvVar:
      typeof candidate.publicSiteUrlEnvVar === 'string'
        ? candidate.publicSiteUrlEnvVar.trim()
        : undefined,
  };
}

function normalizePackageCommand(
  input: unknown,
  allowed: ReadonlySet<string>,
  fieldName: string,
  fail: (message: string) => never,
) {
  if (input === undefined || input === null || input === '') return undefined;
  if (typeof input !== 'string') {
    return fail(`Template manifest ${fieldName} must be a string.`);
  }
  const command = input.trim().replace(/\s+/g, ' ');
  if (!allowed.has(command)) {
    return fail(
      `Template manifest ${fieldName} is not allowed. Use a standard npm, pnpm, or yarn install/build command.`,
    );
  }
  return command;
}

function normalizeVisualEditingConfig(
  input: unknown,
  manifestVersion: number,
  errorFactory: ErrorFactory,
): TemplateVisualEditingConfig {
  const fail = (message: string): never => {
    throw errorFactory(message);
  };

  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    if (manifestVersion >= 2) {
      fail(
        'Template manifest version 2 requires visualEditing.contractVersion 1 and visualEditing.mode "strict".',
      );
    }
    return {
      contractVersion: 1,
      mode: 'legacy',
    };
  }

  const candidate = input as Record<string, unknown>;
  if (candidate.contractVersion !== 1) {
    fail('Template visualEditing.contractVersion must be 1.');
  }

  const mode =
    candidate.mode === 'strict' || candidate.mode === 'legacy'
      ? candidate.mode
      : null;
  if (!mode) {
    return fail('Template visualEditing.mode must be "strict" or "legacy".');
  }
  if (manifestVersion >= 2 && mode !== 'strict') {
    fail('Template manifest version 2 requires visualEditing.mode "strict".');
  }

  const controlOnlyPaths = Array.isArray(candidate.controlOnlyPaths)
    ? candidate.controlOnlyPaths
        .filter((path): path is string => typeof path === 'string')
        .map((path) => path.trim())
        .filter(Boolean)
    : [];

  return {
    contractVersion: 1,
    mode,
    controlOnlyPaths:
      controlOnlyPaths.length > 0 ? controlOnlyPaths : undefined,
  };
}
