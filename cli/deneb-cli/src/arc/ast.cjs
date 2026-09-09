'use strict';

const recast = require('recast');
const babelParser = require('@babel/parser');
const t = recast.types.namedTypes;
const b = recast.types.builders;

let babelTsParser = null;
try {
  babelTsParser = require('recast/parsers/babel-ts');
} catch {
  babelTsParser = null;
}

const BABEL_PLUGIN_SETS = [
  ['jsx', 'typescript', 'decorators-legacy', 'classProperties', 'classPrivateProperties', 'classPrivateMethods', 'importAttributes'],
  ['jsx', 'typescript', 'decorators-legacy', 'classProperties', 'importAssertions'],
  ['jsx', 'typescript', 'classProperties'],
  ['jsx', 'typescript'],
  ['jsx'],
];

function parseWithBabel(code) {
  let lastError = null;
  for (const plugins of BABEL_PLUGIN_SETS) {
    try {
      return babelParser.parse(code, {
        sourceType: 'unambiguous',
        allowReturnOutsideFunction: true,
        allowAwaitOutsideFunction: true,
        errorRecovery: true,
        tokens: true,
        plugins,
      });
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError || new Error('Unable to parse source');
}

function parseSource(code, filePath = 'file.tsx') {
  const options = { sourceFileName: filePath };
  if (babelTsParser) {
    try {
      return recast.parse(code, { ...options, parser: babelTsParser });
    } catch {
      // Fall through to token-aware Babel parse.
    }
  }
  return recast.parse(code, {
    ...options,
    parser: {
      parse(source) {
        return parseWithBabel(source);
      },
    },
  });
}

function printSource(ast, originalCode) {
  let printed = recast.print(ast, {
    quote: 'double',
    wrapColumn: 120,
    reuseWhitespace: true,
  }).code;
  printed = printed.replace(/(['"]use client['"]);;/g, '$1;');
  printed = printed.replace(/(['"]use server['"]);;/g, '$1;');
  if (typeof originalCode === 'string' && originalCode.endsWith('\n') && !printed.endsWith('\n')) {
    printed += '\n';
  }
  return printed;
}

function locKey(node) {
  const loc = node && node.loc;
  if (!loc || !loc.start) return null;
  return `${loc.start.line}:${loc.start.column}:${loc.end ? loc.end.line : ''}:${loc.end ? loc.end.column : ''}`;
}

function getJsxName(node) {
  if (!node) return '';
  const opening = node.openingElement || node;
  const name = opening.name || node.name;
  return jsxNameToString(name);
}

function jsxNameToString(name) {
  if (!name) return '';
  if (name.type === 'JSXIdentifier') return name.name;
  if (name.type === 'JSXMemberExpression') {
    return `${jsxNameToString(name.object)}.${jsxNameToString(name.property)}`;
  }
  if (name.type === 'JSXNamespacedName') {
    return `${name.namespace.name}:${name.name.name}`;
  }
  if (name.type === 'Identifier') return name.name;
  return '';
}

function getJsxAttributes(node) {
  const opening = node.openingElement || node;
  return opening.attributes || [];
}

function findJsxAttribute(node, attrName) {
  return getJsxAttributes(node).find((attr) => {
    return attr && attr.type === 'JSXAttribute' && attr.name && attr.name.name === attrName;
  }) || null;
}

function getJsxAttributeLiteral(node, attrName) {
  const attr = findJsxAttribute(node, attrName);
  if (!attr || !attr.value) return null;
  if (attr.value.type === 'StringLiteral' || attr.value.type === 'Literal') {
    return String(attr.value.value);
  }
  if (attr.value.type === 'JSXExpressionContainer') {
    const expr = attr.value.expression;
    if (!expr) return null;
    if (expr.type === 'StringLiteral' || expr.type === 'Literal') return String(expr.value);
    if (expr.type === 'TemplateLiteral' && expr.expressions.length === 0) {
      return expr.quasis.map((q) => q.value.cooked || q.value.raw || '').join('');
    }
  }
  return null;
}

function hasJsxAttribute(node, attrName) {
  return Boolean(findJsxAttribute(node, attrName));
}

function collectJsxText(node) {
  if (!node || !Array.isArray(node.children)) return '';
  const parts = [];
  for (const child of node.children) {
    if (!child) continue;
    if (child.type === 'JSXText') {
      parts.push(child.value);
    } else if (child.type === 'JSXExpressionContainer' && child.expression && (child.expression.type === 'StringLiteral' || child.expression.type === 'Literal')) {
      parts.push(String(child.expression.value));
    }
  }
  return parts.join('').replace(/\s+/g, ' ').trim();
}

function isJsxTextHeavy(node) {
  if (!node || !Array.isArray(node.children)) return false;
  const meaningful = node.children.filter((child) => {
    if (!child) return false;
    if (child.type === 'JSXText') return child.value.replace(/\s+/g, '').length > 0;
    if (child.type === 'JSXExpressionContainer') {
      const expr = child.expression;
      return expr && (expr.type === 'StringLiteral' || expr.type === 'Literal' || expr.type === 'Identifier');
    }
    return false;
  });
  return meaningful.length > 0;
}

function optionalMember(parts) {
  let expr = b.identifier(parts[0]);
  for (let i = 1; i < parts.length; i++) {
    expr = b.optionalMemberExpression(expr, b.identifier(parts[i]), false, true);
  }
  return expr;
}

function siteDataBinding(pathParts, fallback, fieldType = 'string') {
  const chain = optionalMember(['siteData', 'content', ...pathParts]);
  let fallbackNode;
  if (fieldType === 'number' && fallback !== '' && !Number.isNaN(Number(fallback))) {
    fallbackNode = b.numericLiteral(Number(fallback));
  } else if (fieldType === 'boolean') {
    fallbackNode = b.booleanLiteral(Boolean(fallback));
  } else {
    fallbackNode = b.stringLiteral(String(fallback ?? ''));
  }
  return b.logicalExpression('??', chain, fallbackNode);
}

function jsxPreviewAttr(fieldPath) {
  return b.jsxAttribute(
    b.jsxIdentifier('data-preview-field-path'),
    b.stringLiteral(fieldPath)
  );
}

function jsxStaticAttr(reason) {
  return b.jsxAttribute(
    b.jsxIdentifier('data-preview-static'),
    b.stringLiteral(reason || 'decorative')
  );
}

/**
 * Binds a whole collection to site data while keeping the developer's literal
 * array as the fallback, so `{item.title}` inside the existing map picks up
 * merchant edits with no change to the render logic.
 */
function siteDataListBinding(pathParts, fallbackArrayNode) {
  return b.logicalExpression(
    '??',
    optionalMember(['siteData', 'content', ...pathParts]),
    fallbackArrayNode
  );
}

/**
 * Builds `attr={`prefix[${index}]suffix`}`. Fivora's marker parser accepts JSX
 * template literals, which is how repeated items stay editable after reorder.
 */
function jsxTemplatePathAttr(attrName, prefix, indexName, suffix = '') {
  return b.jsxAttribute(
    b.jsxIdentifier(attrName),
    b.jsxExpressionContainer(
      b.templateLiteral(
        [
          b.templateElement({ raw: `${prefix}[`, cooked: `${prefix}[` }, false),
          b.templateElement({ raw: `]${suffix}`, cooked: `]${suffix}` }, true),
        ],
        [b.identifier(indexName)]
      )
    )
  );
}

function wrapTextInEditableSpan(fieldPath, fallback, fieldType) {
  return b.jsxElement(
    b.jsxOpeningElement(
      b.jsxIdentifier('span'),
      [jsxPreviewAttr(fieldPath)],
      false
    ),
    b.jsxClosingElement(b.jsxIdentifier('span')),
    [b.jsxExpressionContainer(siteDataBinding(fieldPath.split('.'), fallback, fieldType))],
    false
  );
}

function hasDirective(ast, value) {
  const program = ast.program || ast;
  const first = program.body && program.body[0];
  if (first && first.type === 'ExpressionStatement' && first.expression) {
    const expr = first.expression;
    if ((expr.type === 'StringLiteral' || expr.type === 'Literal') && expr.value === value) {
      return true;
    }
  }
  return false;
}

function ensureImport(ast, source, names) {
  const program = ast.program || ast;
  const body = program.body || [];
  const existing = body.find((node) => node.type === 'ImportDeclaration' && node.source && node.source.value === source);
  if (existing) {
    const already = new Set(
      (existing.specifiers || [])
        .filter((s) => s.type === 'ImportSpecifier')
        .map((s) => s.imported?.name || s.local?.name)
    );
    for (const name of names) {
      if (!already.has(name)) {
        existing.specifiers.push(b.importSpecifier(b.identifier(name), b.identifier(name)));
      }
    }
    return;
  }

  const specifiers = names.map((name) => b.importSpecifier(b.identifier(name), b.identifier(name)));
  const decl = b.importDeclaration(specifiers, b.stringLiteral(source));
  let insertAt = 0;
  if (body[0] && body[0].type === 'ExpressionStatement') insertAt = 1;
  body.splice(insertAt, 0, decl);
}

function ensureDefaultImport(ast, source, localName) {
  const program = ast.program || ast;
  const body = program.body || [];
  const existing = body.find((node) => node.type === 'ImportDeclaration' && node.source && node.source.value === source);
  if (existing) return;
  const decl = b.importDeclaration(
    [b.importDefaultSpecifier(b.identifier(localName))],
    b.stringLiteral(source)
  );
  let insertAt = 0;
  if (body[0] && body[0].type === 'ExpressionStatement') insertAt = 1;
  body.splice(insertAt, 0, decl);
}

function codeHasIdentifier(code, name) {
  return new RegExp(`\\b${name}\\b`).test(code);
}

module.exports = {
  parseSource,
  printSource,
  parseWithBabel,
  locKey,
  getJsxName,
  jsxNameToString,
  getJsxAttributes,
  findJsxAttribute,
  getJsxAttributeLiteral,
  hasJsxAttribute,
  collectJsxText,
  isJsxTextHeavy,
  optionalMember,
  siteDataBinding,
  siteDataListBinding,
  jsxPreviewAttr,
  jsxStaticAttr,
  jsxTemplatePathAttr,
  wrapTextInEditableSpan,
  hasDirective,
  ensureImport,
  ensureDefaultImport,
  codeHasIdentifier,
  t,
  b,
  visit: recast.types.visit,
};
