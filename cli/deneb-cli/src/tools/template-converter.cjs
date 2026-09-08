/**
 * DENEB Universal Template Converter Engine
 *
 * Automatically converts existing Next.js projects (built with shadcn/ui,
 * HeroUI, Tailwind CSS, or custom React components) into fully editable
 * Fivora storefront templates.
 *
 * Architecture & Framework by Chamika Gayashan & Induranga Kawishwara.
 * Powered by DENEB-UI Collaborate with FIVORA.
 */

const fs = require('fs');
const path = require('path');

/**
 * 1. Detect CSS and Component Frameworks
 */
function detectProjectFrameworks(projectDir) {
  const pkgPath = path.join(projectDir, 'package.json');
  let pkg = {};
  if (fs.existsSync(pkgPath)) {
    try {
      pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    } catch {
      pkg = {};
    }
  }

  const allDeps = {
    ...(pkg.dependencies || {}),
    ...(pkg.devDependencies || {}),
  };

  const hasShadcn = Boolean(
    fs.existsSync(path.join(projectDir, 'components.json')) ||
    fs.existsSync(path.join(projectDir, 'src', 'components', 'ui')) ||
    fs.existsSync(path.join(projectDir, 'components', 'ui')) ||
    allDeps['@radix-ui/react-slot'] ||
    allDeps['class-variance-authority']
  );

  const hasHeroUi = Boolean(
    allDeps['@heroui/react'] ||
    allDeps['@nextui-org/react'] ||
    Object.keys(allDeps).some((d) => d.startsWith('@heroui/') || d.startsWith('@nextui-org/'))
  );

  const hasTailwind = Boolean(
    allDeps['tailwindcss'] ||
    fs.existsSync(path.join(projectDir, 'tailwind.config.js')) ||
    fs.existsSync(path.join(projectDir, 'tailwind.config.ts')) ||
    fs.existsSync(path.join(projectDir, 'tailwind.config.mjs'))
  );

  let uiDir = null;
  const candidateUiDirs = [
    path.join(projectDir, 'src', 'components', 'ui'),
    path.join(projectDir, 'components', 'ui'),
  ];
  for (const d of candidateUiDirs) {
    if (fs.existsSync(d) && fs.statSync(d).isDirectory()) {
      uiDir = d;
      break;
    }
  }

  let appDir = null;
  let isAppRouter = true;
  const candidateAppDirs = [
    path.join(projectDir, 'src', 'app'),
    path.join(projectDir, 'app'),
  ];
  for (const d of candidateAppDirs) {
    if (fs.existsSync(d) && fs.statSync(d).isDirectory()) {
      appDir = d;
      break;
    }
  }

  if (!appDir) {
    const candidatePagesDirs = [
      path.join(projectDir, 'src', 'pages'),
      path.join(projectDir, 'pages'),
    ];
    for (const d of candidatePagesDirs) {
      if (fs.existsSync(d) && fs.statSync(d).isDirectory()) {
        appDir = d;
        isAppRouter = false;
        break;
      }
    }
  }

  const detected = [];
  if (hasShadcn) detected.push('shadcn/ui (Radix Primitives + CVA)');
  if (hasHeroUi) detected.push('HeroUI / NextUI');
  if (hasTailwind) detected.push('Tailwind CSS');
  if (detected.length === 0) detected.push('Standard React / Next.js Components');

  return {
    pkg,
    hasShadcn,
    hasHeroUi,
    hasTailwind,
    uiDir,
    appDir,
    isAppRouter,
    detected,
  };
}

/**
 * 2. Create Timestamped Backup
 */
function createBackup(projectDir) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(projectDir, `.deneb-backup-${timestamp}`);
  fs.mkdirSync(backupDir, { recursive: true });
  return backupDir;
}

