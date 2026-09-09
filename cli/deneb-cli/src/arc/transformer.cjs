'use strict';

const recast = require('recast');
const path = require('path');
const {
  parseSource,
  printSource,
  locKey,
  getJsxName,
  findJsxAttribute,
  hasJsxAttribute,
  hasDirective,
  ensureImport,
  ensureDefaultImport,
  siteDataBinding,
  siteDataListBinding,
  jsxPreviewAttr,
  jsxTemplatePathAttr,
  wrapTextInEditableSpan,
  b,
} = require('./ast.cjs');
const { toPosix } = require('./fs-utils.cjs');

function findElementByLoc(ast, loc) {
  let found = null;
  recast.types.visit(ast, {
    visitJSXElement(pathNode) {
      if (locKey(pathNode.node) === loc) {
        found = pathNode;
        return false;
      }
      this.traverse(pathNode);
    },
  });
  return found;
}

function replaceAttrValue(node, attrName, expression) {
  const attr = findJsxAttribute(node, attrName);
  if (!attr) {
    node.openingElement.attributes.push(
      b.jsxAttribute(b.jsxIdentifier(attrName), b.jsxExpressionContainer(expression))
    );
    return;
  }
  attr.value = b.jsxExpressionContainer(expression);
}

function ensurePreviewPath(node, fieldPath) {
  if (hasJsxAttribute(node, 'data-preview-field-path')) return;
  node.openingElement.attributes.push(jsxPreviewAttr(fieldPath));
}

function replaceTextChildren(node, fieldPath, fallback, fieldType) {
  const nextChildren = [];
  let replaced = false;
  for (const child of node.children || []) {
    if (!child) continue;
    if (child.type === 'JSXText' && child.value.replace(/\s+/g, '').length) {
      nextChildren.push(b.jsxExpressionContainer(siteDataBinding(fieldPath.split('.'), fallback, fieldType)));
      replaced = true;
    } else if (
      child.type === 'JSXExpressionContainer' &&
      child.expression &&
      (child.expression.type === 'StringLiteral' ||
        child.expression.type === 'Literal' ||
        child.expression.type === 'Identifier')
    ) {
      nextChildren.push(b.jsxExpressionContainer(siteDataBinding(fieldPath.split('.'), fallback, fieldType)));
      replaced = true;
    } else {
      nextChildren.push(child);
    }
  }
  if (!replaced) {
    nextChildren.push(b.jsxExpressionContainer(siteDataBinding(fieldPath.split('.'), fallback, fieldType)));
  }
  node.children = nextChildren;
}

function splitActionChildren(node, labelField, labelFallback) {
  const nextChildren = [];
  let wrapped = false;
  for (const child of node.children || []) {
    if (!child) continue;
    if (child.type === 'JSXElement' && getJsxName(child) === 'span' && !hasJsxAttribute(child, 'data-preview-field-path')) {
      ensurePreviewPath(child, labelField);
      replaceTextChildren(child, labelField, labelFallback, 'text');
      nextChildren.push(child);
      wrapped = true;
    } else if (child.type === 'JSXText' && child.value.replace(/\s+/g, '').length) {
      const leading = child.value.match(/^\s*/)?.[0] || '';
      const trailing = child.value.match(/\s*$/)?.[0] || '';
      if (leading) nextChildren.push(b.jsxText(leading));
      nextChildren.push(wrapTextInEditableSpan(labelField, labelFallback, 'text'));
      if (trailing && trailing !== leading) nextChildren.push(b.jsxText(trailing));
      wrapped = true;
    } else if (
      child.type === 'JSXExpressionContainer' &&
      child.expression &&
      (child.expression.type === 'StringLiteral' || child.expression.type === 'Literal')
    ) {
      nextChildren.push(wrapTextInEditableSpan(labelField, labelFallback, 'text'));
      wrapped = true;
    } else {
      nextChildren.push(child);
    }
  }
  if (!wrapped) {
    nextChildren.push(wrapTextInEditableSpan(labelField, labelFallback, 'text'));
  }
  node.children = nextChildren;
}

