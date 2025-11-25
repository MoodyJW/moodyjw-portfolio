# Release & Versioning Policy

This document defines the release process, versioning strategy, and branching model for the MoodyJW Portfolio project. The goal is to demonstrate enterprise-standard practices while keeping the process lightweight for solo development.

## Version Strategy

**Semantic Versioning (SemVer)**: `MAJOR.MINOR.PATCH`

- **MAJOR** (1.x.x): Breaking changes, major redesigns, architectural rewrites
- **MINOR** (x.1.x): New features, significant enhancements, new pages/sections
- **PATCH** (x.x.1): Bug fixes, content updates, dependency updates, small improvements

**Examples:**

- `1.0.0` → Initial release with all Phase 1-2 features complete
- `1.1.0` → Added GitHub integration and data visualizations (new feature)
- `1.1.1` → Fixed theme picker accessibility issue (bug fix)
- `2.0.0` → Redesigned component library with breaking changes

---

## Branching Strategy: Simplified Trunk-Based Development

**For Solo Development** - Keep it simple but demonstrate best practices:

### Branch Structure

```
main (protected, always deployable)
  ↑
  └── feature/feature-name
  └── fix/bug-description
  └── chore/task-description
```

### Branch Types

- **`main`**: Production-ready code. Protected branch. Every commit triggers deployment to GitHub Pages.
- **`feature/*`**: New features (e.g., `feature/theme-picker`, `feature/github-stats`)
- **`fix/*`**: Bug fixes (e.g., `fix/navigation-mobile`, `fix/accessibility-contrast`)
- **`chore/*`**: Non-functional changes (e.g., `chore/update-deps`, `chore/refactor-services`)
- **`docs/*`**: Documentation updates (e.g., `docs/add-contributing-guide`)

### Workflow

1. **Create branch** from `main` for each feature/fix/chore
2. **Make changes** with conventional commits
3. **Open PR** against `main` with description and screenshots (if UI changes)
4. **CI validates**: lint, tests, E2E, accessibility, Lighthouse
5. **Review** (self-review is OK for solo dev, but document decisions)
6. **Merge** to `main` when PR is green (squash and merge preferred)
7. **Auto-deploy** to GitHub Pages
8. **Tag release** manually when ready (see Release Process below)

### Why No `develop` Branch?

**Trunk-Based Development** is modern and lightweight:

- ✅ Simpler - fewer branches to manage
- ✅ Faster - changes deploy quickly
- ✅ Industry standard - used by Google, Facebook, Netflix
- ✅ CI-first - rely on automated checks instead of branch gatekeeping
- ✅ Solo-friendly - no merge conflicts between long-lived branches

**When you'd need `develop`:**

- ❌ Large team with parallel feature work
- ❌ Strict release schedules (quarterly releases)
- ❌ Need to "batch" features for marketing announcements

For a portfolio demonstrating skills, **trunk-based + feature flags** is more impressive than GitFlow.

---

## Commit Message Convention: Conventional Commits

**Format**: `<type>(<scope>): <description>`

### Types

- **feat**: New feature (triggers MINOR version bump)
- **fix**: Bug fix (triggers PATCH version bump)
- **docs**: Documentation changes
- **style**: Code style changes (formatting, missing semicolons)
- **refactor**: Code refactoring (no functional changes)
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Build process, dependencies, tooling

### Examples

```bash
feat(theme): add theme picker component with 4 color schemes
fix(a11y): improve keyboard navigation in modal component
docs(readme): add Storybook deployment instructions
chore(deps): update Angular to 21.0.1
refactor(store): simplify ProjectStore computed selectors
perf(images): add lazy loading for below-fold images
test(theme): add unit tests for ThemeService persistence
```

### Scope (Optional but Recommended)

Use scope to indicate what part of the app changed:

- `theme`, `navigation`, `home`, `projects`, `case-studies`, `analytics`, `a11y`, `ci`, `deps`, etc.

### Breaking Changes

For MAJOR version bumps, add `BREAKING CHANGE:` in the commit body:

