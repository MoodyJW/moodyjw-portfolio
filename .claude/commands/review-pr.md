---
description: Review code changes against project standards and best practices
---

Perform a comprehensive code review of the current changes.

**Review Checklist:**

1. **Architecture & Patterns**
   - All components are standalone
   - Using ChangeDetectionStrategy.OnPush
   - Using signals for reactive state
   - Lazy loading for feature routes
   - Proper folder structure (core/shared/features)

2. **Code Style**
   - BEM naming convention for CSS classes
   - CSS variables used (no hardcoded colors/spacing)
   - Modern Angular control flow (@if, @for, @switch)
   - TypeScript strict typing (no `any`)
   - Using `inject()` for DI

3. **Documentation**
   - TSDoc comments on public APIs
   - Storybook stories for new components
   - Inline comments explain "why" not "what"
   - README updated if needed

4. **Testing**
   - Unit tests for new components/services
   - Tests cover signal updates and edge cases
   - E2E tests for new user flows
   - Accessibility tests included

5. **Accessibility (WCAG 2.1 AAA)**
   - Semantic HTML used
   - ARIA labels where needed
   - Keyboard navigation support
   - Color contrast meets AAA standards
   - Alt text on images

6. **Performance**
   - OnPush change detection
   - trackBy in @for loops
   - Avoiding unnecessary subscriptions
   - Signals used for reactivity

7. **Code Quality**
   - No ESLint errors
   - No hardcoded strings (use Transloco)
   - Constants defined properly
   - No magic numbers/strings

**Actions:**
1. Run: `git diff` to see changes
2. Run: `npm run lint` to check for errors
3. Provide detailed feedback on violations
4. Suggest improvements aligned with `.github/copilot-instructions.md`
5. Highlight any security or accessibility concerns

Perform a thorough review and provide actionable feedback.
