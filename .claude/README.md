# Claude Code Configuration

This directory contains configuration for [Claude Code](https://claude.com/claude-code), the official CLI for Claude AI.

## Available Slash Commands

Claude Code slash commands provide quick access to common development workflows. Type `/` in Claude Code to see all available commands.

### Component & Service Generation

- **/new-component** - Create a new Angular standalone component with all required files (component, template, styles, spec, stories). Ensures WCAG 2.1 AAA compliance and follows all project patterns.

- **/new-service** - Create a new Angular service with proper structure, typing, tests, and TSDoc documentation.

### Code Quality & Review

- **/accessibility-check** - Perform a comprehensive WCAG 2.1 AAA accessibility audit of code or components. Checks semantic HTML, ARIA, keyboard navigation, color contrast, and more.

- **/review-pr** - Comprehensive code review against all project standards: architecture, code style, documentation, testing, accessibility, performance, and code quality.

- **/fix-lint** - Run ESLint to identify and auto-fix code quality and accessibility issues. Provides guidance on manual fixes.

### Testing & Documentation

- **/add-tests** - Create comprehensive unit tests for components or services. Targets 85% coverage with thorough test cases.

- **/docs-sync** - Ensure all documentation (README, ARCHITECTURE, TSDoc, Storybook) is in sync with code changes.

### Project Management

- **/phase-status** - Check current implementation phase status and get guidance on next steps based on IMPLEMENTATION_PLAN.md.

## Project Context

Claude Code is aware of the project structure and coding standards through:

1. **.github/copilot-instructions.md** - Comprehensive AI coding assistant guidelines covering:
   - Angular 21 patterns and best practices
   - Architecture principles (standalone components, signals, OnPush)
   - Code style (BEM, CSS variables, TypeScript strict mode)
   - Accessibility requirements (WCAG 2.1 AAA)
   - Testing strategy (Vitest, Playwright, axe-core)
   - Documentation standards (TSDoc, Storybook)

2. **IMPLEMENTATION_PLAN.md** - 9-phase development roadmap

3. **ARCHITECTURE.md** - Architectural decisions and patterns

4. **docs/** directory - Strategy documents for analytics, auth, error tracking, theming, and versioning

## Usage Examples

### Creating a New Component

```
You: /new-component
Claude: I'll help you create a new component. What's the component name and where should it be located?
You: Create a "Button" component in shared/components
Claude: [Creates component.ts, template, styles, spec, and story files]
```

### Running Accessibility Check

```
You: /accessibility-check
Claude: I'll perform an accessibility audit. Which component should I review?
You: Check the ThemePickerComponent
Claude: [Reviews code and provides detailed accessibility report]
```

### Checking Phase Status

```
You: /phase-status
Claude: [Analyzes IMPLEMENTATION_PLAN.md and git status]
       Current: Phase 2 - Shared Component Library (⏳ In Progress)
       Completed: Theme system foundation
       Next: Create UI components (Button, Card, Modal)
       [Provides detailed breakdown and next steps]
```

## Customization

You can add more slash commands by creating new `.md` files in `.claude/commands/`. Each command file should:

1. Include a `description` in the frontmatter
2. Provide clear instructions for Claude
3. Reference project standards from `.github/copilot-instructions.md`
4. Specify any prerequisite checks or actions

## Settings

Local settings are stored in `.claude/settings.local.json` (gitignored by default).

## Reference

For more information about Claude Code configuration, visit:
https://github.com/anthropics/claude-code
