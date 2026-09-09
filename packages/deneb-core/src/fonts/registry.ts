import type { DenebFontCategory, DenebFontDefinition } from './types';

const W = [400, 500, 600, 700];
const W_DISPLAY = [400, 700];
const W_MONO = [400, 500, 600, 700];

function googleFont(
  id: string,
  label: string,
  category: DenebFontCategory,
  fontsourcePackage: string,
  googleQuery: string,
  options?: Partial<Pick<DenebFontDefinition, 'weights' | 'italic' | 'variable' | 'cssStack'>>,
): DenebFontDefinition {
  const family = label;
  return {
    id,
    label,
    category,
    family,
    cssStack: options?.cssStack ?? `'${family}', ${category === 'serif' || category === 'slab-serif' ? 'Georgia, serif' : category === 'monospace' ? 'ui-monospace, monospace' : 'system-ui, sans-serif'}`,
    fontsourcePackage,
    googleQuery,
    googleFonts: true,
    weights: options?.weights ?? W,
    italic: options?.italic,
    variable: options?.variable,
  };
}

/** Curated catalog — 54 web-friendly faces from [Google Fonts](https://fonts.google.com/) */
export const DENEB_FONT_REGISTRY: DenebFontDefinition[] = [
  // ── Sans-serif ──
  googleFont('inter', 'Inter', 'sans-serif', 'inter', 'Inter', { variable: true }),
  googleFont('roboto', 'Roboto', 'sans-serif', 'roboto', 'Roboto'),
  googleFont('open-sans', 'Open Sans', 'sans-serif', 'open-sans', 'Open+Sans', { variable: true }),
  googleFont('lato', 'Lato', 'sans-serif', 'lato', 'Lato', { italic: true }),
  googleFont('montserrat', 'Montserrat', 'sans-serif', 'montserrat', 'Montserrat', { variable: true }),
  googleFont('poppins', 'Poppins', 'sans-serif', 'poppins', 'Poppins'),
  googleFont('nunito', 'Nunito', 'sans-serif', 'nunito', 'Nunito', { variable: true }),
  googleFont('raleway', 'Raleway', 'sans-serif', 'raleway', 'Raleway', { variable: true }),
  googleFont('dm-sans', 'DM Sans', 'sans-serif', 'dm-sans', 'DM+Sans', { variable: true }),
  googleFont('work-sans', 'Work Sans', 'sans-serif', 'work-sans', 'Work+Sans', { variable: true }),
  googleFont('fira-sans', 'Fira Sans', 'sans-serif', 'fira-sans', 'Fira+Sans'),
  googleFont('manrope', 'Manrope', 'sans-serif', 'manrope', 'Manrope', { variable: true }),
  googleFont('oswald', 'Oswald', 'sans-serif', 'oswald', 'Oswald', { weights: [400, 500, 600, 700] }),
  googleFont('source-sans-3', 'Source Sans 3', 'sans-serif', 'source-sans-3', 'Source+Sans+3', { variable: true }),
  googleFont('quicksand', 'Quicksand', 'sans-serif', 'quicksand', 'Quicksand', { variable: true }),
  googleFont('plus-jakarta-sans', 'Plus Jakarta Sans', 'sans-serif', 'plus-jakarta-sans', 'Plus+Jakarta+Sans', { variable: true }),
  {
    id: 'satoshi',
    label: 'Satoshi',
    category: 'sans-serif',
    family: 'Space Grotesk',
    cssStack: "'Space Grotesk', system-ui, sans-serif",
    fontsourcePackage: null,
    googleQuery: null,
    googleFonts: false,
    weights: W,
    substituteId: 'space-grotesk',
  },
  googleFont('space-grotesk', 'Space Grotesk', 'sans-serif', 'space-grotesk', 'Space+Grotesk', { variable: true }),
  googleFont('figtree', 'Figtree', 'sans-serif', 'figtree', 'Figtree', { variable: true }),
  googleFont('urbanist', 'Urbanist', 'sans-serif', 'urbanist', 'Urbanist', { variable: true }),
  googleFont('outfit', 'Outfit', 'sans-serif', 'outfit', 'Outfit', { variable: true }),
  {
    id: 'general-sans',
    label: 'General Sans',
    category: 'sans-serif',
    family: 'Figtree',
    cssStack: "'Figtree', system-ui, sans-serif",
    fontsourcePackage: null,
    googleQuery: null,
    googleFonts: false,
    weights: W,
    substituteId: 'figtree',
  },
  googleFont('mulish', 'Mulish', 'sans-serif', 'mulish', 'Mulish', { variable: true }),
  googleFont('barlow', 'Barlow', 'sans-serif', 'barlow', 'Barlow'),
  googleFont('rubik', 'Rubik', 'sans-serif', 'rubik', 'Rubik', { variable: true }),
  googleFont('geist', 'Geist', 'sans-serif', 'geist-sans', 'Geist', { variable: true }),

  // ── Serif ──
  googleFont('merriweather', 'Merriweather', 'serif', 'merriweather', 'Merriweather'),
  googleFont('playfair-display', 'Playfair Display', 'serif', 'playfair-display', 'Playfair+Display'),
  googleFont('lora', 'Lora', 'serif', 'lora', 'Lora', { variable: true }),
  googleFont('pt-serif', 'PT Serif', 'serif', 'pt-serif', 'PT+Serif'),
  googleFont('eb-garamond', 'EB Garamond', 'serif', 'eb-garamond', 'EB+Garamond', { variable: true }),
  googleFont('libre-baskerville', 'Libre Baskerville', 'serif', 'libre-baskerville', 'Libre+Baskerville'),
  googleFont('crimson-text', 'Crimson Text', 'serif', 'crimson-text', 'Crimson+Text'),
  googleFont('cormorant-garamond', 'Cormorant Garamond', 'serif', 'cormorant-garamond', 'Cormorant+Garamond'),
  googleFont('frank-ruhl-libre', 'Frank Ruhl Libre', 'serif', 'frank-ruhl-libre', 'Frank+Ruhl+Libre'),
  googleFont('taviraj', 'Taviraj', 'serif', 'taviraj', 'Taviraj'),
  googleFont('arapey', 'Arapey', 'serif', 'arapey', 'Arapey', { weights: [400], italic: true }),
  googleFont('caladea', 'Caladea', 'serif', 'caladea', 'Caladea'),

  // ── Slab serif ──
  googleFont('roboto-slab', 'Roboto Slab', 'slab-serif', 'roboto-slab', 'Roboto+Slab', { variable: true }),
  googleFont('zilla-slab', 'Zilla Slab', 'slab-serif', 'zilla-slab', 'Zilla+Slab'),
  googleFont('aleo', 'Aleo', 'slab-serif', 'aleo', 'Aleo', { variable: true }),
  googleFont('arvo', 'Arvo', 'slab-serif', 'arvo', 'Arvo'),
  googleFont('bitter', 'Bitter', 'slab-serif', 'bitter', 'Bitter', { variable: true }),
  googleFont('enriqueta', 'Enriqueta', 'slab-serif', 'enriqueta', 'Enriqueta'),

  // ── Monospace ──
  googleFont('fira-code', 'Fira Code', 'monospace', 'fira-code', 'Fira+Code', { weights: W_MONO, variable: true }),
  googleFont('roboto-mono', 'Roboto Mono', 'monospace', 'roboto-mono', 'Roboto+Mono', { weights: W_MONO, variable: true }),
  googleFont('jetbrains-mono', 'JetBrains Mono', 'monospace', 'jetbrains-mono', 'JetBrains+Mono', { weights: W_MONO, variable: true }),
  googleFont('space-mono', 'Space Mono', 'monospace', 'space-mono', 'Space+Mono', { weights: [400, 700], italic: true }),

  // ── Display ──
  googleFont('bebas-neue', 'Bebas Neue', 'display', 'bebas-neue', 'Bebas+Neue', { weights: [400] }),
  googleFont('fraunces', 'Fraunces', 'display', 'fraunces', 'Fraunces', { variable: true }),
  googleFont('cinzel', 'Cinzel', 'display', 'cinzel', 'Cinzel', { weights: W_DISPLAY }),
  googleFont('paytone-one', 'Paytone One', 'display', 'paytone-one', 'Paytone+One', { weights: [400] }),
  googleFont('righteous', 'Righteous', 'display', 'righteous', 'Righteous', { weights: [400] }),
  googleFont('abril-fatface', 'Abril Fatface', 'display', 'abril-fatface', 'Abril+Fatface', { weights: [400] }),

  // ── System / editorial aliases ──
  {
    id: 'system-sans',
    label: 'System Sans',
    category: 'system',
    family: 'system-ui',
    cssStack: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontsourcePackage: null,
    googleQuery: null,
    googleFonts: false,
    weights: [],
  },
  {
    id: 'editorial-serif',
    label: 'Editorial Serif',
    category: 'serif',
    family: 'Playfair Display',
    cssStack: "'Playfair Display', Georgia, serif",
    fontsourcePackage: 'playfair-display',
    googleQuery: 'Playfair+Display',
    googleFonts: true,
    weights: W,
    substituteId: 'playfair-display',
  },
];

export const DENEB_FONT_BY_ID = new Map(
  DENEB_FONT_REGISTRY.map((font) => [font.id, font]),
);

export const DENEB_GOOGLE_FONT_COUNT = DENEB_FONT_REGISTRY.filter(
  (f) => f.googleFonts && f.fontsourcePackage,
).length;

/** Default self-hosted set when a project has no site-data font choices yet. */
export const DEFAULT_PROJECT_FONT_IDS = [
  'inter',
  'plus-jakarta-sans',
  'playfair-display',
] as const;
