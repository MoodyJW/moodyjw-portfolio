# MoodyJW Portfolio

> Lead Frontend Developer portfolio engineered with modern Angular (signals, standalone). A demonstration of scalable architecture, custom design systems, and high-performance UI patterns.

## 🚀 Features

- ✅ **Modern Angular 21+** with standalone components
- ✅ **NgRx SignalStore** for reactive state management
- ✅ **Signals** for reactive data flow
- ✅ **Feature-based architecture** (Core, Shared, Features)
- ✅ **Lazy-loaded routes** for optimal performance
- ✅ **OnPush change detection** throughout
- ✅ **Custom design system** with CSS Variables (no UI frameworks)
- ✅ **BEM methodology** for maintainable styles
- ✅ **Responsive layout** with mobile-first approach
- ✅ **Dark mode support** (auto-detects system preference)
- ✅ **Mockend data layer** with simulated network latency for realistic development
- ✅ **Complete CI/CD pipeline** with GitHub Actions (build, test, E2E, performance, security)
- 🚧 **Client-side AI Career Chatbot** with WebLLM and RAG (Retrieval-Augmented Generation) - *Coming in Phase 5*

# MoodyJW Portfolio

A concise developer-focused overview and local quick-start for the MoodyJW portfolio.

Quick links:

- Architecture: `ARCHITECTURE.md`
- Mock data & services: `src/app/core/MOCKEND_GUIDE.md`
- Store + integration: `src/app/core/STORE_SERVICE_INTEGRATION.md`
- Generated API docs: `docs/compodoc/` (generated with Compodoc)

Prerequisites

- Node.js (v20 or v22 recommended)
- npm (use `--legacy-peer-deps` when adding packages if necessary)

Local quick start

```bash
# install
npm install

# development server
npm start

# build production
npm run build

# generate docs locally
npx compodoc -p tsconfig.json -d docs/compodoc
# serve docs
npx compodoc -s -d docs/compodoc
```

Where things live

- App source: `src/app`
- Mock data: `src/assets/data`
- Generated docs: `docs/compodoc`
- GitHub Actions workflows: `.github/workflows`

Docs and CI

- Compodoc is run locally via `npx compodoc` and is included in CI (`.github/workflows/compodoc.yml`).
- The Pages deploy workflow copies generated Compodoc output into the site so docs are available at `/docs/compodoc/` on the deployed site.

Contributing

- Run `npm run lint` and `npm test` before opening PRs.
- See `IMPLEMENTATION_PLAN.md` for phase-level goals and progress.

License and security

- Do not commit secrets; use GitHub Secrets for tokens.
- CodeQL and dependency review workflows are configured in CI.

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { ProjectStore } from '@core/store';

@Component({
  selector: 'app-case-studies',
  standalone: true,
  template: `
    @if (store.isLoading()) {
    <div>Loading projects...</div>
    } @else if (store.error()) {
    <div>Error: {{ store.error() }}</div>
    } @else {
    <h1>Projects ({{ store.projectCount() }})</h1>
    @for (project of store.projects(); track project.id) {
    <article>{{ project.title }}</article>
    } }
  `,
})
export class CaseStudiesComponent implements OnInit {
  readonly store = inject(ProjectStore);

  ngOnInit() {
    // Load projects automatically triggers loading state
    this.store.loadProjects();
  }
}
```

## 🤖 Client-Side AI Career Chatbot (Planned - Phase 5)

This portfolio will feature an innovative **client-side AI chatbot** that answers questions about Jay's career, experience, and technical expertise—all running locally in your browser with no backend required.

### Architecture Overview

**Technology Stack:**
- **WebLLM**: Browser-based LLM inference using Llama-3.1-8B-Instruct (quantized)
- **RAG (Retrieval-Augmented Generation)**: Vector search using pre-computed embeddings
- **Sentence Transformers**: Build-time embedding generation with `all-MiniLM-L6-v2`
- **Pure TypeScript**: Client-side vector similarity search (cosine similarity)
- **IndexedDB**: Model caching to avoid re-downloading

### Key Features

- 🧠 **Fully Client-Side**: All AI processing happens in your browser
- ⚡ **Fast Response Time**: Model loads in < 30 seconds, cached for subsequent visits
- 🔒 **Privacy-First**: No data sent to external servers
- 📚 **Knowledge Base**: Answers questions about career history, projects, skills, and achievements
- ♿ **Accessible**: WCAG 2.1 AAA compliant with keyboard navigation and screen reader support
- 📱 **Mobile-Friendly**: Responsive chat interface works on all devices

### How It Works

1. **Build Time**: Python script generates embeddings from career content corpus
2. **First Load**: WebLLM model downloads and caches in IndexedDB (~1-2GB)
3. **User Query**: Question is embedded and similar content chunks are retrieved via RAG
4. **Response**: LLM generates contextual answer using only retrieved career information
5. **Streaming**: Tokens stream in real-time for smooth UX

### Example Queries

- "What experience does Jay have with Angular?"
- "Tell me about Jay's leadership experience"
- "What are Jay's most significant technical achievements?"
- "Has Jay worked with microservices architecture?"

**Status**: Implementation planned for Phase 5 (see [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md#L869-L906))

## 🎯 State Management with NgRx SignalStore

### Store Features

The `ProjectStore` provides a complete state management solution:

**State Properties:**

- `projects()` - Array of all projects
- `selectedProject()` - Currently selected project
- `isLoading()` - Loading state indicator
- `error()` - Error message if any

**Computed Selectors:**

- `projectCount()` - Total number of projects
- `projectsByTag(tag)` - Filter projects by tag
- `hasSelection()` - Check if a project is selected
- `allTags()` - Get all unique tags sorted

**Methods:**

- `loadProjects()` - Load all projects
- `loadProjectById(id)` - Load and select specific project
- `selectProject(project)` - Manually set selected project
- `clearSelection()` - Clear selected project
- `clearError()` - Clear error state
- `reset()` - Reset store to initial state

### Advanced Usage

```typescript
// Filter projects by technology
const angularProjects = store.projectsByTag()('Angular');

