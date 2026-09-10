'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const {
  DENEB_FONT_REGISTRY,
  DENEB_GOOGLE_FONT_COUNT,
  DEFAULT_PROJECT_FONT_IDS,
  buildGoogleFontsStylesheetUrl,
  collectFontIdsFromSiteData,
  lookupFontDefinition,
  normalizeFontId,
  resolveFontFamily,
  formatResponsiveFontSize,
} = require('../../../dist/index.js');

describe('DENEB font registry', () => {
  it('includes 50+ presets', () => {
    assert.ok(DENEB_FONT_REGISTRY.length >= 50);
    assert.ok(DENEB_GOOGLE_FONT_COUNT >= 50);
  });

  it('does not recurse on unknown font families or CSS stacks', () => {
    assert.equal(lookupFontDefinition('NotARealFont'), null);
    assert.equal(lookupFontDefinition('NotARealFont, sans-serif'), null);
    const inter = lookupFontDefinition('Inter, system-ui, sans-serif');
    assert.ok(inter);
    assert.equal(inter.id, 'inter');
  });

  it('maps non-Google aliases to substitutes', () => {
    const satoshi = lookupFontDefinition('satoshi');
    assert.ok(satoshi);
    assert.equal(satoshi.substituteId, 'space-grotesk');
  });

  it('builds Google Fonts stylesheet URL', () => {
    const url = buildGoogleFontsStylesheetUrl(['inter', 'playfair-display']);
    assert.ok(url);
    assert.match(url, /fonts\.googleapis\.com/);
    assert.match(url, /Inter/);
    assert.match(url, /Playfair/);
  });

  it('collects fonts from site-data theme and styles', () => {
    const ids = collectFontIdsFromSiteData({
      theme: { headingFont: 'Montserrat', bodyFont: 'Inter' },
      styles: { 'home.heroTitle': { fontFamily: 'playfair-display' } },
    });
    assert.ok(ids.includes('montserrat'));
    assert.ok(ids.includes('inter'));
    assert.ok(ids.includes('playfair-display'));
  });

  it('exposes default project font ids', () => {
    assert.ok(DEFAULT_PROJECT_FONT_IDS.includes('inter'));
  });

  it('formats responsive clamp font sizes', () => {
    const clamp = formatResponsiveFontSize(48);
    assert.ok(clamp);
    assert.match(clamp, /^clamp\(/);
  });
});
