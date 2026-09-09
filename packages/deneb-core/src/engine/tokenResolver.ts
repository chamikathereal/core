export { resolveFontFamily } from '../fonts/resolve';

const SHADOW_PRESETS: Record<string, string> = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
};

export function resolveShadowPreset(value: string | undefined): string | undefined {
  if (!value) return undefined;
  return SHADOW_PRESETS[value] ?? value;
}

export function resolveThemeToken(value: string | undefined): string | undefined {
  if (!value) return undefined;
  if (value.startsWith('var(')) return value;
  const themeMap: Record<string, string> = {
    primary: 'var(--brand-color, #2563eb)',
    secondary: 'var(--brand-secondary, #0f172a)',
    surface: 'var(--surface-color, #ffffff)',
    background: 'var(--page-bg, #f8fafc)',
    heading: 'var(--heading-color, #0f172a)',
    muted: 'var(--muted-color, #64748b)',
  };
  return themeMap[value] ?? value;
}
