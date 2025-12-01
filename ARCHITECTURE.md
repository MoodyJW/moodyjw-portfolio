# Architecture Documentation

## Overview

This Angular portfolio application is built using modern Angular 21+ features with a focus on performance, maintainability, and scalability. The architecture follows enterprise-grade patterns suitable for large-scale applications.

## Core Architectural Decisions

### 1. Standalone Components

**Decision**: Use standalone components exclusively, eliminating NgModules.

**Rationale**:

- Simplified dependency management
- Better tree-shaking and smaller bundles
- Improved developer experience
- Forward-compatible with Angular's direction

**Implementation**:

```typescript
@Component({
  selector: 'app-feature',
  standalone: true,
  imports: [RouterLink, CommonModule],
  // ...
})
```

### 2. Signal-Based State Management

**Decision**: Use Angular Signals as the primary reactive primitive.

**Rationale**:

- Fine-grained reactivity
- Better performance than zone-based change detection
- Simpler mental model than RxJS for UI state
- Native Angular feature with first-class support

**Implementation**:

```typescript
protected readonly items = signal<Item[]>([]);
protected readonly loading = signal(false);
```

### 3. OnPush Change Detection Strategy

**Decision**: Enforce `ChangeDetectionStrategy.OnPush` on all components.

**Rationale**:

- Significant performance improvements
- Forces immutable data patterns
- Works seamlessly with signals
- Prevents unnecessary re-renders

**Implementation**:

```typescript
@Component({
  // ...
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

### 4. Feature-Based Architecture

**Decision**: Organize code by feature domains rather than technical layers.

**Rationale**:

- Better code organization at scale
- Clear boundaries between features
- Easier to understand and maintain
- Supports team-based development

**Structure**:

```
src/app/
├── core/       # Application-wide singletons
├── shared/     # Reusable components/utilities
└── features/   # Business features
```

### 5. Lazy Loading Routes

**Decision**: Lazy load all feature routes using dynamic imports.

**Rationale**:

- Smaller initial bundle size
- Faster time to interactive
- Better code splitting
- Improved performance metrics

**Implementation**:

```typescript
{
  path: 'feature',
  loadComponent: () => import('./features/feature').then(m => m.FeatureComponent)
}
```

### 6. Custom Design System

**Decision**: Build custom design system with CSS Variables instead of using UI frameworks.

**Rationale**:

- Full control over styling
- Smaller bundle size
- No framework-specific conventions
- Demonstrates frontend expertise
- Theme flexibility

**Implementation**:

- CSS Variables in `_variables.scss`
- BEM naming convention
- Consistent design tokens

## Module Organization

### Core Module

**Purpose**: Application-wide singleton services, guards, interceptors, and layouts.

**Contents**:

- Layout components (MainLayout)
- Global services
- Route guards
- HTTP interceptors
- Shared models/interfaces

**Rules**:

- Should only be imported/used by the root app
- Services should use `providedIn: 'root'`
- No feature-specific logic

### Shared Module

**Purpose**: Reusable presentational components, directives, and pipes.

**Contents**:

- UI components (buttons, cards, modals)
- Utility directives
- Pure pipes
- Helper functions

**Rules**:

- No business logic
- Should be dumb/presentational
- Accept inputs via signals
- Emit outputs via signal outputs
- Must be reusable across features

### Features Module

**Purpose**: Self-contained feature implementations.

**Contents**:

- Feature components
- Feature-specific services
- Feature-specific state

**Rules**:

- Minimize inter-feature dependencies
- Lazy-loaded by default
- Feature-specific services provided at component level
- Each feature is a cohesive unit

## Routing Strategy

### Shell Architecture

The application uses a shell architecture with `MainLayoutComponent`:

```
MainLayout (Shell)
└── Router Outlet
    ├── Home (Lazy)
    ├── Case Studies (Lazy)
    └── Future Features (Lazy)
