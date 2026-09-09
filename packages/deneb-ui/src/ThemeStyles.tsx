import React from 'react';
import { ResponsiveBaseStyles } from './ResponsiveBaseStyles';

export interface TemplateTheme {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  textColor?: string;
  headingColor?: string;
  mutedTextColor?: string;
  linkColor?: string;
  heroMinHeight?: string;
  sectionPadding?: string;
  baseSize?: string;
  headingFont?: string;
  bodyFont?: string;
  borderRadius?: string;
  align?: 'left' | 'center' | 'right';
  [key: string]: unknown;
}

/**
 * Pre-configured, high-converting theme presets tailored for different business categories.
 * Allows developers and AI agents to instantly generate distinct designs without copy-pasting styles.
 */
export const THEME_PRESETS: Record<string, TemplateTheme> = {
  restaurant: {
    primaryColor: '#b45309', // Warm amber
    secondaryColor: '#1c1917', // Deep charcoal
    accentColor: '#f59e0b', // Golden yellow
    backgroundColor: '#0c0a09', // Dark atmospheric background
    textColor: '#f5f5f4', // Off-white
    headingFont: 'Playfair Display, Georgia, serif',
    bodyFont: 'Inter, sans-serif',
    borderRadius: '12px',
    align: 'left',
  },
  medical: {
    primaryColor: '#0284c7', // Serene ocean blue
    secondaryColor: '#0f172a', // Deep slate
    accentColor: '#0d9488', // Teal accent
    backgroundColor: '#ffffff', // Pure clean white
    textColor: '#334155', // Slate body text
    headingFont: 'Plus Jakarta Sans, sans-serif',
    bodyFont: 'Inter, sans-serif',
    borderRadius: '8px',
    align: 'left',
  },
  luxury: {
    primaryColor: '#d4af37', // Metallic gold
    secondaryColor: '#000000', // Jet black
    accentColor: '#e5e5e5', // Platinum silver
    backgroundColor: '#0a0a0a', // Obsidian dark
    textColor: '#ffffff',
    headingFont: 'Cormorant Garamond, serif',
    bodyFont: 'Montserrat, sans-serif',
    borderRadius: '4px',
    align: 'center',
  },
  tech: {
    primaryColor: '#6366f1', // Electric indigo
    secondaryColor: '#0f172a', // Dark slate
    accentColor: '#06b6d4', // Neon cyan
    backgroundColor: '#030712', // Midnight abyss
    textColor: '#f8fafc',
    headingFont: 'Inter, system-ui, sans-serif',
    bodyFont: 'Inter, sans-serif',
    borderRadius: '16px',
    align: 'left',
  },
  retail: {
    primaryColor: '#e11d48', // Vibrant rose/coral
    secondaryColor: '#18181b', // Zinc
    accentColor: '#fbbf24', // Sunny amber
    backgroundColor: '#ffffff',
    textColor: '#27272a',
    headingFont: 'Outfit, sans-serif',
    bodyFont: 'Inter, sans-serif',
    borderRadius: '12px',
    align: 'left',
  },
  corporate: {
    primaryColor: '#1e3a8a', // Corporate navy
    secondaryColor: '#0f172a', // Slate
    accentColor: '#3b82f6', // Bright cobalt
    backgroundColor: '#f8fafc', // Soft light gray
    textColor: '#1e293b',
    headingFont: 'Merriweather, serif',
    bodyFont: 'Inter, sans-serif',
    borderRadius: '6px',
    align: 'left',
  },
  cyberpunk: {
    primaryColor: '#f43f5e', // Neon crimson
    secondaryColor: '#09090b', // Deep zinc
    accentColor: '#06b6d4', // Electric cyan
    backgroundColor: '#09090b', // Dark void
    textColor: '#f4f4f5',
    headingFont: 'Outfit, sans-serif',
    bodyFont: 'Inter, sans-serif',
    borderRadius: '4px',
    align: 'left',
  },
  minimalDark: {
    primaryColor: '#e2e8f0', // Clean silver
    secondaryColor: '#000000', // Pitch black
    accentColor: '#38bdf8', // Sky accent
    backgroundColor: '#0c0a09', // Dark basalt
    textColor: '#f1f5f9',
    headingFont: 'Plus Jakarta Sans, sans-serif',
    bodyFont: 'Inter, sans-serif',
    borderRadius: '12px',
    align: 'left',
  },
  nordicPastel: {
    primaryColor: '#0f766e', // Nordic pine
    secondaryColor: '#1e293b', // Deep slate
    accentColor: '#f59e0b', // Amber sun
    backgroundColor: '#fafaf9', // Crisp stone
    textColor: '#334155',
    headingFont: 'Playfair Display, serif',
    bodyFont: 'Inter, sans-serif',
    borderRadius: '16px',
    align: 'left',
  },
  emeraldGold: {
    primaryColor: '#059669', // Emerald
    secondaryColor: '#064e3b', // Deep forest
    accentColor: '#d97706', // Imperial gold
    backgroundColor: '#022c22', // Emerald dark
    textColor: '#ecfdf5',
    headingFont: 'Cormorant Garamond, serif',
    bodyFont: 'Montserrat, sans-serif',
    borderRadius: '10px',
    align: 'center',
  },
};