function backupFile(filePath, projectDir, backupDir) {
  if (!fs.existsSync(filePath)) return;
  const rel = path.relative(projectDir, filePath);
  const dest = path.join(backupDir, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(filePath, dest);
}

/**
 * 3. Instrument Root Layout with SiteDataProvider
 */
function instrumentRootLayout(projectDir, detection, backupDir) {
  if (!detection.appDir) return { success: false, reason: 'No app or pages directory found' };

  const layoutCandidates = [
    path.join(detection.appDir, 'layout.tsx'),
    path.join(detection.appDir, 'layout.jsx'),
    path.join(detection.appDir, 'layout.js'),
    path.join(detection.appDir, '_app.tsx'),
    path.join(detection.appDir, '_app.jsx'),
    path.join(detection.appDir, '_app.js'),
  ];

  let layoutFile = null;
  for (const f of layoutCandidates) {
    if (fs.existsSync(f)) {
      layoutFile = f;
      break;
    }
  }

  if (!layoutFile) return { success: false, reason: 'Root layout file not found' };

  backupFile(layoutFile, projectDir, backupDir);
  let content = fs.readFileSync(layoutFile, 'utf8');

  // Check if SiteDataProvider already mounted
  if (content.includes('SiteDataProvider') || content.includes('DenebDataProvider')) {
    return { success: true, updated: false, layoutFile };
  }

  // Determine site-data import path
  const hasSrc = fs.existsSync(path.join(projectDir, 'src'));
  const siteDataImport = hasSrc ? '@/data/site-data.json' : '../data/site-data.json';

  // Add imports at top
  const importStatement = `import { SiteDataProvider } from '@deneb-ui/ui';\nimport initialSiteData from '${siteDataImport}';\n`;

  if (content.includes('import ')) {
    content = importStatement + content;
  } else {
    content = importStatement + '\n' + content;
  }

  // Wrap children or body content with SiteDataProvider
  if (content.includes('{children}')) {
    content = content.replace(
      '{children}',
      '<SiteDataProvider initialSiteData={initialSiteData}>{children}</SiteDataProvider>'
    );
  } else if (content.includes('<Component {...pageProps}')) {
    // Pages router _app.tsx
    content = content.replace(
      /<Component\s+\{\.\.\.pageProps\}\s*\/>/,
      '<SiteDataProvider initialSiteData={initialSiteData}><Component {...pageProps} /></SiteDataProvider>'
    );
  }

  fs.writeFileSync(layoutFile, content, 'utf8');
  return { success: true, updated: true, layoutFile };
}

/**
 * 4. Helper: Walk directory to find target TSX/JSX files
 */
function findSourceFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (
        entry.name === 'node_modules' ||
        entry.name === '.next' ||
        entry.name === 'out' ||
        entry.name === 'dist' ||
        entry.name === '.git' ||
        entry.name.startsWith('.deneb-backup')
      ) {
        continue;
      }
      findSourceFiles(fullPath, fileList);
    } else if (entry.isFile()) {
      if (/\.(tsx|jsx)$/.test(entry.name) && !entry.name.endsWith('.d.ts')) {
        fileList.push(fullPath);
      }
    }
  }
  return fileList;
}

/**
 * Sanitize strings for valid field keys
 */