// Check loading state
if (store.isLoading()) {
  // Show spinner
}

// Access all tags for filtering UI
const tags = store.allTags(); // ['Angular', 'React', 'TypeScript', ...]
```

## 🚦 Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/MoodyJW/moodyjw-portfolio.git

# Navigate to project directory
cd moodyjw-portfolio

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm start

# Application will be available at http://localhost:4200
```

### Build

```bash
# Build for production
npm run build

# Output will be in dist/moodyjw-portfolio
```

### Testing

```bash
# Run unit tests (interactive, watch mode)
npm test

# Run unit tests with coverage (used in CI)
npm run test:coverage

# Run linting (ESLint + accessibility)
npm run lint

# Run E2E tests
npm run test:e2e

# Run E2E tests in UI mode (interactive)
npm run test:e2e:ui

# Update visual regression baselines
npm run test:e2e:update-snapshots
```

**Important:** Always use `npm test` or `npm run test:coverage` for running tests. Do not use `npx vitest run` directly as it bypasses Angular's test infrastructure which handles component template and style resolution.

### Storybook

```bash
# Start Storybook development server
npm run storybook

# Build Storybook static site
npm run build-storybook
```

**Note:** The `storybook-static/` build output is excluded from git (`.gitignore`) and CodeQL scanning. This directory contains bundled dependencies and should not be committed to the repository.

### CI/CD Pipeline

The project includes 8 automated workflows:

1. **CI** (`ci.yml`) - Build, lint, test with coverage (80% threshold)
2. **E2E Tests** (`e2e.yml`) - Cross-browser testing (Chromium, Firefox, WebKit)
3. **Lighthouse** (`lighthouse.yml`) - Performance monitoring with PR comments
4. **Dependency Review** (`dependency-review.yml`) - Security vulnerability scanning
5. **Deploy Pages** (`deploy-pages.yml`) - Automated GitHub Pages deployment
6. **Compodoc** (`compodoc.yml`) - API documentation generation
7. **Docs Check** (`docs-check.yml`) - Documentation validation
8. **Pages Sanity** (`pages-sanity.yml`) - Deployment verification

All workflows run on pull requests and must pass before merging.

**Security:** GitHub's CodeQL "Default setup" is enabled for automatic security analysis on every push and PR.

## 📐 Architecture Principles

### Standalone Components

All components are standalone, eliminating the need for NgModules:

```typescript
@Component({
  selector: 'app-feature',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureComponent {}
```

### Signals

Using Angular Signals for reactive state:

```typescript
protected readonly data = signal<Type>(initialValue);
```

### Lazy Loading

All feature routes are lazy-loaded:

```typescript
{
  path: 'feature',
  loadComponent: () => import('./features/feature').then(m => m.FeatureComponent)
}
```

### OnPush Change Detection

All components use OnPush strategy for optimal performance:

```typescript
changeDetection: ChangeDetectionStrategy.OnPush;
```

## 🎯 Code Style

### BEM Naming Convention

```scss
.component {
  &__element {
    // element styles
  }

  &__element--modifier {
    // modifier styles
  }
}
```

### CSS Variables Usage

```scss
.component {
  color: var(--color-primary);
  padding: var(--spacing-lg);
  font-size: var(--font-size-base);
}
```

## 🧪 Testing Strategy

### Unit Testing