```bash
feat(api)!: redesign ProjectStore API

BREAKING CHANGE: ProjectStore.getProjects() now returns a signal instead of Observable.
Consumers must call .loadProjects() explicitly on init.
```

---

## Release Process

### When to Create a Release

**Option 1: Milestone-Based** (Recommended for Portfolio)

- After completing a major phase (e.g., Phase 2 complete)
- After adding a significant feature (e.g., GitHub integration)
- After reaching a stability milestone (e.g., all accessibility tests pass)

**Option 2: Time-Based**

- Weekly releases (every Friday)
- Monthly releases (first of the month)

**Option 3: On-Demand**

- When deploying a critical fix
- When showcasing progress to recruiters

### Release Steps

1. **Ensure `main` is stable**

   - All CI checks passing
   - No known critical bugs
   - Features tested in staging (GitHub Pages preview)

2. **Generate changelog** (automated)

   ```bash
   # Install tooling
   npm install -g conventional-changelog-cli

   # Generate CHANGELOG.md from conventional commits
   conventional-changelog -p angular -i CHANGELOG.md -s
   ```

3. **Bump version** in `package.json`

   ```bash
   # For PATCH (bug fixes)
   npm version patch -m "chore(release): %s"

   # For MINOR (new features)
   npm version minor -m "chore(release): %s"

   # For MAJOR (breaking changes)
   npm version major -m "chore(release): %s"
   ```

   This creates a git tag (e.g., `v1.2.0`) and commits the version bump.

4. **Push tag to GitHub**

   ```bash
   git push origin main --tags
   ```

5. **Create GitHub Release**

   - Go to GitHub → Releases → "Draft a new release"
   - Select the tag (e.g., `v1.2.0`)
   - Title: `Version 1.2.0 - Theme System & Navigation`
   - Description: Copy from CHANGELOG.md
   - Attach build artifacts (optional): Lighthouse reports, coverage reports
   - Publish release

6. **Announce** (optional)
   - Tweet/LinkedIn post with screenshots
   - Update resume/portfolio links
   - Email to recruiters showing progress

### Automated Release (Future Enhancement)

Create `.github/workflows/release.yml`:

```yaml
name: Release

on:
  workflow_dispatch:
    inputs:
      version:
        description: 'Release type (patch, minor, major)'
        required: true
        default: 'patch'
        type: choice
        options:
          - patch
          - minor
          - major

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22.x'

      - name: Configure Git
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"

      - name: Bump version
        run: npm version ${{ inputs.version }} -m "chore(release): %s"

      - name: Generate changelog
        run: |
          npm install -g conventional-changelog-cli
          conventional-changelog -p angular -i CHANGELOG.md -s
          git add CHANGELOG.md
          git commit -m "docs(changelog): update for release" || true

      - name: Push changes
        run: git push origin main --tags

      - name: Create GitHub Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: v${{ steps.version.outputs.version }}
          release_name: Release v${{ steps.version.outputs.version }}
          body_path: CHANGELOG.md
          draft: false
          prerelease: false
```

---

## Version Tracking in the App

### 1. Add Version to Environment Files

In `src/environments/environment.ts`:

```typescript
export const environment = {
  production: true,
  name: 'production',
  version: '1.0.0', // Update manually or via build script
  // ... other config
};
```

### 2. Display Version in Footer

```typescript
@Component({
  selector: 'app-footer',
  template: `
    <footer>
      <p>© 2025 MoodyJW Portfolio</p>
      <p class="version">v{{ version }}</p>
    </footer>
  `,
})
export class FooterComponent {
  version = environment.version;
}
```

### 3. Use Version in Error Tracking & Analytics

Include version in error logs and analytics events to track issues by release.

---

## Hotfix Process

For critical production bugs that can't wait for next release:

1. **Create hotfix branch** from `main`:

   ```bash
   git checkout main
   git pull
   git checkout -b fix/critical-bug-description
   ```

2. **Fix the issue** with minimal changes

3. **Test thoroughly** - run full CI locally if possible

4. **Open PR** with `[HOTFIX]` prefix in title

5. **Expedite review** - merge ASAP

6. **Deploy** (auto-deploys to GitHub Pages)

