export type DenebFontCategory =
  | 'sans-serif'
  | 'serif'
  | 'slab-serif'
  | 'monospace'
  | 'display'
  | 'system';

export interface DenebFontDefinition {
  /** Stable slug for Fivora + site-data (e.g. `plus-jakarta-sans`) */
  id: string;
  /** Human label shown in editors */
  label: string;
  category: DenebFontCategory;
  /** Primary CSS family name */
  family: string;
  /** Full CSS font-family stack */
  cssStack: string;
  /** @fontsource package name (without scope), null when not installable */
  fontsourcePackage: string | null;
  /** Google Fonts API family query segment */
  googleQuery: string | null;
  /** Whether this font is served from Google Fonts */
  googleFonts: boolean;
  /** Default weights to install / load */
  weights: number[];
  /** Include italic axis in Google Fonts request */
  italic?: boolean;
  /** Use variable font bundle when installing via @fontsource */
  variable?: boolean;
  /** When not on Google Fonts, maps to this registry id for install/load */
  substituteId?: string;
}

export interface DenebFontManifest {
  version: 1;
  installedAt: string;
  fonts: Array<{
    id: string;
    fontsourcePackage: string;
    weights: number[];
    variable?: boolean;
  }>;
}
