'use strict';

function tryCoreFonts() {
  try {
    return require('@deneb-ui/core');
  } catch {
    try {
      return require('../../../../packages/deneb-core/dist/index.js');
    } catch {
      return null;
    }
  }
}

const core = tryCoreFonts();

function collectFontIdsFromSiteData(siteData) {
  if (core && typeof core.collectFontIdsFromSiteData === 'function') {
    const ids = core.collectFontIdsFromSiteData(siteData);
    if (ids && ids.length) return ids;
  }
  const defaults = (core && core.DEFAULT_PROJECT_FONT_IDS) || ['inter', 'plus-jakarta-sans', 'playfair-display'];
  return [...defaults];
}

function applyFontTheme(siteData, fontIds) {
  const next = siteData && typeof siteData === 'object' ? siteData : {};
  const theme = { ...(next.theme || {}) };
  const structureTheme = next.template?.structure?.theme;
  if (isPlain(structureTheme)) {
    Object.assign(theme, structureTheme);
  }
  if (!theme.headingFont) {
    theme.headingFont = prettyFont(fontIds[1] || fontIds[0] || 'inter');
  }
  if (!theme.bodyFont) {
    theme.bodyFont = prettyFont(fontIds[0] || 'inter');
  }
  next.theme = theme;
  if (next.template && next.template.structure) {
    next.template.structure.theme = {
      ...(next.template.structure.theme || {}),
      headingFont: theme.headingFont,
      bodyFont: theme.bodyFont,
    };
  }
  return next;
}

function prettyFont(id) {
  if (core && typeof core.lookupFontDefinition === 'function') {
    const def = core.lookupFontDefinition(id);
    if (def?.label) return def.label;
  }
  return String(id || 'Inter');
}

function isPlain(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

module.exports = {
  collectFontIdsFromSiteData,
  applyFontTheme,
};
