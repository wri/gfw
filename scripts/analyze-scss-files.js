#!/usr/bin/env node
/* eslint-disable no-console, no-unused-vars, no-restricted-syntax, no-continue, no-cond-assign, no-useless-escape, security/detect-non-literal-fs-filename, security/detect-non-literal-regexp */
/**
 * Analyzes SCSS files in the project to classify them as:
 * - CONVERT_SAFE: Safe to convert to CSS Modules
 * - NEEDS_REVIEW: Has cross-file dependencies or issues requiring human review
 * - KEEP_GLOBAL: Should remain as global CSS (frameworks, themes, third-party overrides)
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const REPO_ROOT = path.join(__dirname, '..');
const COMPONENTS_DIR = path.join(REPO_ROOT, 'components');
const LAYOUTS_DIR = path.join(REPO_ROOT, 'layouts');
const WRAPPERS_DIR = path.join(REPO_ROOT, 'wrappers');
const STYLES_DIR = path.join(REPO_ROOT, 'styles');
const APP_FILE = path.join(REPO_ROOT, 'pages', '_app.js');

// Files/patterns that should ALWAYS stay global
const KEEP_GLOBAL_PATTERNS = [
  'styles/**/*.scss', // All framework styles
  'components/map/components/draw/styles.scss', // Mapbox override
  'components/ui/*/themes/**/*.scss', // All theme files
  'components/*/themes/**/*.scss',
  'components/ui/switch/react-toggle.scss', // Singular-named outlier
  'components/world-map/style.scss', // Singular-named outlier
];

