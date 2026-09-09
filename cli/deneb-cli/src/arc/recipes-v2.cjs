'use strict';

const { loadAllRecipes, matchRecipeForProject, getRecipeByName } = require('../tools/recipe-engine.cjs');

function matchRecipeV2(projectDir, profile, sourceFiles, recipeName) {
  if (recipeName) {
    const explicit = getRecipeByName(recipeName, projectDir);
    if (explicit) return { recipe: normalizeRecipe(explicit), source: 'explicit' };
  }
  const matched = matchRecipeForProject(projectDir, profile.pkg || {}, sourceFiles);
  if (matched) return { recipe: normalizeRecipe(matched), source: 'signature' };
  return { recipe: null, source: null };
}

function normalizeRecipe(recipe) {
  if (!recipe) return null;
  return {
    id: recipe.name || recipe.id,
    name: recipe.name || recipe.id,
    label: recipe.label || recipe.name,
    version: recipe.version || '1.0.0',
    fingerprint: recipe.signatures || {},
    prerequisites: [],
    detectors: recipe.signatures?.keywords || [],
    transforms: [],
    validators: [],
    confidenceThreshold: 0.85,
    successfulApplications: recipe.successfulApplications || 0,
    failedApplications: recipe.failedApplications || 0,
    actionRules: recipe.actionRules,
    socialRules: recipe.socialRules,
    gridRules: recipe.gridRules,
    sections: recipe.sections,
    pages: recipe.pages,
    defaults: recipe.defaults,
    signatures: recipe.signatures,
    raw: recipe,
  };
}

function listRecipes(projectDir) {
  return loadAllRecipes(projectDir).map(normalizeRecipe);
}

module.exports = {
  matchRecipeV2,
  normalizeRecipe,
  listRecipes,
};