```

**Benefits**:

- Consistent layout across features
- Single navigation implementation
- Shared header/footer
- Easy to add authentication shells later

### Route Configuration

```typescript
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./core/layout').then((m) => m.MainLayoutComponent),
    children: [
      // Feature routes here
    ],
  },
];
```

## State Management Strategy

### Component State (Local)

Use signals for component-local state:

```typescript
class MyComponent {
  private readonly items = signal<Item[]>([]);

  protected readonly filteredItems = computed(() => this.items().filter(/* logic */));
}
```

### Global State (Future)

For global state, create services in `core/services`:

```typescript
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly theme = signal<Theme>('light');

  readonly theme$ = this.theme.asReadonly();

  setTheme(theme: Theme) {
    this.theme.set(theme);
  }
}
```

## Styling Architecture

### CSS Variables

All design tokens are defined as CSS variables:

```scss
:root {
  --color-primary: #2563eb;
  --spacing-lg: 1rem;
  --font-size-base: 1rem;
}
```

### BEM Methodology

All components follow BEM naming:

```scss
.component {
  &__element {
    &--modifier {
      // styles
    }
  }
}
```

### Theme Support

Dark mode via CSS `prefers-color-scheme`:

```scss
@media (prefers-color-scheme: dark) {
  :root {
    --color-primary: #3b82f6;
    // ...
  }
}
```

## Performance Optimizations

### 1. Bundle Size

- Initial bundle: ~60KB gzipped
- Lazy chunks: ~1-1.5KB each
- No heavy UI frameworks
- Tree-shakeable code

### 2. Runtime Performance

- OnPush change detection
- Signals for fine-grained reactivity
- Minimal DOM manipulations
- Optimized rendering

### 3. Loading Performance

- Lazy-loaded routes
- Code splitting by feature
- Minimal initial JavaScript
- Preconnect hints (future)

## Testing Strategy

### Unit Tests

- Test components in isolation
- Mock dependencies
- Test signal updates
- Use Angular Testing Library

### Integration Tests

- Test feature flows
- Test route navigation
- Test service integration

### E2E Tests

- Test critical user flows
- Test across browsers
- Test responsive behavior

## Security Considerations

### Current Measures

- No hardcoded secrets
- XSS protection via Angular sanitization
- CSRF protection (when backend added)
- Content Security Policy headers (deployment)

### Future Enhancements

- Authentication guards
- Authorization logic
- Input validation
- Rate limiting

## Scalability Considerations

### Code Organization

- Feature-based structure scales to hundreds of features
- Clear boundaries prevent coupling
- Easy to parallelize development

### Performance

- Lazy loading prevents bundle bloat
- OnPush scales to complex UIs
- Signals provide efficient updates

### Team Collaboration

- Feature folders enable team ownership
- Clear separation of concerns
- Consistent patterns across codebase

## Migration Path

### From Current State

The application is designed to grow incrementally:

1. **Phase 1** (95% Complete): Foundation
2. **Phase 2**: Enhanced features
3. **Phase 3**: State management
4. **Phase 4**: Shared components
5. **Phase 5**: Advanced features
6. **Phase 6**: Testing
7. **Phase 7**: Deployment
8. **Phase 8**: Documentation

### Adding New Features

```bash
# Create feature structure
mkdir -p src/app/features/new-feature/{components,services}

# Generate component
ng generate component features/new-feature --standalone