// Read _app.js to get the current import list
function getImportsFromApp() {
  const appContent = fs.readFileSync(APP_FILE, 'utf8');
  const imports = new Set();

  const importRegex = /import\s+['"]([^'"]+\.(?:scss|css))['"]/g;
  let match;
  while ((match = importRegex.exec(appContent)) !== null) {
    // Normalize the path to relative from REPO_ROOT
    const importPath = match[1];
    // Convert ../ to just the relative path from repo root
    const normalized = importPath.replace(/^\.\.\//, '');
    imports.add(normalized);
    imports.add(importPath); // Also add the original for matching
  }

  return imports;
}

// Get all SCSS files in components, layouts, wrappers
function getAllScssFiles() {
  const patterns = [
    `${COMPONENTS_DIR}/**/styles.scss`,
    `${COMPONENTS_DIR}/**/style.scss`,
    `${LAYOUTS_DIR}/**/styles.scss`,
    `${WRAPPERS_DIR}/**/styles.scss`,
  ];

  const files = new Set();
  patterns.forEach((pattern) => {
    glob.sync(pattern).forEach((file) => {
      files.add(path.relative(REPO_ROOT, file));
    });
  });

  return Array.from(files);
}

// Parse class selectors from SCSS content
function parseSelectors(content) {
  const selectors = new Set();

  // Match top-level class selectors (e.g. .c-widget, .c-footer)
  // This is a simplified regex; a production version would use a real SCSS parser
  const classRegex = /^\s*\.([a-z0-9\-]+)\s*\{/gm;
  let match;

  while ((match = classRegex.exec(content)) !== null) {
    selectors.add(`.${match[1]}`);
  }

  return Array.from(selectors);
}

// Check if a selector is referenced in other files
function findSelectorDependencies(selector, sourceFile) {
  const dependencies = [];

  // Search for this selector in other SCSS and JS files
  const allFiles = glob.sync(`${REPO_ROOT}/**/*.{scss,js,jsx}`, {
    ignore: [`${REPO_ROOT}/node_modules/**`, path.join(REPO_ROOT, sourceFile)],
  });

  for (const file of allFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const escapedSelector = selector.replace(/[.\\-]/g, '\\$&');

    // Look for references in SCSS nested selectors or JS classNames
    const refRegex = new RegExp(`\\b${escapedSelector.substring(1)}\\b`, 'g');
    if (refRegex.test(content)) {
      dependencies.push({
        file: path.relative(REPO_ROOT, file),
        type: file.endsWith('.scss') ? 'scss' : 'jsx',
      });
    }
  }

  return dependencies.length > 0 ? dependencies : [];
}

// Check if a component has string-literal classNames (the basemaps-menu bug)
function findStringLiteralClassNames(scssFile) {
  const scssContent = fs.readFileSync(path.join(REPO_ROOT, scssFile), 'utf8');
  const selectors = parseSelectors(scssContent);

  // Find the component's JSX file
  const dir = path.dirname(scssFile);
  const jsxFile = [
    path.join(dir, 'component.jsx'),
    path.join(dir, 'component.js'),
    path.join(dir, 'index.js'),
  ].find((f) => fs.existsSync(path.join(REPO_ROOT, f)));

  if (!jsxFile) return [];

  const jsxContent = fs.readFileSync(path.join(REPO_ROOT, jsxFile), 'utf8');
  const issues = [];

  for (const selector of selectors) {
    // Look for string literals: className="c-widget" or cx('c-widget', ...)
    const selectorName = selector.substring(1); // Remove the dot
    const stringLiteralRegex = new RegExp(
      `className\\s*=\\s*["']${selectorName}["']`,
      'g'
    );
    const cxLiteralRegex = new RegExp(`cx\\([^)]*["']${selectorName}["']`, 'g');

    if (
      stringLiteralRegex.test(jsxContent) ||
      cxLiteralRegex.test(jsxContent)
    ) {
      issues.push({
        file: jsxFile,
        selector,
        issue: `String literal className found; must be replaced with styles["${selectorName}"]`,
      });
    }
  }

  return issues;
}

// Check if component uses the theme prop
function usesThemeProp(scssFile) {
  const dir = path.dirname(scssFile);
  const jsxFile = [
    path.join(dir, 'component.jsx'),
    path.join(dir, 'component.js'),
    path.join(dir, 'index.js'),
  ].find((f) => fs.existsSync(path.join(REPO_ROOT, f)));

  if (!jsxFile) return false;

  const jsxContent = fs.readFileSync(path.join(REPO_ROOT, jsxFile), 'utf8');
  return /theme\s*=|theme-|className=.*theme|cx\([^)]*theme/.test(jsxContent);
}

// Main analysis
function analyze() {
  console.log('🔍 Analyzing SCSS files for CSS Modules migration...\n');

  const allFiles = getAllScssFiles();
  const appImports = getImportsFromApp();
  const keepGlobalFiles = new Set();
  const convertSafeFiles = [];
  const needsReviewFiles = [];
  const keepGlobalReasons = {};

  // Populate keep-global patterns
  for (const pattern of KEEP_GLOBAL_PATTERNS) {
    glob.sync(pattern, { cwd: REPO_ROOT }).forEach((file) => {
      keepGlobalFiles.add(path.relative(REPO_ROOT, file));
      keepGlobalReasons[path.relative(REPO_ROOT, file)] =
        'matches keep-global pattern';
    });
  }

  // Analyze each file
  for (const file of allFiles) {
    if (keepGlobalFiles.has(file)) {
      continue;
    }

    // Check if the file is imported in _app.js
    const normalizedFile = file.startsWith('../')
      ? file
      : file.replace(/\\/g, '/');
    if (
      !appImports.has(normalizedFile) &&
      !appImports.has(`./${normalizedFile}`)
    ) {
      needsReviewFiles.push({
        file,
        reason: 'Not found in _app.js imports (possible naming mismatch)',
      });
      continue;
    }

    // Check for theme prop usage
    if (usesThemeProp(file)) {
      keepGlobalFiles.add(file);
      keepGlobalReasons[file] = 'uses theme prop';
      continue;
    }

    // Check for string-literal classNames
    const stringIssues = findStringLiteralClassNames(file);
    if (stringIssues.length > 0) {
      needsReviewFiles.push({
        file,
        reason: `String literal classNames found: ${stringIssues
          .map((i) => i.selector)
          .join(', ')}`,
        details: stringIssues,
      });
      continue;
    }

    // Check for cross-file selector dependencies
    const content = fs.readFileSync(path.join(REPO_ROOT, file), 'utf8');
    const selectors = parseSelectors(content);
    let hasDependencies = false;
    const dependencies = [];

    for (const selector of selectors) {
      const deps = findSelectorDependencies(selector, file);
      if (deps && deps.length > 0) {
        hasDependencies = true;
        dependencies.push({ selector, dependencies: deps });
      }
    }

    if (hasDependencies) {
      needsReviewFiles.push({
        file,
        reason: 'Cross-file selector dependencies detected',
        dependencies,
      });
    } else {
      convertSafeFiles.push(file);
    }
  }

  // Output results
  console.log(`📊 Analysis Results:\n`);
  console.log(`✅ CONVERT_SAFE: ${convertSafeFiles.length} files`);
  console.log(`⚠️  NEEDS_REVIEW: ${needsReviewFiles.length} files`);
  console.log(`🔒 KEEP_GLOBAL: ${keepGlobalFiles.size} files\n`);

  if (convertSafeFiles.length > 0) {
    console.log('CONVERT_SAFE files:');
    convertSafeFiles.forEach((f) => console.log(`  - ${f}`));
    console.log();
  }

  if (needsReviewFiles.length > 0) {
    console.log('NEEDS_REVIEW files:');
    needsReviewFiles.forEach((item) => {
      console.log(`  - ${item.file}`);
      console.log(`    Reason: ${item.reason}`);
      if (item.dependencies) {
        item.dependencies.forEach((dep) => {
          console.log(`      ${dep.selector} used in:`);
          dep.dependencies.forEach((d) => console.log(`        - ${d.file}`));
        });
      }
      if (item.details) {
        item.details.forEach((d) =>
          console.log(`      ${d.selector}: ${d.issue}`)
        );
      }
    });
    console.log();
  }

  if (keepGlobalFiles.size > 0) {
    console.log('KEEP_GLOBAL files:');
    Array.from(keepGlobalFiles)
      .sort()
      .forEach((f) => {
        console.log(`  - ${f} (${keepGlobalReasons[f]})`);
      });
  }

  // Summary
  console.log(`\n📋 Summary:`);
  console.log(`  Total files analyzed: ${allFiles.length}`);
  console.log(
    `  Safe to convert: ${convertSafeFiles.length} (${Math.round(
      (convertSafeFiles.length / allFiles.length) * 100
    )}%)`
  );
  console.log(`  Need review: ${needsReviewFiles.length}`);
  console.log(`  Stay global: ${keepGlobalFiles.size}`);

  // Return data for programmatic use
  return {
    convertSafe: convertSafeFiles,
    needsReview: needsReviewFiles,
    keepGlobal: Array.from(keepGlobalFiles),
    total: allFiles.length,
  };
}

// Run if called directly
if (require.main === module) {
  analyze();
}

module.exports = { analyze };
