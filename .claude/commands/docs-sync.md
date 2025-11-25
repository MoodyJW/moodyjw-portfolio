---
description: Ensure documentation is in sync with code changes
---

Review and update all documentation to match current code state.

**Documentation to Check:**

1. **README.md**
   - Project description accurate
   - Installation steps current
   - Scripts list updated
   - Tech stack matches package.json

2. **ARCHITECTURE.md**
   - Architectural decisions documented
   - Design patterns match implementation
   - Folder structure current

3. **IMPLEMENTATION_PLAN.md**
   - Phase status updated (✅ or ⏳)
   - Completed tasks marked
   - New decisions documented

4. **TSDoc Comments**
   - All public APIs documented
   - @param and @returns tags present
   - @example tags where helpful

5. **Storybook Stories**
   - Stories exist for all components
   - Accessibility notes included
   - All variants documented

6. **Strategy Docs**
   - docs/ANALYTICS.md
   - docs/AUTH.md
   - docs/ERROR_TRACKING.md
   - docs/RELEASE_VERSIONING.md
   - docs/THEME_CONTRIBUTION_GUIDE.md

7. **.github/copilot-instructions.md**
   - Patterns match current code
   - Examples are up-to-date
   - New conventions documented

**Actions:**
1. Review recent code changes
2. Identify documentation gaps
3. Update outdated documentation
4. Add missing documentation
5. Ensure consistency across all docs

Follow the "docs-as-you-go" principle from `.github/copilot-instructions.md`.
