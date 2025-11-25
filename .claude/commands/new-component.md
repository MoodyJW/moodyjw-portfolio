---
description: Create a new Angular standalone component with all required files (component, template, styles, spec, stories)
---

Create a new Angular standalone component following the project's architecture patterns.

**Requirements:**
1. Component must be standalone with `ChangeDetectionStrategy.OnPush`
2. Use signals for reactive state management
3. Follow BEM naming convention for styles
4. Use CSS variables from the theme system (no hardcoded values)
5. Include TSDoc comments for all public APIs
6. Create Storybook story with accessibility notes
7. Create unit test spec file with basic tests
8. Use modern Angular control flow (@if, @for, @switch)
9. Place in appropriate folder (shared/components or features/)
10. Use `inject()` for dependency injection

**Before creating:**
- Ask me for the component name and location
- Ask if it needs any inputs or outputs
- Ask about the component's purpose and main functionality

**Files to create:**
- `{name}.component.ts` - Component class
- `{name}.component.html` - Template
- `{name}.component.scss` - Styles (BEM + CSS variables)
- `{name}.component.spec.ts` - Vitest unit tests
- `{name}.component.stories.ts` - Storybook story

Follow all patterns from `.github/copilot-instructions.md` and ensure WCAG 2.1 AAA accessibility compliance.