/**
 * Merges category presets with custom developer/agent overrides.
 */
export function getCategoryTheme(
  category: keyof typeof THEME_PRESETS | string,
  overrides?: Partial<TemplateTheme>,
): TemplateTheme {
  const base = THEME_PRESETS[category] || THEME_PRESETS.tech;
  return { ...base, ...overrides };
}

/**
 * Extracts a typed CSSProperties object containing both standard and custom theme tokens.
 * Any custom property defined by a developer in `theme` (e.g. cardBg: "#111")
 * is automatically converted to a CSS variable (e.g. --card-bg: #111).
 */
export function getThemeCssProperties(theme?: TemplateTheme | null): React.CSSProperties {
  const customVars: Record<string, string> = {};

  if (theme) {
    for (const [key, val] of Object.entries(theme)) {
      if (typeof val === 'string' || typeof val === 'number') {
        const cssVarName = `--${key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`;
        customVars[cssVarName] = String(val);
      }
    }
  }

  return {
    '--brand-color': theme?.primaryColor || '#2563eb',
    '--brand-secondary': theme?.secondaryColor || '#0f172a',
    '--brand-accent': theme?.accentColor || '#14b8a6',
    '--page-background': theme?.backgroundColor || '#ffffff',
    '--page-text': theme?.textColor || '#0f172a',
    '--heading-color': theme?.headingColor || theme?.secondaryColor || '#0f172a',
    '--muted-text': theme?.mutedTextColor || '#64748b',
    '--link-color': theme?.linkColor || theme?.primaryColor || '#2563eb',
    '--hero-min-height': theme?.heroMinHeight || '72vh',
    '--section-padding': theme?.sectionPadding || '5rem',
    '--base-size': theme?.baseSize || '16px',
    '--heading-font': theme?.headingFont || 'Inter, sans-serif',
    '--body-font': theme?.bodyFont || 'Inter, sans-serif',
    '--border-radius': theme?.borderRadius || '8px',
    '--content-align': theme?.align || 'left',
    fontFamily: theme?.bodyFont || 'Inter, sans-serif',
    ...customVars,
  } as React.CSSProperties;
}

export interface ThemeStylesProps {
  theme?: TemplateTheme | null;
  defaultPrimary?: string;
  defaultSecondary?: string;
  defaultAccent?: string;
  defaultBg?: string;
  defaultText?: string;
}

/**
 * Automatically injects standard and custom fivora theme variables into the document.
 */
export function ThemeStyles({
  theme,
  defaultPrimary = '#2563eb',
  defaultSecondary = '#0f172a',
  defaultAccent = '#14b8a6',
  defaultBg = '#ffffff',
  defaultText = '#0f172a',
}: ThemeStylesProps) {
  const styleProps = getThemeCssProperties(theme);
  const cssLines = Object.entries(styleProps)
    .filter(([key]) => key.startsWith('--'))
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n');

  const css = `
    :root {
${cssLines}
    }
  `;

  return (
    <>
      <ResponsiveBaseStyles />
      <style dangerouslySetInnerHTML={{ __html: css }} />
    </>
  );
}
