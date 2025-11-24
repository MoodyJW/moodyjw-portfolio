#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function gitChangedFiles(base = 'origin/main') {
  try {
    execSync('git fetch origin main --depth=1', { stdio: 'ignore' });
  } catch (e) {}
  const out = execSync(
    `${process.env.GIT_CMD || 'git'} diff --name-only ${base}...HEAD`
  ).toString();
  return out
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
}

function hasTSDoc(content) {
  // look for /** ... */ just before component class or export
  return /\/\*\*[\s\S]*?\*\//.test(content);
}

function specExistsFor(file) {
  const dir = path.dirname(file);
  const base = path.basename(file, '.component.ts');
  const spec = path.join(dir, `${base}.component.spec.ts`);
  const altSpec = path.join(dir, `${base}.spec.ts`);
  return fs.existsSync(spec) || fs.existsSync(altSpec);
}

function isDemoPathListed(file, demoRaw) {
  // Extract explicitly backticked paths from DEMO_COMPONENTS.md (preferred)
  const pathMatches = [];
  const backtickRe = /`([^`]+)`/g;
  let m;
  while ((m = backtickRe.exec(demoRaw))) {
    pathMatches.push(m[1]);
  }

  const candidates = pathMatches.length ? pathMatches : demoRaw.split('\n');

  for (const raw of candidates) {
    const line = String(raw).trim();
    if (!line) continue;
    // Normalize common patterns
    const cleaned = line.replace(/^[-\s>]+/, '').replace(/[()]*/g, '').trim();

    // If pattern ends with /* or /*.. then treat as directory prefix
    if (cleaned.endsWith('/*')) {
      const prefix = cleaned.slice(0, -2).replace(/\/*$/, '') + '/';
      if (file.startsWith(prefix)) return true;
      continue;
    }

    // If path is a directory (ends with /)
    if (cleaned.endsWith('/')) {
      if (file.startsWith(cleaned)) return true;
      continue;
    }

    // Exact match
    if (file === cleaned) return true;

    // Match if cleaned is a suffix (e.g., docs/compodoc/...)
    if (file.endsWith(cleaned) || file.includes(cleaned)) return true;
  }

  return false;
}

function run() {
  const changed = gitChangedFiles();
  const componentFiles = changed.filter((f) => f.endsWith('.component.ts'));
  const failures = [];

  for (const file of componentFiles) {
    if (!fs.existsSync(file)) continue; // deleted or moved
    const dir = path.dirname(file);
    const baseName = path.basename(file, '.ts');
    const storyFile = path.join(dir, `${baseName}.stories.ts`);
    const content = fs.readFileSync(file, 'utf8');

    // skip demo components listed in DEMO_COMPONENTS.md (supports simple wildcards/dirs)
    const demoList = fs.existsSync('DEMO_COMPONENTS.md')
      ? fs.readFileSync('DEMO_COMPONENTS.md', 'utf8')
      : '';
    if (isDemoPathListed(file, demoList)) {
      console.log(`Skipping demo component ${file}`);
      continue;
    }

    const missing = [];
    if (!fs.existsSync(storyFile)) missing.push('story');
    if (!hasTSDoc(content)) missing.push('TSDoc');
    if (!specExistsFor(file)) missing.push('spec');

    if (missing.length) {
      failures.push({ file, missing });
    }
  }

  if (failures.length) {
    console.error('\nDocumentation policy check failed:');
    for (const f of failures) {
      console.error(` - ${f.file}: missing ${f.missing.join(', ')}`);
    }
    console.error(
      '\nAdd a Storybook story and TSDoc, or add the component to DEMO_COMPONENTS.md if it is a temporary demo.'
    );
    process.exit(2);
  }

  console.log('Documentation policy check passed.');
}

if (require.main === module) run();