function applyTransformToElement(pathNode, transform) {
  const node = pathNode.node;
  if (transform.operation === 'split-action-contract') {
    const urlParts = transform.urlField.split('.');
    replaceAttrValue(node, 'href', siteDataBinding(urlParts, transform.fallback, 'url'));
    ensurePreviewPath(node, transform.urlField);
    splitActionChildren(node, transform.labelField, transform.labelFallback || '');
    return;
  }
  if (transform.operation === 'extract-url') {
    replaceAttrValue(node, 'href', siteDataBinding(transform.field.split('.'), transform.fallback, 'url'));
    ensurePreviewPath(node, transform.field);
    return;
  }
  if (transform.operation === 'extract-image') {
    replaceAttrValue(node, 'src', siteDataBinding(transform.field.split('.'), transform.fallback, 'image'));
    ensurePreviewPath(node, transform.field);
    return;
  }
  if (transform.operation === 'extract-alt') {
    replaceAttrValue(node, 'alt', siteDataBinding(transform.field.split('.'), transform.fallback, 'text'));
    return;
  }
  if (transform.operation === 'extract-placeholder') {
    replaceAttrValue(node, 'placeholder', siteDataBinding(transform.field.split('.'), transform.fallback, 'text'));
    ensurePreviewPath(node, transform.field);
    return;
  }
  if (transform.operation === 'wrap-text-span') {
    wrapLiteralTextChildren(node, transform.field, transform.fallback);
    return;
  }
  if (transform.operation === 'extract-text') {
    ensurePreviewPath(node, transform.field);
    replaceTextChildren(node, transform.field, transform.fallback, transform.fieldType || 'text');
  }
}

/**
 * Replaces literal text children with an editable <span>, leaving the container
 * element and every one of its classes untouched.
 */
function wrapLiteralTextChildren(node, fieldPath, fallback) {
  const nextChildren = [];
  let wrapped = false;

  for (const child of node.children || []) {
    if (!child) continue;
    if (!wrapped && child.type === 'JSXText' && child.value.replace(/\s+/g, '').length) {
      const leading = child.value.match(/^\s*/)?.[0] || '';
      const trailing = child.value.match(/\s*$/)?.[0] || '';
      if (leading) nextChildren.push(b.jsxText(leading));
      nextChildren.push(wrapTextInEditableSpan(fieldPath, fallback, 'text'));
      if (trailing) nextChildren.push(b.jsxText(trailing));
      wrapped = true;
      continue;
    }
    if (child.type === 'JSXText' && child.value.replace(/\s+/g, '').length) continue;
    nextChildren.push(child);
  }

  if (wrapped) node.children = nextChildren;
}

/**
 * Converts a literal-array `.map()` render into a Fivora list contract.
 *
 * The developer's array declaration becomes site-data backed with the original
 * literal as fallback, so `{item.title}` keeps working untouched. Markers are
 * emitted as JSX template literals (`items[${index}].title`) so added and
 * reordered items stay editable, which is what strict mode requires.
 */
function applyCollectionTransform(ast, transform) {
  const listPath = transform.listField;
  const binding = transform.itemParam;
  if (!listPath || !binding) return false;

  const mapCall = findMapCall(ast, transform.loc);
  if (!mapCall) return false;

  const callback = (mapCall.node.arguments || [])[0];
  if (!callback) return false;

  // The contract needs a concrete index for each item marker.
  let indexName = transform.indexParam;
  if (!indexName) {
    indexName = callback.params.some((p) => p.name === 'index') ? 'denebIndex' : 'index';
    callback.params.push(b.identifier(indexName));
  }

  const itemRoot = findElementByLoc(ast, transform.loc);
  if (!itemRoot) return false;

  if (!hasJsxAttribute(itemRoot.node, 'data-preview-item-path')) {
    itemRoot.node.openingElement.attributes.push(
      jsxTemplatePathAttr('data-preview-item-path', listPath, indexName)
    );
  }

  markItemFields(callback, { listPath, binding, indexName });

  const container = findListContainer(mapCall);
  if (container && !hasJsxAttribute(container, 'data-preview-list-path')) {
    container.openingElement.attributes.push(
      b.jsxAttribute(b.jsxIdentifier('data-preview-list-path'), b.stringLiteral(listPath))
    );
  }

  return bindArrayDeclaration(ast, mapCall, listPath);
}