7. **Create patch release** immediately:

   ```bash
   npm version patch -m "chore(release): hotfix for critical bug"
   git push origin main --tags
   ```

8. **Post-mortem** (optional but professional):
   - Document what went wrong
   - Update tests to prevent regression
   - Review monitoring/alerts

---

## Feature Flags (Optional - Advanced)

For larger features that take multiple PRs to complete:

```typescript
// src/environments/environment.ts
export const environment = {
  features: {
    githubIntegration: false, // Enable when ready
    authSystem: false,        // Work in progress
    analytics: true,          // Enabled in production
  },
};

// Usage in components
@if (environment.features.githubIntegration) {
  <app-github-stats />
}
```

**Benefits:**

- Merge incomplete features to `main` without exposing them
- Test in production with feature flags off
- Enable for specific users/environments

---

## Pre-Release Versions (Optional)

For showcasing work-in-progress to recruiters:

```bash
# Alpha - very early, not feature-complete
npm version prerelease --preid=alpha
# Result: 1.1.0-alpha.0

# Beta - feature-complete, testing
npm version prerelease --preid=beta
# Result: 1.1.0-beta.0

# Release candidate - final testing
npm version prerelease --preid=rc
# Result: 1.1.0-rc.0
```

---

## CHANGELOG.md Format

Maintain a `CHANGELOG.md` at the root of the project:

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Nothing yet

## [1.1.0] - 2025-01-15

### Added

- Theme picker component with 4 color schemes
- GitHub integration for repository statistics
- Contribution heatmap visualization

### Fixed

- Mobile navigation accessibility issues
- Theme persistence in localStorage

### Changed

- Improved loading performance with lazy-loaded routes

## [1.0.0] - 2025-01-01

### Added

- Initial release
- Project infrastructure and CI/CD
- Core component library
- Home and Case Studies pages
- Accessibility compliance (WCAG 2.1 AAA)

[Unreleased]: https://github.com/MoodyJW/moodyjw-portfolio/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/MoodyJW/moodyjw-portfolio/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/MoodyJW/moodyjw-portfolio/releases/tag/v1.0.0
```

---

## Git Tags

**Tag Format**: `vMAJOR.MINOR.PATCH` (e.g., `v1.2.0`)

```bash
# Create annotated tag (recommended)
git tag -a v1.2.0 -m "Release version 1.2.0 - Theme System"

# Push tag
git push origin v1.2.0

# List all tags
git tag -l

# Delete tag (if mistake)
git tag -d v1.2.0
git push origin :refs/tags/v1.2.0
```

---

## Summary & Recommendations

### Recommended Setup for Solo Enterprise Demo

1. ✅ **Trunk-Based Development** - Feature branches → `main` → Auto-deploy
2. ✅ **Conventional Commits** - Enable automated changelog generation
3. ✅ **Semantic Versioning** - Clear version progression
4. ✅ **Milestone-Based Releases** - After completing phases or major features
5. ✅ **Manual Release Process** - Tag + GitHub Release + CHANGELOG update
6. ⏳ **Future**: Automated release workflow (when comfortable with process)

### What This Demonstrates to Employers

- ✅ Modern Git workflow (trunk-based, not GitFlow)
- ✅ Conventional commits for maintainability
- ✅ Semantic versioning understanding
- ✅ CI/CD best practices (automated deployments)
- ✅ Release management discipline
- ✅ Professional changelog maintenance
- ✅ Enterprise-standard practices adapted for solo dev

### Quick Reference

```bash
# Daily workflow
git checkout -b feature/my-feature
# ... make changes ...
git commit -m "feat(scope): add feature"
git push origin feature/my-feature
# Open PR, wait for CI, merge to main

# Release workflow (after milestone)
git checkout main
git pull
npm version minor -m "chore(release): %s"
conventional-changelog -p angular -i CHANGELOG.md -s
git add CHANGELOG.md
git commit -m "docs(changelog): update for release"
git push origin main --tags
# Create GitHub Release with changelog
```

---

**Document Version**: 1.0  
**Last Updated**: November 25, 2025  
**Status**: Recommended for Phase 1 completion