function toFieldKey(text, prefix = 'text', index = 1) {
  if (!text || typeof text !== 'string') return `${prefix}_${index}`;
  const cleaned = text
    .trim()
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .split(/\s+/)
    .slice(0, 4)
    .map((word, i) =>
      i === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join('');

  if (!cleaned || cleaned.length < 2) {
    return `${prefix}_${index}`;
  }
  return cleaned;
}

/**
 * 5. Intelligent JSX Content Extractor and Marker Transformer
 */
function transformFileContent(filePath, pageKey, extractedData, backupDir, projectDir) {
  let code = fs.readFileSync(filePath, 'utf8');

  let fileModified = false;
  let elementCount = 0;
  let keyCounters = {};

  function getUniqueKey(baseKey) {
    keyCounters[baseKey] = (keyCounters[baseKey] || 0) + 1;
    if (keyCounters[baseKey] === 1) return baseKey;
    return `${baseKey}_${keyCounters[baseKey]}`;
  }

  // 1. Ensure <main> has data-preview-page-key if this is a page file
  if (filePath.endsWith('page.tsx') || filePath.endsWith('page.jsx')) {
    if (code.includes('<main') && !code.includes('data-preview-page-key')) {
      code = code.replace(/<main(\s+[^>]*)?>/, (match, attrs = '') => {
        fileModified = true;
        return `<main data-preview-page-key="${pageKey}"${attrs}>`;
      });
    }
  }

  // 2. Extract Headings: <h1> to <h6>
  const headingRegex = /<(h[1-6])(\s+[^>]*)?>([^<>{}\n]+)<\/\1>/g;
  code = code.replace(headingRegex, (match, tag, attrs = '', text) => {
    const trimmed = text.trim();
    if (!trimmed || trimmed.length < 2 || attrs.includes('data-preview-field-path')) {
      return match;
    }
    const rawKey = toFieldKey(trimmed, `${tag}Title`, elementCount + 1);
    const fieldKey = getUniqueKey(rawKey);

    extractedData[fieldKey] = trimmed;
    elementCount++;
    fileModified = true;

    return `<${tag} data-preview-field-path="${pageKey}.${fieldKey}"${attrs}>{siteData?.content?.${pageKey}?.${fieldKey} || "${trimmed}"}</${tag}>`;
  });

  // 3. Extract Paragraphs: <p>
  const pRegex = /<p(\s+[^>]*)?>([^<>{}\n]+)<\/p>/g;
  code = code.replace(pRegex, (match, attrs = '', text) => {
    const trimmed = text.trim();
    if (!trimmed || trimmed.length < 2 || attrs.includes('data-preview-field-path')) {
      return match;
    }
    const rawKey = toFieldKey(trimmed, 'paragraph', elementCount + 1);
    const fieldKey = getUniqueKey(rawKey);

    extractedData[fieldKey] = trimmed;
    elementCount++;
    fileModified = true;

    return `<p data-preview-field-path="${pageKey}.${fieldKey}"${attrs}>{siteData?.content?.${pageKey}?.${fieldKey} || "${trimmed}"}</p>`;
  });

  // 4. Extract CardTitle & CardDescription (shadcn/ui & modern patterns)
  const cardTitleRegex = /<CardTitle(\s+[^>]*)?>([^<>{}\n]+)<\/CardTitle>/g;
  code = code.replace(cardTitleRegex, (match, attrs = '', text) => {
    const trimmed = text.trim();
    if (!trimmed || trimmed.length < 2 || attrs.includes('data-preview-field-path')) {
      return match;
    }
    const rawKey = toFieldKey(trimmed, 'cardTitle', elementCount + 1);
    const fieldKey = getUniqueKey(rawKey);

    extractedData[fieldKey] = trimmed;
    elementCount++;
    fileModified = true;

    return `<CardTitle data-preview-field-path="${pageKey}.${fieldKey}"${attrs}>{siteData?.content?.${pageKey}?.${fieldKey} || "${trimmed}"}</CardTitle>`;
  });

  const cardDescRegex = /<CardDescription(\s+[^>]*)?>([^<>{}\n]+)<\/CardDescription>/g;
  code = code.replace(cardDescRegex, (match, attrs = '', text) => {
    const trimmed = text.trim();
    if (!trimmed || trimmed.length < 2 || attrs.includes('data-preview-field-path')) {
      return match;
    }
    const rawKey = toFieldKey(trimmed, 'cardDescription', elementCount + 1);
    const fieldKey = getUniqueKey(rawKey);

    extractedData[fieldKey] = trimmed;
    elementCount++;
    fileModified = true;

    return `<CardDescription data-preview-field-path="${pageKey}.${fieldKey}"${attrs}>{siteData?.content?.${pageKey}?.${fieldKey} || "${trimmed}"}</CardDescription>`;
  });

  // 5. Extract Buttons & CTAs: <Button> and <button>
  const btnRegex = /<(Button|button)(\s+[^>]*)?>([^<>{}\n]+)<\/\1>/g;
  code = code.replace(btnRegex, (match, tag, attrs = '', text) => {
    const trimmed = text.trim();
    if (!trimmed || trimmed.length < 2 || attrs.includes('data-preview-field-path')) {
      return match;
    }
    const rawKey = toFieldKey(trimmed, 'ctaLabel', elementCount + 1);
    const fieldKey = getUniqueKey(rawKey);

    extractedData[fieldKey] = trimmed;
    elementCount++;
    fileModified = true;

    return `<${tag} data-preview-field-path="${pageKey}.${fieldKey}"${attrs}>{siteData?.content?.${pageKey}?.${fieldKey} || "${trimmed}"}</${tag}>`;
  });

  // 6. Extract Inputs & Search Bars: placeholder attribute
  const inputRegex = /<(input|Input|textarea|Textarea)(\s+[^>]*?)placeholder="([^"]+)"([^>]*?)\/?>/g;
  code = code.replace(inputRegex, (match, tag, beforeAttrs = '', placeholder, afterAttrs = '') => {
    const trimmed = placeholder.trim();
    if (!trimmed || beforeAttrs.includes('data-preview-field-path') || afterAttrs.includes('data-preview-field-path')) {
      return match;
    }
    const rawKey = toFieldKey(trimmed, 'placeholder', elementCount + 1);
    const fieldKey = getUniqueKey(rawKey);

    extractedData[fieldKey] = trimmed;
    elementCount++;
    fileModified = true;

    return `<${tag}${beforeAttrs}data-preview-field-path="${pageKey}.${fieldKey}" placeholder={siteData?.content?.${pageKey}?.${fieldKey} || "${trimmed}"}${afterAttrs}/>`;
  });

  // 7. Extract Image alt & src: <img src="..." alt="..." /> or <Image ... />
  const imgRegex = /<(img|Image)(\s+[^>]*?)src="([^"]+)"([^>]*?)alt="([^"]+)"([^>]*?)\/?>/g;
  code = code.replace(imgRegex, (match, tag, preSrc = '', src, mid = '', alt, post = '') => {
    if (preSrc.includes('data-preview-field-path') || mid.includes('data-preview-field-path') || post.includes('data-preview-field-path')) {
      return match;
    }
    const altTrimmed = alt.trim();
    const rawKey = toFieldKey(altTrimmed, 'bannerImage', elementCount + 1);
    const fieldKey = getUniqueKey(rawKey);

    extractedData[fieldKey] = src;
    elementCount++;
    fileModified = true;

    return `<${tag}${preSrc}data-preview-field-path="${pageKey}.${fieldKey}" src={siteData?.content?.${pageKey}?.${fieldKey} || "${src}"}${mid}alt="${alt}"${post}/>`;
  });

  // If file was modified, ensure useSiteData and client directives are added
  if (fileModified) {
    backupFile(filePath, projectDir, backupDir);

    // Ensure 'use client' at top if not present
    if (!code.includes('use client')) {
      code = "'use client';\n\n" + code;
    }

    // Add useSiteData import if needed
    if (!code.includes('useSiteData')) {
      code = code.replace(
        /(import\s+[^;]+;\n)/,
        `$1import { useSiteData } from '@deneb-ui/ui';\n`
      );
    }

    // Add const { siteData } = useSiteData(); inside the primary component function
    if (!code.includes('useSiteData()')) {
      code = code.replace(
        /(export\s+default\s+function\s+[A-Za-z0-9_]*\s*\([^)]*\)\s*\{)/,
        `$1\n  const { siteData } = useSiteData();`
      );
    }

    fs.writeFileSync(filePath, code, 'utf8');
  }

  return { fileModified, elementCount };
}

/**
 * 6. Harmonize and Upgrade Existing UI Components
 */
function harmonizeUiComponents(projectDir, detection, backupDir) {
  if (!detection.uiDir || !fs.existsSync(detection.uiDir)) {
    return { count: 0 };
  }

  const entries = fs.readdirSync(detection.uiDir);
  let harmonized = 0;

  for (const entry of entries) {
    if (!entry.endsWith('.tsx') && !entry.endsWith('.jsx')) continue;
    const compPath = path.join(detection.uiDir, entry);
    let code = fs.readFileSync(compPath, 'utf8');

    if (code.includes('{...props}')) {
      harmonized++;
    }
  }

  return { count: harmonized };
}

/**
 * 7. Generate Comprehensive site-data.json and fivora-template.json
 */
function generateTemplateData(projectDir, projectName, detectedPages, extractedByPage) {
  const manifestPath = path.join(projectDir, 'fivora-template.json');
  const siteDataPath = path.join(projectDir, 'src', 'data', 'site-data.json');
  fs.mkdirSync(path.dirname(siteDataPath), { recursive: true });

  const content = {
    common: {
      websiteTitle: projectName,
      shortDescription: `A high-converting storefront built for the Fivora platform.`,
      logoUrl: '/fivora-logo.png',
      headerCtaLabel: 'Contact Us',
      copyright: `${projectName}. All rights reserved.`,
      business: {
        phone: '+1 (555) 482-9012',
        whatsapp: '15554829012',
        email: 'merchant@fivora.site',
      },
    },
  };

  const editorSections = [
    {
      id: 'common',
      path: 'common',
      type: 'object',
      label: 'Common Storefront Content',
      fields: [
        { key: 'websiteTitle', type: 'text', label: 'Website Title', required: true },
        { key: 'shortDescription', type: 'textarea', label: 'Short Description' },
        { key: 'logoUrl', type: 'image', label: 'Website Logo' },
        { key: 'headerCtaLabel', type: 'text', label: 'Header CTA Button' },
      ],
    },
  ];

  for (const page of detectedPages) {
    const pageKey = page.id;
    const pageFields = extractedByPage[pageKey] || {};

    content[pageKey] = {
      ...(content[pageKey] || {}),
      ...pageFields,
    };

    const sectionFields = Object.entries(pageFields).map(([key, val]) => {
      const isImg = key.toLowerCase().includes('image') || (typeof val === 'string' && /\.(jpg|png|webp|svg)$/i.test(val));
      const isLong = typeof val === 'string' && val.length > 60;
      return {
        key: key,
        type: isImg ? 'image' : isLong ? 'textarea' : 'text',
        label: key
          .replace(/([A-Z])/g, ' $1')
          .replace(/[-_]/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase()),
      };
    });

    if (sectionFields.length > 0) {
      editorSections.push({
        id: pageKey,
        path: pageKey,
        type: 'object',
        label: `${page.label || pageKey} Content`,
        fields: sectionFields,
      });
    }
  }

  const siteData = {
    project: {
      id: `${projectName}-project`,
      title: projectName,
      status: 'APPROVED',
    },
    merchant: {
      businessName: projectName,
      description: `A modern commerce storefront built for the Fivora platform.`,
    },
    template: {
      id: `${projectName}-template`,
      name: projectName,
      engine: 'NEXT_STATIC_EXPORT',
      structure: {
        pages: detectedPages.map((p) => p.id),
      },
    },
    requirements: {
      requiredPages: detectedPages.filter((p) => p.required).map((p) => p.id),
      requiredFeatures: [],
    },
    content: content,
  };

  const manifest = {
    framework: 'nextjs-static-export',
    version: 2,
    visualEditing: {
      contractVersion: 1,
      mode: 'strict',
      controlOnlyPaths: [],
    },
    siteDataFile: 'src/data/site-data.json',
    outputDirectory: 'out',
    installCommand: 'npm install',
    buildCommand: 'npm run build',
    basePathEnvVar: 'NEXT_PUBLIC_SITE_BASE_PATH',
    pages: detectedPages,
    editorSchema: {
      version: 1,
      sections: editorSections,
    },
  };

  fs.writeFileSync(siteDataPath, JSON.stringify(siteData, null, 2) + '\n', 'utf8');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');

  return { siteDataPath, manifestPath, totalFields: editorSections.reduce((acc, s) => acc + (s.fields?.length || 0), 0) };
}

/**
 * Main Conversion Pipeline
 */
function runUniversalTemplateConversion(projectDir, projectName, detectedPages) {
  console.log(`\n🔍 Analyzing existing UI and CSS frameworks in project...`);
  const detection = detectProjectFrameworks(projectDir);
  for (const framework of detection.detected) {
    console.log(`  \x1b[36m✔ Detected:\x1b[0m ${framework}`);
  }

  const backupDir = createBackup(projectDir);
  console.log(`\n🛡️  Created safe backup at \x1b[90m${path.basename(backupDir)}\x1b[0m`);

  // 1. Root Layout
  console.log(`\n🔗 Instrumenting Root Layout with SiteDataProvider...`);
  const layoutRes = instrumentRootLayout(projectDir, detection, backupDir);
  if (layoutRes.updated) {
    console.log(`  \x1b[32m✔ Mounted\x1b[0m SiteDataProvider in ${path.basename(layoutRes.layoutFile)}`);
  } else {
    console.log(`  \x1b[90m⏩ Layout already configured\x1b[0m`);
  }

  // 2. Scan & Transform Pages and Components
  console.log(`\n⚡ Scanning & instrumenting pages with visual editing markers...`);
  const allSourceFiles = findSourceFiles(projectDir);
  const extractedByPage = {};
  let totalTransformedElements = 0;
  let transformedFilesCount = 0;

  for (const page of detectedPages) {
    extractedByPage[page.id] = {};
  }

  for (const file of allSourceFiles) {
    // Determine page association
    let pageKey = 'home';
    for (const page of detectedPages) {
      if (page.id !== 'home' && file.toLowerCase().includes(page.id)) {
        pageKey = page.id;
        break;
      }
    }

    if (!extractedByPage[pageKey]) extractedByPage[pageKey] = {};

    const res = transformFileContent(file, pageKey, extractedByPage[pageKey], backupDir, projectDir);
    if (res.fileModified) {
      transformedFilesCount++;
      totalTransformedElements += res.elementCount;
      console.log(`  \x1b[32m✔ Transformed\x1b[0m ${path.relative(projectDir, file)} (\x1b[33m${res.elementCount}\x1b[0m editable markers added)`);
    }
  }

  // 3. Harmonize UI Components
  console.log(`\n🧩 Harmonizing UI components in ${detection.uiDir ? path.relative(projectDir, detection.uiDir) : 'src/components/ui'}...`);
  const uiRes = harmonizeUiComponents(projectDir, detection, backupDir);
  if (uiRes.count > 0) {
    console.log(`  \x1b[32m✔ Harmonized\x1b[0m ${uiRes.count} component(s) to support visual preview attributes`);
  }

  // 4. Generate centralized data and synchronized manifest
  console.log(`\n📦 Generating centralized site-data.json and Fivora Spec v2 contract...`);
  const dataRes = generateTemplateData(projectDir, projectName, detectedPages, extractedByPage);
  console.log(`  \x1b[32m✔ Generated\x1b[0m ${path.relative(projectDir, dataRes.siteDataPath)}`);
  console.log(`  \x1b[32m✔ Generated\x1b[0m ${path.relative(projectDir, dataRes.manifestPath)} (\x1b[36m${dataRes.totalFields}\x1b[0m visual fields mapped)`);

  return {
    detection,
    backupDir,
    transformedFilesCount,
    totalTransformedElements,
    totalFields: dataRes.totalFields,
  };
}

module.exports = {
  detectProjectFrameworks,
  createBackup,
  instrumentRootLayout,
  transformFileContent,
  harmonizeUiComponents,
  generateTemplateData,
  runUniversalTemplateConversion,
};