function findMapCall(ast, loc) {
  let found = null;
  recast.types.visit(ast, {
    visitCallExpression(pathNode) {
      const callee = pathNode.node.callee;
      if (
        !found &&
        callee?.type === 'MemberExpression' &&
        !callee.computed &&
        callee.property?.name === 'map'
      ) {
        let hit = false;
        recast.types.visit(pathNode.node, {
          visitJSXElement(inner) {
            if (locKey(inner.node) === loc) {
              hit = true;
              return false;
            }
            inner.traverse(inner);
          },
        });
        if (hit) {
          found = pathNode;
          return false;
        }
      }
      this.traverse(pathNode);
    },
  });
  return found;
}

/** Attaches field markers to the elements that render item properties. */
function markItemFields(callback, { listPath, binding, indexName }) {
  recast.types.visit(callback, {
    visitJSXElement(pathNode) {
      const node = pathNode.node;

      for (const attr of node.openingElement.attributes || []) {
        if (attr.type !== 'JSXAttribute' || !attr.value) continue;
        const attrName = attr.name?.name;
        if (attrName !== 'src' && attrName !== 'href') continue;
        const property = itemMemberName(attr.value.expression, binding);
        if (!property) continue;
        if (!hasJsxAttribute(node, 'data-preview-field-path')) {
          node.openingElement.attributes.push(
            jsxTemplatePathAttr('data-preview-field-path', listPath, indexName, `.${property}`)
          );
        }
      }

      const textChild = (node.children || []).find(
        (child) => child.type === 'JSXExpressionContainer' && itemMemberName(child.expression, binding)
      );
      if (textChild && !hasJsxAttribute(node, 'data-preview-field-path')) {
        const property = itemMemberName(textChild.expression, binding);
        node.openingElement.attributes.push(
          jsxTemplatePathAttr('data-preview-field-path', listPath, indexName, `.${property}`)
        );
      }

      this.traverse(pathNode);
    },
  });
}

function itemMemberName(expr, binding) {
  if (!expr || expr.type !== 'MemberExpression' || expr.computed) return null;
  if (expr.object?.type !== 'Identifier' || expr.object.name !== binding) return null;
  return expr.property?.name || null;
}

/** The nearest JSX element that wraps the map expression. */
function findListContainer(mapCallPath) {
  let current = mapCallPath.parent;
  while (current) {
    const node = current.node || current.value;
    if (node?.type === 'JSXElement') return node;
    current = current.parentPath || current.parent;
  }
  return null;
}

function bindArrayDeclaration(ast, mapCallPath, listPath) {
  const arrayName = mapCallPath.node.callee.object?.name;
  if (!arrayName) return false;
  let bound = false;

  recast.types.visit(ast, {
    visitVariableDeclarator(pathNode) {
      const node = pathNode.node;
      if (bound || node.id?.type !== 'Identifier' || node.id.name !== arrayName) {
        this.traverse(pathNode);
        return;
      }
      if (node.init?.type !== 'ArrayExpression') {
        this.traverse(pathNode);
        return;
      }
      node.init = siteDataListBinding(listPath.split('.'), node.init);
      bound = true;
      return false;
    },
  });

  return bound;
}

function injectSiteDataHook(ast) {
  const program = ast.program || ast;
  let injected = false;

  function injectIntoFunction(fn) {
    if (!fn || !fn.body || fn.body.type !== 'BlockStatement') return false;
    const body = fn.body.body;
    const already = body.some((stmt) => recast.print(stmt).code.includes('useSiteData'));
    if (already) return true;
    const hook = b.variableDeclaration('const', [
      b.variableDeclarator(
        b.identifier('siteData'),
        b.callExpression(b.identifier('useSiteData'), [])
      ),
    ]);
    body.unshift(hook);
    return true;
  }

  recast.types.visit(ast, {
    visitExportDefaultDeclaration(pathNode) {
      if (injected) return false;
      const decl = pathNode.node.declaration;
      if (decl && (decl.type === 'FunctionDeclaration' || decl.type === 'ArrowFunctionExpression' || decl.type === 'FunctionExpression')) {
        injected = injectIntoFunction(decl);
      }
      this.traverse(pathNode);
    },
    visitFunctionDeclaration(pathNode) {
      if (injected) return false;
      const name = pathNode.node.id && pathNode.node.id.name;
      if (name && /^[A-Z]/.test(name)) {
        injected = injectIntoFunction(pathNode.node);
        return false;
      }
      this.traverse(pathNode);
    },
    visitVariableDeclarator(pathNode) {
      if (injected) return false;
      const id = pathNode.node.id;
      const init = pathNode.node.init;
      if (id && id.type === 'Identifier' && /^[A-Z]/.test(id.name) && init && (init.type === 'ArrowFunctionExpression' || init.type === 'FunctionExpression')) {
        injected = injectIntoFunction(init);
        return false;
      }
      this.traverse(pathNode);
    },
  });

  if (!injected) {
    recast.types.visit(ast, {
      visitFunctionDeclaration(pathNode) {
        if (injected) return false;
        injected = injectIntoFunction(pathNode.node);
        return false;
      },
    });
  }

  return injected;
}

