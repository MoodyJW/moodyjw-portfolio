---
description: Run linting and fix all auto-fixable issues
---

Run ESLint to identify and fix code quality and accessibility issues.

**Actions:**
1. Run: `npm run lint` to see all issues
2. Run: `npm run lint:fix` to auto-fix issues
3. Review remaining issues that require manual fixes
4. Provide specific solutions for each remaining issue
5. Ensure no ESLint errors remain (CI requirement)

**Common Issues to Check:**
- Accessibility violations (WCAG 2.1 AAA)
- Missing alt text on images
- Missing ARIA labels
- Improper use of interactive elements
- TypeScript strict mode violations
- Unused imports/variables
- Incorrect file naming conventions

**Manual Fixes May Include:**
- Adding ARIA labels to buttons/links
- Adding alt text to images
- Fixing semantic HTML structure
- Adding keyboard event handlers
- Fixing TypeScript type errors

After auto-fixing, review the changes and provide guidance on manual fixes needed.
