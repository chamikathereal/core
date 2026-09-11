'use strict';

const { getJsxName, getJsxAttributeLiteral, hasJsxAttribute, collectJsxText } = require('./ast.cjs');

function createAdapter(id, impl) {
  return { id, ...impl };
}

function detectFromProfile(profile, id) {
  return (profile.componentLibraries || []).includes(id) || profile[id] === true;
}

const ICON_NAME_RE = /^(Icon|[A-Z][A-Za-z0-9]*(Icon|Logo)|Lucide[A-Z]|HiOutline|HiSolid|Fa[A-Z]|Md[A-Z]|Io[A-Z])/;
const DECORATIVE_TAGS = new Set([
  'svg', 'path', 'circle', 'rect', 'g', 'line', 'polyline', 'polygon', 'ellipse',
  'defs', 'clipPath', 'linearGradient', 'radialGradient', 'stop', 'use', 'mask',
]);
const SKIP_TAGS = new Set([
  'script', 'style', 'link', 'meta', 'head', 'html', 'Fragment', 'Suspense',
  'StrictMode', 'ErrorBoundary',
]);
const HEADING_TAGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'Heading', 'Title', 'CardTitle', 'ModalHeader', 'DialogTitle']);
const TEXT_TAGS = new Set(['p', 'span', 'li', 'blockquote', 'figcaption', 'label', 'CardDescription', 'Description', 'Subtitle', 'Typography', 'Text', 'Badge', 'badge']);
const ACTION_TAGS = new Set(['a', 'Link', 'NavLink', 'Button', 'button', 'IconButton', 'NavbarBrand']);
const IMAGE_TAGS = new Set(['img', 'Image', 'Img', 'BackgroundImage']);

const shadcn = createAdapter('shadcn', {
  detect: (project) => detectFromProfile(project, 'shadcn') || project.shadcn,
  recognizeNode(node, ctx) {
    const name = getJsxName(node);
    if (name === 'Button') {
      return { library: 'shadcn', kind: 'button', asChild: hasJsxAttribute(node, 'asChild') };
    }
    if (name === 'CardTitle' || name === 'CardDescription' || name === 'Badge') {
      return { library: 'shadcn', kind: 'text', tag: name };
    }
    return null;
  },
  resolveAction(node) {
    const name = getJsxName(node);
    if (name === 'Button' && hasJsxAttribute(node, 'asChild')) {
      const child = (node.children || []).find((c) => c && c.type === 'JSXElement');
      if (child && ACTION_TAGS.has(getJsxName(child))) return child;
    }
    return null;
  },
});

const heroui = createAdapter('heroui', {
  detect: (project) => detectFromProfile(project, 'heroui') || project.heroui,
  recognizeNode(node) {
    const name = getJsxName(node);
    if (['Button', 'Link', 'Navbar', 'NavbarBrand', 'NavbarItem', 'NavbarContent'].includes(name)) {
      return { library: 'heroui', kind: name === 'Button' || name === 'Link' ? 'action' : 'structure', tag: name };
    }
    return null;
  },
  resolveAction(node) {
    const name = getJsxName(node);
    if (name === 'Button' && (hasJsxAttribute(node, 'href') || hasJsxAttribute(node, 'as'))) return node;
    if (name === 'Link') return node;
    return null;
  },
});

const nextjs = createAdapter('nextjs', {
  detect: (project) => project.framework === 'nextjs',
  recognizeNode(node) {
    const name = getJsxName(node);
    if (name === 'Link') return { library: 'nextjs', kind: 'action', tag: 'Link' };
    if (name === 'Image') return { library: 'nextjs', kind: 'image', tag: 'Image' };
    return null;
  },
  resolveAction(node) {
    return getJsxName(node) === 'Link' ? node : null;
  },
});

const framer = createAdapter('framer-motion', {
  detect: (project) => (project.animationLibraries || []).includes('framer-motion'),
  recognizeNode(node) {
    const name = getJsxName(node);
    if (name.startsWith('motion.')) {
      const tag = name.slice('motion.'.length);
      return { library: 'framer-motion', kind: HEADING_TAGS.has(tag) || TEXT_TAGS.has(tag) ? 'text' : 'structure', tag };
    }
    return null;
  },
});

