export const VISUAL_CUSTOMIZATION_VERSION = 1 as const;
export const PREMIUM_TEMPLATE_TIER = 'PREMIUM';
export const CUSTOM_TEMPLATE_TIER = 'CUSTOM';

export type VisualCustomizationColors = {
  primary?: string;
  secondary?: string;
  accent?: string;
  background?: string;
  text?: string;
  surface?: string;
  surfaceAlt?: string;
  heading?: string;
  mutedText?: string;
  border?: string;
  headerBackground?: string;
  footerBackground?: string;
  cardBackground?: string;
  buttonBackground?: string;
  buttonText?: string;
};

export type VisualCustomizationTypography = {
  headingFont?: string;
  bodyFont?: string;
  baseSize?: string;
  headingScale?: string;
  bodyLineHeight?: string;
  headingLineHeight?: string;
  headingWeight?: string;
  bodyWeight?: string;
  letterSpacing?: string;
};

export type VisualCustomizationSpacing = {
  heroMinHeight?: string;
  sectionPadding?: string;
  contentMaxWidth?: string;
  containerPadding?: string;
  sectionGap?: string;
  elementGap?: string;
  gridGap?: string;
};

export type VisualCustomizationLayout = {
  textAlign?: string;
  contentAlign?: string;
  heroTextAlign?: string;
  cardTextAlign?: string;
  gridColumns?: string;
};

export type VisualCustomizationComponents = {
  cardWidth?: string;
  cardMinHeight?: string;
  cardPadding?: string;
  cardRadius?: string;
  cardBorderWidth?: string;
  cardShadow?: string;
  buttonPadding?: string;
  buttonRadius?: string;
  buttonShadow?: string;
  imageRadius?: string;
  headerHeight?: string;
};

export type VisualCustomizationSectionOverride = {
  backgroundColor?: string;
  textColor?: string;
  headingColor?: string;
  minHeight?: string;
  padding?: string;
  contentMaxWidth?: string;
  gap?: string;
  textAlign?: string;
  contentAlign?: string;
  cardBackgroundColor?: string;
  cardWidth?: string;
  cardMinHeight?: string;
  cardRadius?: string;
  gridColumns?: string;
  visible?: boolean;
};

export type VisualCustomizationElementStyle = {
  fontFamily?: string;
  fontSize?: string;
  lineHeight?: string;
  fontWeight?: string;
  letterSpacing?: string;
  color?: string;
  backgroundColor?: string;
  textAlign?: string;
  width?: string;
  height?: string;
  minWidth?: string;
  minHeight?: string;
  maxWidth?: string;
  maxHeight?: string;
  marginTop?: string;
  marginRight?: string;
  marginBottom?: string;
  marginLeft?: string;
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  borderRadius?: string;
};

export type VisualCustomization = {
  version: typeof VISUAL_CUSTOMIZATION_VERSION;
  colors?: VisualCustomizationColors;
  colorReplacements?: Record<string, string>;
  typography?: VisualCustomizationTypography;
  spacing?: VisualCustomizationSpacing;
  layout?: VisualCustomizationLayout;
  components?: VisualCustomizationComponents;
  sections?: Record<string, VisualCustomizationSectionOverride>;
  elementStyles?: Record<string, VisualCustomizationElementStyle>;
};

export type ThemeSchemaDefaults = {
  colors?: VisualCustomizationColors;
  typography?: VisualCustomizationTypography;
  spacing?: VisualCustomizationSpacing;
  layout?: VisualCustomizationLayout;
  components?: VisualCustomizationComponents;
  sections?: Record<string, VisualCustomizationSectionOverride>;
  elementStyles?: Record<string, VisualCustomizationElementStyle>;
};

export type ThemeSchema = {
  version: number;
  tokens?: string[];
  defaults?: ThemeSchemaDefaults;
};

