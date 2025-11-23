# MoodyJW Portfolio

> Lead Frontend Developer portfolio engineered with modern Angular (signals, standalone). A demonstration of scalable architecture, custom design systems, and high-performance UI patterns.

## 🚀 Features

- ✅ **Modern Angular 21+** with standalone components
- ✅ **Signals** for reactive state management
- ✅ **Feature-based architecture** (Core, Shared, Features)
- ✅ **Lazy-loaded routes** for optimal performance
- ✅ **OnPush change detection** throughout
- ✅ **Custom design system** with CSS Variables (no UI frameworks)
- ✅ **BEM methodology** for maintainable styles
- ✅ **Responsive layout** with mobile-first approach
- ✅ **Dark mode support** (auto-detects system preference)

## 📁 Project Structure

```
src/app/
├── core/                    # Core application functionality
│   ├── layout/             # Shell layouts (MainLayout)
│   ├── services/           # Global services
│   ├── guards/             # Route guards
│   ├── interceptors/       # HTTP interceptors
│   └── models/             # Data models and interfaces
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
- **Language**: TypeScript 5.9
- **Styling**: SCSS with CSS Variables
- **State Management**: Angular Signals
- **Routing**: Angular Router (lazy-loaded)
- **Testing**: Vitest
- **Build Tool**: Angular CLI with Vite

## 🎨 Design System

The application uses a custom design system built with CSS Variables for consistency and theme support:

- **Colors**: Primary, surface, text, and status colors
- **Spacing**: 8-point grid system (xs to 4xl)
- **Typography**: Font sizes, weights, and families
- **Border Radius**: Consistent corner radii
- **Shadows**: Elevation system
- **Transitions**: Standardized durations and timings

All design tokens are defined in `src/styles/_variables.scss`.

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
# Run unit tests
npm test
```

## 📐 Architecture Principles

### Standalone Components
All components are standalone, eliminating the need for NgModules:

```typescript
@Component({
  selector: 'app-feature',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush
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
changeDetection: ChangeDetectionStrategy.OnPush
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

## 📚 Documentation

- **[Implementation Plan](./IMPLEMENTATION_PLAN.md)** - Phased development roadmap
- **[Copilot Instructions](./.github/copilot-instructions.md)** - AI coding assistant guidelines

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
- **Lighthouse Score Target**: 95+
- **First Contentful Paint**: < 1.5s

## 🔐 Security

- No hardcoded secrets
- Dependencies regularly updated
- Security best practices enforced

## 📝 License

This project is licensed under the MIT License.

## 👤 Author

**MoodyJW**
- GitHub: [@MoodyJW](https://github.com/MoodyJW)

---

Built with ❤️ using Angular