function resolveSiteDataSpecifier(profile, fromRelativeFile) {
  const aliases = profile.aliasMap || {};
  const hasAt = Object.keys(aliases).some((k) => k === '@/*' || k.startsWith('@/'));
  const siteDataRel = profile.hasSrc ? 'src/data/site-data.json' : 'data/site-data.json';
  if (hasAt && profile.hasSrc) return '@/data/site-data.json';

  const fromAbs = path.join(profile.root, fromRelativeFile);
  const toAbs = path.join(profile.root, siteDataRel);
  let relSpec = path.relative(path.dirname(fromAbs), toAbs).replace(/\\/g, '/');
  if (!relSpec.startsWith('.')) relSpec = './' + relSpec;
  return relSpec;
}

function applyFilePlan(filePlan, profile) {
  if (!filePlan.originalCode || !filePlan.transformations.length) {
    return { code: filePlan.originalCode, changed: false };
  }

  const ast = parseSource(filePlan.originalCode, filePlan.file);
  const isClient = hasDirective(ast, 'use client') || /['"]use client['"]/.test(filePlan.originalCode.slice(0, 400));
  let applied = 0;
  const failures = [];

  const supported = new Set([
    'split-action-contract',
    'extract-url',
    'extract-image',
    'extract-alt',
    'extract-placeholder',
    'extract-text',
    'wrap-text-span',
    'collection-conversion',
  ]);

  // Collections run first: they rewrite the array declaration and add an index
  // parameter, and later per-element edits must observe that shape.
  const ordered = [...filePlan.transformations].sort(
    (left, right) =>
      Number(right.operation === 'collection-conversion') -
      Number(left.operation === 'collection-conversion')
  );

  for (const transform of ordered) {
    if (transform.decision === 'skip') continue;
    if (!supported.has(transform.operation)) continue;

    if (transform.operation === 'collection-conversion') {
      try {
        if (applyCollectionTransform(ast, transform)) applied++;
        else failures.push({ loc: transform.loc, reason: 'collection-not-bindable' });
      } catch (err) {
        failures.push({ loc: transform.loc, reason: err.message });
      }
      continue;
    }

    const pathNode = findElementByLoc(ast, transform.loc);
    if (!pathNode) {
      failures.push({ loc: transform.loc, reason: 'node-not-found' });
      continue;
    }
    try {
      applyTransformToElement(pathNode, transform);
      applied++;
    } catch (err) {
      failures.push({ loc: transform.loc, reason: err.message });
    }
  }

  if (applied === 0) {
    return { code: filePlan.originalCode, changed: false, applied, failures };
  }

  const siteDataImport = resolveSiteDataSpecifier(profile, filePlan.file);
  if (isClient) {
    ensureImport(ast, '@deneb-ui/ui', ['useSiteData']);
    injectSiteDataHook(ast);
  } else {
    ensureDefaultImport(ast, siteDataImport, 'siteData');
  }

  // Page keys are stamped in a separate route-driven pass so App Router and
  // Pages Router projects are handled by the same logic.
  const code = printSource(ast, filePlan.originalCode);
  return { code, changed: true, applied, failures, usedClientHook: isClient };
}

/**
 * Stamps a route's page component with data-preview-page-key. Fivora requires
 * exactly one per exported route, so the key comes from the scanned route id
 * rather than being guessed from the filename — Pages Router uses
 * `pages/contact.jsx`, App Router uses `app/contact/page.tsx`.
 *
 * `<main>` is preferred, but any project shape is supported by falling back to
 * the outermost element the page component returns.
 */
function instrumentPageKey(code, relativeFile, pageKey) {
  if (code.includes('data-preview-page-key')) return { code, updated: false };
  const key = pageKey || inferPageKey(relativeFile);

  let ast;
  try {
    ast = parseSource(code, relativeFile);
  } catch {
    return { code, updated: false };
  }

  const attribute = () =>
    b.jsxAttribute(b.jsxIdentifier('data-preview-page-key'), b.stringLiteral(key));

  let target = null;
  recast.types.visit(ast, {
    visitJSXOpeningElement(pathNode) {
      const name = pathNode.node.name && pathNode.node.name.name;
      if (!target && name === 'main') {
        target = pathNode.node;
        return false;
      }
      this.traverse(pathNode);
    },
  });

  if (!target) {
    // No <main>: use the first host element of the returned tree so the marker
    // still lands inside this route's exported HTML.
    recast.types.visit(ast, {
      visitJSXElement(pathNode) {
        if (target) return false;
        const name = getJsxName(pathNode.node);
        if (typeof name === 'string' && /^[a-z]/.test(name)) {
          target = pathNode.node.openingElement;
          return false;
        }
        this.traverse(pathNode);
      },
    });
  }

  if (!target) return { code, updated: false };
  target.attributes = target.attributes || [];
  target.attributes.unshift(attribute());
  return { code: printSource(ast, code), updated: true };
}

function inferPageKey(relativeFile) {
  const posix = toPosix(relativeFile);
  if (/(^|\/)page\.(tsx|jsx|js)$/.test(posix)) {
    const parts = posix.split('/');
    const idx = parts.lastIndexOf('app');
    const segs = parts.slice(idx + 1, -1).filter((s) => !(s.startsWith('(') && s.endsWith(')')));
    if (!segs.length) return 'home';
    return segs.join('_').replace(/[^a-z0-9_-]/gi, '_').toLowerCase();
  }
  return 'home';
}

function instrumentLayoutSource(code, siteDataImport) {
  if (/SiteDataProvider|DenebDataProvider/.test(code)) {
    return { code, updated: false };
  }
  const ast = parseSource(code, 'layout.tsx');
  ensureImport(ast, '@deneb-ui/ui', ['SiteDataProvider']);
  ensureDefaultImport(ast, siteDataImport, 'initialSiteData');

  let wrapped = false;
  recast.types.visit(ast, {
    visitJSXExpressionContainer(pathNode) {
      if (wrapped) return false;
      const expr = pathNode.node.expression;
      if (expr && expr.type === 'Identifier' && expr.name === 'children') {
        pathNode.replace(
          b.jsxElement(
            b.jsxOpeningElement(
              b.jsxIdentifier('SiteDataProvider'),
              [
                b.jsxAttribute(
                  b.jsxIdentifier('initialSiteData'),
                  b.jsxExpressionContainer(b.identifier('initialSiteData'))
                ),
              ],
              false
            ),
            b.jsxClosingElement(b.jsxIdentifier('SiteDataProvider')),
            [pathNode.node],
            false
          )
        );
        wrapped = true;
        return false;
      }
      this.traverse(pathNode);
    },
  });

  if (!wrapped) {
    recast.types.visit(ast, {
      visitJSXElement(pathNode) {
        if (wrapped) return false;
        const name = getJsxName(pathNode.node);
        if (name === 'Component') {
          pathNode.replace(
            b.jsxElement(
              b.jsxOpeningElement(
                b.jsxIdentifier('SiteDataProvider'),
                [
                  b.jsxAttribute(
                    b.jsxIdentifier('initialSiteData'),
                    b.jsxExpressionContainer(b.identifier('initialSiteData'))
                  ),
                ],
                false
              ),
              b.jsxClosingElement(b.jsxIdentifier('SiteDataProvider')),
              [pathNode.node],
              false
            )
          );
          wrapped = true;
          return false;
        }
        this.traverse(pathNode);
      },
    });
  }

  return { code: printSource(ast, code), updated: wrapped };
}

function ensureJsonModule(tsconfig) {
  if (!tsconfig || !tsconfig.compilerOptions) return { config: tsconfig, changed: false };
  if (tsconfig.compilerOptions.resolveJsonModule) return { config: tsconfig, changed: false };
  return {
    config: {
      ...tsconfig,
      compilerOptions: {
        ...tsconfig.compilerOptions,
        resolveJsonModule: true,
      },
    },
    changed: true,
  };
}

module.exports = {
  applyFilePlan,
  instrumentLayoutSource,
  instrumentPageKey,
  resolveSiteDataSpecifier,
  ensureJsonModule,
  inferPageKey,
};