export type TemplateThemeShape = {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  textColor?: string;
  surfaceColor?: string;
  surfaceAltColor?: string;
  headingColor?: string;
  mutedTextColor?: string;
  borderColor?: string;
  headerBackgroundColor?: string;
  footerBackgroundColor?: string;
  cardBackgroundColor?: string;
  buttonBackgroundColor?: string;
  buttonTextColor?: string;
  headingFont?: string;
  bodyFont?: string;
  baseSize?: string;
  headingScale?: string;
  bodyLineHeight?: string;
  headingLineHeight?: string;
  headingWeight?: string;
  bodyWeight?: string;
  letterSpacing?: string;
  heroMinHeight?: string;
  sectionPadding?: string;
  contentMaxWidth?: string;
  containerPadding?: string;
  sectionGap?: string;
  elementGap?: string;
  gridGap?: string;
  textAlign?: string;
  contentAlign?: string;
  heroTextAlign?: string;
  cardTextAlign?: string;
  gridColumns?: string;
  cardWidth?: string;
  cardMinHeight?: string;
  cardPadding?: string;
  cardRadius?: string;
  cardBorderWidth?: string;
  cardShadow?: string;
  buttonPadding?: string;
  buttonRadius?: string;
  buttonShadow?: string;
  imageRadius?: string;
  headerHeight?: string;
  style?: string;
  designCustomizationVersion?: number;
  colorReplacements?: Record<string, string>;
  sections?: Record<string, VisualCustomizationSectionOverride>;
  elementStyles?: Record<string, VisualCustomizationElementStyle>;
};

const COLOR_KEYS = [
  'primary',
  'secondary',
  'accent',
  'background',
  'text',
  'surface',
  'surfaceAlt',
  'heading',
  'mutedText',
  'border',
  'headerBackground',
  'footerBackground',
  'cardBackground',
  'buttonBackground',
  'buttonText',
] as const;

const TYPOGRAPHY_KEYS = [
  'headingFont',
  'bodyFont',
  'baseSize',
  'headingScale',
  'bodyLineHeight',
  'headingLineHeight',
  'headingWeight',
  'bodyWeight',
  'letterSpacing',
] as const;

const SPACING_KEYS = [
  'heroMinHeight',
  'sectionPadding',
  'contentMaxWidth',
  'containerPadding',
  'sectionGap',
  'elementGap',
  'gridGap',
] as const;

const LAYOUT_KEYS = [
  'textAlign',
  'contentAlign',
  'heroTextAlign',
  'cardTextAlign',
  'gridColumns',
] as const;

const COMPONENT_KEYS = [
  'cardWidth',
  'cardMinHeight',
  'cardPadding',
  'cardRadius',
  'cardBorderWidth',
  'cardShadow',
  'buttonPadding',
  'buttonRadius',
  'buttonShadow',
  'imageRadius',
  'headerHeight',
] as const;

const SECTION_STRING_KEYS = [
  'backgroundColor',
  'textColor',
  'headingColor',
  'minHeight',
  'padding',
  'contentMaxWidth',
  'gap',
  'textAlign',
  'contentAlign',
  'cardBackgroundColor',
  'cardWidth',
  'cardMinHeight',
  'cardRadius',
  'gridColumns',
] as const;