# Add route
# Update app.routes.ts with lazy-loaded route
```

## Technology Choices

### Angular 21+

- Latest features (signals, control flow)
- Long-term support
- Strong TypeScript integration
- Excellent tooling

### TypeScript 5.9+

- Type safety
- Better IDE support
- Modern JavaScript features
- Improved DX

### SCSS

- Variables and mixins
- Nesting for BEM
- Better organization
- Build-time processing

### Vite (via Angular CLI)

- Fast HMR
- Efficient bundling
- Modern build tool
- Great DX

## Client-Side AI Career Chatbot Architecture (Phase 5)

### Overview

The portfolio includes an innovative client-side AI chatbot that answers questions about Jay's career experience using **WebLLM** and **RAG (Retrieval-Augmented Generation)**—all processing happens in the browser with no backend required.

### Architecture Components

#### 1. Knowledge Base (Build-Time)

**Career Corpus** (`/assets/chatbot/corpus.json`):
```json
[
  {
    "id": 1,
    "text": "Jay has 5 years of experience with Angular, specializing in enterprise applications...",
    "metadata": { "category": "technical-skills", "topic": "angular" }
  }
]
```

**Embeddings** (`/assets/chatbot/embeddings.json`):
```json
[
  {
    "id": 1,
    "embedding": [0.123, -0.456, ...],  // 384-dimensional vector
    "text": "Jay has 5 years of experience..."
  }
]
```

**Build Process**:
- Python script using `sentence-transformers` library
- Model: `all-MiniLM-L6-v2` (offline, lightweight, 384 dimensions)
- Run manually before deployment: `python scripts/generate-embeddings.py`

#### 2. Core Services

**LlmService** (`core/services/llm.service.ts`):
```typescript
@Injectable({ providedIn: 'root' })
export class LlmService {
  private readonly modelLoaded = signal(false);
  private readonly loadingProgress = signal(0);

  // Initialize WebLLM worker
  async initializeModel(): Promise<void>

  // Embed query for RAG retrieval
  async embed(text: string): Promise<number[]>

  // Generate response with streaming
  async generate(prompt: string, context: string): AsyncGenerator<string>
}
```

**RagService** (`core/services/rag.service.ts`):
```typescript
@Injectable({ providedIn: 'root' })
export class RagService {
  private readonly embeddings = signal<Embedding[]>([]);

  // Load embeddings on app startup
  async loadEmbeddings(): Promise<void>

  // Find most similar chunks via cosine similarity
  async retrieveContext(queryEmbedding: number[], k = 5): Promise<string[]>

  // Build final prompt with retrieved context
  buildPrompt(query: string, context: string[]): string
}
```

**ChatbotStateService** (`core/services/chatbot-state.service.ts`):
```typescript
@Injectable({ providedIn: 'root' })
export class ChatbotStateService {
  private readonly messages = signal<ChatMessage[]>([]);
  private readonly isLoading = signal(false);

  addMessage(role: 'user' | 'assistant', content: string): void
  clearConversation(): void
  persistToStorage(): void
}
```

#### 3. UI Components

**CareerChatbotComponent** (`features/career-chatbot/career-chatbot.component.ts`):
- Main chat interface
- Lazy-loaded when user opens chatbot
- Manages conversation flow
- Handles model initialization

**ChatContainerComponent** (`shared/components/chat-container/`):
- Reusable chat UI shell
- Message list with auto-scroll
- Loading states and error handling

**ChatMessageComponent** (`shared/components/chat-message/`):
- Individual message display
- Markdown rendering for bot responses
- Timestamp and avatar

**ChatInputComponent** (`shared/components/chat-input/`):
- Multi-line textarea
- Send button with keyboard shortcuts
- Character validation

#### 4. Data Flow

**User Query Flow**:
```
User Input
  ↓
ChatbotStateService (add user message)
  ↓
LlmService.embed(query)
  ↓
RagService.retrieveContext(embedding) → Top 5 relevant chunks
  ↓
RagService.buildPrompt(query, context)
  ↓
LlmService.generate(prompt) → Stream tokens
  ↓
ChatbotStateService (add assistant message)
  ↓