- **Framework**: Vitest
- **Coverage**: Components, services, utilities
- **Strategy**: Test signal updates, component reactions, and business logic

### E2E Testing

- **Framework**: Playwright
- **Coverage**: Navigation, user flows, visual regression
- **Viewports**: Desktop (1920x1080), Laptop (1440x1024), Tablet (768x1024), Mobile (375x667)
- **Browsers**: Chromium, Firefox, WebKit

#### Visual Regression Tests

Visual regression tests ensure CSS Grid layouts and responsive designs don't break:

- Screenshots captured for Home and Case Studies pages
- Tested across 4 viewports (Desktop, Laptop, Tablet, Mobile)
- Baseline images stored in `e2e/screenshots-baseline/`
- Automatic pixel-by-pixel comparison

See **[E2E Testing Guide](./e2e/README.md)** for detailed information.

## 📚 Documentation

- **[Implementation Plan](./IMPLEMENTATION_PLAN.md)** - Phased development roadmap
- **[Architecture](./ARCHITECTURE.md)** - System architecture and design decisions
- **[Copilot Instructions](./.github/copilot-instructions.md)** - AI coding assistant guidelines
- **[Claude Code Commands](./.claude/README.md)** - Claude Code slash commands and configuration
- **[E2E Testing Guide](./e2e/README.md)** - Playwright testing documentation
- **[Environment Configuration](./src/environments/README.md)** - Environment setup and configuration
- **[Constants Documentation](./src/app/shared/constants/README.md)** - Application constants usage guide

### AI Coding Assistants

This project is optimized for AI-assisted development:

- **GitHub Copilot**: See [.github/copilot-instructions.md](./.github/copilot-instructions.md) for comprehensive coding guidelines
- **Claude Code**: See [.claude/README.md](./.claude/README.md) for available slash commands like `/new-component`, `/accessibility-check`, `/review-pr`, and more

## 🚀 Deployment

This project is deployed to **GitHub Pages** with automated CI/CD via GitHub Actions.

### GitHub Pages Configuration

**Current Status:** Workflow created and ready. First deployment will occur when configuration is merged to `main` branch.

#### Initial Setup

1. Go to repository **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. Push changes to `main` branch to trigger automatic deployment

#### Automated Deployment Workflow

The `.github/workflows/deploy-pages.yml` workflow automatically:

- Triggers on every push to `main` branch
- Builds the application with production configuration
- Applies the correct `baseHref` for GitHub Pages (`/moodyjw-portfolio/`)
- Creates a `404.html` for SPA routing support
- Uploads and deploys to GitHub Pages

#### Site URL

Once deployed, the site will be available at:

```
https://MoodyJW.github.io/moodyjw-portfolio/
```

**Note:** First deployment is pending merge of configuration to `main` branch.

#### Manual Deployment

To trigger a deployment manually (without pushing to `main`):

1. Go to **Actions** tab in GitHub
2. Select **Deploy to GitHub Pages** workflow
3. Click **Run workflow** → **Run workflow**

#### Local Production Build

Test the production build locally before deploying:

```bash
# Build for production (with GitHub Pages baseHref)
npm run build

# Serve the production build locally
npx http-server dist/moodyjw-portfolio/browser -p 8080
```

**Note:** When serving locally, routes may not work exactly as on GitHub Pages due to baseHref differences.

## 🤝 Contributing

1. Follow the established folder structure
2. Use standalone components with OnPush
3. Implement features with signals
4. Style with BEM and CSS variables
5. Lazy-load all feature routes
6. Write tests for new functionality

## 📊 Performance

- **Initial Bundle**: ~60 KB (gzipped)
- **Lazy Chunks**: ~1-1.5 KB each feature
- **Lighthouse Scores** (enforced via CI):
  - Performance: ≥95
  - Accessibility: 100
  - Best Practices: 100
  - SEO: ≥90
- **Core Web Vitals**:
  - First Contentful Paint: <1.5s
  - Largest Contentful Paint: <2.5s
  - Cumulative Layout Shift: <0.1
  - Total Blocking Time: <300ms
  - Speed Index: <3s

## 🔐 Security

- **Dependency Review**: Automated scanning blocks high-severity vulnerabilities
- **CodeQL Analysis**: GitHub's built-in security scanning for TypeScript/JavaScript
- **License Compliance**: Copyleft licenses (GPL, LGPL, AGPL) automatically blocked
- **Branch Protection**: Required status checks enforce all quality gates
- **No Hardcoded Secrets**: All sensitive data managed via environment variables

## 📝 License

This project is licensed under the MIT License.

## 👤 Author

**MoodyJW**

- GitHub: [@MoodyJW](https://github.com/MoodyJW)

---

Built with ❤️ using Angular