export const ELEMENT_STYLE_KEYS = [
  'fontFamily',
  'fontSize',
  'lineHeight',
  'fontWeight',
  'letterSpacing',
  'color',
  'backgroundColor',
  'textAlign',
  'width',
  'height',
  'minWidth',
  'minHeight',
  'maxWidth',
  'maxHeight',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'borderRadius',
] as const;

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function safeDesignValue(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (trimmed.length > 160) return undefined;
  if (/[;{}<>\r\n]/.test(trimmed)) return undefined;
  if (/(?:url\s*\(|expression\s*\(|@import|javascript:)/i.test(trimmed)) {
    return undefined;
  }
  return trimmed;
}

function normalizeHexColor(value: string) {
  const normalized = value.trim().toLowerCase();
  const short = normalized.match(/^#([0-9a-f]{3})$/);
  if (short) {
    return `#${[...short[1]].map((digit) => digit.repeat(2)).join('')}`;
  }
  return /^#[0-9a-f]{6}$/.test(normalized) ? normalized : null;
}

function parseColorReplacements(value: unknown) {
  if (!isPlainRecord(value)) return undefined;
  const replacements: Record<string, string> = {};
  for (const [source, replacement] of Object.entries(value).slice(0, 64)) {
    if (typeof replacement !== 'string') continue;
    const normalizedSource = normalizeHexColor(source);
    const normalizedReplacement = normalizeHexColor(replacement);
    if (!normalizedSource || !normalizedReplacement) continue;
    replacements[normalizedSource] = normalizedReplacement;
  }
  return Object.keys(replacements).length > 0 ? replacements : undefined;
}

function pickSafeStrings<const Key extends string>(
  value: unknown,
  keys: readonly Key[],
): Partial<Record<Key, string>> | undefined {
  if (!isPlainRecord(value)) return undefined;
  const result: Partial<Record<Key, string>> = {};
  for (const key of keys) {
    if (typeof value[key] !== 'string') continue;
    const safe = safeDesignValue(value[key]);
    if (safe !== undefined) result[key] = safe;
  }
  return Object.keys(result).length > 0 ? result : undefined;
}

function isSafeSectionKey(key: string) {
  return /^[a-zA-Z0-9_-]{1,64}$/.test(key);
}

function isSafeElementPath(path: string) {
  return /^[a-zA-Z0-9_.:\[\]-]{1,180}$/.test(path);
}

export function normalizeTemplateTier(tier: string | null | undefined) {
  return tier?.trim().toUpperCase() ?? 'STANDARD';
}

export function isPremiumTemplateTier(tier: string | null | undefined) {
  return normalizeTemplateTier(tier) === PREMIUM_TEMPLATE_TIER;
}

export function isFullVisualCustomizationTier(tier: string | null | undefined) {
  const normalizedTier = normalizeTemplateTier(tier);
  return (
    normalizedTier === PREMIUM_TEMPLATE_TIER ||
    normalizedTier === CUSTOM_TEMPLATE_TIER
  );
}

export function emptyVisualCustomization(): VisualCustomization {
  return { version: VISUAL_CUSTOMIZATION_VERSION };
}

export function parseVisualCustomization(value: unknown): VisualCustomization {
  if (!isPlainRecord(value)) {
    return emptyVisualCustomization();
  }

  const colors = pickSafeStrings(value.colors, COLOR_KEYS);
  const colorReplacements = parseColorReplacements(value.colorReplacements);
  const typography = pickSafeStrings(value.typography, TYPOGRAPHY_KEYS);
  const spacing = pickSafeStrings(value.spacing, SPACING_KEYS);
  const layout = pickSafeStrings(value.layout, LAYOUT_KEYS);
  const components = pickSafeStrings(value.components, COMPONENT_KEYS);

  const sections: Record<string, VisualCustomizationSectionOverride> = {};
  if (isPlainRecord(value.sections)) {
    for (const [key, sectionValue] of Object.entries(value.sections)) {
      if (!isSafeSectionKey(key) || !isPlainRecord(sectionValue)) continue;
      const strings = pickSafeStrings(sectionValue, SECTION_STRING_KEYS) ?? {};
      const section: VisualCustomizationSectionOverride = { ...strings };
      if (typeof sectionValue.visible === 'boolean') {
        section.visible = sectionValue.visible;
      }
      if (Object.keys(section).length > 0) sections[key] = section;
    }
  }

  const elementStyles: Record<string, VisualCustomizationElementStyle> = {};
  if (isPlainRecord(value.elementStyles)) {
    for (const [path, styleValue] of Object.entries(value.elementStyles).slice(
      0,
      256,
    )) {
      if (!isSafeElementPath(path) || !isPlainRecord(styleValue)) continue;
      const style = pickSafeStrings(styleValue, ELEMENT_STYLE_KEYS);
      if (style && Object.keys(style).length > 0) {
        elementStyles[path] = style;
      }
    }
  }

  return {
    version: VISUAL_CUSTOMIZATION_VERSION,
    ...(colors ? { colors } : {}),
    ...(colorReplacements ? { colorReplacements } : {}),
    ...(typography ? { typography } : {}),
    ...(spacing ? { spacing } : {}),
    ...(layout ? { layout } : {}),
    ...(components ? { components } : {}),
    ...(Object.keys(sections).length > 0 ? { sections } : {}),
    ...(Object.keys(elementStyles).length > 0 ? { elementStyles } : {}),
  };
}

export function limitVisualCustomizationForTier(
  value: unknown,
  tier: string | null | undefined,
): VisualCustomization {
  const parsed = parseVisualCustomization(value);
  if (isFullVisualCustomizationTier(tier)) return parsed;

  // Standard can save color tokens only. The client groups tokens
  // that share the same loaded value and submits each grouped token together.
  return parseVisualCustomization({
    version: VISUAL_CUSTOMIZATION_VERSION,
    colors: parsed.colors,
    colorReplacements: parsed.colorReplacements,
  });
}

export function parseThemeSchema(manifest: unknown): ThemeSchema | null {
  if (!isPlainRecord(manifest)) return null;
  const themeSchema = manifest.themeSchema;
  if (!isPlainRecord(themeSchema)) return null;

  const parsedDefaults = parseVisualCustomization(
    isPlainRecord(themeSchema.defaults)
      ? { version: VISUAL_CUSTOMIZATION_VERSION, ...themeSchema.defaults }
      : null,
  );
  const defaults: ThemeSchemaDefaults = {
    ...(parsedDefaults.colors ? { colors: parsedDefaults.colors } : {}),
    ...(parsedDefaults.typography
      ? { typography: parsedDefaults.typography }
      : {}),
    ...(parsedDefaults.spacing ? { spacing: parsedDefaults.spacing } : {}),
    ...(parsedDefaults.layout ? { layout: parsedDefaults.layout } : {}),
    ...(parsedDefaults.components
      ? { components: parsedDefaults.components }
      : {}),
    ...(parsedDefaults.sections ? { sections: parsedDefaults.sections } : {}),
  };

  return {
    version: typeof themeSchema.version === 'number' ? themeSchema.version : 1,
    tokens: Array.isArray(themeSchema.tokens)
      ? themeSchema.tokens.filter(
          (token): token is string => typeof token === 'string',
        )
      : undefined,
    ...(Object.keys(defaults).length > 0 ? { defaults } : {}),
  };
}

export function getDefaultThemeTokens(
  themeSchema: ThemeSchema | null,
  baseTheme: TemplateThemeShape | null | undefined,
): ThemeSchemaDefaults {
  const defaults: ThemeSchemaDefaults = {
    colors: {
      primary: baseTheme?.primaryColor ?? '#088395',
      secondary: baseTheme?.secondaryColor,
      accent: baseTheme?.accentColor,
      background: baseTheme?.backgroundColor,
      text: baseTheme?.textColor,
      surface: baseTheme?.surfaceColor,
      surfaceAlt: baseTheme?.surfaceAltColor,
      heading: baseTheme?.headingColor,
      mutedText: baseTheme?.mutedTextColor,
      border: baseTheme?.borderColor,
      headerBackground: baseTheme?.headerBackgroundColor,
      footerBackground: baseTheme?.footerBackgroundColor,
      cardBackground: baseTheme?.cardBackgroundColor,
      buttonBackground: baseTheme?.buttonBackgroundColor,
      buttonText: baseTheme?.buttonTextColor,
    },
    typography: {
      headingFont: baseTheme?.headingFont,
      bodyFont: baseTheme?.bodyFont,
      baseSize: baseTheme?.baseSize,
      headingScale: baseTheme?.headingScale,
      bodyLineHeight: baseTheme?.bodyLineHeight,
      headingLineHeight: baseTheme?.headingLineHeight,
      headingWeight: baseTheme?.headingWeight,
      bodyWeight: baseTheme?.bodyWeight,
      letterSpacing: baseTheme?.letterSpacing,
    },
    spacing: {
      heroMinHeight: baseTheme?.heroMinHeight ?? '80vh',
      sectionPadding: baseTheme?.sectionPadding ?? '4rem',
      contentMaxWidth: baseTheme?.contentMaxWidth,
      containerPadding: baseTheme?.containerPadding,
      sectionGap: baseTheme?.sectionGap,
      elementGap: baseTheme?.elementGap,
      gridGap: baseTheme?.gridGap,
    },
    layout: {
      textAlign: baseTheme?.textAlign,
      contentAlign: baseTheme?.contentAlign,
      heroTextAlign: baseTheme?.heroTextAlign,
      cardTextAlign: baseTheme?.cardTextAlign,
      gridColumns: baseTheme?.gridColumns,
    },
    components: {
      cardWidth: baseTheme?.cardWidth,
      cardMinHeight: baseTheme?.cardMinHeight,
      cardPadding: baseTheme?.cardPadding,
      cardRadius: baseTheme?.cardRadius,
      cardBorderWidth: baseTheme?.cardBorderWidth,
      cardShadow: baseTheme?.cardShadow,
      buttonPadding: baseTheme?.buttonPadding,
      buttonRadius: baseTheme?.buttonRadius,
      buttonShadow: baseTheme?.buttonShadow,
      imageRadius: baseTheme?.imageRadius,
      headerHeight: baseTheme?.headerHeight,
    },
  };

  if (!themeSchema?.defaults) return defaults;
  return {
    colors: { ...defaults.colors, ...themeSchema.defaults.colors },
    typography: {
      ...defaults.typography,
      ...themeSchema.defaults.typography,
    },
    spacing: { ...defaults.spacing, ...themeSchema.defaults.spacing },
    layout: { ...defaults.layout, ...themeSchema.defaults.layout },
    components: {
      ...defaults.components,
      ...themeSchema.defaults.components,
    },
    sections: themeSchema.defaults.sections,
  };
}

export function customizationToTheme(
  customization: VisualCustomization,
): TemplateThemeShape {
  const colors = customization.colors ?? {};
  const typography = customization.typography ?? {};
  const spacing = customization.spacing ?? {};
  const layout = customization.layout ?? {};
  const components = customization.components ?? {};
  return {
    designCustomizationVersion: VISUAL_CUSTOMIZATION_VERSION,
    colorReplacements: customization.colorReplacements,
    primaryColor: colors.primary,
    secondaryColor: colors.secondary,
    accentColor: colors.accent,
    backgroundColor: colors.background,
    textColor: colors.text,
    surfaceColor: colors.surface,
    surfaceAltColor: colors.surfaceAlt,
    headingColor: colors.heading,
    mutedTextColor: colors.mutedText,
    borderColor: colors.border,
    headerBackgroundColor: colors.headerBackground,
    footerBackgroundColor: colors.footerBackground,
    cardBackgroundColor: colors.cardBackground,
    buttonBackgroundColor: colors.buttonBackground,
    buttonTextColor: colors.buttonText,
    ...typography,
    ...spacing,
    ...layout,
    ...components,
    sections: customization.sections,
    elementStyles: customization.elementStyles,
  };
}

export function mergeVisualCustomizationIntoTheme(
  baseTheme: TemplateThemeShape | null | undefined,
  customization: unknown,
  templateTier: string | null | undefined,
): TemplateThemeShape | null {
  const parsed = limitVisualCustomizationForTier(customization, templateTier);
  const hasOverrides =
    [
      'colors',
      'colorReplacements',
      'typography',
      'spacing',
      'layout',
      'components',
    ].some((key) => {
      const group = parsed[key as keyof VisualCustomization];
      return Boolean(
        group &&
        typeof group === 'object' &&
        Object.values(group).some(
          (value) => value !== undefined && value !== '',
        ),
      );
    }) ||
    Boolean(parsed.sections && Object.keys(parsed.sections).length > 0) ||
    Boolean(
      parsed.elementStyles && Object.keys(parsed.elementStyles).length > 0,
    );

  if (!hasOverrides) return baseTheme ?? null;

  const overrideTheme = customizationToTheme(parsed);
  return Object.fromEntries(
    Object.entries({ ...(baseTheme ?? {}), ...overrideTheme }).filter(
      ([, value]) => value !== undefined,
    ),
  );
}

export function mergeCustomizationRecords(
  base: VisualCustomization,
  patch: Partial<VisualCustomization>,
): VisualCustomization {
  return {
    version: VISUAL_CUSTOMIZATION_VERSION,
    colors: { ...base.colors, ...patch.colors },
    colorReplacements: {
      ...base.colorReplacements,
      ...patch.colorReplacements,
    },
    typography: { ...base.typography, ...patch.typography },
    spacing: { ...base.spacing, ...patch.spacing },
    layout: { ...base.layout, ...patch.layout },
    components: { ...base.components, ...patch.components },
    sections: { ...base.sections, ...patch.sections },
    elementStyles: Object.fromEntries(
      Array.from(
        new Set([
          ...Object.keys(base.elementStyles ?? {}),
          ...Object.keys(patch.elementStyles ?? {}),
        ]),
      ).map((path) => [
        path,
        {
          ...base.elementStyles?.[path],
          ...patch.elementStyles?.[path],
        },
      ]),
    ),
  };
}

export function seedVisualCustomizationFromRequirements(input: {
  preferredColorTheme?: string | null;
  preferredStyle?: string | null;
}): VisualCustomization {
  const customization = emptyVisualCustomization();
  const preferredColor = input.preferredColorTheme?.trim();
  const preferredStyle = input.preferredStyle?.trim();

  if (preferredColor) customization.colors = { primary: preferredColor };
  if (preferredStyle) customization.typography = { bodyFont: preferredStyle };
  return parseVisualCustomization(customization);
}