UI Update (display response)
```

### Technology Stack

**WebLLM**:
- Browser-based LLM inference using WebGPU/WebAssembly
- Model: Llama-3.1-8B-Instruct-q4f32_1 (quantized for browser)
- Size: ~1.5-2GB (cached in IndexedDB)
- Inference: ~10-20 tokens/second on modern hardware

**Sentence Transformers**:
- Python library for generating embeddings
- Model: `all-MiniLM-L6-v2` (lightweight, 80MB)
- Output: 384-dimensional embeddings
- Build-time only (not shipped to browser)

**RAG Implementation**:
- Pure TypeScript cosine similarity calculation
- No external dependencies for vector search
- O(n) search complexity (acceptable for < 1000 chunks)

### Performance Optimizations

1. **Model Caching**: IndexedDB stores downloaded model (~1.5GB) for instant subsequent loads
2. **Lazy Loading**: Chatbot feature only loads when user opens it
3. **Embedding Compression**: Consider quantizing embeddings to reduce JSON size
4. **Progressive Loading**: Show model download progress to user
5. **Worker Threads**: WebLLM runs in Web Worker to avoid blocking main thread

### Security & Privacy

- **No Backend**: All processing happens client-side
- **No Telemetry**: User queries never leave the browser
- **No PII**: Corpus contains only professional career information
- **Browser Compatibility**: Graceful degradation for unsupported browsers

### Accessibility

- **WCAG 2.1 AAA Compliant**: Full keyboard navigation and screen reader support
- **ARIA Live Regions**: Announce new messages to screen readers
- **Focus Management**: Proper focus handling for modal dialog pattern
- **Reduced Motion**: Respect `prefers-reduced-motion` for animations

### Browser Compatibility

**Supported Browsers**:
- Chrome 113+ (WebGPU support)
- Edge 113+
- Firefox 117+ (with WebGPU flag)
- Safari 17+ (experimental WebGPU)

**Fallback Strategy**:
- Detect WebGPU support on component mount
- Show friendly error message for unsupported browsers
- Provide alternative contact methods

### Testing Strategy

**Unit Tests**:
- Mock WebLLM worker for service tests
- Test cosine similarity calculations
- Test RAG retrieval accuracy
- Test state management logic

**E2E Tests**:
- Test chat interaction flow (send message, receive response)
- Test model loading progress display
- Test error handling (model load failure, generation timeout)
- Test accessibility (keyboard navigation, screen reader)

### Deployment Considerations

**Build Process**:
```bash
# 1. Generate embeddings (run before deployment)
python scripts/generate-embeddings.py

# 2. Verify output files exist
ls src/assets/chatbot/corpus.json
ls src/assets/chatbot/embeddings.json

# 3. Build application (includes static assets)
npm run build
```

**Bundle Size Impact**:
- `corpus.json`: ~50-100KB (depends on career content volume)
- `embeddings.json`: ~500KB-1MB (384 dimensions × ~1000 chunks)
- `@mlc-ai/web-llm`: ~200KB (library only, model downloaded at runtime)
- Total Impact: ~1-1.5MB additional bundle size

**CDN Considerations**:
- Model files (~1.5GB) served from WebLLM CDN (Hugging Face)
- Static assets (corpus, embeddings) served from GitHub Pages
- Consider compressing embeddings.json with Brotli

## Future Considerations

### Potential Additions

- Storybook for component documentation
- Nx for monorepo management
- Playwright for E2E testing
- Husky for git hooks
- Prettier for code formatting
- ESLint for code quality

### Backend Integration

When adding a backend:

- Create API service in `core/services`
- Add HTTP interceptors for auth
- Add error handling
- Add loading states

### State Management Library

If needed at scale:

- NgRx for complex state
- Elf for lightweight solution
- Maintain signal-first approach

## Conclusion

This architecture provides a solid foundation for a scalable, performant Angular application. It follows Angular best practices, uses modern features, and is designed to grow with the application's needs.

The focus on standalone components, signals, and lazy loading ensures the application remains fast and maintainable as it scales. The feature-based organization and clear separation of concerns make it easy for teams to collaborate and extend functionality.