const reactBits = createAdapter('react-bits', {
  detect: (project) => project.reactBits,
  recognizeNode(node) {
    const name = getJsxName(node);
    if (/SplitText|BlurText|GradientText|ShinyText|CountUp|RotatingText/.test(name)) {
      return { library: 'react-bits', kind: 'text', tag: name };
    }
    return null;
  },
});

const deneb = createAdapter('deneb', {
  detect: (project) =>
    (project.componentLibraries || []).includes('@deneb-ui/ui') ||
    project['@deneb-ui/ui'] === true ||
    Boolean(project.dependencies && project.dependencies['@deneb-ui/ui']),
  recognizeNode(node) {
    const name = getJsxName(node);
    if (['EditableGoogleFeedback', 'EditableCustomerReviews', 'CustomerReviews', 'GoogleFeedback'].includes(name)) {
      return { library: 'deneb', kind: 'feedback', tag: name };
    }
    if (['EditableTestimonialSection', 'EditableTestimonialCard', 'TestimonialSection', 'Testimonials'].includes(name)) {
      return { library: 'deneb', kind: 'testimonial', tag: name };
    }
    if (name === 'EditableMap' || name === 'Map') {
      return { library: 'deneb', kind: 'map', tag: name };
    }
    if (['EditableImage', 'EditableText', 'EditableCard', 'EditableProductCard', 'Image', 'Text', 'Card'].includes(name)) {
      return { library: 'deneb', kind: 'editable-primitive', tag: name };
    }
    return null;
  },
});

const radix = createAdapter('radix', {
  detect: (project) => (project.componentLibraries || []).includes('radix'),
  recognizeNode(node) {
    const name = getJsxName(node);
    if (name === 'Slot' || name.endsWith('.Root') || name.endsWith('.Trigger')) {
      return { library: 'radix', kind: 'structure', tag: name };
    }
    return null;
  },
});

const ADAPTERS = [nextjs, deneb, shadcn, heroui, framer, reactBits, radix];

function activeAdapters(profile) {
  return ADAPTERS.filter((adapter) => {
    try {
      return adapter.detect(profile);
    } catch {
      return false;
    }
  });
}

function recognizeWithAdapters(node, ctx, adapters) {
  for (const adapter of adapters) {
    if (!adapter.recognizeNode) continue;
    const result = adapter.recognizeNode(node, ctx);
    if (result) return { ...result, adapterId: adapter.id };
  }
  return null;
}

function resolveActionWithAdapters(node, adapters) {
  for (const adapter of adapters) {
    if (!adapter.resolveAction) continue;
    const result = adapter.resolveAction(node);
    if (result) return result;
  }
  return null;
}

function isIconComponent(name, importSource) {
  if (!name) return false;
  if (DECORATIVE_TAGS.has(name)) return true;
  if (ICON_NAME_RE.test(name)) return true;
  if (importSource && /(lucide-react|heroicons|react-icons|tabler\/icons)/i.test(importSource)) return true;
  return false;
}

function classifyHref(href) {
  const value = String(href || '');
  if (/wa\.me|whatsapp/i.test(value)) return 'whatsapp';
  if (/^tel:/i.test(value) || /phone|call/i.test(value)) return 'phone';
  if (/^mailto:/i.test(value)) return 'email';
  const social = value.match(/(instagram|facebook|tiktok|twitter|x\.com|youtube|linkedin|pinterest|threads)\./i);
  if (social) {
    const platform = social[1].toLowerCase().replace('x.com', 'twitter');
    return platform === 'x.com' ? 'twitter' : platform;
  }
  return 'link';
}

function isLikelyCtaClass(className) {
  return /\b(btn|button|cta|action|rounded|bg-|hero[-_]?cta)\b/i.test(className || '');
}

module.exports = {
  ADAPTERS,
  activeAdapters,
  recognizeWithAdapters,
  resolveActionWithAdapters,
  isIconComponent,
  classifyHref,
  isLikelyCtaClass,
  DECORATIVE_TAGS,
  SKIP_TAGS,
  HEADING_TAGS,
  TEXT_TAGS,
  ACTION_TAGS,
  IMAGE_TAGS,
  collectJsxText,
  getJsxAttributeLiteral,
};
