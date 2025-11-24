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

## 📁 Project Structure

```
src/
├── app/
│   ├── core/                    # Core application functionality
│   │   ├── layout/             # Shell layouts (MainLayout)
│   │   ├── services/           # Global services (ProjectService)
│   │   ├── store/              # NgRx SignalStore (ProjectStore)
│   │   ├── guards/             # Route guards
│   │   ├── interceptors/       # HTTP interceptors (latency simulation)
│   │   └── models/             # Data models and interfaces (Project)
├── assets/
│   └── data/               # Mock JSON data files (projects.json)
├── shared/                 # Shared across features
│   ├── components/         # Reusable components
│   ├── directives/         # Custom directives
│   ├── pipes/              # Custom pipes
│   └── utils/              # Utility functions
└── features/               # Feature modules
    ├── home/               # Home page feature
    └── case-studies/       # Case studies feature
```

## 🛠️ Tech Stack

- **Framework**: Angular 21.0
- **Language**: TypeScript 5.9 (strict mode)
- **Styling**: SCSS with CSS Variables
- **State Management**: NgRx SignalStore + Angular Signals
- **Data Layer**: Mockend pattern with local JSON files
- **HTTP Client**: Angular HttpClient with functional interceptors
- **Routing**: Angular Router (lazy-loaded)
- **Testing**: Vitest (Unit) + Playwright (E2E + Visual Regression)
- **Build Tool**: Angular CLI with Vite
- **CI/CD**: GitHub Actions (4 workflows) + GitHub CodeQL
- **Code Quality**: ESLint with Angular ESLint + accessibility linting
- **Performance**: Lighthouse CI with strict budgets (≥95/100/100/90)

## 🎨 Design System

The application uses a custom design system built with CSS Variables for consistency and theme support:

- **Colors**: Primary, surface, text, and status colors
- **Spacing**: 8-point grid system (xs to 4xl)
- **Typography**: Font sizes, weights, and families
- **Border Radius**: Consistent corner radii
- **Shadows**: Elevation system
- **Transitions**: Standardized durations and timings

All design tokens are defined in `src/styles/_variables.scss`.

## 💾 Data Architecture (Mockend Pattern)

The application uses a **Mockend** approach for data management, providing a realistic development experience that easily transitions to real APIs:

### Architecture Overview

```
┌─────────────────┐
│   Component     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ ProjectService  │  (uses inject(HttpClient))
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  HttpClient     │  → latencyInterceptor (500-1000ms delay)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  projects.json  │  (src/assets/data/)
└─────────────────┘
```

### Key Components

- **`src/assets/data/projects.json`**: Mock data for case studies/projects
- **`ProjectService`**: Service layer that fetches data using HttpClient
- **`latencyInterceptor`**: Functional interceptor that simulates network latency (500-1000ms)
- **`Project` model**: TypeScript interface defining the data structure

### Why This Approach?

1. **Realistic Development**: Simulated latency helps test loading states and UX
2. **Easy Transition**: Same service layer works with real APIs—just change the URL
3. **No Backend Required**: Develop frontend features independently
4. **Type Safety**: Full TypeScript support with defined models
5. **Testable**: Easy to mock and test data flows

### Usage Example with NgRx SignalStore

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
# Run unit tests with coverage
npm test

# Run linting (ESLint + accessibility)
npm run lint

# Run E2E tests
npm run test:e2e

# Run E2E tests in UI mode (interactive)
npm run test:e2e:ui

# Update visual regression baselines
npm run test:e2e:update-snapshots
```

### CI/CD Pipeline

The project includes 4 automated workflows:

1. **CI** (`ci.yml`) - Build, lint, test with coverage (80% threshold)
2. **E2E Tests** (`e2e.yml`) - Cross-browser testing (Chromium, Firefox, WebKit)
3. **Lighthouse** (`lighthouse.yml`) - Performance monitoring with PR comments
4. **Dependency Review** (`dependency-review.yml`) - Security vulnerability scanning

All workflows run on pull requests and must pass before merging.

**Security:** GitHub's built-in CodeQL scanning is enabled for static code analysis and vulnerability detection.

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
- **[Copilot Instructions](./.github/copilot-instructions.md)** - AI coding assistant guidelines
- **[E2E Testing Guide](./e2e/README.md)** - Playwright testing documentation
- **[Environment Configuration](./src/environments/README.md)** - Environment setup and configuration
- **[Constants Documentation](./src/app/shared/constants/README.md)** - Application constants usage guide

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
