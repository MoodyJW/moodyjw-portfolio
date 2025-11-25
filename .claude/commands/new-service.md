---
description: Create a new Angular service with proper structure, typing, and tests
---

Create a new Angular service following the project's patterns.

**Requirements:**
1. Use `providedIn: 'root'` or provide in component
2. Use signals or RxJS observables for state
3. Use `inject()` function for dependency injection
4. For data services, use HttpClient to fetch from assets/data/*.json
5. Return Observables for async operations
6. Include TSDoc comments for all public methods
7. Create unit test spec file
8. Proper TypeScript typing (no `any` types)
9. Place in appropriate folder (core/services or feature/services)

**Before creating:**
- Ask me for the service name and location
- Ask about the service's purpose and main responsibilities
- Ask if it needs HttpClient or other dependencies

**Files to create:**
- `{name}.service.ts` - Service class
- `{name}.service.spec.ts` - Vitest unit tests

Follow all patterns from `.github/copilot-instructions.md`.
